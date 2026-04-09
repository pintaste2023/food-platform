/**
 * AI 生成 API
 * 
 * 提供配方建議、風味調整、產品定位等功能
 * 支援 Mock 模式（無 API Key 時使用）
 */

import { NextRequest, NextResponse } from 'next/server';
import { RECIPE_PROMPT } from '@/prompts/recipe';
import { FLAVOR_ADJUST_PROMPT } from '@/prompts/flavor';
import { POSITIONING_PROMPT } from '@/prompts/positioning';
import { BRAND_NAMING_PROMPT } from '@/prompts/naming';
import { LOGO_DESIGN_PROMPT } from '@/prompts/logo';
import { BRAND_STORY_PROMPT } from '@/prompts/story';
import { PACKAGING_DESIGN_PROMPT } from '@/prompts/packaging';

// 環境變數
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_MOCK = !OPENAI_API_KEY; // 沒有 API Key 時使用 Mock 模式

// 模擬延遲（毫秒）
const MOCK_DELAY = 3000;

/**
 * Mock 配方數據生成器
 */
function generateMockRecipe(ingredient: string, productType: string) {
  const ingredientName = ingredient || '食材';
  const typeName = productType || '食品';
  
  return {
    recipe_name: `${ingredientName}${typeName}`,
    description: `使用${ingredientName}製作的美味${typeName}，方便又健康`,
    suggested_variants: [
      `經典版${ingredientName}${typeName}`,
      `升級版（加強風味）`,
      `Lite版（低負擔）`
    ],
    serving_size: '1包（50g）',
    ingredients: [
      { name: ingredientName, amount: '30', unit: 'g', notes: '主要食材' },
      { name: '調味粉', amount: '5', unit: 'g', notes: '可調整' },
      { name: '油脂', amount: '5', unit: 'ml', notes: '橄欖油' },
      { name: '糖', amount: '3', unit: 'g', notes: '可選用蜂蜜' },
      { name: '鹽', amount: '1', unit: 'g', notes: '少許' },
    ],
    steps: [
      `步驟1：將${ingredientName}處理成適當大小`,
      '步驟2：加入調味料均勻攪拌',
      '步驟3：進行調理或烘烤',
      '步驟4：冷卻後包裝完成',
    ],
    flavor_profile: {
      taste: '順口美味，層次豐富',
      aroma: '香氣誘人，令人食指大動',
      texture: '口感絕佳，令人回味',
    },
    shelf_life: '常溫30天',
    target_price: 'NT$89-129',
    difficulty: '簡單',
    prep_time: '30分鐘',
    notes: '這是 AI 為您生成的 MVP 配方，您可以根據實際試作品質進行調整。',
  };
}

const MOCK_RECIPES: Record<string, ReturnType<typeof generateMockRecipe>> = {
  '咖哩': generateMockRecipe('咖哩', '印度風味的即食咖哩醬'),
  '能量': generateMockRecipe('能量球', '高纖維能量球'),
  '餅乾': generateMockRecipe('餅乾', '酥脆可口的餅乾'),
  '果乾': generateMockRecipe('果乾', '天然水果乾'),
  '堅果': generateMockRecipe('堅果', '混合堅果零食'),
  '醬料': generateMockRecipe('醬料', '萬用醬料'),
};

/**
 * Mock 風味調整數據
 */
function generateMockFlavorAdjust(direction: string) {
  const adjustments = {
    '更甜': {
      adjustments: [
        { aspect: '甜度', current: '目前甜度適中', suggestion: '增加甜度', new_amount: '蜂蜜從 30g 增加到 45g', reason: '提升順口度' },
      ],
      revised_ingredients: [
        { name: '蜂蜜', old_amount: '30g', new_amount: '45g', reason: '增加甜度' },
      ],
      revised_flavor_profile: {
        taste: '甜而不膩，溫暖順口',
        aroma: '蜂蜜香甜更明顯',
        texture: '保持濕潤口感',
      },
      prep_notes: '蜂蜜可在最後加入，保留香氣',
      estimated_cost_change: '增加約 5%',
      testing_suggestions: '先做小批量測試，比較調整前后的風味差異',
    },
    '更辣': {
      adjustments: [
        { aspect: '辣度', current: '目前不辣', suggestion: '增加辣度', new_amount: '辣椒粉從 2g 增加到 5g', reason: '提升刺激感' },
      ],
      revised_ingredients: [
        { name: '辣椒粉', old_amount: '2g', new_amount: '5g', reason: '增加辣度' },
      ],
      revised_flavor_profile: {
        taste: '香辣帶勁，層次分明',
        aroma: '辣椒香氣更突出',
        texture: '保持原有口感',
      },
      prep_notes: '辣椒粉可分次加入，調整到喜歡的辣度',
      estimated_cost_change: '增加約 2%',
      testing_suggestions: '從少量開始嘗試，慢慢調整到喜歡的辣度',
    },
    '更健康': {
      adjustments: [
        { aspect: '糖分', current: '含糖量普通', suggestion: '減少糖分', new_amount: '糖從 30g 減少到 15g', reason: '降低熱量' },
        { aspect: '油脂', current: '油脂含量適中', suggestion: '減少油脂', new_amount: '油脂從 20ml 減少到 10ml', reason: '更健康' },
      ],
      revised_ingredients: [
        { name: '糖', old_amount: '30g', new_amount: '15g', reason: '減少糖分' },
        { name: '油脂', old_amount: '20ml', new_amount: '10ml', reason: '減少油脂' },
      ],
      revised_flavor_profile: {
        taste: '清爽不膩，天然食材味',
        aroma: '食材原味更突出',
        texture: '稍微乾一點，但更健康',
      },
      prep_notes: '可加入少量檸檬汁增加層次感，彌補糖分減少的味道',
      estimated_cost_change: '不變',
      testing_suggestions: '注意口感可能會稍微改變，建議加入檸檬汁調整',
    },
  };

  return (adjustments as Record<string, typeof adjustments['更甜']>)[direction] || adjustments['更甜'];
}

