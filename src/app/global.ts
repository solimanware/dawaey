const SITE_URL = 'https://dawaey.com'
const VER = 'v2'
export const API = {
    drugs: (country) => `${SITE_URL}/api/${VER}/${country || "eg"}/drugs.json`,
    partners: (country) => `${SITE_URL}/api/${VER}/${country || "eg"}/partners.json`,
    sponsors: (country) => `${SITE_URL}/api/${VER}/${country || "eg"}/sponsors.json`,
}

