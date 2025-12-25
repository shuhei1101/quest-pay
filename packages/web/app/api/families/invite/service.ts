import nodemailer from "nodemailer";
import { SupabaseClient } from "@supabase/supabase-js";
import { ServerError } from "@/app/(core)/error/appError";
import { generateInviteCode } from "@/app/(core)/util";
import { getFamilyByInviteCode } from "../query";
import { Db, Tx } from "@/index";

/** 使用可能な家族招待コードを生成する */
export const generateUniqueInviteCode = async ({db}: {
  db: Tx | Db
}) => {
  for (let i = 0; i < 10; i++) {
    // 招待コードを生成する
    const code = generateInviteCode()

    const family = await getFamilyByInviteCode({code, db})

    // 招待コードが存在していない場合
    if (family === null) {
      // コードを返却する
      return code
    }
  }
  throw new ServerError("招待コードの生成に失敗しました")
}
