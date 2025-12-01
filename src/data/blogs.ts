export interface BlogPost {
  id: string;
  slug: string;
  title: {
    en: string;
    bs: string;
  };
  excerpt: {
    en: string;
    bs: string;
  };
  content: {
    en: string;
    bs: string;
  };
  date: string; // ISO format: "2025-12-01"
  readTime: {
    en: string;
    bs: string;
  };
  coverImage: string;
  category: {
    en: string;
    bs: string;
  };
}

export const blogsData: BlogPost[] = [
  {
    id: "1",
    slug: "custom-vs-wordpress",
    title: {
      en: "Why Custom React, Not WordPress?",
      bs: "Zašto Custom React, a ne WordPress?"
    },
    excerpt: {
      en: "Discover why modern businesses choose custom React solutions over WordPress for better performance, security, and scalability.",
      bs: "Otkrijte zašto moderni biznisi biraju custom React rješenja umjesto WordPressa za bolje performanse, sigurnost i skalabilnost."
    },
    content: {
      en: `
## The WordPress Problem

WordPress powers 40% of the web, but that comes with baggage. Plugin bloat, security vulnerabilities, and slow load times hurt your business.

## Why React Wins

Custom React applications offer **blazing-fast performance**, complete **design freedom**, and **enterprise-grade security**. No plugins, no bloat, just clean code.

## The Bottom Line

For businesses serious about growth, custom development isn't an expense—it's an investment. Better UX means higher conversions.
      `,
      bs: `
## Problem sa WordPressom

WordPress pokreće 40% weba, ali to dolazi sa problemima. Pretrpanost pluginima, sigurnosne ranjivosti i sporo učitavanje štete vašem biznisu.

## Zašto React Pobjeđuje

Custom React aplikacije nude **munjevite performanse**, potpunu **slobodu dizajna** i **sigurnost na enterprise nivou**. Bez plugina, bez nepotrebnog koda.

## Zaključak

Za biznise ozbiljne po pitanju rasta, custom razvoj nije trošak—to je investicija. Bolje korisničko iskustvo znači veće konverzije.
      `
    },
    date: "2025-11-28",
    readTime: {
      en: "3 min read",
      bs: "3 min čitanja"
    },
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    category: {
      en: "Web Development",
      bs: "Web Razvoj"
    }
  },
  {
    id: "2",
    slug: "saas-mvp-guide",
    title: {
      en: "How to Launch a SaaS MVP in 4 Weeks with AI?",
      bs: "Kako lansirati SaaS MVP za 4 sedmice uz AI?"
    },
    excerpt: {
      en: "Learn the exact process I use to build and launch production-ready SaaS products in just four weeks using AI-powered workflows.",
      bs: "Naučite tačan proces koji koristim za izradu i lansiranje production-ready SaaS proizvoda za samo četiri sedmice koristeći AI."
    },
    content: {
      en: `
## The 4-Week Framework

Building a SaaS used to take months. With AI-assisted development, I compress that into **four focused weeks**. Here's how.

## Week 1-2: Core Features

Focus on the **20% of features** that deliver 80% of value. AI handles boilerplate while you focus on business logic.

## Week 3-4: Polish & Launch

Payment integration, onboarding flows, and deployment. Ship fast, iterate based on real user feedback.
      `,
      bs: `
## Okvir od 4 Sedmice

Izrada SaaS-a je nekad trajala mjesecima. Sa AI-potpomognutim razvojem, to komprimujem u **četiri fokusirane sedmice**. Evo kako.

## Sedmica 1-2: Ključne Funkcionalnosti

Fokus na **20% funkcionalnosti** koje isporučuju 80% vrijednosti. AI obrađuje šablonski kod dok vi fokusirate na poslovnu logiku.

## Sedmica 3-4: Poliranje i Lansiranje

Integracija plaćanja, onboarding tokovi i deployment. Lansirajte brzo, iterišite na osnovu pravih povratnih informacija.
      `
    },
    date: "2025-11-20",
    readTime: {
      en: "4 min read",
      bs: "4 min čitanja"
    },
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    category: {
      en: "SaaS & Startups",
      bs: "SaaS i Startupi"
    }
  },
  {
    id: "3",
    slug: "mobile-app-cost-2026",
    title: {
      en: "Mobile App Development Cost in 2026",
      bs: "Cijena izrade mobilne aplikacije u 2026."
    },
    excerpt: {
      en: "A transparent breakdown of mobile app development costs in 2026, from simple MVPs to complex enterprise solutions.",
      bs: "Transparentan pregled cijena izrade mobilnih aplikacija u 2026., od jednostavnih MVP-ova do složenih enterprise rješenja."
    },
    content: {
      en: `
## The Real Numbers

Mobile app costs vary wildly—from $5K to $500K+. Here's what actually drives the price and how to budget smart.

## Cost Factors

**Complexity** is the biggest driver. Simple apps (MVP): $5-15K. Medium complexity: $15-50K. Enterprise solutions: $50K+.

## How to Save Money

Cross-platform frameworks like **Flutter** cut costs by 40%. AI tools accelerate development. Smart planning prevents scope creep.
      `,
      bs: `
## Pravi Brojevi

Cijene mobilnih aplikacija variraju—od $5K do $500K+. Evo šta zapravo utiče na cijenu i kako pametno budžetirati.

## Faktori Cijene

**Složenost** je najveći faktor. Jednostavne aplikacije (MVP): $5-15K. Srednja složenost: $15-50K. Enterprise rješenja: $50K+.

## Kako Uštedjeti

Cross-platform frameworki poput **Fluttera** smanjuju troškove za 40%. AI alati ubrzavaju razvoj. Pametno planiranje sprječava širenje opsega.
      `
    },
    date: "2025-11-15",
    readTime: {
      en: "5 min read",
      bs: "5 min čitanja"
    },
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
    category: {
      en: "Mobile Apps",
      bs: "Mobilne Aplikacije"
    }
  }
];

/**
 * Get all blog posts sorted by date (newest first)
 */
export const getAllBlogs = (): BlogPost[] => {
  return [...blogsData].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

/**
 * Get latest N blog posts
 */
export const getLatestBlogs = (count: number = 3): BlogPost[] => {
  return getAllBlogs().slice(0, count);
};

/**
 * Get a single blog post by slug
 */
export const getBlogBySlug = (slug: string): BlogPost | undefined => {
  return blogsData.find(post => post.slug === slug);
};

/**
 * Get next blog post for navigation
 */
export const getNextBlog = (currentSlug: string): BlogPost | null => {
  const blogs = getAllBlogs();
  const currentIndex = blogs.findIndex(post => post.slug === currentSlug);
  if (currentIndex === -1 || currentIndex === blogs.length - 1) {
    return blogs[0]; // Loop back to first post
  }
  return blogs[currentIndex + 1];
};

/**
 * Get previous blog post for navigation
 */
export const getPreviousBlog = (currentSlug: string): BlogPost | null => {
  const blogs = getAllBlogs();
  const currentIndex = blogs.findIndex(post => post.slug === currentSlug);
  if (currentIndex === -1 || currentIndex === 0) {
    return blogs[blogs.length - 1]; // Loop back to last post
  }
  return blogs[currentIndex - 1];
};
