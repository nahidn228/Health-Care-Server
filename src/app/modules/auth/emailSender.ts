import nodemailer from "nodemailer";
import config from "../../../config";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass, // app password
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as SMTPTransport.Options);

  const info = await transporter.sendMail({
    from: '"PH Health Care" <nahidn228@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Reset Password Link", // Subject line
    //text: "Hello world?", // plain text body
    html, // html body
  });
};

export default emailSender;
