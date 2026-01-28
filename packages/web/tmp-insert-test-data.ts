import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://spmuuethhjpvpaxckfgx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbXV1ZXRoaGpwdnBheGNrZmd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzEzNjE0OSwiZXhwIjoyMDc4NzEyMTQ5fQ.ei6LaJBRYGiTNCvz-Fg9k_ntXZdMBZDohe-UFLESUH4"
)

// ランダムな招待コードを生成する
const generateInviteCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// ランダムな色を生成する
const colors = ["#339af0", "#f06595", "#51cf66", "#fcc419", "#ff6b6b", "#845ef7", "#20c997", "#fd7e14"]
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

async function main() {
  console.log("=== テストデータ投入開始 ===\n")

  // ========================================
  // 1. アイコンカテゴリ追加
  // ========================================
  console.log("1. アイコンカテゴリを追加...")
  
  const iconCategories = [
    { name: "動物", icon_name: "tbIconPaw", icon_size: 20, sort_order: 3 },
    { name: "天気", icon_name: "tbIconSun", icon_size: 20, sort_order: 4 },
    { name: "食べ物", icon_name: "tbIconMeat", icon_size: 20, sort_order: 5 },
    { name: "スポーツ", icon_name: "tbIconBallBasketball", icon_size: 20, sort_order: 6 },
    { name: "乗り物", icon_name: "tbIconCar", icon_size: 20, sort_order: 7 },
    { name: "音楽", icon_name: "tbIconMusic", icon_size: 20, sort_order: 8 },
    { name: "ゲーム", icon_name: "tbIconDeviceGamepad2", icon_size: 20, sort_order: 9 },
    { name: "オブジェクトとツール", icon_name: "tbIconTool", icon_size: 20, sort_order: 10 },
    { name: "人", icon_name: "tbIconUser", icon_size: 20, sort_order: 12 },
    { name: "記号", icon_name: "tbIconArrowRight", icon_size: 20, sort_order: 13 },
  ]

  const { data: insertedCategories, error: catError } = await supabase
    .from("icon_categories")
    .upsert(iconCategories, { onConflict: "name" })
    .select()
  
  if (catError) {
    console.error("アイコンカテゴリ追加エラー:", catError)
  } else {
    console.log(`  ${insertedCategories?.length || 0}件のアイコンカテゴリを追加/更新しました`)
  }

  // カテゴリIDを取得する
  const { data: allCategories } = await supabase.from("icon_categories").select("*")
  const categoryMap = new Map(allCategories?.map(c => [c.name, c.id]) || [])

  // ========================================
  // 2. アイコン追加
  // ========================================
  console.log("2. アイコンを追加...")

  const icons = [
    // 動物カテゴリ
    { name: "tbIconPaw", category_id: categoryMap.get("動物") },
    { name: "tbIconDog", category_id: categoryMap.get("動物") },
    { name: "tbIconCat", category_id: categoryMap.get("動物") },
    { name: "tbIconFish", category_id: categoryMap.get("動物") },
    { name: "tbIconBird", category_id: categoryMap.get("動物") },
    { name: "tbIconButterfly", category_id: categoryMap.get("動物") },
    // 天気カテゴリ
    { name: "tbIconSun", category_id: categoryMap.get("天気") },
    { name: "tbIconMoon", category_id: categoryMap.get("天気") },
    { name: "tbIconStar", category_id: categoryMap.get("天気") },
    { name: "tbIconCloud", category_id: categoryMap.get("天気") },
    { name: "tbIconCloudRain", category_id: categoryMap.get("天気") },
    { name: "tbIconSnowflake", category_id: categoryMap.get("天気") },
    { name: "tbIconRainbow", category_id: categoryMap.get("天気") },
    // 食べ物カテゴリ
    { name: "tbIconMeat", category_id: categoryMap.get("食べ物") },
    { name: "tbIconApple", category_id: categoryMap.get("食べ物") },
    { name: "tbIconCake", category_id: categoryMap.get("食べ物") },
    { name: "tbIconIceCream", category_id: categoryMap.get("食べ物") },
    { name: "tbIconPizza", category_id: categoryMap.get("食べ物") },
    { name: "tbIconCookie", category_id: categoryMap.get("食べ物") },
    { name: "tbIconCandy", category_id: categoryMap.get("食べ物") },
    // スポーツカテゴリ
    { name: "tbIconBallBasketball", category_id: categoryMap.get("スポーツ") },
    { name: "tbIconBallFootball", category_id: categoryMap.get("スポーツ") },
    { name: "tbIconBallTennis", category_id: categoryMap.get("スポーツ") },
    { name: "tbIconSwimming", category_id: categoryMap.get("スポーツ") },
    { name: "tbIconRun", category_id: categoryMap.get("スポーツ") },
    { name: "tbIconBike", category_id: categoryMap.get("スポーツ") },
    // 乗り物カテゴリ
    { name: "tbIconCar", category_id: categoryMap.get("乗り物") },
    { name: "tbIconBus", category_id: categoryMap.get("乗り物") },
    { name: "tbIconTrain", category_id: categoryMap.get("乗り物") },
    { name: "tbIconPlane", category_id: categoryMap.get("乗り物") },
    { name: "tbIconShip", category_id: categoryMap.get("乗り物") },
    { name: "tbIconRocket", category_id: categoryMap.get("乗り物") },
    // 音楽カテゴリ
    { name: "tbIconMusic", category_id: categoryMap.get("音楽") },
    { name: "tbIconGuitar", category_id: categoryMap.get("音楽") },
    { name: "tbIconMicrophone", category_id: categoryMap.get("音楽") },
    { name: "tbIconHeadphones", category_id: categoryMap.get("音楽") },
    { name: "tbIconPiano", category_id: categoryMap.get("音楽") },
    // ゲームカテゴリ
    { name: "tbIconDeviceGamepad2", category_id: categoryMap.get("ゲーム") },
    { name: "tbIconPuzzle", category_id: categoryMap.get("ゲーム") },
    { name: "tbIconTrophy", category_id: categoryMap.get("ゲーム") },
    { name: "tbIconDice", category_id: categoryMap.get("ゲーム") },
    { name: "tbIconCards", category_id: categoryMap.get("ゲーム") },
    // オブジェクトとツールカテゴリ
    { name: "tbIconTool", category_id: categoryMap.get("オブジェクトとツール") },
    { name: "tbIconHammer", category_id: categoryMap.get("オブジェクトとツール") },
    { name: "tbIconScissors", category_id: categoryMap.get("オブジェクトとツール") },
    { name: "tbIconPencil", category_id: categoryMap.get("オブジェクトとツール") },
    { name: "tbIconBrush", category_id: categoryMap.get("オブジェクトとツール") },
    { name: "tbIconKey", category_id: categoryMap.get("オブジェクトとツール") },
    { name: "tbIconLock", category_id: categoryMap.get("オブジェクトとツール") },
    { name: "tbIconBulb", category_id: categoryMap.get("オブジェクトとツール") },
    // ホームカテゴリ（既存カテゴリに追加）
    { name: "tbIconBed", category_id: categoryMap.get("ホーム") },
    { name: "tbIconBath", category_id: categoryMap.get("ホーム") },
    { name: "tbIconToiletPaper", category_id: categoryMap.get("ホーム") },
    { name: "tbIconLamp", category_id: categoryMap.get("ホーム") },
    { name: "tbIconDeviceTv", category_id: categoryMap.get("ホーム") },
    { name: "tbIconFridge", category_id: categoryMap.get("ホーム") },
    // 人カテゴリ
    { name: "tbIconUser", category_id: categoryMap.get("人") },
    { name: "tbIconUsers", category_id: categoryMap.get("人") },
    { name: "tbIconUserCircle", category_id: categoryMap.get("人") },
    { name: "tbIconFriends", category_id: categoryMap.get("人") },
    { name: "tbIconMan", category_id: categoryMap.get("人") },
    { name: "tbIconWoman", category_id: categoryMap.get("人") },
    { name: "tbIconBabyCarriage", category_id: categoryMap.get("人") },
    { name: "tbIconMoodSmile", category_id: categoryMap.get("人") },
    // 記号カテゴリ
    { name: "tbIconArrowRight", category_id: categoryMap.get("記号") },
    { name: "tbIconArrowLeft", category_id: categoryMap.get("記号") },
    { name: "tbIconArrowUp", category_id: categoryMap.get("記号") },
    { name: "tbIconArrowDown", category_id: categoryMap.get("記号") },
    { name: "tbIconCheck", category_id: categoryMap.get("記号") },
    { name: "tbIconX", category_id: categoryMap.get("記号") },
    { name: "tbIconPlus", category_id: categoryMap.get("記号") },
    { name: "tbIconMinus", category_id: categoryMap.get("記号") },
    { name: "tbIconHeart", category_id: categoryMap.get("記号") },
    { name: "tbIconCircle", category_id: categoryMap.get("記号") },
    { name: "tbIconSquare", category_id: categoryMap.get("記号") },
  ]

  const { data: insertedIcons, error: iconError } = await supabase
    .from("icons")
    .upsert(icons, { onConflict: "name" })
    .select()
  
  if (iconError) {
    console.error("アイコン追加エラー:", iconError)
  } else {
    console.log(`  ${insertedIcons?.length || 0}件のアイコンを追加/更新しました`)
  }

  // アイコンIDマップを取得する
  const { data: allIcons } = await supabase.from("icons").select("*")
  const iconMap = new Map(allIcons?.map(i => [i.name, i.id]) || [])
  const defaultIconId = iconMap.get("tbIconUser") || 1

  // ========================================
  // 3. 家族登録
  // ========================================
  console.log("3. 家族を登録...")

  const familiesData = [
    { display_id: "yamada_family", local_name: "山田家", online_name: "やまだファミリー", introduction: "東京在住の4人家族です！子供たちと一緒にクエストを楽しんでいます", icon_id: iconMap.get("tbIconHome") || 1, icon_color: "#339af0", invite_code: generateInviteCode() },
    { display_id: "sato_family", local_name: "佐藤家", online_name: "さとうファミリー", introduction: "福岡の元気いっぱい家族！お手伝いが大好きな子供たちです", icon_id: iconMap.get("tbIconHeart") || 1, icon_color: "#f06595", invite_code: generateInviteCode() },
    { display_id: "suzuki_family", local_name: "鈴木家", online_name: "すずきファミリー", introduction: "大阪で暮らす賑やかな家族。クエストで毎日楽しく過ごしています", icon_id: iconMap.get("tbIconStar") || 1, icon_color: "#fcc419", invite_code: generateInviteCode() },
    { display_id: "takahashi_family", local_name: "高橋家", online_name: "たかはしファミリー", introduction: "北海道から参加！雪国ならではのクエストもあります", icon_id: iconMap.get("tbIconSnowflake") || 1, icon_color: "#20c997", invite_code: generateInviteCode() },
    { display_id: "tanaka_family", local_name: "田中家", online_name: "たなかファミリー", introduction: "名古屋の3世代家族。おじいちゃんおばあちゃんも応援してくれます", icon_id: iconMap.get("tbIconUsers") || 1, icon_color: "#845ef7", invite_code: generateInviteCode() },
    { display_id: "ito_family", local_name: "伊藤家", online_name: "いとうファミリー", introduction: "沖縄の海が大好き家族！自然と触れ合うクエストが多いです", icon_id: iconMap.get("tbIconSun") || 1, icon_color: "#fd7e14", invite_code: generateInviteCode() },
    { display_id: "watanabe_family", local_name: "渡辺家", online_name: "わたなべファミリー", introduction: "京都の伝統を大切にする家族。礼儀作法のクエストが得意です", icon_id: iconMap.get("tbIconMoon") || 1, icon_color: "#51cf66", invite_code: generateInviteCode() },
    { display_id: "nakamura_family", local_name: "中村家", online_name: "なかむらファミリー", introduction: "神奈川のスポーツ大好き家族！運動系クエストをたくさん作っています", icon_id: iconMap.get("tbIconBallBasketball") || 1, icon_color: "#ff6b6b", invite_code: generateInviteCode() },
  ]

  const { data: insertedFamilies, error: familyError } = await supabase
    .from("families")
    .upsert(familiesData, { onConflict: "display_id" })
    .select()
  
  if (familyError) {
    console.error("家族登録エラー:", familyError)
  } else {
    console.log(`  ${insertedFamilies?.length || 0}件の家族を登録しました`)
  }

  // 家族IDマップを取得する
  const { data: allFamilies } = await supabase.from("families").select("*")
  const familyMap = new Map(allFamilies?.map(f => [f.local_name, f.id]) || [])

  // ========================================
  // 4. プロフィール・親・子供登録
  // ========================================
  console.log("4. プロフィール・親・子供を登録...")

  // 各家族のユーザーデータ
  const familyUsers = [
    {
      familyName: "山田家",
      parents: [
        { name: "山田太郎", birthday: "1985-03-15" },
        { name: "山田花子", birthday: "1987-06-20" },
      ],
      children: [
        { name: "やまと", birthday: "2015-04-10", level: 5, totalExp: 350 },
        { name: "さくら", birthday: "2018-08-25", level: 3, totalExp: 150 },
        { name: "ひなた", birthday: "2022-01-05", level: 1, totalExp: 30 },
      ],
    },
    {
      familyName: "佐藤家",
      parents: [
        { name: "佐藤健一", birthday: "1982-11-08" },
        { name: "佐藤美咲", birthday: "1984-02-14" },
      ],
      children: [
        { name: "こうき", birthday: "2013-07-22", level: 8, totalExp: 1200 },
        { name: "みゆ", birthday: "2016-12-03", level: 4, totalExp: 280 },
        { name: "りく", birthday: "2019-05-18", level: 2, totalExp: 80 },
      ],
    },
    {
      familyName: "鈴木家",
      parents: [
        { name: "鈴木一郎", birthday: "1980-09-12" },
        { name: "鈴木恵子", birthday: "1983-04-28" },
      ],
      children: [
        { name: "しょうた", birthday: "2017-03-30", level: 3, totalExp: 180 },
        { name: "あおい", birthday: "2019-10-15", level: 2, totalExp: 90 },
        { name: "ゆい", birthday: "2021-06-08", level: 1, totalExp: 40 },
      ],
    },
    {
      familyName: "高橋家",
      parents: [
        { name: "高橋誠", birthday: "1978-07-25" },
        { name: "高橋真理", birthday: "1981-12-10" },
      ],
      children: [
        { name: "はると", birthday: "2012-02-14", level: 15, totalExp: 3500 },
        { name: "ことは", birthday: "2015-09-20", level: 6, totalExp: 500 },
        { name: "あさひ", birthday: "2018-04-05", level: 3, totalExp: 160 },
      ],
    },
    {
      familyName: "田中家",
      parents: [
        { name: "田中浩二", birthday: "1975-01-30" },
        { name: "田中由美", birthday: "1979-08-18" },
      ],
      children: [
        { name: "りょうた", birthday: "2016-11-25", level: 4, totalExp: 300 },
        { name: "ひまり", birthday: "2019-07-12", level: 2, totalExp: 70 },
        { name: "かいと", birthday: "2022-03-08", level: 1, totalExp: 20 },
      ],
    },
    {
      familyName: "伊藤家",
      parents: [
        { name: "伊藤大輔", birthday: "1983-05-22" },
        { name: "伊藤彩", birthday: "1986-10-30" },
      ],
      children: [
        { name: "そら", birthday: "2014-06-15", level: 10, totalExp: 2000 },
        { name: "うみ", birthday: "2017-12-20", level: 5, totalExp: 400 },
        { name: "なぎさ", birthday: "2020-08-10", level: 2, totalExp: 100 },
      ],
    },
    {
      familyName: "渡辺家",
      parents: [
        { name: "渡辺修", birthday: "1977-04-08" },
        { name: "渡辺京子", birthday: "1980-11-25" },
      ],
      children: [
        { name: "あきら", birthday: "2013-01-18", level: 12, totalExp: 2800 },
        { name: "まい", birthday: "2016-05-30", level: 6, totalExp: 550 },
        { name: "れん", birthday: "2019-09-22", level: 3, totalExp: 140 },
      ],
    },
    {
      familyName: "中村家",
      parents: [
        { name: "中村翔太", birthday: "1984-08-15" },
        { name: "中村愛", birthday: "1987-03-20" },
      ],
      children: [
        { name: "しゅん", birthday: "2015-10-08", level: 7, totalExp: 800 },
        { name: "のぞみ", birthday: "2018-02-28", level: 4, totalExp: 250 },
        { name: "かける", birthday: "2021-07-15", level: 1, totalExp: 50 },
      ],
    },
  ]

  let totalProfiles = 0
  let totalParents = 0
  let totalChildren = 0

  for (const family of familyUsers) {
    const familyId = familyMap.get(family.familyName)
    if (!familyId) {
      console.error(`  家族 ${family.familyName} が見つかりません`)
      continue
    }

    // 親を登録する
    for (const parent of family.parents) {
      // プロフィール作成
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .insert({
          name: parent.name,
          birthday: parent.birthday,
          family_id: familyId,
          icon_id: defaultIconId,
          icon_color: getRandomColor(),
          type: "parent",
        })
        .select()
        .single()

      if (profileErr) {
        console.error(`  プロフィール作成エラー (${parent.name}):`, profileErr.message)
        continue
      }

      // 親レコード作成
      const { error: parentErr } = await supabase
        .from("parents")
        .insert({
          profile_id: profile.id,
          invite_code: generateInviteCode(),
        })

      if (parentErr) {
        console.error(`  親作成エラー (${parent.name}):`, parentErr.message)
      } else {
        totalProfiles++
        totalParents++
      }
    }

    // 子供を登録する
    for (const child of family.children) {
      // プロフィール作成
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .insert({
          name: child.name,
          birthday: child.birthday,
          family_id: familyId,
          icon_id: defaultIconId,
          icon_color: getRandomColor(),
          type: "child",
        })
        .select()
        .single()

      if (profileErr) {
        console.error(`  プロフィール作成エラー (${child.name}):`, profileErr.message)
        continue
      }

      // 子供レコード作成
      const { error: childErr } = await supabase
        .from("children")
        .insert({
          profile_id: profile.id,
          invite_code: generateInviteCode(),
          current_level: child.level,
          total_exp: child.totalExp,
        })

      if (childErr) {
        console.error(`  子供作成エラー (${child.name}):`, childErr.message)
      } else {
        totalProfiles++
        totalChildren++
      }
    }
  }

  console.log(`  プロフィール ${totalProfiles}件、親 ${totalParents}件、子供 ${totalChildren}件を登録しました`)

  // ========================================
  // 5 & 6. クエスト & 家族クエスト作成
  // ========================================
  console.log("5. クエスト & 家族クエストを作成...")

  // クエストデータ定義
  const questsData = [
    // 勉強（カテゴリID: 1）
    { name: "宿題を終わらせる", category_id: 1, client: "お母さん", request_detail: "学校の宿題を全部終わらせよう！", age_from: 6, age_to: 12 },
    { name: "漢字ドリル1ページ", category_id: 1, client: "お父さん", request_detail: "漢字ドリルを1ページ丁寧に書こう", age_from: 6, age_to: 12 },
    { name: "算数プリント", category_id: 1, client: "お母さん", request_detail: "算数プリントを解いて見せてね", age_from: 6, age_to: 12 },
    { name: "英単語10個覚える", category_id: 1, client: "お父さん", request_detail: "今日の英単語を10個覚えよう", age_from: 8, age_to: 15 },
    { name: "九九の練習", category_id: 1, client: "お母さん", request_detail: "九九を全部言えるように練習しよう", age_from: 7, age_to: 9 },
    { name: "音読する", category_id: 1, client: "お父さん", request_detail: "教科書を大きな声で読もう", age_from: 6, age_to: 10 },
    { name: "日記を書く", category_id: 1, client: "お母さん", request_detail: "今日あったことを日記に書こう", age_from: 6, age_to: 12 },
    { name: "プログラミング学習", category_id: 1, client: "お父さん", request_detail: "Scratchで1つ作品を作ろう", age_from: 8, age_to: 15 },
    { name: "テスト勉強30分", category_id: 1, client: "お母さん", request_detail: "テストに向けて30分勉強しよう", age_from: 10, age_to: 15 },
    { name: "計算ドリル", category_id: 1, client: "お父さん", request_detail: "計算ドリル2ページをやろう", age_from: 6, age_to: 12 },
    // 運動（カテゴリID: 2）
    { name: "朝のラジオ体操", category_id: 2, client: "お母さん", request_detail: "朝起きたらラジオ体操をしよう！", age_from: null, age_to: null },
    { name: "縄跳び100回", category_id: 2, client: "お父さん", request_detail: "縄跳びを100回連続で跳ぼう", age_from: 5, age_to: 12 },
    { name: "散歩30分", category_id: 2, client: "お母さん", request_detail: "外を30分歩いてこよう", age_from: null, age_to: null },
    { name: "ストレッチ", category_id: 2, client: "お父さん", request_detail: "朝か夜にストレッチをしよう", age_from: null, age_to: null },
    { name: "公園で遊ぶ", category_id: 2, client: "お母さん", request_detail: "公園で30分以上遊ぼう", age_from: 3, age_to: 12 },
    { name: "自転車の練習", category_id: 2, client: "お父さん", request_detail: "自転車に乗る練習をしよう", age_from: 4, age_to: 8 },
    { name: "腕立て伏せ10回", category_id: 2, client: "お父さん", request_detail: "正しいフォームで腕立て伏せをしよう", age_from: 8, age_to: 15 },
    { name: "スクワット20回", category_id: 2, client: "お母さん", request_detail: "スクワット20回頑張ろう", age_from: 8, age_to: 15 },
    { name: "ダンス練習", category_id: 2, client: "お母さん", request_detail: "好きなダンスを10分練習しよう", age_from: null, age_to: null },
    { name: "バランス練習", category_id: 2, client: "お父さん", request_detail: "片足立ち30秒できるかな？", age_from: 4, age_to: 10 },
    // 家事（カテゴリID: 3）
    { name: "お風呂掃除", category_id: 3, client: "お母さん", request_detail: "お風呂をピカピカにしよう", age_from: 8, age_to: 15 },
    { name: "食器洗い", category_id: 3, client: "お父さん", request_detail: "食後の食器を洗おう", age_from: 6, age_to: 15 },
    { name: "洗濯物たたみ", category_id: 3, client: "お母さん", request_detail: "乾いた洗濯物をきれいにたたもう", age_from: 5, age_to: 15 },
    { name: "部屋の掃除", category_id: 3, client: "お父さん", request_detail: "自分の部屋を掃除しよう", age_from: 6, age_to: 15 },
    { name: "ゴミ捨て", category_id: 3, client: "お母さん", request_detail: "ゴミをゴミ捨て場に持っていこう", age_from: 6, age_to: 15 },
    { name: "テーブル拭き", category_id: 3, client: "お父さん", request_detail: "食事の前後にテーブルを拭こう", age_from: 4, age_to: 12 },
    { name: "玄関掃除", category_id: 3, client: "お母さん", request_detail: "玄関をきれいに掃除しよう", age_from: 6, age_to: 15 },
    { name: "窓拭き", category_id: 3, client: "お父さん", request_detail: "窓ガラスをピカピカにしよう", age_from: 8, age_to: 15 },
    { name: "布団干し", category_id: 3, client: "お母さん", request_detail: "天気の良い日に布団を干そう", age_from: 8, age_to: 15 },
    { name: "植物の水やり", category_id: 3, client: "お父さん", request_detail: "植物にお水をあげよう", age_from: 3, age_to: 12 },
    { name: "ペットの世話", category_id: 3, client: "お母さん", request_detail: "ペットにごはんをあげよう", age_from: 5, age_to: 15 },
    { name: "靴を揃える", category_id: 3, client: "お父さん", request_detail: "玄関の靴をきれいに揃えよう", age_from: 3, age_to: 10 },
    // 身だしなみ（カテゴリID: 4）
    { name: "歯磨き3分", category_id: 4, client: "お母さん", request_detail: "3分間しっかり歯を磨こう", age_from: null, age_to: null },
    { name: "爪切り", category_id: 4, client: "お父さん", request_detail: "伸びた爪を切ろう", age_from: 6, age_to: 15 },
    { name: "髪をとかす", category_id: 4, client: "お母さん", request_detail: "朝起きたら髪をとかそう", age_from: null, age_to: null },
    { name: "顔を洗う", category_id: 4, client: "お父さん", request_detail: "朝と夜に顔を洗おう", age_from: null, age_to: null },
    { name: "お風呂に入る", category_id: 4, client: "お母さん", request_detail: "体をきれいに洗おう", age_from: null, age_to: null },
    { name: "服をたたむ", category_id: 4, client: "お父さん", request_detail: "脱いだ服をきれいにたたもう", age_from: 4, age_to: 12 },
    { name: "早寝早起き", category_id: 4, client: "お母さん", request_detail: "夜9時に寝て朝7時に起きよう", age_from: 5, age_to: 12 },
    { name: "手洗いうがい", category_id: 4, client: "お父さん", request_detail: "外から帰ったら手洗いうがい！", age_from: null, age_to: null },
    // 料理（カテゴリID: 5）
    { name: "朝ごはん作り", category_id: 5, client: "お母さん", request_detail: "簡単な朝ごはんを作ってみよう", age_from: 8, age_to: 15 },
    { name: "お弁当の手伝い", category_id: 5, client: "お父さん", request_detail: "お弁当作りを手伝おう", age_from: 6, age_to: 15 },
    { name: "サラダ作り", category_id: 5, client: "お母さん", request_detail: "野菜を切ってサラダを作ろう", age_from: 8, age_to: 15 },
    { name: "おにぎり作り", category_id: 5, client: "お父さん", request_detail: "おにぎりを上手に握ろう", age_from: 5, age_to: 15 },
    { name: "卵料理", category_id: 5, client: "お母さん", request_detail: "卵焼きや目玉焼きを作ろう", age_from: 8, age_to: 15 },
    { name: "お米を研ぐ", category_id: 5, client: "お父さん", request_detail: "お米をきれいに研いでセットしよう", age_from: 6, age_to: 15 },
    { name: "食材を切る", category_id: 5, client: "お母さん", request_detail: "野菜を包丁で切ってみよう", age_from: 8, age_to: 15 },
    { name: "お菓子作り", category_id: 5, client: "お父さん", request_detail: "クッキーやケーキを作ろう", age_from: 6, age_to: 15 },
    { name: "配膳の手伝い", category_id: 5, client: "お母さん", request_detail: "ご飯の準備を手伝おう", age_from: 4, age_to: 12 },
    // 読書（カテゴリID: 6）
    { name: "本を30分読む", category_id: 6, client: "お母さん", request_detail: "静かに30分読書しよう", age_from: 6, age_to: 15 },
    { name: "図書館で本を借りる", category_id: 6, client: "お父さん", request_detail: "図書館に行って本を借りよう", age_from: 5, age_to: 15 },
    { name: "読書感想文", category_id: 6, client: "お母さん", request_detail: "読んだ本の感想を書こう", age_from: 8, age_to: 15 },
    { name: "絵本を読む", category_id: 6, client: "お父さん", request_detail: "絵本を1冊読もう", age_from: 3, age_to: 8 },
    { name: "新聞を読む", category_id: 6, client: "お母さん", request_detail: "子供新聞を読んでみよう", age_from: 8, age_to: 15 },
    { name: "本を1冊読み切る", category_id: 6, client: "お父さん", request_detail: "1冊最後まで読もう", age_from: 6, age_to: 15 },
    // お金の管理（カテゴリID: 7）
    { name: "おこづかい帳をつける", category_id: 7, client: "お母さん", request_detail: "今日使ったお金を記録しよう", age_from: 6, age_to: 15 },
    { name: "貯金箱に入れる", category_id: 7, client: "お父さん", request_detail: "おこづかいの一部を貯金しよう", age_from: 5, age_to: 15 },
    { name: "お買い物メモ作り", category_id: 7, client: "お母さん", request_detail: "買いたいものリストを作ろう", age_from: 6, age_to: 15 },
    { name: "節約チャレンジ", category_id: 7, client: "お父さん", request_detail: "1週間むだ遣いをしないでおこう", age_from: 8, age_to: 15 },
    { name: "目標貯金", category_id: 7, client: "お母さん", request_detail: "目標金額まで貯金しよう", age_from: 8, age_to: 15 },
    // 友だち（カテゴリID: 8）
    { name: "お友達と仲良く遊ぶ", category_id: 8, client: "お母さん", request_detail: "ケンカしないで楽しく遊ぼう", age_from: 3, age_to: 12 },
    { name: "お礼の手紙を書く", category_id: 8, client: "お父さん", request_detail: "ありがとうの気持ちを手紙に書こう", age_from: 6, age_to: 15 },
    { name: "挨拶をする", category_id: 8, client: "お母さん", request_detail: "元気よく挨拶しよう", age_from: null, age_to: null },
    { name: "順番を守る", category_id: 8, client: "お父さん", request_detail: "順番をきちんと守ろう", age_from: 3, age_to: 10 },
    { name: "譲り合う", category_id: 8, client: "お母さん", request_detail: "お友達に譲ってあげよう", age_from: 3, age_to: 12 },
    // 趣味・創作（カテゴリID: 9）
    { name: "お絵描き", category_id: 9, client: "お母さん", request_detail: "好きな絵を1枚描こう", age_from: null, age_to: null },
    { name: "折り紙", category_id: 9, client: "お父さん", request_detail: "折り紙で何か作ろう", age_from: 4, age_to: 12 },
    { name: "工作", category_id: 9, client: "お母さん", request_detail: "材料を使って何か作ろう", age_from: 4, age_to: 12 },
    { name: "ピアノ練習", category_id: 9, client: "お父さん", request_detail: "ピアノを30分練習しよう", age_from: 5, age_to: 15 },
    { name: "楽器練習", category_id: 9, client: "お母さん", request_detail: "好きな楽器を練習しよう", age_from: 5, age_to: 15 },
    { name: "粘土遊び", category_id: 9, client: "お父さん", request_detail: "粘土で好きなものを作ろう", age_from: 3, age_to: 10 },
    { name: "塗り絵", category_id: 9, client: "お母さん", request_detail: "塗り絵を1ページ完成させよう", age_from: 3, age_to: 10 },
    { name: "写真を撮る", category_id: 9, client: "お父さん", request_detail: "素敵な写真を撮ってみよう", age_from: 6, age_to: 15 },
    { name: "習字練習", category_id: 9, client: "お母さん", request_detail: "習字を丁寧に書こう", age_from: 6, age_to: 15 },
  ]

  // クエストごとのアイコンマッピング
  const questIconMapping: Record<number, string> = {
    1: "tbIconPencil",  // 勉強
    2: "tbIconRun",     // 運動
    3: "tbIconHome",    // 家事
    4: "tbIconMoodSmile", // 身だしなみ
    5: "tbIconMeat",    // 料理
    6: "tbIconStar",    // 読書
    7: "tbIconHeart",   // お金
    8: "tbIconFriends", // 友だち
    9: "tbIconMusic",   // 趣味
  }

  // 家族リストを取得する
  const familyIds = Array.from(familyMap.values())
  
  let questCount = 0
  let familyQuestCount = 0
  const createdQuests: { questId: string; familyId: string }[] = []

  // 各家族に均等にクエストを割り当てる（約12-13件ずつ）
  for (let i = 0; i < questsData.length; i++) {
    const quest = questsData[i]
    const familyId = familyIds[i % familyIds.length]
    const iconName = questIconMapping[quest.category_id] || "tbIconStar"
    const iconId = iconMap.get(iconName) || defaultIconId

    // クエスト作成
    const { data: createdQuest, error: questErr } = await supabase
      .from("quests")
      .insert({
        name: quest.name,
        type: "family",
        category_id: quest.category_id,
        icon_id: iconId,
        icon_color: getRandomColor(),
        age_from: quest.age_from,
        age_to: quest.age_to,
        client: quest.client,
        request_detail: quest.request_detail,
      })
      .select()
      .single()

    if (questErr) {
      console.error(`  クエスト作成エラー (${quest.name}):`, questErr.message)
      continue
    }
    questCount++

    // 家族クエスト作成
    const { error: fqErr } = await supabase
      .from("family_quests")
      .insert({
        quest_id: createdQuest.id,
        family_id: familyId,
      })

    if (fqErr) {
      console.error(`  家族クエスト作成エラー (${quest.name}):`, fqErr.message)
    } else {
      familyQuestCount++
      createdQuests.push({ questId: createdQuest.id, familyId })
    }
  }

  console.log(`  クエスト ${questCount}件、家族クエスト ${familyQuestCount}件を作成しました`)

  // ========================================
  // 7. クエスト詳細（レベル設定）
  // ========================================
  console.log("6. クエスト詳細（レベル設定）を作成...")

  let detailCount = 0
  const levelConfigs = [
    { level: 1, reward: 50, child_exp: 10, required_completion_count: 1, required_clear_count: 3 },
    { level: 2, reward: 100, child_exp: 20, required_completion_count: 1, required_clear_count: 5 },
    { level: 3, reward: 150, child_exp: 30, required_completion_count: 1, required_clear_count: 10 },
    { level: 4, reward: 200, child_exp: 50, required_completion_count: 1, required_clear_count: 15 },
    { level: 5, reward: 300, child_exp: 100, required_completion_count: 1, required_clear_count: 0 },
  ]

  for (const { questId } of createdQuests) {
    for (const config of levelConfigs) {
      const { error: detailErr } = await supabase
        .from("quest_details")
        .insert({
          quest_id: questId,
          level: config.level,
          success_condition: `レベル${config.level}の成功条件を達成しよう`,
          required_completion_count: config.required_completion_count,
          reward: config.reward + Math.floor(Math.random() * 50), // 少しランダム性を加える
          child_exp: config.child_exp,
          required_clear_count: config.required_clear_count,
        })

      if (detailErr) {
        // 重複エラーは無視する
        if (!detailErr.message.includes("duplicate")) {
          console.error(`  クエスト詳細作成エラー:`, detailErr.message)
        }
      } else {
        detailCount++
      }
    }
  }

  console.log(`  クエスト詳細 ${detailCount}件を作成しました`)

  // ========================================
  // 8 & 9. 公開クエスト作成
  // ========================================
  console.log("7. 公開クエストを作成...")

  // 公開クエスト用のクエストを選ぶ（最初の20件の家族クエストを公開）
  const { data: familyQuestsForPublic } = await supabase
    .from("family_quests")
    .select("id, quest_id, family_id")
    .limit(20)

  let publicQuestCount = 0

  for (const fq of familyQuestsForPublic || []) {
    // 公開用のクエストを作成する（元クエストをコピー）
    const { data: originalQuest } = await supabase
      .from("quests")
      .select("*")
      .eq("id", fq.quest_id)
      .single()

    if (!originalQuest) continue

    const { data: publicQuestData, error: pqErr } = await supabase
      .from("quests")
      .insert({
        name: originalQuest.name,
        type: "public",
        category_id: originalQuest.category_id,
        icon_id: originalQuest.icon_id,
        icon_color: originalQuest.icon_color,
        age_from: originalQuest.age_from,
        age_to: originalQuest.age_to,
        client: originalQuest.client,
        request_detail: originalQuest.request_detail,
      })
      .select()
      .single()

    if (pqErr) {
      console.error(`  公開クエスト作成エラー:`, pqErr.message)
      continue
    }

    // 公開クエストレコードを作成する
    const { error: pubErr } = await supabase
      .from("public_quests")
      .insert({
        quest_id: publicQuestData.id,
        family_quest_id: fq.id,
        family_id: fq.family_id,
        is_activate: true,
      })

    if (pubErr) {
      console.error(`  公開クエストレコード作成エラー:`, pubErr.message)
    } else {
      publicQuestCount++
    }

    // 公開クエストにもレベル設定をコピーする
    for (const config of levelConfigs) {
      await supabase
        .from("quest_details")
        .insert({
          quest_id: publicQuestData.id,
          level: config.level,
          success_condition: `レベル${config.level}の成功条件を達成しよう`,
          required_completion_count: config.required_completion_count,
          reward: config.reward + Math.floor(Math.random() * 50),
          child_exp: config.child_exp,
          required_clear_count: config.required_clear_count,
        })
    }
  }

  console.log(`  公開クエスト ${publicQuestCount}件を作成しました`)

  // ========================================
  // 完了
  // ========================================
  console.log("\n=== テストデータ投入完了 ===")
  
  // 最終確認
  const { data: finalFamilies } = await supabase.from("families").select("id")
  const { data: finalProfiles } = await supabase.from("profiles").select("id")
  const { data: finalQuests } = await supabase.from("quests").select("id")
  const { data: finalFamilyQuests } = await supabase.from("family_quests").select("id")
  const { data: finalPublicQuests } = await supabase.from("public_quests").select("id")
  const { data: finalQuestDetails } = await supabase.from("quest_details").select("id")
  const { data: finalIcons } = await supabase.from("icons").select("id")
  const { data: finalIconCategories } = await supabase.from("icon_categories").select("id")

  console.log("\n【最終データ件数】")
  console.log(`  アイコンカテゴリ: ${finalIconCategories?.length || 0}件`)
  console.log(`  アイコン: ${finalIcons?.length || 0}件`)
  console.log(`  家族: ${finalFamilies?.length || 0}件`)
  console.log(`  プロフィール: ${finalProfiles?.length || 0}件`)
  console.log(`  クエスト: ${finalQuests?.length || 0}件`)
  console.log(`  家族クエスト: ${finalFamilyQuests?.length || 0}件`)
  console.log(`  公開クエスト: ${finalPublicQuests?.length || 0}件`)
  console.log(`  クエスト詳細: ${finalQuestDetails?.length || 0}件`)
}

main().catch(console.error)