/**
 * Mock 產品定位數據
 */
function generateMockPositioning() {
  return {
    positioning_statement: '高纖低卡的即食能量棒，適合忙碌上班族的健康零食首選',
    target_segments: [
      {
        name: '忙碌上班族',
        age_range: '25-40歲',
        pain_points: '沒時間做飯，但又想吃得健康',
        buying_behavior: '願意為便利性和健康付出溢價',
      },
      {
        name: '健身族群',
        age_range: '20-35歲',
        pain_points: '需要快速補充能量但不想吃加工食品',
        buying_behavior: '注重成分和營養標示',
      },
    ],
    core_benefits: [
      '5分鐘即食，方便快速',
      '無人工添加，天然健康',
      '高纖配方，飽足感強',
    ],
    differentiators: [
      '使用台灣本土食材，差异化市場',
      '常溫保存30天，攜帶方便',
    ],
    price_strategy: {
      tier: '中價',
      price_range: 'NT$99-129',
      margin_estimate: '40-50%',
    },
    channel_strategy: [
      '線上電商（主戰場）',
      '健身房運動用品店',
      '便利商店（長期目標）',
    ],
    competitor_gap: '目前市場上的能量棒多為國外進口，價格偏高且口味偏甜，台灣本土品牌的低卡高纖選擇稀少',
    risk_notes: '需注意營養標示規範，以及過度宣稱功效可能觸法的問題',
  };
}

/**
 * Mock 品牌命名數據
 */
function generateMockBrandNaming(productType: string, productFeatures: string) {
  return {
    brand_names: [
      {
        name: '晨食光',
        reason: '「晨」代表早餐，「食」代表食物，「光」代表陽光和希望，整體傳達早晨、元氣、健康的品牌形象',
        chinese_meaning: '早晨陽光般的食物，帶來活力與希望',
        emotional_tone: '溫暖、活力、正能量',
        memorability: 9,
        suitable_for: '早餐食品、健康零食、即食產品',
      },
      {
        name: '田裡味',
        reason: '強調天然、自然、健康的產品特性，給人質樸實在的感覺',
        chinese_meaning: '來自田野的天然美味',
        emotional_tone: '質樸、實在、自然',
        memorability: 8,
        suitable_for: '天然食品、有機產品、農產品加工',
      },
      {
        name: '灶味先生',
        reason: '代表灶頭（廚房）的味道，給人親切、專業的感覺',
        chinese_meaning: '來自廚房的美味',
        emotional_tone: '親切、專業、溫馨',
        memorability: 8,
        suitable_for: '即食料理、醬料、調味料',
      },
    ],
    domain_check: {
      domain_available: 'unknown',
      social_media: '需進一步確認',
    },
    naming_tips: '建議先確認網域和社群帳號的可取得性，再正式使用。中文名稱要注意諧音，避免負面聯想。',
  };
}

/**
 * 根據用戶顏色偏好返回主色
 */
function getPrimaryColor(colorPreference: string) {
  const colors: Record<string, { name: string; hex: string; usage: string; psychology: string }> = {
    '黑白極簡': { name: '石墨黑', hex: '#2D3436', usage: 'Logo 主體、核心文字', psychology: '黑色代表專業、權威，是極簡風格的經典選擇' },
    '暖色系': { name: '活力橙', hex: '#FF6B3D', usage: 'Logo 主體、呼籲行動按鈕', psychology: '橙色代表活力、熱情、食慾，是食品品牌的絕佳選擇' },
    '冷色系': { name: '清新藍', hex: '#0984E3', usage: 'Logo 主體、信任感元素', psychology: '藍色代表信任、專業、清爽，適合健康導向的品牌' },
    '莫蘭迪': { name: '莫蘭迪綠', hex: '#7F8C8D', usage: 'Logo 主體、柔和視覺', psychology: '低飽和色彩傳達高級感、質感，適合追求品味的品牌' },
    '高對比': { name: '強烈紅', hex: '#E74C3C', usage: 'Logo 主體、視覺焦點', psychology: '高對比色彩立即吸引目光，適合需要強烈識別的品牌' },
    '自然色': { name: '森林綠', hex: '#27AE60', usage: 'Logo 主體、自然元素', psychology: '大地色系傳達天然、健康、環保的理念' },
  };
  return colors[colorPreference] || colors['暖色系'];
}

/**
 * 根據用戶顏色偏好返回輔色
 */
function getSecondaryColor(colorPreference: string) {
  const colors: Record<string, { name: string; hex: string; usage: string; psychology: string }> = {
    '黑白極簡': { name: '純淨白', hex: '#FFFFFF', usage: '背景、負空間', psychology: '白色代表純淨、簡潔' },
    '暖色系': { name: '柔奶黃', hex: '#FFEAA7', usage: '輔助圖案、漸層', psychology: '柔和的暖黃色增添溫暖感' },
    '冷色系': { name: '薄荷綠', hex: '#00B894', usage: '輔助圖案、平衡色', psychology: '綠色平衡藍色的冷靜感' },
    '莫蘭迪': { name: '霧霾灰', hex: '#B2BEC3', usage: '輔助元素、層次', psychology: '灰色增添層次而不搶戲' },
    '高對比': { name: '電光藍', hex: '#0984E3', usage: '對比元素、視覺張力', psychology: '強烈對比創造視覺衝擊' },
    '自然色': { name: '大地棕', hex: '#A0522D', usage: '輔助元素、質感', psychology: '棕色代表質樸、自然' },
  };
  return colors[colorPreference] || colors['暖色系'];
}

