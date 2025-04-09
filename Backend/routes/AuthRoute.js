import express from 'express';
import { registerUser, loginUser } from '../controllers/authControler/AuthController.js'
import { ForgetPassword } from '../controllers/authControler/ForgetPassword.js';
import { verifyOtp } from '../controllers/authControler/VerifyOtp.js';
import { resetPassword } from '../controllers/authControler/ResetPassword.js';
const router = express.Router();

router.post('/user/signup', registerUser);
router.post('/user/login', loginUser);
router.post('/user/forgetpassword', ForgetPassword);
router.post('/user/otp/verify', verifyOtp);
router.post('/user/resetpassword', resetPassword);
export default router;
