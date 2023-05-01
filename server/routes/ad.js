import express from 'express';

const router = express.Router();
import * as ad from '../controller/ad.js';
import { requireSignin } from "../middlewares/auth.js";

router.post('/upload-image', requireSignin, ad.uploadImage);
router.post('/remove-image', requireSignin, ad.removeImage);
router.post('/ad', requireSignin, ad.create)
router.get('/ads', ad.ads);
router.get('/ad/:slug', ad.read);
router.put('/ad/:adId', requireSignin, ad.update);
router.delete('/ad/:adId', requireSignin, ad.remove);

router.post('/wishlist', requireSignin, ad.addToWishList);
router.delete('/wishlist/:adId', requireSignin, ad.removeFromWishList);
router.post('/contact-seller', requireSignin, ad.contactSeller);
router.get('/user-ads/:page', requireSignin, ad.userAds);
router.get('/enquired-properties', requireSignin, ad.enquiredProperties);
router.get('/wishlist', requireSignin, ad.wishlist);

router.get('/search', ad.search);

export default router;