/**
 * 根據用戶顏色偏好返回強調色
 */
function getAccentColor(colorPreference: string) {
  const colors: Record<string, { name: string; hex: string; usage: string; psychology: string }> = {
    '黑白極簡': { name: '活力紅', hex: '#E74C3C', usage: '唯一強調色、視覺焦點', psychology: '在極簡中創造亮點' },
    '暖色系': { name: '陽光金', hex: '#F39C12', usage: '強調元素、閃光效果', psychology: '金色增添高級感' },
    '冷色系': { name: '珊瑚粉', hex: '#FD79A8', usage: '柔和強調、平衡冷色', psychology: '粉色增添溫暖平衡' },
    '莫蘭迪': { name: '霧霾粉', hex: '#DFE6E9', usage: '低調強調、層次感', psychology: '柔和的點綴' },
    '高對比': { name: '亮黃', hex: '#F1C40F', usage: '高光元素、 extreme contrast', psychology: '極致吸引目光' },
    '自然色': { name: '落葉橘', hex: '#E17055', usage: '自然強調、活力感', psychology: '呼應自然主題' },
  };
  return colors[colorPreference] || colors['暖色系'];
}

/**
 * 根據用戶選擇給予色彩應用建議
 */
function getColorTips(colorPreference: string) {
  const tips: Record<string, string> = {
    '黑白極簡': '💡 技巧：善用負空間，讓黑色 Logo 在白色背景上創造視覺衝擊。可加入一點紅色作為獨特的記憶點。',
    '暖色系': '💡 技巧：暖色系特別適合食品，能刺激食慾。建議橙紅色為主調，金黃色作為點綴。',
    '冷色系': '💡 技巧：藍色傳達信任感，適合健康保健品。但要避免過多藍色，以免降低食慾。',
    '莫蘭迪': '💡 技巧：莫蘭迪色系適合追求質感和高級感的品牌。建議使用霧面處理提升質感。',
    '高對比': '💡 技巧：高對比配色要注意視覺舒適度。可以用白色或淺色作為緩衝，避免過於刺眼。',
    '自然色': '💡 技巧：大地色系傳達天然健康理念。建議使用永續紙材或環保包裝呼應品牌理念。',
  };
  return tips[colorPreference] || tips['暖色系'];
}

/**
 * Mock Logo 設計數據 - 多樣化概念
 */
