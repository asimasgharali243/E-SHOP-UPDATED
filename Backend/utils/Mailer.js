import nodemailer from "nodemailer";
export const Mailer = nodemailer.createTransport({
    service: "Gmail", // Use your email service
    auth: {
      user: "hashimali123456.asim@gmail.com", // Replace with your email
      pass: "apxu jzsw llxc wyfa",  // Replace with your email password
      secure: true,
      
    },
  });
  