import nodemailer from "nodemailer";
export const Mailer = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "Gmail",
    auth: {
      user: process.env.EMAIL_USER || "hashimali123456.asim@gmail.com",
      pass: process.env.EMAIL_PASS || "lvjm vsrx aoej vwdz",
      secure: true,
      
    },
  });
  
  