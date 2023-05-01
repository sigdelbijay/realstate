import * as config from '../config.js'
import { nanoid } from 'nanoid'
import slugify from 'slugify'
import Ad from '../models/Ad.js'
import User from '../models/User.js'
import { emailTemplate } from "../helpers/email.js";

export const uploadImage = async(req, res) => {
  try {
    console.log('req.body', req.body)
    const {image} = req.body
    const base64image = new Buffer.from(image.replace(/^data:image\/\w+;base64,/,""), "base64")
    const type = image.split(";")[0].split("/")[1];

    //image params
    const params = {
      Bucket: 'realstate-bucket',
      Key: `${nanoid()}.${type}`,
      Body: base64image,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`
    }

    config.AWSS3.upload(params, (err, data) => {
      if(err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        console.log(data);
        res.send(data);
      }
    })
  } catch(err) {
    console.log(err);
    res.json({error: "Upload failed. Try again"})
  }
}

export const removeImage = (req, res) => {
  try {
    const {Key, Bucket} = req.body;
    config.AWSS3.deleteObject({Bucket, Key}, (err, data) => {
      if(err) {
        console.log(err);
        res.sendStatu(400);
      } else {
        res.send({ok: true})
      }
    });
  } catch(err) {
    console.log(err)
  }
}

export const create = async(req, res) => {
  try {
    console.log(req.body)
    const {photos, description, title, address, price, type, landsize } = req.body;
    if (!photos?.length) {
      return res.json({ error: "Photos are required" });
    }
    if (!price) {
      return res.json({ error: "Price is required" });
    }
    if (!type) {
      return res.json({ error: "Is property house or land?" });
    }
    if (!address) {
      return res.json({ error: "Address is required" });
    }
    if (!description) {
      return res.json({ error: "Description is required" });
    }

    const geo = await config.GOOGLE_GEOCODER.geocode(address);
    const ad = await new Ad({
      ...req.body,
      postedBy: req.user._id,
      location: {
        type: 'Point',
        coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude]
      },
      googleMap: geo,
      slug: slugify(`${type}-${address}-${price}-${nanoid(6)}`) //nanoid to make slug unique
    }).save();

    // make user row > seller
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {role: 'Seller'}
    }, {new: true})

    user.password = undefined;
    user.resetCode = undefined;

    return res.json({
      ad, user
    })
  } catch(err) {
    res.json({error: "Something went wrong. Try again."});
    console.log(err)
  }
}

export const ads = async (req, res) => {
  try {
    const adsForSale = await Ad.find({action: 'Sell'})
      .select('-googleMap -location -photo.Key -photo.key -photo.ETag')
      .sort({createdAt: -1})
      .limit(12);

    const adsForRent = await Ad.find({action: 'Rent'})
      .select('-googleMap -location -photo.Key -photo.key -photo.ETag')
      .sort({createdAt: -1})
      .limit(12);

    res.json({adsForSale, adsForRent});
  } catch (err) {
    console.log(err)
  }
}

export const read = async (req, res) => {
  try {
    const slug = req.params.slug;
    const ad = await Ad.findOne({slug}).populate('postedBy', 'name username email phone company photo.Location')
    //related ads
    const related = await Ad.find({
      _id: {$ne: ad._id},
      action: ad.action,
      type: ad.type,
      address: {
        $regex: ad.googleMap[0].city,
        $options: 'i'
      },
    }).limit(3).select('-photos.Key -photos.key -photos.ETag -photos.Bucket -googleMap');

    res.json({ad, related});
  } catch (err) {
    console.log(err)
  }
}

export const addToWishList = async(req, res) => {
  try {
    console.log("i am like")
    const adId = req.body?.adId;
    console.log("adId", adId);
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {wishlist: adId}
    }, {new: true})

    const {password, resetCode, ...rest} = user._doc //user._doc gives raw data - mongoose default
    res.json(rest)
  } catch (err) {
    console.log(err)
  }
}

export const removeFromWishList = async(req, res) => {
  try {
    console.log("i am unlike")
    const adId = req.params.adId;
    console.log("adId", adId)
    const user = await User.findByIdAndUpdate(req.user._id, {
      $pull: {wishlist: adId}
    }, {new: true})

    const {password, resetCode, ...rest} = user._doc //user._doc
    res.json(rest)
  } catch (err) {
    console.log(err)
  }
}

export const contactSeller = async(req, res) => {
  try {
    const {name, email, phone, message, adId}  = req.body;
    const ad = await Ad.findById(adId).populate('postedBy', 'email');
    console.log("ad", ad);
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet :{ enquiredProperties: adId}
    })

    if(!user) {
      return res.json({
        error: 'Could not find user with that email'
      })
    } else {
      //send emails
      config.AWSSES.sendEmail(emailTemplate(
        ad.postedBy.email,
        `<p>You have received a new customer enquiry.</p>
        <h4>Customer details</h4>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Message: ${message}</p>
        <a href="${config.CLIENT_URL}/ad/{ad.slug}">${ad.type} in ${ad.address} for ${ad.action}${ad.price}</a>
        `, 
        email, 
        "New enquiry received"
      ), (err, data) => {
        if (err) {
            console.log("Error", err);
            return res.json({ error: "Provide a valid email address" });
        } else {
            console.log("data", data)
            return res.json({ data: "Email sent" });
        }
      })

    }
  } catch(err) {
    console.log(err);
  }
}

export const userAds = async(req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;

    const total = await Ad.count({ postedBy: req.user._id })
    const ads = await Ad.find({postedBy: req.user._id})
      // .select("-photos.Key -photos.key -photos.Bucket -location -googleMap")
      .populate("postedBy", "name email username phone company")
      .skip((page - 1)*perPage)
      .limit(perPage)
      .sort({createdAt: -1});
    
    res.json({ads, total})
  } catch(err) {
    console.log(err)
  }
}

export const update = async(req, res) => {
  try {
    console.log("hit")
    //Check if this ad is posted by the logged in user
    const {photos, price, type, address, description} = req.body;
    const ad = await Ad.findById(req.params.adId);
    console.log("ad", ad)
    const owner = req.user._id == ad.postedBy;
    if(!owner) {
      return res.json({error: "Permission denied"})
    } else {
      if(!photos.length) {
        return res.json({error: "Photos are required"})
      }
      if(!price) {
        return res.json({error: "Price is required"})
      }
      if(!type) {
        return res.json({error: "Is property house or land?"})
      }
      if(!address) {
        return res.json({error: "Address is required"})
      }
      if(!description) {
        return res.json({error: "Description is required"})
      }
      const geo = await config.GOOGLE_GEOCODER.geocode(address);
      await Ad.findByIdAndUpdate(req.params.adId, {
        ...req.body,
        slug: ad.slug,
        location: {
          type: "Point",
          coordinates: [geo?.[0].longitude, geo?.[0].latitude],
        }
      });
      return res.json({ok: true})
    }
    
  } catch(err) {
    console.log(err)
  }
}

export const remove = async(req, res) => {
  try {
    const ad = await Ad.findById(req.params.adId);
    const owner = req.user._id == ad.postedBy;
    if(!owner) {
      return res.json({error: "Permission denied"})
    } else {
      await Ad.findByIdAndDelete(req.params.adId);
      return res.json({ok: true})
    }
  } catch(err) {
    console.log(err)
  }
}

export const enquiredProperties = async(req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const enquiredProperties = await Ad.find({_id: {$in: user.enquiredProperties}}).sort({createdAt: -1});
    res.json(enquiredProperties)
  } catch(err) {
    console.log(err)
  }
}

export const wishlist = async(req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const wishlist = await Ad.find({_id: {$in: user.wishlist}}).sort({createdAt: -1});
    console.log("wishlist", wishlist);
    res.json(wishlist)
  } catch(err) {
    console.log(err)
  }
}

export const search = async(req, res) => {
  try {
    const {action, address, type, priceRange} = req.query;
    const geo = await config.GOOGLE_GEOCODER.geocode(address);
    const ads = await Ad.find({
      action: action === "Buy" ? "Sell" : "Rent",
      type,
      price : {
        $gte: parseInt(priceRange[0]),
        $lte: parseInt(priceRange[1])
      },
      location: {
        $near: {
          $maxDistance: 100000, //1000m = 1km
          $geometry: {
            type: "Point",
            coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
          }
        }
      }
    }).limit(24).sort({createdAt: -1}).select("-photos.Key -photos.key -photos.Bucket -photos.ETag -location -googleMap");
    return res.json(ads)
  } catch(err) {
    console.log(err)
  }
} 