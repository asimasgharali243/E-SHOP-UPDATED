import User from "../../models/UserModel.js";
import AuthWorkerPool from "../workers/createWorkerPools.js";
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(email,otp);
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch=await AuthWorkerPool.run({type:'compareOtp',data:{otp,otpHashed:user.resetOtp,resetOtpExpires:user.resetOtpExpires}});
        console.log(isMatch);
        if (!isMatch.success) {
            return res.status(400).json({ message: isMatch.error });
        }

        user.resetOtp = null;
        user.resetOtpExpires = null;
        await user.save();
        
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Server error" });
    }   
}