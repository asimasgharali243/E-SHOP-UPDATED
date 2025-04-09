import bcrypt from "bcryptjs";
import User from "../../models/UserModel.js";
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashedOtp = user.resetOtp;
        const isMatch = await bcrypt.compare(otp, hashedOtp);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        else if (user.resetOtpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Server error" });
    }   
}