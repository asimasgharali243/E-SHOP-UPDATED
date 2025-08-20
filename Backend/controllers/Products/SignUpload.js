import { imagekitInstance } from "../../index.js";
export const signUpload =  async (req, res) => {
  const count=req.query.count 
  console.log(count);
  const tokens=[];
  try {
    console.log("hell");
for (let i = 0; i < count; i++) {
tokens.push(imagekitInstance.getAuthenticationParameters());  
}
    
res.json({
     tokens:tokens,
      publicKey:process.env.IMAGEKIT_PUBLIC_KEY
       });
  } catch (error) {
    res.status(500).json({ error: 'Worker failed to generate signature' });
  }
};

