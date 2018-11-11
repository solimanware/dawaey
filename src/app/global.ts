const SITE_URL = 'https://dawaey.com'
const VER = localStorage.dataVersion ||'v3'
export const API = {
    drugs: (country) => `${SITE_URL}/api/${VER}/${country || "eg"}/drugs.json`,
    partners: (country) => `${SITE_URL}/api/${VER}/${country || "eg"}/partners.json`,
    sponsors: (country) => `${SITE_URL}/api/${VER}/${country || "eg"}/sponsors.json`,
    updates: `${SITE_URL}/api/current-api-version.json`,
    current: `${VER}`
}