function generateMockLogoDesign(
  brandName: string, 
  brandPositioning: string = '', 
  targetAudience: string = '', 
  preferredStyle: string = '',
  colorPreference: string = '',
  fontStyle: string = ''
) {
  // 根據不同條件選擇不同的 Logo 概念組合
  const concepts = [];
  
  // 概念 1: 陽光田野
  concepts.push({
    concept_name: '🌾 陽光田野',
    description: '以陽光和麥穗為核心視覺元素，傳達天然、健康、溫暖的品牌形象',
    visual_elements: {
      icon: '☀️ 陽光圖案 + 🌾 麥穗線條',
      color_palette: [
        { color: '暖陽橙', hex: '#FF6B3D', usage: '主色 - 傳達活力與熱情' },
        { color: '田野綠', hex: '#4DBF69', usage: '輔色 - 代表自然與健康' },
        { color: '陽光黃', hex: '#FFD166', usage: '強調色 - 點亮視覺焦點' },
      ],
      typography: {
        font_style: '✍️ 溫暖圓潤的手寫風格',
        recommendations: 'Google Fonts: Just Loop, Caveat, 或 yomogi',
      },
      layout: '📐 水平排列：Logo 在左、文字在右；垂直排列：Logo 在上、文字在下',
    },
    mockup_idea: '🏷️ 可以想像一個陽光形狀的圖案，中間有一束麥穗，下方放品牌名稱',
    mood: '🌟 溫暖、活力、自然',
    versatility: '📦 包裝、🌐 網站、📱 社群媒體、名片等各種場景',
    reason: '陽光和麥穗直接傳達天然、健康、溫暖的品牌價值，與食品創業的核心概念契合',
  });

  // 概念 2: 極簡線條
  concepts.push({
    concept_name: '✨ 極簡線條',
    description: '以簡單的線條勾勒出食材輪廓，呈現現代、專業的品牌風格',
    visual_elements: {
      icon: '🎯 幾何線條勾畫的食物輪廓（可用叉子、湯匙、碗等餐具形狀）',
      color_palette: [
        { color: '石墨黑', hex: '#2D3436', usage: '主色 - 專業、沉穩' },
        { color: '鋼鐵灰', hex: '#636E72', usage: '輔色 - 現代感' },
        { color: '活力紅', hex: '#E17055', usage: '強調色 - 刺激食慾' },
      ],
      typography: {
        font_style: '🔤 簡潔有力的無襯線字體',
        recommendations: 'Google Fonts: Noto Sans TC, Inter, 或 Source Han Sans',
      },
      layout: '📐 左圖右文或上圖下文，適合多種比例',
    },
    mockup_idea: '🏷️ 一個由線條組成的簡單碗或餐具圖案，旁邊放簡潔的品牌文字',
    mood: '🎩 專業、現代、簡潔',
    versatility: '💼 適合高端食材店、餐廳、烹飪課程等商業用途',
    reason: '極簡設計傳達專業品質，線條元素讓人聯想到美食，適合追求品質感的品牌',
  });

  // 概念 3: 手繪溫度
  concepts.push({
    concept_name: '🎨 手繪溫度',
    description: '手繪風格的插圖，傳達溫暖、親切、有溫度的品牌形象',
    visual_elements: {
      icon: '✏️ 手繪風格的食物插圖（水果、甜點、烹飪過程等）',
      color_palette: [
        { color: '柔粉色', hex: '#FDEDEE', usage: '主色 - 柔和、女性化' },
        { color: '焦糖棕', hex: '#A0522D', usage: '輔色 - 溫暖、甜點感' },
        { color: '薄荷綠', hex: '#98D8C8', usage: '強調色 - 清爽、點綴' },
      ],
      typography: {
        font_style: '✍️ 手寫/手繪風格字體',
        recommendations: 'Google Fonts: Ma Shan Zheng, ZCOOL XiaoWei, 或 Hanyi 華康手繪風',
      },
      layout: '📐 Logo 為主，文字為輔，手繪插圖可作為裝飾元素',
    },
    mockup_idea: '🏷️ 一個可愛的手繪草莓或甜點圖案，旁邊用圓潤的手寫字寫品牌名稱',
    mood: '💕 溫馨、親切、少女心',
    versatility: '🍰 甜點店、咖啡廳、烘焙產品、個人品牌',
    reason: '手繪風格傳達溫暖和個人特色，適合想要建立親和形象的品牌',
  });

  // 概念 4: 幾何科技
  concepts.push({
    concept_name: '📐 幾何科技',
    description: '使用幾何圖形和現代設計語言，傳達創新、科技感的品牌形象',
    visual_elements: {
      icon: '⬡ 由六邊形、三角形等幾何形狀組合的食物抽象圖案',
      color_palette: [
        { color: '科技藍', hex: '#0984E3', usage: '主色 - 專業、科技' },
        { color: '未來紫', hex: '#6C5CE7', usage: '輔色 - 創新、年輕' },
        { color: '霓虹綠', hex: '#00B894', usage: '強調色 - 活力、 growth' },
      ],
      typography: {
        font_style: '🔷 幾何風格無襯線字體',
        recommendations: 'Google Fonts: Orbitron, Rajdhani, 或 Fira Code',
      },
      layout: '📐 幾何圖案為視覺焦點，文字簡潔有力，適合數位應用',
    },
    mockup_idea: '🏷️ 一個由幾何圖形組成的抽象食物或AI晶片圖案，帶有科技感的漸層',
    mood: '🚀 創新、前瞻、年輕',
    versatility: '🤖 AI 食品服務、健康科技APP、生技產品',
    reason: '幾何設計傳達精準和專業，適合結合科技的健康食品或AI相關服務',
  });

  // 概念 5: 自然物語
  concepts.push({
    concept_name: '🍃 自然物語',
    description: '以植物葉片、花朵等自然元素為設計核心，強調天然有機的品牌理念',
    visual_elements: {
      icon: '🌿 葉片、花朵、果實等自然元素組成的圖案',
      color_palette: [
        { color: '森林綠', hex: '#27AE60', usage: '主色 - 自然、生機' },
        { color: '大地棕', hex: '#8B7355', usage: '輔色 - 穩重、質樸' },
        { color: '晨光橘', hex: '#F39C12', usage: '強調色 - 陽光、溫暖' },
      ],
      typography: {
        font_style: '🌱 結合自然感的柔和字體',
        recommendations: 'Google Fonts: Nunito, Quicksand, 或 文鼎圓體',
      },
      layout: '📐 自然元素環繞品牌名稱，或作為底部裝飾',
    },
    mockup_idea: '🏷️ 一片美麗的葉子輪廓包圍著品牌名稱，或葉子上放品牌首字母',
    mood: '🌳 純淨、自然、環保',
    versatility: '🌱 有機食品、天然產品、環保包裝、農業品牌',
    reason: '自然元素直接傳達產品天然、健康的特性，適合有機或天然取向的品牌',
  });

  // 概念 6: 活力漸層
  concepts.push({
    concept_name: '🌈 活力漸層',
    description: '使用現代漸層色彩，傳達年輕、活力、多元化的品牌形象',
    visual_elements: {
      icon: '💫 漸層色彩的食物圖案或抽象形狀',
      color_palette: [
        { color: '蜜桃粉', hex: '#FF7675', usage: '主色 - 甜美、活力' },
        { color: '葡萄紫', hex: '#A29BFE', usage: '輔色 - 夢幻、創意' },
        { color: '檸檬黃', hex: '#FFEAA7', usage: '強調色 - 陽光、歡樂' },
      ],
      typography: {
        font_style: '📝 圓潤現代的無襯線字體',
        recommendations: 'Google Fonts: Poppins, Nunito, 或 痞子邦奧運體',
      },
      layout: '📐 漸層圖案為背景或主視覺，文字清晰置於上方',
    },
    mockup_idea: '🏷️ 一個帶有粉色到紫色漸層的圓形或水滴圖案，裡面放品牌首字母',
    mood: '🎉 年輕、活力、快樂',
    versatility: '🎪 派對食品、休閒零食、網紅品牌、潮流產品',
    reason: '漸層色彩傳達多元和活力，適合年輕族群的休閒食品或派對產品',
  });

  return {
    logo_concepts: concepts,
    // 根據用戶選擇動態生成色彩規範
    color_guidelines: {
      // 分析用戶的顏色偏好
      primary: getPrimaryColor(colorPreference),
      secondary: getSecondaryColor(colorPreference),
      accent: getAccentColor(colorPreference),
      color_tips: getColorTips(colorPreference),
    },
    design_tips: getDesignTips(preferredStyle, fontStyle),
    do_and_dont: getDoAndDont(preferredStyle),
  };
}

/**
 * 根據風格偏好返回設計提示
 */
