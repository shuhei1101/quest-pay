import nodemailer from "nodemailer";

/** 家族招待コードをメールする */
export const sendFamilyInviteCode = async ({email, familyInviteCode}: {
  email: string,
  familyInviteCode: string
}) => {
  // メール送信インスタンスを生成する
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.me.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ICLOUD_SMTP_USER,
      pass: process.env.ICLOUD_SMTP_PASS,
    },
  });

  // メールを送信する
  await transporter.sendMail({
    from: process.env.ICLOUD_SMTP_USER,
    to: `${email}`,
    subject: "家族招待コード送信",
    text: `招待コード: ${familyInviteCode}`,
  });
}

const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
/** 招待コードを生成する */
export const generateInviteCode = (length = 8) => {
  let code = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    const index = array[i] % CHARS.length;
    code += CHARS[index];
  }

  return code;
};
