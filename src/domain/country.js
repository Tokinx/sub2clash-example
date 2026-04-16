const COUNTRY_RULES = [
  { name: "香港", codes: ["hk"], keywords: ["香港", "hk", "hong kong", "🇭🇰"] },
  { name: "台湾", codes: ["tw"], keywords: ["台湾", "taiwan", "tw", "🇹🇼"] },
  { name: "新加坡", codes: ["sg"], keywords: ["新加坡", "singapore", "sg", "🇸🇬"] },
  { name: "日本", codes: ["jp"], keywords: ["日本", "tokyo", "japan", "jp", "🇯🇵"] },
  { name: "韩国", codes: ["kr"], keywords: ["韩国", "首尔", "korea", "kr", "🇰🇷"] },
  { name: "美国", codes: ["us"], keywords: ["美国", "united states", "us", "🇺🇸", "los angeles"] },
  { name: "英国", codes: ["uk", "gb"], keywords: ["英国", "伦敦", "uk", "gb", "britain", "🇬🇧"] },
  { name: "德国", codes: ["de"], keywords: ["德国", "germany", "de", "🇩🇪"] },
  { name: "法国", codes: ["fr"], keywords: ["法国", "france", "fr", "🇫🇷"] },
  { name: "荷兰", codes: ["nl"], keywords: ["荷兰", "netherlands", "nl", "🇳🇱"] },
  { name: "加拿大", codes: ["ca"], keywords: ["加拿大", "canada", "ca", "🇨🇦"] },
  { name: "澳大利亚", codes: ["au"], keywords: ["澳大利亚", "australia", "au", "🇦🇺"] },
  { name: "马来西亚", codes: ["my"], keywords: ["马来西亚", "malaysia", "my", "🇲🇾"] },
  { name: "泰国", codes: ["th"], keywords: ["泰国", "thailand", "th", "🇹🇭"] },
  { name: "菲律宾", codes: ["ph"], keywords: ["菲律宾", "philippines", "ph", "🇵🇭"] },
  { name: "越南", codes: ["vn"], keywords: ["越南", "vietnam", "vn", "🇻🇳"] },
  { name: "印尼", codes: ["id"], keywords: ["印尼", "indonesia", "id", "🇮🇩"] },
  { name: "印度", codes: ["in"], keywords: ["印度", "india", "in", "🇮🇳"] },
  { name: "俄罗斯", codes: ["ru"], keywords: ["俄罗斯", "russia", "ru", "🇷🇺"] },
  { name: "其他地区", codes: ["other"], keywords: [] }
];

function includesKeyword(value, keyword) {
  return value.includes(keyword.toLowerCase());
}

export function detectCountryName(proxyName) {
  const value = proxyName.toLowerCase();
  for (const rule of COUNTRY_RULES) {
    if (rule.keywords.some((keyword) => includesKeyword(value, keyword))) {
      return rule.name;
    }
  }
  return "其他地区";
}

export function resolveCountryByCode(code) {
  const normalized = code.toLowerCase();
  const rule = COUNTRY_RULES.find((item) => item.codes.includes(normalized));
  return rule ? rule.name : null;
}
