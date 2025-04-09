import User from "../../models/UserModel.js";
export const resetPassword = async (req, res) => {
    try {
    
      const { email, password } = req.body;      
    if(!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });

    }
       // Check for user existence
    
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
      
          
          // Update the user's password
          user.password = password;
          await user.save();
      
          return res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
          console.error("Reset Password Error:", error.message);
          return res.status(500).json({ message: "Internal server error" });
        }
      }

      