function getDesignTips(preferredStyle: string, fontStyle: string): string {
  const tips: Record<string, string> = {
    '可愛': '💡 設計提示：可愛風格適合使用圓潤的圖案和柔和的顏色。確保在小尺寸時依然可愛吸睛。可加入小巧思如表情符號或趣味元素。',
    '專業': '💡 設計提示：專業風格要保持簡潔有力的視覺。建議使用幾何圖形和清晰的層次。確保文字在各種背景下都能清晰閱讀。',
    '自然': '💡 設計提示：自然風格可融入植物葉片或手繪元素。建議使用大地色系並考慮環保材質的包裝設計。',
    '時尚': '💡 設計提示：時尚風格要大膽實驗。可以使用漸層、幾何圖形或獨特的排版。確保在社群媒體上能夠突出。',
    '復古': '💡 設計提示：復古風格可以使用懷舊的配色和經典的圖案。注意不要過於老氣，可以加入現代元素平衡。',
    '極簡': '💡 設計提示：極簡風格講究「少即是多」。善用負空間，確保 Logo 在單色模式下依然有良好辨識度。',
  };
  
  // 字體相關提示
  const fontTips: Record<string, string> = {
    '無襯線': ' → 字體建議：選擇幾何感的無襯線字體，如 Noto Sans TC 或 Inter，看起來現代且專業。',
    '襯線': ' → 字體建議：襯線字體傳達經典和高級感，適合傳統或高端品牌。',
    '手寫': ' → 字體建議：手寫字體增添溫度和親和力，適合個人品牌或手工產品。',
    '幾何': ' → 字體建議：幾何字體強調結構和精確，適合科技或創新品牌。',
    '粗體': ' → 字體建議：粗體字有力量感和親和力，適合大眾市場品牌。',
    '細體': ' → 字體建議：細體字優雅精緻，適合高端或女性化品牌。',
  };
  
  const styleTip = tips[preferredStyle] || tips['極簡'];
  const fontTip = fontStyle ? (fontTips[fontStyle] || '') : '';
  
  return styleTip + fontTip;
}

/**
 * 根據風格偏好返回建議與禁忌
 */
function getDoAndDont(preferredStyle: string) {
  const commonDo = [
    '✅ 保持簡單，避免過於複雜的細節',
    '✅ 確保在不同尺寸下都清晰可讀',
    '✅ 使用品牌色系保持一致性',
  ];
  
  const commonDont = [
    '❌ 避免使用過多顏色（建議不超過 4 種）',
    '❌ 避免與知名品牌過於相似',
  ];
  
  const styleSpecific: Record<string, { do: string[]; dont: string[] }> = {
    '可愛': {
      do: ['✅ 使用圓潤的邊角和柔和的曲線', '✅ 加入小巧思讓人會心一笑'],
      dont: ['❌ 避免過於尖銳或男性的元素', '❌ 避免過於正式或沉重的氛圍'],
    },
    '專業': {
      do: ['✅ 保持視覺層次清晰', '✅ 使用精確的幾何形狀'],
      dont: ['❌ 避免過於花俏的裝飾', '❌ 避免過於主觀或情緒化的設計'],
    },
    '自然': {
      do: ['✅ 融入自然元素如葉子、果實', '✅ 使用大地色系'],
      dont: ['❌ 避免過於機械或人造的圖形', '❌ 避免過於鮮豔的合成顏色'],
    },
    '時尚': {
      do: ['✅ 大膽嘗試漸層和獨特配色', '✅ 保持前衛和獨特'],
      dont: ['❌ 避免過於保守或無聊的設計', '❌ 避免過時的設計趨勢'],
    },
    '復古': {
      do: ['✅ 使用經典配色和圖案元素', '✅ 加入懷舊情懷但保持現代感'],
      dont: ['❌ 避免過於老舊或過時的感覺', '❌ 避免過度複雜的裝飾花紋'],
    },
    '極簡': {
      do: ['✅ 善用負空間', '✅ 追求「少即是多」的哲學'],
      dont: ['❌ 避免不必要的裝飾元素', '❌ 避免視覺過於空洞'],
    },
  };
  
  const specific = styleSpecific[preferredStyle] || styleSpecific['極簡'];
  
  return {
    do: [...commonDo, ...specific.do],
    dont: [...commonDont, ...specific.dont],
  };
}

/**
 * Mock 品牌故事數據
 */
function generateMockBrandStory(brandName: string) {
  const brand = brandName || '品點子';
  return {
    brand_story: {
      head_line: '讓每一口都是家的味道',
      story: `「${brand}」诞生於一個簡單的想法：每個人都應該能輕鬆做出健康又美味的食物。\n\n創辦人小美原本是個忙碌的上班族，每天為了吃什麼而煩惱。外食雖然方便，但總覺得少了什麼。後來她開始研究如何用簡單的方法，做出營養均衡的料理。\n\n「我想讓跟我一樣忙碌的人，也能好好照顧自己的胃。」就這樣，「${brand}」誕生了。\n\n我們相信，美食不應該是少數人的特權。每個人都有能力做出讓自己驕傲的食物。`,
      mission: '讓每個人都能輕鬆做出健康美味的食物',
      values: [
        '真材實料 - 用最好的食材，做出最好的產品',
        '簡單優先 - 複雜的問題簡單解決',
        '用心對待 - 像對待家人一樣對待每一位顧客',
      ],
      tone_of_voice: '溫暖、友善、專業但不失輕鬆，像是身邊的朋友給你建議',
    },
    story_variants: {
      short: `${brand} - 讓每個人都能成為自己的廚神`,
      medium: `${brand}相信，美食不應該是少數人的特權。我們用 AI 技術，幫助每一位有創業夢想的人，做出屬於自己的產品。從配方到包裝，讓創業變得更簡單。`,
      long: `【${brand}品牌故事完整版】\n\n（這是 Mock 數據，真實 AI 會根據您的品牌特性生成專屬故事）`,
    },
    key_messages: [
      {
        message: '我們相信每個人都能成為自己的廚神',
        context: '官網首頁',
      },
      {
        message: '從 0 到 1，我們陪你一起走',
        context: '關於我們頁面',
      },
    ],
    storytelling_elements: {
      hero: '每一位有創業夢想的普通人',
      conflict: '沒有廚藝經驗，不知道如何開始',
      resolution: '提供 AI 工具和資源，讓每個人都能輕鬆創造自己的食品品牌',
      call_to_action: '開始你的食品創業之旅',
    },
    content_tips: '在撰寫品牌故事時，可以加入創辦人的個人經歷，讓故事更有溫度。記得穿插具體的場景描述，讓讀者能夠產生畫面感。',
  };
}

