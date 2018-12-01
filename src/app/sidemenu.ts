import { AboutPage } from './../pages/about/about';
import { ProfilePage } from "../pages/profile/profile";
import { TabsPage } from '../pages/tabs/tabs';
import { PharmaciesPage } from '../pages/pharmacies/pharmacies';
import { PartnersPage } from '../pages/partners/partners';
import { SettingsPage } from '../pages/settings/settings';
import { InvitePage } from '../pages/invite/invite';

export const sideMenuPages = [
    {
        title: "Home",
        component: TabsPage,
        icon: "home"
    },
    {
        title: "Nearby Pharmacies",
        component: PharmaciesPage,
        icon: "medkit"
    },
    {
        title: "Partners",
        component: PartnersPage,
        icon: "cash"
    },
    {
        title: "Settings",
        component: SettingsPage,
        icon: "cog"
    },
    {
        title: "Invite Your Friends",
        component: InvitePage,
        icon: "share"
    },
    {
        title: "About",
        component: AboutPage,
        icon: "information-circle"
    },
    {
        title: "Profile",
        component: ProfilePage,
        icon: "person"
    }
];