// controllers/auth/ForgetPassword.js
import { Mailer } from "../../utils/Mailer.js";
import User from "../../models/UserModel.js";
import AuthWorkerPool from "../workers/createWorkerPools.js"; // 

export const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.resetOtpExpires && user.resetOtpExpires > Date.now()) {
      return res.status(400).json({
        message: "OTP already sent.",
        timer: user.resetOtpExpires,
      });
    }

    const result = await AuthWorkerPool.run({type:'generateOtpAndHash', data:{}});

    if (!result.success) {
      return res.status(500).json({ message: "OTP generation failed.", error: result.error });
    }

    const { otp, hashedOtp } = result;

    user.resetOtp = hashedOtp;
    user.resetOtpExpires = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_TIME) * 1000);
    await user.save();

    // Schedule email in background
    setImmediate(async () => {
      try {
        console.log("Sending email...");
        await Mailer.sendMail({
          from: process.env.From_Email,
          to: email,
          subject: "Password Reset OTP",
          text: `Your OTP for password reset is: ${otp}`,
        });
      } catch (err) {
        console.error("Email sending failed (background):", err);
      }
    });

    return res.status(200).json({
      message: "OTP sent successfully.",
      timer: user.resetOtpExpires,
    });

  } catch (error) {
    console.error("ForgetPassword Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
