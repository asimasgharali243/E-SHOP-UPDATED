// utils/otpHashWorker.js
import { parentPort } from "worker_threads";
import bcrypt from "bcrypt";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

parentPort.on("message", async () => {
  try {
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    parentPort.postMessage({ otp, hashedOtp });
  } catch (err) {
    parentPort.postMessage({ error: "Failed to generate OTP." });
  }
});
