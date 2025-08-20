export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Booking store",
  description: "Paid booking",
  navItems: [
    {
      label: "Baskets",
      link: "/baskets",
    },
    {
      label: "Orders",
      link: "/orders",
    },
  ],
  navMenuItems: [
    {
      label: "Baskets",
      link: "/baskets",
    },
    {
      label: "Orders",
      link: "/orders",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
