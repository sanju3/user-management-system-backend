import nodemailer from "nodemailer";

export const SendMail = async (mail: string, url: string) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "sanjupriyanga101@gmail.com",
      pass: "19961214@sanju",
    },
  });

  let info = await transporter.sendMail({
    from: "sanjupriyanga101@gmail.com",
    to: mail,
    subject: "Cofirmation mail ✔",
    text: "Please visit the url: " + url,
    html: `<b>User management system => </b> ${url}`,
  });

  return info;
};
