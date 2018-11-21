import { TabsPage } from "../pages/tabs/tabs";

import { PharmaciesPage } from "../pages/pharmacies/pharmacies";

import { PartnersPage } from "../pages/partners/partners";

import { SettingsPage } from "../pages/settings/settings";

import { InvitePage } from "../pages/invite/invite";

import { AboutPage } from "../pages/about/about";


//API
const SITE_URL = 'https://dawaey.com'
const VER = localStorage.dataVersion || 'v3'

export const API = {
    drugs: (country) => `${SITE_URL}/api/${VER}/${country || "eg"}/drugs.json`,
    partners: (country) => `${SITE_URL}/api/${VER}/${country || "eg"}/partners.json`,
    sponsors: (country) => `${SITE_URL}/api/${VER}/${country || "eg"}/sponsors.json`,
    pharmacies: (country) => `${SITE_URL}/api/${VER}/${country || "eg"}/pharmacies.json`,
    updates: `${SITE_URL}/api/current-api-version.json`,
    current: `${VER}`,

}

export const matColors = {
    red: {
        "primary": "#B71C1C",
        "secondary": "#E53935",
    },
    pink: {
        "primary": "#880E4F",
        "secondary": "#D81B60",
    },
    purple: {
        "primary": "#4A148C",
        "secondary": "#8E24AA",
    },
    deepPurple: {
        "primary": "#311B92",
        "secondary": "#5E35B1",
    },
    indigo: {
        "primary": "#1A237E",
        "secondary": "#3949AB",
    },
    blue: {
        "primary": "#0D47A1",
        "secondary": "#1E88E5",
    },
    lightBlue: {
        "primary": "#01579B",
        "secondary": "#039BE5",
    },
    cyan: {
        "primary": "#006064",
        "secondary": "#00ACC1",
    },
    teal: {
        "primary": "#004D40",
        "secondary": "#00897B",
    },
    green: {
        "primary": "#1B5E20",
        "secondary": "#43A047",
    },
    lightGreen: {
        "primary": "#33691E",
        "secondary": "#7CB342",
    },
    lime: {
        "primary": "#827717",
        "secondary": "#C0CA33",
    },
    yello: {
        "primary": "#F57F17",
        "secondary": "#FDD835",
    },
    amber: {
        "primary": "#FF6F00",
        "secondary": "#FFB300",
    },
    orange: {
        "primary": "#E65100",
        "secondary": "#FB8C00",
    },
    deepOrange: {
        "primary": "#BF360C",
        "secondary": "#F4511E",
    },
    brown: {
        "primary": "#3E2723",
        "secondary": "#6D4C41",
    },
    gray: {
        "primary": "#212121",
        "secondary": "#757575",
    },
    blueGray: {
        "primary": "#263238",
        "secondary": "#546E7A",
    }
}
