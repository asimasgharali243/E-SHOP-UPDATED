import nodemailer from "nodemailer";
export const Mailer = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: "hashimali123456.asim@gmail.com", 
      pass: "lvjm vsrx aoej vwdz",  
      secure: true,
      
    },
  });
  