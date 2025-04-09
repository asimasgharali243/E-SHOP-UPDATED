import { Mailer } from "../../utils/Mailer.js";
import User from "../../models/UserModel.js";
import { generateOtp } from "../../utils/generateOTP.js";
import bcrypt from "bcryptjs";
export const ForgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.resetOtp && user.resetOtpExpires > new Date()) {
         
            return res.status(400).json({ message: "OTP has already been sent" ,timer:user.resetOtpExpires,sendotp:true});
        }
        const otp = await generateOtp();
        const mailOptions = {
            from: "hashimali123456.asim@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}`,}
        await Mailer.sendMail(mailOptions);
        const hashedOtp = await bcrypt.hash(otp, 10);

    // Save the OTP and expiration time in the database
    user.resetOtp = hashedOtp;
    user.resetOtpExpires = new Date().getTime() + 1 * 60 * 1000; // 10 minutes expiry
    console.log(user.resetOtpExpires);    
    await user.save();
        res.status(200).json({ message: "OTP sent successfully",timer:user.resetOtpExpires,sendotp:true });

}
catch (error) {
    console.error("Error sending OTP:", error);
return res.status(500).json({ message: "Server error" })
}
;
}