/**
 * Mock 包裝設計數據
 */
function generateMockPackaging(brandName: string, productType: string) {
  const brand = brandName || '品點子';
  return {
    packaging_concepts: [
      {
        concept_name: '自然簡約',
        description: '以自然、健康為核心的簡約設計，使用大地色系和手繪風格插圖',
        structure: {
          type: '站立袋（帶夾鏈）',
          size: '15x20cm（可裝50g產品）',
          material: '鋁箔夾鏈袋',
          finish: '霧面局部光處理',
        },
        design_elements: {
          front: {
            main_visual: '左側：品牌 Logo + 手繪食材插圖；右側：產品名稱',
            product_name: '中上方，採用溫暖手寫字體',
            tagline: '產品名稱下方，簡短有力',
          },
          back: {
            ingredients: '左側垂直排列',
            nutrition: '右側營養標示表格',
            company_info: '底部廠商資訊',
          },
          side: {
            usage: '左側：使用說明（圖文並茂）',
            storage: '右側：保存方式',
            barcode: '底部角落',
          },
        },
        color_scheme: {
          primary: '#FF6B3D（暖陽橙）',
          secondary: '#4DBF69（田野綠）',
          accent: '#FFD166（陽光黃）',
          text: '#2D3436（深灰）',
        },
        printing_technique: '正面 Logo 和圖案使用局部光處理，增加質感；避免燙金以控制成本',
        cost_estimate: '每個約 NT$2-3元（5000個起印）',
        pros: ['成本適中', '資訊排列清晰', '夾鏈袋方便保存'],
        cons: ['霧面處理稍貴', '圖案複雜度有限制'],
        reason: '簡約設計符合健康、天然的品牌定位，大地色系傳達產品特色，站立袋方便陳列和使用',
      },
    ],
    label_requirements: {
      required: ['產品名稱', '成分', '營養標示', '有效日期', '廠商名稱和地址', '原產地'],
      recommended: ['品牌故事（簡短版）', '烹飪/食用建議', '過敏原警示'],
      optional: ['二維碼（連結到官網）', '社交媒體帳號'],
    },
    packaging_checklist: {
      functionality: ['是否方便打開和關閉', '是否容易傾倒', '是否容易存放', '是否方便攜帶'],
      legal: ['營養標示是否符合法規', '成分標示是否完整', '有效日期是否清晰', '過敏原是否標示'],
      aesthetics: ['視覺是否吸引人', '品牌識別是否清楚', '資訊是否易於閱讀', '整體是否協調'],
      cost: ['是否符合預算', '數量是否有折扣', '是否需要模具費', '運輸成本計算'],
    },
    sustainability: {
      material_options: ['可降解材料', '再生紙漿', 'FSC 認證紙張'],
      reusability: '鋁箔夾鏈袋建議分開處理，鋁箔部分送回收，塑膠部分送再利用',
      tips: '可以在包裝上加入回收說明，提升品牌形象',
    },
    production_tips: '建議先打樣確認效果，大批量生產前計算好物流成本。注意印刷顏色會因材質不同而有誤差。',
  };
}

/**
 * POST handler - 生成配方
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, productIdea, ingredient, productType, targetAudience, styleTags, brandName, currentRecipe, adjustmentDirection, preference, budgetRange, competitors } = body;

    // 根據類型調用不同的生成邏輯
    if (type === 'recipe') {
      // 驗證輸入 - 支援新格式 (ingredient + productType) 或舊格式 (productIdea)
      if (!productIdea && !(ingredient && productType)) {
        return NextResponse.json(
          { error: '請提供食材（ingredient）和產品類型（productType），或產品想法（productIdea）' },
          { status: 400 }
        );
      }
      return await generateRecipe({
        ingredient: ingredient || productIdea,  // 支援新舊格式
        productType: productType || '食品',       // 預設為一般食品
        targetAudience: targetAudience || '一般消費者',
        styleTags: styleTags || [],
        brandName,
      });
    }

    if (type === 'flavor') {
      // 驗證輸入
      if (!currentRecipe || !adjustmentDirection) {
        return NextResponse.json(
          { error: '請提供當前配方（currentRecipe）和調整方向（adjustmentDirection）' },
          { status: 400 }
        );
      }
      return await generateFlavorAdjust({
        currentRecipe,
        adjustmentDirection,
        preference: preference || '',
        targetAudience: targetAudience || '一般消費者',
      });
    }

    if (type === 'positioning') {
      // 驗證輸入
      if (!productIdea || !currentRecipe) {
        return NextResponse.json(
          { error: '請提供產品想法（productIdea）和當前配方（currentRecipe）' },
          { status: 400 }
        );
      }
      return await generatePositioning({
        productIdea,
        currentRecipe,
        targetAudience: targetAudience || '一般消費者',
        budgetRange: budgetRange || '',
        competitors: competitors || '',
      });
    }

    if (type === 'naming') {
      if (!productIdea || !targetAudience) {
        return NextResponse.json(
          { error: '請提供產品想法（productIdea）和目標客群（targetAudience）' },
          { status: 400 }
        );
      }
      return await generateBrandNaming({
        productType: productIdea,
        productFeatures: currentRecipe?.description || '',
        targetAudience: targetAudience,
        brandPositioning: currentRecipe?.positioning_statement || '',
        preferredStyle: styleTags?.[0] || '',
      });
    }

    if (type === 'logo') {
      if (!brandName) {
        return NextResponse.json(
          { error: '請提供 Logo 名稱（brandName）' },
          { status: 400 }
        );
      }
      return await generateLogoDesign({
        brandName: brandName,
        brandPositioning: currentRecipe?.positioning_statement || '',
        targetAudience: targetAudience || '一般消費者',
        preferredStyle: styleTags?.[0] || '',
        colorPreference: body.colorPreference || '',
        fontStyle: body.fontStyle || '',
      });
    }

    if (type === 'story') {
      if (!brandName || !productIdea) {
        return NextResponse.json(
          { error: '請提供品牌名稱（brandName）和產品類型（productIdea）' },
          { status: 400 }
        );
      }
      return await generateBrandStory({
        brandName: brandName,
        productType: productIdea,
        productFeatures: currentRecipe?.description || '',
        brandPositioning: currentRecipe?.positioning_statement || '',
        targetAudience: targetAudience || '一般消費者',
      });
    }

    if (type === 'packaging') {
      if (!brandName || !productIdea) {
        return NextResponse.json(
          { error: '請提供品牌名稱（brandName）和產品類型（productIdea）' },
          { status: 400 }
        );
      }
      return await generatePackaging({
        brandName: brandName,
        productType: productIdea,
        productFeatures: currentRecipe?.description || '',
        packagingForm: styleTags?.[0] || '袋裝',
        budgetRange: budgetRange || '中',
        targetAudience: targetAudience || '一般消費者',
      });
    }

    return NextResponse.json(
      { error: `不支持的生成類型：${type}` },
      { status: 400 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}

/**
 * 生成配方
 */
