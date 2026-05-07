export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  url?: string;
  ongoing?: boolean;
}

export interface Project {
  title: string;
  description: string;
  url: string;
  language?: string;
  eyebrow?: string;
  featured?: boolean;
  metadata?: string[];
  status?: string;
  quote?: string;
  terminal?: string;
}

export interface Education {
  institution: string;
  credential: string;
  year: string;
}

export interface ProfileData {
  name: string;
  location: string;
  email: string;
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  skills: Record<string, string[]>;
  social: {
    linkedin: string;
    github: string;
  };
}

export const profileData: ProfileData = {
  name: "Clay Coffman",
  location: "Salt Lake City, Utah",
  email: "contact@clay21.mozmail.com",
  experiences: [
    {
      company: "Steady Grade Studios",
      role: "Founder/Engineer",
      period: "2025 - Present",
      description:
        "Steady Grade Studios builds and operates software products. Our first project, PrePA Navigator, launched in March 2026. More coming soon.",
      url: "https://steadygrade.studio",
    },
    {
      company: "Student",
      role: "",
      period: "Fall 2024 - Present",
      description:
        "Always wanted to go back and learn more about hardware/low-level systems and take more math and physics. Doing a second degree in CS at Oregon State. Current focus is hardware/systems-programming and networking.",
    },
    {
      company: "Due Diligence Consulting",
      role: "",
      period: "2022 - Present",
      description:
        "I have helped venture funds and other investors evaluate potential investments.",
      ongoing: true,
    },
    {
      company: "Angel Investing",
      role: "",
      period: "2022 - Present",
      description: "CarePilot, Harmony.ai, ReNFT, Cabin Labs",
      ongoing: true,
    },
    {
      company: "TradeFoundry",
      role: "Co-founder/CEO",
      period: "October 2022 - July 2024",
      description:
        "TradeFoundry was an AI-powered recruiting platform we built to help connect young Americans with apprenticeships in the skilled trades. The business was acquired in 2024.",
    },
    {
      company: "CryptoSlam",
      role: "Chief Product Officer",
      period: "November 2021 - August 2022",
      description:
        "Multi-chain NFT market data aggregator. Joined as part of a $10m venture round to help build out the product and engineering orgs.",
    },
    {
      company: "Zego (Powered By PayLease)",
      role: "Director of Product Management",
      period: "May 2019 - July 2020",
      description:
        'Rolled over as a Director of Product Management after Zego was acquired by PayLease. Was in charge of running the Resident Experience products post-acquisition. PayLease was rebranded as Zego after our acquisition... hence "Zego (Powered by PayLease)".',
    },
    {
      company: "Zego",
      role: "Co-founder/Head of Product",
      period: "January 2017 - May 2019",
      description:
        "Proptech startup that I co-founded and helped scale. We built an IoT device management platform for multifamily owners/operators, as well as a resident engagement app. Participated in Techstars Kansas City (2017). Acquired by Paylease, a Vista Equity Partners co. in 2019.",
    },
    {
      company: "Brightergy",
      role: "Sales Process Manager/Product Manager",
      period: "January 2016 - January 2017",
      description:
        "Commercial solar installer. Initially worked in sales, transitioned into product role to help launch Brighterlink building management product.",
    },
    {
      company: "Sungevity",
      role: "Solar Consultant",
      period: "July 2015 - January 2016",
      description:
        "I sold solar panels to consumers all over the country. If you owned a roof in Southern California in 2016 I probably called you.",
    },
    {
      company: "PerfectMind Software",
      role: "Business Development",
      period: "January 2015 - July 2015",
      description:
        "I cold-called martial arts and yoga studios to sell them an out-dated CRM software. It was tough.",
    },
  ],
  projects: [
    {
      title: "cctop",
      description:
        "btop-style terminal dashboard for monitoring Claude Code instances across tmux sessions in real time. Hooks capture lifecycle events into SQLite; the TUI polls and renders a live feed.",
      url: "https://github.com/clay-coffman/cctop",
      language: "TypeScript",
      eyebrow: "featured / workflow tool",
      featured: true,
      metadata: ["TypeScript", "Bun", "Python", "SQLite (WAL)", "tmux"],
      status: "in use",
      terminal: `┌─ cctop ─── Active: 3 │ Sessions: 12 │ Rate: 42/min ─────┐
├─ Activity (5m) ─────────────── 847 events  peak: 18/min ┤
│ ▁▂▃▅█▇▃▁▂▄▇█▅▃▂▁▂▃▅▇█▇▅▃▂▁▂▃▄▅▆▇▆▅▃▂▁▂▃▄▅▆▇▆▅▃▂▁▂▃▅▆▇█ │
├─ Sessions ──────────────────────────────────────────────┤
│▸ ● dev:0.1   ~/pa-apply   running: Bash    12m 30s   2s │
│  ● work:1.0  ~/cctop      ran: Write        5m 12s  15s │
│  ○ api:2.1   ~/backend    idle              1h 5m    3m │
├─ Event Feed ────────────────────────────────────────────┤
│ 14:32:05  🔧 abc12345  Bash    npm test                 │
│ 14:32:08  💬 def45678  —       "Refactor the auth..."   │
│ 14:32:12  🛑 ghi90123  —       reason: exit             │
└─────────────────────────────────────────────────────────┘`,
    },
    {
      title: "cc-notify",
      description:
        "Desktop notifications for Claude Code hooks, built for running multiple agents across tmux windows and git worktrees.",
      url: "https://github.com/clay-coffman/cc-notify",
      language: "Shell",
      eyebrow: "workflow tool",
      metadata: ["Shell", "Claude Code hooks", "Linux/KDE", "notify-send", "jq"],
      status: "in use",
    },
    {
      title: "dotfiles",
      description:
        "Portable Fedora/dev-server environment managed with chezmoi, covering shell, editor, terminal, tmux, and remote host config.",
      url: "https://github.com/clay-coffman/dotfiles",
      language: "Lua",
      eyebrow: "dev environment",
      metadata: ["Lua", "chezmoi", "tmux", "neovim", "Fedora"],
      status: "in use",
    },
    {
      title: "personal-site",
      description:
        "Static Astro site for essays, books, photos, and notes. Bookshelf syncs from Hardcover, photos from an Immich album, with assets mirrored to R2.",
      url: "https://github.com/clay-coffman/personal-site",
      language: "TypeScript",
      eyebrow: "site infrastructure",
      metadata: ["Astro", "TypeScript", "Cloudflare Pages", "R2"],
      status: "in use",
    },
  ],
  education: [
    {
      institution: "Oregon State University",
      credential: "B.S. Computer Science",
      year: "2026",
    },
    {
      institution: "University of British Columbia",
      credential: "B.A. Psychology",
      year: "2015",
    },
    {
      institution: "Corporate Finance Institute",
      credential:
        "Financial Modeling and Valuation Analyst (FMVA) Certificate",
      year: "",
    },
    {
      institution: "Pragmatic Marketing Institute",
      credential: "PMC Level IV",
      year: "",
    },
    {
      institution: "Dribbble Education",
      credential: "UI Design 101",
      year: "",
    },
  ],
  skills: {
    Languages: ["Python", "TypeScript", "C/C++", "Lua"],
    Web: ["Astro", "Node", "PostgreSQL", "Cloudflare"],
    Systems: [
      "Linux",
      "Docker",
      "Bun",
      "SQLite",
      "tmux",
      "Neovim",
      "chezmoi",
    ],
    "AI workflows": ["Claude Code", "git worktrees", "hooks"],
  },
  social: {
    linkedin: "https://www.linkedin.com/in/claymcoffman/",
    github: "https://github.com/clay-coffman",
  },
};
