import express from 'express';
import { registerUser, loginUser, logoutUser,verifyUser } from '../controllers/authControler/AuthController.js'
import { ForgetPassword } from '../controllers/authControler/ForgetPassword.js';
import { verifyOtp } from '../controllers/authControler/VerifyOtp.js';
import { resetPassword } from '../controllers/authControler/ResetPassword.js';
import { getUserProfile, updateUserProfile, changePassword, upgradeToSeller, uploadProfileImage } from '../controllers/authControler/userprofile.js';
import { AuthUser } from "../middlewares/Authmiddleware.js";
const router = express.Router();

router.post('/user/signup', registerUser);
router.post('/user/login', loginUser);
router.post('/user/logout',logoutUser);
router.post('/user/forgetpassword', ForgetPassword);
router.post('/user/otp/verify', verifyOtp);
router.post('/user/resetpassword', resetPassword);
router.post('/user/verify-email', verifyUser);

router.route('/profile')
  .get(AuthUser,getUserProfile)
  .put(AuthUser,updateUserProfile);

router.route('/change-password').post(AuthUser,changePassword);
router.route('/upgrade-seller').post(AuthUser,upgradeToSeller);
router.route('/upload-image').post(AuthUser,uploadProfileImage);



export default router;
