import nodemailer from "nodemailer";
import { ServerError } from "@/app/(core)/error/appError";
import { generateInviteCode } from "@/app/(core)/util";
import { getFamilyByInviteCode } from "../query";
import { Db } from "@/index";

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

/** 使用可能な家族招待コードを生成する */
export const generateUniqueInviteCode = async ({db}: {
  db: Db
}) => {
  for (let i = 0; i < 10; i++) {
    // 招待コードを生成する
    const code = generateInviteCode()

    const family = await getFamilyByInviteCode({code, db})

    // 招待コードが存在していない場合
    if (!family) {
      // コードを返却する
      return code
    }
  }
  throw new ServerError("招待コードの生成に失敗しました")
}
