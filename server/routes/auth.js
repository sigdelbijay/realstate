import express from 'express';

const router = express.Router();
import * as auth from '../controller/auth.js';
import { requireSignin } from "../middlewares/auth.js";

router.post('/pre-register', auth.preRegister);
router.post('/register', auth.register);
router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/access-account", auth.accessAccount);
router.get("/refresh-token", auth.refreshToken);
router.get("/current-user", requireSignin, auth.currentUser);
router.get("/profile/:username", auth.publicProfile);
router.put("/update-password", requireSignin, auth.updatePassword);
router.put("/update-profile", requireSignin, auth.updateProfile);

router.get('/agents', auth.agents);
router.get('/agent/:username', auth.agent);
router.get('/agent-ad-count/:agentId', auth.agentAdCount);

export default router;