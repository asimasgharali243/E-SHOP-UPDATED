import nodemailer from "nodemailer";
export const Mailer = nodemailer.createTransport({
    service: "Gmail", // Use your email service
    auth: {
      user: "hashimali123456.asim@gmail.com", // Replace with your email
      pass: "lvjm vsrx aoej vwdz",  // Replace with your email password
      secure: true,
      
    },
  });
  