async function generateRecipe(params: {
  ingredient: string;
  productType: string;
  targetAudience: string;
  styleTags: string[];
  brandName?: string;
}) {
  const { ingredient, productType, targetAudience, styleTags, brandName } = params;

  // Mock 模式
  if (USE_MOCK) {
    // 模擬 API 延遲
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    // 根據食材和產品類型生成適當的 Mock 數據
    const mockData = generateMockRecipe(ingredient, productType);

    // 添加品牌名稱（如果有的話）
    if (brandName) {
      return NextResponse.json({
        success: true,
        data: { ...mockData, recipe_name: `${brandName} - ${mockData.recipe_name}` },
        mode: 'mock',
        message: '這是 Mock 模式的測試資料。若要使用真實 AI，請設定 OPENAI_API_KEY 環境變數。',
      });
    }

    return NextResponse.json({
      success: true,
      data: mockData,
      mode: 'mock',
      message: '這是 Mock 模式的測試資料。若要使用真實 AI，請設定 OPENAI_API_KEY 環境變數。',
    });
  }

  // 真實 API 調用（需要 API Key）
  try {
    const prompt = RECIPE_PROMPT
      .replace('{ingredient}', ingredient)
      .replace('{productType}', productType)
      .replace('{targetAudience}', targetAudience)
      .replace('{styleTags}', styleTags.join(', '))
      .replace('{brandName}', brandName || '（未提供）');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'o4-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API 錯誤');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI 回應為空');

    const recipe = JSON.parse(content);
    return NextResponse.json({ success: true, data: recipe, mode: 'openai' });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: `AI 生成失敗：${error instanceof Error ? error.message : '未知錯誤'}` },
      { status: 500 }
    );
  }
}

/**
 * 風味調整
 */
async function generateFlavorAdjust(params: {
  currentRecipe: any;
  adjustmentDirection: string;
  preference: string;
  targetAudience: string;
}) {
  const { currentRecipe, adjustmentDirection, preference, targetAudience } = params;

  // Mock 模式
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    const mockData = generateMockFlavorAdjust(adjustmentDirection) || generateMockFlavorAdjust('更甜');
    return NextResponse.json({
      success: true,
      data: mockData,
      mode: 'mock',
      message: '這是 Mock 模式的測試資料。若要使用真實 AI，請設定 OPENAI_API_KEY 環境變數。',
    });
  }

  // 真實 API 調用
  try {
    const recipeJson = JSON.stringify(currentRecipe, null, 2);
    const prompt = FLAVOR_ADJUST_PROMPT
      .replace('{currentRecipe}', recipeJson)
      .replace('{adjustmentDirection}', adjustmentDirection)
      .replace('{preference}', preference)
      .replace('{targetAudience}', targetAudience);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'o4-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API 錯誤');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI 回應為空');

    const result = JSON.parse(content);
    return NextResponse.json({ success: true, data: result, mode: 'openai' });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: `AI 生成失敗：${error instanceof Error ? error.message : '未知錯誤'}` },
      { status: 500 }
    );
  }
}

/**
 * 產品定位
 */
async function generatePositioning(params: {
  productIdea: string;
  currentRecipe: any;
  targetAudience: string;
  budgetRange: string;
  competitors: string;
}) {
  const { productIdea, currentRecipe, targetAudience, budgetRange, competitors } = params;

  // Mock 模式
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    const mockData = generateMockPositioning();
    return NextResponse.json({
      success: true,
      data: mockData,
      mode: 'mock',
      message: '這是 Mock 模式的測試資料。若要使用真實 AI，請設定 OPENAI_API_KEY 環境變數。',
    });
  }

  // 真實 API 調用
  try {
    const recipeJson = JSON.stringify(currentRecipe, null, 2);
    const prompt = POSITIONING_PROMPT
      .replace('{productIdea}', productIdea)
      .replace('{currentRecipe}', recipeJson)
      .replace('{targetAudience}', targetAudience)
      .replace('{budgetRange}', budgetRange || '中價位')
      .replace('{competitors}', competitors || '（未提供）');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'o4-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API 錯誤');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI 回應為空');

    const result = JSON.parse(content);
    return NextResponse.json({ success: true, data: result, mode: 'openai' });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: `AI 生成失敗：${error instanceof Error ? error.message : '未知錯誤'}` },
      { status: 500 }
    );
  }
}

