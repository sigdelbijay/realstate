import {nanoid} from "nanoid"
import jwt from "jsonwebtoken"
import validator from "email-validator"

import * as config from "../config.js"
import { emailTemplate } from "../helpers/email.js"
import {hashPassword, comparePassword} from "../helpers/auth.js"
import User from "../models/User.js"
import Ad from '../models/Ad.js'

export const preRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email", email, "password", password)
    if (!validator.validate(email)) {
      return res.json({ error: "A valid email is required" });
    }
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    if (!password) {
      return res.json({ error: "Email is required" });
    }
    if (password && password?.length < 6) {
      return res.json({
        error: "Password should be at least 6 characters long",
      });
    }
    const user = await User.findOne({email})
    if(user) {
      return res.json({error: "Email is already in use"})
    }

    // generate jwt using email and password
    const token = jwt.sign({ email, password }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
    // send test email
    config.AWSSES.sendEmail(
      emailTemplate(
        email,
        `
        <p>Please click the link below to activate your account.</p>
        <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>
    `,
        config.REPLY_TO,
        "Welcome to Realist app"
      ),
      (err, data) => {
        if (err) {
          console.log(err)
          return res.json({ error: "Provide a valid email address" });
        } else {
          console.log("data", config.CLIENT_URL + "/auth/account-activate/" + token)
          return res.json({ message: "Check email to complete registration" });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const register = async (req, res) => {
  try {
    const {email, password} = jwt.verify(req.body.token, config.JWT_SECRET);
    const hashedPassword = await hashPassword(password);
    const user = await new User({
      username: nanoid(6),
      email,
      password: hashedPassword,
    }).save()
    console.log("user", user)
    const token = jwt.sign({_id: user._id}, config.JWT_SECRET, {
      expiresIn: "1h"
    });
    const refreshToken = jwt.sign({_id: user._id}, config.JWT_SECRET, {
      expiresIn: "7d"
    });

    user.password = undefined;
    user.resetCode = undefined;
    return res.json({
      token,
      refreshToken,
      user
    })
  } catch (err) {
    console.log(err);
    res.json({ error: "Could not complete registration. Try again." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "Please register first" });
    }
    // 2. compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    // 3. create jwt tokens
    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "30d",
    });
    // 4. send user and token as response excluding password
    user.password = undefined;
    user.resetCode = undefined;

    res.json({
      user,
      token,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
};

export const forgotPassword = async(req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({ email });
    if(!user) {
      return res.json({error: "Couldn't find user with that email."});
    } else {
      const resetCode = nanoid();
      user.resetCode = resetCode;
      user.save();

      const token = jwt.sign({resetCode}, config.JWT_SECRET, {
        expiresIn: '1h'
      })

      config.AWSSES.sendEmail(emailTemplate(
        email,
        `<p>Please click the link below to access your account.</p>
        <a href="${config.CLIENT_URL}/auth/access-account/${token}">Access my account</a>`, 
        config.REPLY_TO, 
        "Access to your account"
      ), (err, data) => {
        if (err) {
            return res.json({ error: "Provide a valid email address" });
        } else {
            return res.json({ data: "Check email to access your account" });
        }
      })
    }
  } catch(err) {

  }
}

export const accessAccount = async(req, res) => {
  try {
    console.log("req.body: " + req.body);
    const {resetCode} = jwt.verify(req.body.resetCode, config.JWT_SECRET);
    const user = await User.findOneAndUpdate({resetCode}, {resetCode: ''});
    if(!user) {
      return res.json({error: "User not found"});
    }
    // 3. create jwt tokens
    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "30d",
    });
    // 4. send user and token as response excluding password
    user.password = undefined;
    user.resetCode = undefined;

    res.json({
      user,
      token,
      refreshToken,
    });

  } catch(err) {
    console.log(err);
    res.json({ error: "Something went wrong. Try again." });
  }
}

export const refreshToken = async(req, res) => {
  try {
    console.log("i am here")
    const {_id} = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);
    const user = await User.findById(_id);
    
    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "365d",
    });
    // send user and token as response excluding password
    user.password = undefined;
    user.resetCode = undefined;
    res.json({
      user,
      token,
      refreshToken,
    });
  } catch(err) {
    console.log(err);
    return res.status(403).json({error: "Refresh token failed"})
  }
}

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    user.resetCode = undefined;
    res.json({user});
  } catch(err) {
    console.log(err);
    return res.status(403).json({error: "Unathorized"})
  }
}

export const publicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: err });
  }
};

export const updatePassword = async(req, res) => {
  try {
    const {password} = req.body;
    if(!password) {
      return res.json({error: "Password is required"});
    }
    if(password && password.length < 6) {
      return res.json({error: "password must be min 6 characters"});
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
      password: await hashPassword(password)
    })
    res.json({ok: true})
  } catch(err) {
    console.log(err);
    return res.status(403).json({error: "Unauthorized"})
  }
}

export const updateProfile = async(req, res) => {
  try {
    console.log("req.body", req.body);
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {new: true});
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user)
  } catch(err) {
    if(err.codeName === "DuplicateKey") {
      return res.json({error: "Username or email is already taken"})
    } else {
      return res.status(403).json({error: "Unauthorized"})
    }
    console.log(err)
  }
}

export const agents = async(req, res) => {
  try {
    const agents = await User.find({role: 'Seller'}).select("-password -resetCode -role -enquiredProperties -wishlist -photo.key -photo.Bucket");
    res.json(agents)
  } catch(err) {
    console.log(err)
  }
}

export const agent = async(req, res) => {
  try {
    const user = await User.findOne({username: req.params.username}).select("-password -resetCode -role -enquiredProperties -wishlist -photo.key -photo.Bucket");
    const ads = await Ad.find({postedBy: user._id}).select("-photo.key -photo.Bucket -photos.ETag -photos.Key -location -googleMap");
    res.json({user, ads})
  } catch(err) {
    console.log(err)
  }
}

export const agentAdCount = async(req, res) => {
  try {
    const total = await Ad.count({postedBy: req.params.agentId});
    res.json(total)
  } catch(err) {
    console.log(err)
  }
}