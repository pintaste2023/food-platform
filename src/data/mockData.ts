export const mockData = {
  // Company Information - builds trust
  company: {
    name: '品點子有限公司',
    founded: '2024',
    registration: '統一編號: 91028476',
    address: '台北市松山區民生東路三段 156 號',
    phone: '02-2528-0000',
    email: 'hello@pindianzi.com',
    line: '@pindianzi',
  },

  // Trust Badges
  trustBadges: [
    { icon: '🛡️', text: 'SSL 安全加密' },
    { icon: '📋', text: '食品業登錄字號' },
    { icon: '🏦', text: '金流代收款保障' },
    { icon: '📦', text: '商品責任險' },
  ],

  // User Testimonials - social proof
  testimonials: [
    {
      id: 1,
      name: '小美',
      avatar: '👩',
      role: '部落客',
      quote: '本來只是想試試看，沒想到做出來的產品真的有人買！',
      earnings: '+NT$12,000/月',
      products: 3,
    },
    {
      id: 2,
      name: '阿國',
      avatar: '👨',
      role: '健身教練',
      quote: '我用「高蛋白零食」這個點子，做出自己品牌的健身點心',
      earnings: '+NT$28,000/月',
      products: 5,
    },
    {
      id: 3,
      name: '怡君',
      avatar: '👩‍🦰',
      role: '家庭媽媽',
      quote: '在家帶小孩也能做自己的產品，小額收入很開心',
      earnings: '+NT$5,000/月',
      products: 2,
    },
  ],

  // Partner Factories
  partners: [
    { name: '合格食品工廠 A 廠', location: '桃園', certifications: ['ISO 22000', 'HACCP'] },
    { name: '合格食品工廠 B 廠', location: '台中', certifications: ['ISO 22000', 'HALAL'] },
    { name: '合格食品工廠 C 廠', location: '高雄', certifications: ['ISO 22000', 'FSSC'] },
  ],

  // Media Coverage
  mediaCoverage: [
    { outlet: '數位時代', title: 'AI 助力食品創業：從點子到商品只要 7 天' },
    { outlet: 'INSIDE', title: '品點子：用 AI 降低食品創業門檻' },
    { outlet: '食力', title: '個人品牌食品的崛起：AI 輔助創作成新趨勢' },
  ],

  // Pricing Plans
  pricing: [
    {
      name: '免費體驗',
      price: 'NT$0',
      period: '永久',
      features: ['每日 3 次 AI 生成', '基本配方建議', '社群分享連結'],
      cta: '開始免費試試',
      highlight: false,
    },
    {
      name: '創作人',
      price: 'NT$399',
      period: '/月',
      features: ['無限 AI 生成', '完整配方報告', '工廠媒合服務', '一鍵生成商品頁', '銷售數據分析'],
      cta: '立即升級',
      highlight: true,
    },
    {
      name: '品牌代理',
      price: 'NT$1,299',
      period: '/月',
      features: ['創作人全部功能', '多品牌管理', 'API 接口', '專屬客服', '營銷素材庫'],
      cta: '聯繫業務',
      highlight: false,
    },
  ],

  // FAQ
  faq: [
    {
      question: '真的不用自己跑去工廠嗎？',
      answer: '是的，我們會根據你的配方媒合最適合的工廠，你只需要確認樣品就可以量產。',
    },
    {
      question: '沒有食品背景可以做嗎？',
      answer: '完全可以！我們的 AI 會引導你完成所有必要的安全規範和標示要求。',
    },
    {
      question: '商品多久可以上市？',
      answer: '從點子到上架最快 7 天，包含配方調整、包裝設計和工廠生產。',
    },
    {
      question: '賺不到錢會被收費嗎？',
      answer: '不會。我們採用訂閱制，只有在你持續使用功能時才收費，沒有營收不收費。',
    },
    {
      question: '如何確保食品安全？',
      answer: '所有合作工廠都有 ISO 22000 或同等認證，且每筆訂單都有商品責任險保障。',
    },
  ],

  // Feature list for landing page
  features: [
    {
      icon: '🧠',
      title: 'AI 配方設計',
      description: '輸入你的點子，AI 自動分析市場並生成可行配方',
    },
    {
      icon: '🏭',
      title: '工廠媒合',
      description: '系統自動媒合符合條件的認證食品工廠',
    },
    {
      icon: '📦',
      title: '一站式生產',
      description: '從打樣到量產，一個平台全部搞定',
    },
    {
      icon: '📱',
      title: '快速上架',
      description: '一鍵生成專屬商品頁，立即開始銷售',
    },
    {
      icon: '💰',
      title: '自動分潤',
      description: '銷售款項自動結算，直接匯入帳戶',
    },
    {
      icon: '📊',
      title: '數據分析',
      description: '即時掌握銷售數據和市場趨勢',
    },
  ],

  // Process steps
  process: [
    { step: 1, title: '輸入點子', description: '描述你想做的食品類型' },
    { step: 2, title: 'AI 分析', description: '系統分析市場需求與可行性' },
    { step: 3, title: '配方生成', description: '取得完整配方與成本估算' },
    { step: 4, title: '工廠生產', description: '媒合工廠並開始製作' },
    { step: 5, title: '開始銷售', description: '一鍵上架並開始營收' },
  ],
  // 即時動態條數據
  liveTicker: {
    trendingSearches: [
      { keyword: '低卡咖哩', growth: '11.5%' },
      { keyword: '高蛋白甜點', growth: '8.2%' },
      { keyword: '無糖奶茶', growth: '6.8%' },
    ],
    activeDevelopers: 18,
    newOrders: 12,
  },

  // Story Carousel 數據
  stories: [
    {
      id: 1,
      type: 'pain_point',
      title: '每次想做低卡料理都好麻煩...',
      subtitle: '3,421 人說過這句話',
      action: '丟給 AI 試試看',
      bgGradient: 'from-orange-400 to-red-500',
    },
    {
      id: 2,
      type: 'ai_process',
      title: 'AI 正在分析市場',
      subtitle: '找出競爭缺口 + 早期採用者需求',
      action: '比我想的還完整',
      bgGradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      type: 'made',
      title: '後來真的被做出來了',
      subtitle: '我沒有自己處理生產',
      action: '也不用囤貨',
      bgGradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 4,
      type: 'selling',
      title: '我把連結丟到限動',
      subtitle: '有人開始下單',
      action: '開始有收益',
      bgGradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 5,
      type: 'result',
      title: '+ NT$30',
      subtitle: '原來這樣也可以做一個產品',
      action: '🔥 我也想試試',
      bgGradient: 'from-yellow-500 to-orange-500',
    },
  ],

  // 社會證明案例
  socialProof: [
    {
      id: 1,
      quote: '第一次發就有人買',
      earnings: '+ NT$60',
      type: 'new',
    },
    {
      id: 2,
      quote: '原本只是亂試',
      earnings: '每天都有單',
      type: 'growth',
    },
    {
      id: 3,
      quote: '我只是分享給朋友',
      earnings: '結果變副收入',
      type: 'viral',
    },
  ],

  // 敲碗需求卡
  demandCards: [
    {
      id: 1,
      demand: '無糖咖哩',
      votes: 301,
      developers: 2,
      recentGrowth: 12,
      category: '低卡',
      aiAnalysis: {
        reasons: [
          '現有產品太貴（平均 NT$180）',
          '口味不夠「日常」（只能運動後吃）',
        ],
        suggestion: {
          price: 'NT$99',
          flavor: '清爽日常版',
        },
        directions: [
          '無糖低脂咖哩',
          '高蛋白健身咖哩',
          '懶人即食咖哩',
        ],
        recommended: '無糖低脂咖哩',
        reason: '這個族群在 IG 上說找不到「好吃又不會胖的咖哩」，但市場 90% 是國外品牌',
      },
    },
    {
      id: 2,
      demand: '高蛋白雪糕',
      votes: 187,
      developers: 1,
      recentGrowth: 8,
      category: '健身',
    },
    {
      id: 3,
      demand: '無糖奶茶',
      votes: 256,
      developers: 3,
      recentGrowth: 15,
      category: '飲品',
    },
  ],

  // 研發故事卡
 研发Stories: [
    {
      id: 1,
      title: '爆款背後',
      content: '測試 7 種配方',
      aiInsight: '這個配方在測試時「健身女孩」反應最好（比一般版本高出 2.3 倍興趣）',
      image: '🧪',
    },
  ],

  // 商品卡
  products: [
    {
      id: 1,
      name: '低卡高蛋白咖哩粉',
      sales: 1230,
      earnings: 30,
      sharers: 128,
      image: '🍛',
      tags: ['新手首推', '熱賣中', '低卡'],
      brandName: 'FitMeal',
      brandLogo: '💪',
      brandStory: '專為健身族群設計的低卡高蛋白咖哩粉，讓你輕鬆享受美味不發胖。來自健身教練的研發初心，要讓每個人都能簡單做出健康料理。',
      price: 99,
    },
    {
      id: 2,
      name: '無糖奶茶粉',
      sales: 856,
      earnings: 25,
      sharers: 64,
      image: '🧋',
      tags: ['熱賣中', '無糖'],
      brandName: '茶時光',
      brandLogo: '🍵',
      brandStory: '堅持使用天然茶葉與代糖，給你最健康的奶茶選擇。零負擔的甜蜜，讓你享受奶茶的同時不需罪惡感。',
      price: 79,
    },
    {
      id: 3,
      name: '健身能量棒',
      sales: 642,
      earnings: 40,
      sharers: 89,
      image: '🥜',
      tags: ['高蛋白', '健身'],
      brandName: 'PowerBar',
      brandLogo: '⚡',
      brandStory: '運動後的最佳能量補充！使用天然堅果和燕麥，結合乳清蛋白，讓你訓練後快速恢復體力。',
      price: 129,
    },
    {
      id: 4,
      name: '素食堅果罐',
      sales: 428,
      earnings: 35,
      sharers: 52,
      image: '🥜',
      tags: ['素食', '天然'],
      brandName: '自然派',
      brandLogo: '🌿',
      brandStory: '來自台灣小農的天然堅果，嚴選無添加的純粹美味。每一口都是大自然的饋贈。',
      price: 149,
    },
    {
      id: 5,
      name: '低糖果乾',
      sales: 512,
      earnings: 20,
      sharers: 78,
      image: '🍎',
      tags: ['低糖', '健康'],
      brandName: '甜而不膩',
      brandLogo: '🍬',
      brandStory: '使用赤蘚糖醇取代傳統糖，保留水果的天然甜味。這是我們對健康的堅持，要讓零食也可以很健康。',
      price: 59,
    },
  ],

  // 收益數據
  earnings: {
    thisMonth: 2340,
    nextLevel: 80,
    level: 1,
    nextLevelName: 'Lv2',
  },

  // AI 生成結果（模擬）
  aiResult: {
    product_name: 'FitMeal 低卡高蛋白咖哩粉',
    concept: '低脂高蛋白，適合健身族快速料理',
    target_audience: '健身族 / 減脂族',
    why_it_sells:
      '這個族群在 IG 上說「每次想做低卡料理都好麻煩...找不到好吃的低卡咖哩」，但市場上 90% 是國外品牌，沒有一個本地品牌能同時做到「美味+低卡+即食」',
    early_adopter_quote: '她們說：每次想做低卡料理都好麻煩，要準備一堆東西...',
    competitor_gap: '搜「低卡咖哩」前三名都是國外品牌，平均價格 NT$180，沒有本地品牌做即食版本',
    social_proof: '這個方向過去 30 天搜尋上升 11.5%，相關關鍵字「健身即食料理」成長 8%',
    ingredients: {
      main: [
        { name: '雞胸肉粉', weight_g: 6 },
        { name: '咖哩香料', weight_g: 2 },
      ],
      required: [{ name: '薑黃粉', weight_g: 1 }],
      optional: [
        { name: '黑胡椒', weight_g: 0.5 },
        { name: '孜然', weight_g: 0.5 },
      ],
    },
    total_weight: 10,
    flavor_profile: ['濃郁', '微辣', '香料感'],
    cost_estimate: '約 NT$12 / 包',
    product_format: '即食粉包',
    brand_aesthetic: {
      reference_brand: 'Glossier',
      style_keywords: ['極簡', '自然', '健康生活'],
      color_palette: ['白', '淺綠', '柔和米'],
      visual_tone: '不像食品品牌的化妝品品牌感',
    },
  },

  // 快速標籤
  quickTags: [
    '低卡咖哩',
    '高蛋白甜點',
    '無糖奶茶',
    '健身餅乾',
    '素食點心',
    '無麩質',
  ],
};

export type MockData = typeof mockData;