/**
 * 品牌命名
 */
async function generateBrandNaming(params: {
  productType: string;
  productFeatures: string;
  targetAudience: string;
  brandPositioning: string;
  preferredStyle: string;
}) {
  const { productType, productFeatures, targetAudience, brandPositioning, preferredStyle } = params;

  // Mock 模式
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    const mockData = generateMockBrandNaming(productType, productFeatures);
    return NextResponse.json({
      success: true,
      data: mockData,
      mode: 'mock',
      message: '這是 Mock 模式的測試資料。若要使用真實 AI，請設定 OPENAI_API_KEY 環境變數。',
    });
  }

  // 真實 API 調用
  try {
    const prompt = BRAND_NAMING_PROMPT
      .replace('{productType}', productType)
      .replace('{productFeatures}', productFeatures)
      .replace('{targetAudience}', targetAudience)
      .replace('{brandPositioning}', brandPositioning || '（未提供）')
      .replace('{preferredStyle}', preferredStyle || '（未提供）');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'o4-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API 錯誤');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI 回應為空');

    const result = JSON.parse(content);
    return NextResponse.json({ success: true, data: result, mode: 'openai' });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: `AI 生成失敗：${error instanceof Error ? error.message : '未知錯誤'}` },
      { status: 500 }
    );
  }
}

/**
 * Logo 設計
 */
async function generateLogoDesign(params: {
  brandName: string;
  brandPositioning: string;
  targetAudience: string;
  preferredStyle: string;
  colorPreference?: string;
  fontStyle?: string;
}) {
  const { brandName, brandPositioning, targetAudience, preferredStyle, colorPreference, fontStyle } = params;

  // Mock 模式
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    const mockData = generateMockLogoDesign(brandName, brandPositioning, targetAudience, preferredStyle, colorPreference, fontStyle);
    return NextResponse.json({
      success: true,
      data: mockData,
      mode: 'mock',
      message: '這是 Mock 模式的測試資料。若要使用真實 AI，請設定 OPENAI_API_KEY 環境變數。',
    });
  }

  // 真實 API 調用
  try {
    const prompt = LOGO_DESIGN_PROMPT
      .replace('{brandName}', brandName)
      .replace('{brandPositioning}', brandPositioning || '（未提供）')
      .replace('{targetAudience}', targetAudience)
      .replace('{preferredStyle}', preferredStyle || '（未提供）')
      .replace('{colorPreference}', colorPreference || '（未提供）')
      .replace('{fontStyle}', fontStyle || '（未提供）');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'o4-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API 錯誤');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI 回應為空');

    const result = JSON.parse(content);
    return NextResponse.json({ success: true, data: result, mode: 'openai' });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: `AI 生成失敗：${error instanceof Error ? error.message : '未知錯誤'}` },
      { status: 500 }
    );
  }
}

/**
 * 品牌故事
 */
async function generateBrandStory(params: {
  brandName: string;
  productType: string;
  productFeatures: string;
  brandPositioning: string;
  targetAudience: string;
}) {
  const { brandName, productType, productFeatures, brandPositioning, targetAudience } = params;

  // Mock 模式
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    const mockData = generateMockBrandStory(brandName);
    return NextResponse.json({
      success: true,
      data: mockData,
      mode: 'mock',
      message: '這是 Mock 模式的測試資料。若要使用真實 AI，請設定 OPENAI_API_KEY 環境變數。',
    });
  }

  // 真實 API 調用
  try {
    const prompt = BRAND_STORY_PROMPT
      .replace('{brandName}', brandName)
      .replace('{productType}', productType)
      .replace('{productFeatures}', productFeatures)
      .replace('{brandPositioning}', brandPositioning || '（未提供）')
      .replace('{targetAudience}', targetAudience);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'o4-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API 錯誤');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI 回應為空');

    const result = JSON.parse(content);
    return NextResponse.json({ success: true, data: result, mode: 'openai' });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: `AI 生成失敗：${error instanceof Error ? error.message : '未知錯誤'}` },
      { status: 500 }
    );
  }
}

/**
 * 包裝設計
 */
async function generatePackaging(params: {
  brandName: string;
  productType: string;
  productFeatures: string;
  packagingForm: string;
  budgetRange: string;
  targetAudience: string;
}) {
  const { brandName, productType, productFeatures, packagingForm, budgetRange, targetAudience } = params;

  // Mock 模式
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    const mockData = generateMockPackaging(brandName, productType);
    return NextResponse.json({
      success: true,
      data: mockData,
      mode: 'mock',
      message: '這是 Mock 模式的測試資料。若要使用真實 AI，請設定 OPENAI_API_KEY 環境變數。',
    });
  }

  // 真實 API 調用
  try {
    const prompt = PACKAGING_DESIGN_PROMPT
      .replace('{brandName}', brandName)
      .replace('{productType}', productType)
      .replace('{productFeatures}', productFeatures)
      .replace('{packagingForm}', packagingForm)
      .replace('{budgetRange}', budgetRange)
      .replace('{targetAudience}', targetAudience);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'o4-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API 錯誤');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI 回應為空');

    const result = JSON.parse(content);
    return NextResponse.json({ success: true, data: result, mode: 'openai' });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: `AI 生成失敗：${error instanceof Error ? error.message : '未知錯誤'}` },
      { status: 500 }
    );
  }
}

/**
 * GET handler - 健康檢查
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: USE_MOCK ? 'mock' : 'openai',
    timestamp: new Date().toISOString(),
  });
}