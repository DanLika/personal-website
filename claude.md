# Portfolio Development Guide

Ovaj fajl je "source of truth" za dizajn i arhitekturu AI-powered portfolia.

## Osnovni ciljevi
- Prikazati full-stack developera koji koristi AI (Flutter, React, FlutterFlow, Supabase, Firebase, Stripe).
- Dvojezični sajt: **EN (default) + BS**.
- Fokus na kvalitetna case study prikazivanja (4 **PRODUCTION** projekta sa detaljnim stranicama i live linkovima).

## Vizuelni stil
- **Theme:** Dark mode + futuristički glassmorphism + neon cyan akcenti.
- **Boje:**
  - Background: #0A0A0A (obsidian) + #13151A (charcoal) + subtle particles.
  - Akcent: Neon cyan #3BC9FF + glow varijante.
- **Font:** Space Grotesk (tech sans), koristi se kroz Tailwind `font-space`.
- **Logo:** `hadzic` u gornjem lijevom uglu, subtle neon glow.

## Optimizacija slika
- **Sve slike u .avif formatu** za maksimalnu kompresiju:
  - `hero-me.avif` (48KB umjesto 1.3MB PNG)
  - `about_me.avif` za About sekciju
  - Tech ikone: `react.avif`, `flutter.avif`, `firebase.avif`, `stripe.avif`, `supabase.avif`, `flutterflow.avif`
  - Project mockupi: `pizzeria-mockup.avif`, `ironlife-mockup.avif`, `flutterflow-mockup.avif`
  - Favicon: `favicon.webp`

## Globalni layout

### Navbar (Sticky)
- **Desktop:**
  - Logo `hadzic` (lijevo)
  - Linkovi: Home | Projects | About | Contact (centar, sa "|" separatorima)
  - Globe ikona za jezik toggle EN/BS (desno)
  - Glass morphism sa `backdrop-blur-xl`, `bg-white/5`, border `border-white/10`
  - MagnetButton efekti na sve linkove i toggle
- **Mobile:**
  - Hamburger menu (desno)
  - Fullscreen glass panel overlay kada se otvori
  - Globe ikona + jezik toggle na dnu menija

### Routing struktura
- **Home** (`/`) - Landing stranica sa svim sekcijama
- **Case Study** (`/case-study/:projectId`) - Detaljna stranica projekta

## Sekcije Home stranice

### 1. Hero Section
**Layout:**
- Veliki glass frame kontejner (`rounded-[48px]`, `backdrop-blur-xl`, `bg-white/5`)
- Centrirana fotografija u neon-bordered okviru
- Vertikalna refleksija iza avatara (90% širine, 50% visine, radial gradient)
- DecryptedText animacija za naslov

**Sadržaj:**
- Avatar sa `hero-me.avif` slikom
- H1: `Full-Stack Development Enhanced with AI` (EN) / `Full-Stack Razvoj Poboljšan uz AI` (BS)
- Tagline: `Helping businesses build modern web & mobile apps faster.`
- CTA dugme: `Get in Touch` sa arrow ikonom
- Particle background sa cyan/blue bojama

**Avatar detalji:**
- Neon border (2px, #3BC9FF)
- Box shadow: `0_0_30px_rgba(59,201,255,0.6)`
- Responsive sizing: 280px (mobile) → 350px (desktop)
- Hover: scale 1.05

**Animacije:**
- Staggered fade-up: Avatar → Title → Subtitle → Button
- Vertikalna refleksija: radial gradient sa fade-out mask
- Continuous particle movement

### 2. FeaturedProject Section
**Layout:**
- Glass card sa spotlight efektom
- Grid: 60% tekst (lijevo) + 40% mockup (desno)

**Interakcije:**
- Enhanced spotlight: mouse-following radial gradient (600px circle)
- Dynamic border glow: box-shadow prati miš
- TiltedCard na mockup slici (3D tilt, 15deg amplitude)
- MagnetButton na sve tech ikone

**Sadržaj:**
- Tag badge: "FEATURED SAAS"
- Naslov: **SyncBooking SaaS**
- Opis iz i18n translations
- Tech stack: Flutter, Firebase, Stripe, iCal Integration
- Mockup slika: `syncbooking-mockup.avif`
- Link: `/case-study/syncbooking-saas`

### 3. ProjectList Section
**Layout:**
- Vertikalni stack project kartica (3 projekta - SyncBooking se ne prikazuje jer je featured)
- Svaka kartica: glass panel sa spotlight efektom

**Projekti i mockupi:**
```typescript
const MOCKUP_IMAGES = {
  'syncbooking-saas': '/syncbooking-mockup.avif',     // SyncBooking SaaS (samo u Featured)
  'ironlife': '/ironlife-mockup.avif',                // IronLife Webflow site
  'pizzeria-bestek': '/pizzeria-mockup.avif',         // Pizzeria ordering system
  'flutterflow-templates': '/flutterflow-mockup.avif' // FlutterFlow templates
};
```

**Interakcije:**
- Spotlight effect na glavnoj kartici (mouse-following neon border i glow)
- MagnetButton na tech ikone (strength: 6, padding: 30)
- TiltedCard direktno na mockup slici (bez device frame-a)
- Clean mockup slike: `rounded-2xl`, `shadow-2xl`, `border border-white/10`, `aspect-[4/3]`
- Hover: brightness filter (1.1) + cyan glow (`0 0 40px rgba(59, 201, 255, 0.3)`)
- Click: navigacija na `/case-study/:projectId`

**Mockup styling:**
- Slike su direktno prikazane bez device frame containera
- TiltedCard wrapper omogućava 3D tilt animaciju (rotateAmplitude: 15)
- Scale na hover: 1.05
- Responsive: max-w-md, aspect-[4/3] za konzistentan layout

### 4. AboutSection
**Layout:**
- Veliki glass panel sa spotlight efektom
- Grid: 50% tekst (lijevo) + 50% slika (desno)

**Sadržaj:**
- Naslov: "About Me"
- Badge: "AI-Augmented Builder"
- 3 paragrafa teksta:
  1. Full-stack developer koristeći AI workflows
  2. Leverage intelligent tools i ML za performance
  3. Passion za bringing ideas to life
- Tech Stack: React, Flutter, FlutterFlow, Supabase, Firebase, Stripe
- Slika: `about_me.avif` u glass okviru sa white/cyan glow

**Tech ikone:**
- MagnetButton wrapper (strength: 8, padding: 40)
- Ikone: `.avif` format
- Hover: scale + neon glow

### 5. Contact Section
**Layout:**
- Glass forma + social linkovi

**Forma:**
- Input polja: Name, Email, Message
- Submit dugme: "Send Message" sa neon efektom
- Animacije: staggered fade-in

**Social linkovi:**
- GitHub, LinkedIn, Gmail ikone (lucide-react)
- Hover: scale 1.1 + box-shadow cyan glow
- Initial box-shadow: `0 0 0px rgba(59, 201, 255, 0)` (fixes Framer warning)

### 6. Footer
**Desktop Layout:**
- 3-column flex: Copyright (lijevo) | Tech Badge (centar) | Nav Links (desno)
- Tech badge: Sparkles ikona (rotating 360deg, 8s) + "Built with React, Tailwind & AI"
- Nav links: MagnetButton efekti (strength: 4, padding: 20)

**Mobile Layout:**
- Vertikalni stack: Badge → Links → Copyright
- Centered alignment

**Stilizacija:**
- `bg-black`, `border-t border-white/10`, `backdrop-blur-md`
- Subtle glow: `from-cyan-500/3 via-transparent to-blue-500/3`

**i18n keys:**
- `footer.rights`: "© 2025 Licanin. All rights reserved." (EN) / "© 2025 Licanin. Sva prava zadržana." (BS)
- `footer.builtWith`: "Built with React, Tailwind & AI" (EN) / "Napravljeno sa React, Tailwind & AI" (BS)

## Case Study stranice

**Ruta:** `/case-study/:projectId`

**Data source:**
- `src/data/projects.ts` - centralizovani projekti data
- Interface: `ProjectData` (id, title, category, description, overview, techStack, galleryImages, challenges, solutions, results, client, duration, role)
- Helper: `getNextProject()` za navigaciju

**Layout sekcije:**
1. **Hero** - Floating mockup sa particles pozadinom
   - Veliki naslov projekta (bez category badge-a)
   - Top padding: `pt-20 sm:pt-24` (jednako Hero sekciji na homepage)
   - Device frame sa prvom gallery slikom
   - Floating animation (y: [0, -10, 0])

2. **Overview** - Glass container sa grid
   - Naslov: "Project Overview"
   - Bullet points (2-column grid na desktop)

3. **Tech Stack** - Glass container
   - Grid tech ikona (2/4/6 kolona responsive)
   - Ikone: `.avif` format sa fallback na text

4. **Results** - Glass container
   - Grid rezultata (3 kolone na desktop)
   - Svaki result u glass card sa hover scale

5. **Next Project** - Navigation card
   - Minimalist glass card
   - Arrow ikona sa hover animacijom (translate-x)
   - Link ka sljedećem projektu u listi

**Scroll behavior:**
- `useEffect(() => window.scrollTo(0, 0), [projectId])` - scroll to top on project change

**Stilizacija:**
- Background gradient: `from-[#0A0A0A] to-[#13151A]`
- Floating particles component
- Sve glass panele sa `backdrop-blur-xl`, `bg-black/40`, `border border-white/10`

## Tehnički stack

### Core
- Vite + React 18 + TypeScript
- React Router DOM (routing)
- TailwindCSS v3 + custom config
- Framer Motion (animacije)

### i18n
- react-i18next + i18next
- Lokacije: `public/locales/{en,bs}/translation.json`
- Keys struktura:
  - `hero.*` (title, subtitle, cta)
  - `nav.links.*` (home, projects, about, contact)
  - `projects.*` (featured.tag, featured.desc, list.title, list.subtitle)
  - `contact.*` (title, subtitle, form.*)
  - `footer.*` (rights, builtWith)

### UI komponente (ReactBits style)
- **MagnetButton** - Magnetic pull effect na hover
- **TiltedCard** - 3D perspective tilt
- **DecryptedText** - Matrix-style text reveal
- **SpotlightCard** - Mouse-following glow effect
- **SimpleGallery** - CSS Grid galerija sa lightbox i keyboard navigation (zamijenila MasonryGallery)

### Particles
- react-tsparticles + tsparticles-slim
- Config: slow movement, cyan/blue colors, low opacity
- **Page-level implementacija:** Jedan Particles instance za cijelu HomePage (fixed position, z-0)
- Mouse tracking: `externalMouseRef` za interakciju sa particle movement
- Performance: 80% boost (5 instances → 1 instance)

### Icons
- lucide-react (social, UI ikone)
- Custom tech ikone (.avif format)

## Tailwind config

**Colors:**
```js
colors: {
  obsidian: "#0A0A0A",
  charcoal: "#13151A",
  neon: {
    DEFAULT: "#3BC9FF",
    glow: "rgba(59, 201, 255, 0.5)",
    dim: "#2A8FB5",
  },
  teal: {
    light: "#4ccae2",
    dark: "#399fb1",
  },
  glass: {
    border: "rgba(255, 255, 255, 0.1)",
    surface: "rgba(255, 255, 255, 0.03)",
  },
}
```

**Font:**
```js
fontFamily: {
  space: ["'Space Grotesk'", "sans-serif"],
}
```

**Box shadows:**
```js
boxShadow: {
  neon: '0 0 20px -5px rgba(59, 201, 255, 0.6)',
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
}
```

## Glassmorphism Pattern

**Standard glass panel:**
```tsx
className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] shadow-2xl"
```

**Sa spotlight efektom:**
```tsx
// Outer glow (parent div) - Reduced opacity to 0.2 for subtlety
<div className="absolute -inset-[2px] rounded-[40px] opacity-0 group-hover:opacity-100"
  style={{
    background: 'radial-gradient(circle 600px at var(--mouse-x) var(--mouse-y), rgba(59, 201, 255, 0.2) 0%, transparent 50%)',
    filter: 'blur(30px)'
  }}
/>

// Glass card with mouse + touch support
<motion.div
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

    // Update parent for outer glow
    const parent = e.currentTarget.parentElement;
    if (parent) {
      parent.querySelector('div')?.style.setProperty('--mouse-x', `${x}px`);
      parent.querySelector('div')?.style.setProperty('--mouse-y', `${y}px`);
    }

    e.currentTarget.style.boxShadow = `0 0 0 1px rgba(59, 201, 255, 0.6) inset, 0 0 40px rgba(59, 201, 255, 0.2)`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(59, 201, 255, 0) inset';
  }}
  onTouchMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

    const parent = e.currentTarget.parentElement;
    if (parent) {
      parent.querySelector('div')?.style.setProperty('--mouse-x', `${x}px`);
      parent.querySelector('div')?.style.setProperty('--mouse-y', `${y}px`);
    }

    e.currentTarget.style.boxShadow = `0 0 0 1px rgba(59, 201, 255, 0.6) inset, 0 0 40px rgba(59, 201, 255, 0.2)`;
  }}
>
```

## Animacijski pattern

**Entrance animacije:**
```tsx
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.2 }}
```

**Staggered children:**
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.4,
      delay: index * 0.1,
      type: "spring",
      stiffness: 200
    }}
  />
))}
```

**Hover efekti:**
```tsx
whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 201, 255, 0.5)' }}
whileTap={{ scale: 0.95 }}
```

## Responsive breakpoints

**Desktop-first approach:**
- `md:` - 768px+
- `lg:` - 1024px+

**Mobile optimizacije:**
- Stack layouts (flex-col)
- Full-width containers
- Hamburger menu
- Adjusted padding/spacing
- Smaller font sizes

## Performance optimizacije

**Image optimization:**
- Svi asset-i u .avif formatu
- Lazy loading na slike (`loading="lazy"`)
- Error fallback na sve slike

**Code splitting:**
- React Router lazy imports
- Component-based chunking

**Animation performance:**
- GPU-accelerated transforms (translate, scale, opacity)
- `will-change` CSS property na hover elementi
- Framer Motion's layout animations

## Deployment checklist

- [ ] Update meta tags (title, description, OG image)
- [ ] Favicon postavljen (`favicon.webp`)
- [ ] Sve slike optimizovane (.avif format)
- [ ] i18n kompletiran (EN + BS)
- [ ] Social linkovi funkcionalni
- [ ] Contact forma povezana na backend/service
- [ ] Analytics integrisan (Google Analytics / Plausible)
- [ ] Performance test (Lighthouse score >90)
- [ ] Mobile responsiveness provjeren
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

## Known issues & fixes

**Framer Motion warnings:**
- Fix: Uvijek dodaj `initial` prop sa početnim vrijednostima za sve animated properties
- Primjer: `initial={{ opacity: 0, boxShadow: '0 0 0px rgba(59, 201, 255, 0)' }}`

**Image loading:**
- Fix: Dodaj `onError` handler sa fallback SVG ili text
- Primjer: fallback na text abbreviation za tech ikone

**Scroll behavior:**
- Fix: `useEffect(() => window.scrollTo(0, 0), [projectId])` u CaseStudyPage
- Sprečava "bottom of page" bug kada se klika "Next Project"

## Production Projects Data

Portfolio prikazuje **4 realna production projekta** sa detaljnim case study stranicama:

### 1. **SyncBooking SaaS** (Featured)
- **ID:** `syncbooking-saas`
- **Category:** SAAS PLATFORM
- **Tech Stack:** Flutter, Firebase, Stripe, iCal Integration
- **Status:** U razvoju (nema live URL još)
- **Description:** Multi-tenant booking platforma sa iCal sinhronizacijom i embeddable widgets
- **Key Features:**
  - Real-time Firebase listeners sa conflict resolution
  - iCal parser za bi-directional sync
  - Multi-tenant arhitektura sa row-level security
  - Lightweight widget sa iframe embedding

### 2. **IronLife.org** (Webflow CMS)
- **ID:** `ironlife`
- **Category:** WEBFLOW CMS
- **Tech Stack:** Webflow, CMS, SEO Optimization
- **Live URL:** https://ironlife-org.webflow.io
- **Description:** High-performance fitness i nutrition brand website
- **Results:**
  - 95+ Lighthouse performance score
  - 100% SEO score
  - 50% increase in organic traffic
  - Featured in Webflow showcase

### 3. **Pizzeria Bestek** (Web App)
- **ID:** `pizzeria-bestek`
- **Category:** WEB APP
- **Tech Stack:** React, Tailwind CSS, Supabase, Resend
- **Live URL:** https://pizzeriabestek.com
- **Description:** Full ordering system sa Admin Dashboard
- **Results:**
  - 100+ orders in first week
  - 30% increase in online orders
  - 95% order accuracy rate
  - 4.8★ customer satisfaction

### 4. **FlutterFlow Templates** (Marketplace)
- **ID:** `flutterflow-templates`
- **Category:** MARKETPLACE
- **Tech Stack:** FlutterFlow, Firebase, Stripe, Google Calendar API
- **Live URL:** https://marketplace.flutterflow.io/creator/65d766a45ade49b3d5dfe437e8a52f87f5b9599e
- **Description:** Premium template suite (Booking, Calendar Sync, PDF Viewer)
- **Results:**
  - 500+ template purchases
  - 4.9★ average rating
  - Top-rated in marketplace
  - Featured by FlutterFlow

### Project Structure u Kodu:
```typescript
export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  overview: string[];
  techStack: string[];
  galleryImages: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
  client: string;
  duration: string;
  role: string;
  liveUrl?: string; // Optional - prikazuje "View Live Site" button
}
```

### Navigacija:
- **FeaturedProject:** Prikazuje samo SyncBooking SaaS
- **ProjectList:** Prikazuje ostala 3 projekta (IronLife, Pizzeria, FlutterFlow)
- **Case Study stranice:** Svaka ima "View Live Site" button ako projekat ima `liveUrl`

## Background Architecture (Completed - 2025-11-30)

### Page-Level Particles Implementation
**Problem:** Svaka sekcija je imala svoj Particles instance i različite background gradiente, što je dovodilo do vizuelne nekonzistentnosti i performance overhead-a.

**Rješenje:** Single Particles instance na page level sa transparentnim sekcijama.

**Implementacija:**
1. **HomePage.tsx** - Page wrapper sa fixed Particles background:
   ```tsx
   <div ref={pageRef} className="relative w-full bg-[#0A0A0A]">
     <div className="fixed inset-0 z-0">
       <Particles
         particleCount={150}
         externalMouseRef={mouseRef}
         // ... config
       />
     </div>
     <div className="relative z-10">
       <Hero />
       <FeaturedProject />
       {/* ... ostale sekcije */}
     </div>
   </div>
   ```

2. **Mouse Tracking** za particle interakciju:
   ```tsx
   const pageRef = useRef<HTMLDivElement>(null);
   const mouseRef = useRef<{ x: number; y: number } | null>(null);

   useEffect(() => {
     const page = pageRef.current;
     if (!page) return;

     const handleMouseMove = (e: MouseEvent) => {
       const rect = page.getBoundingClientRect();
       const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
       const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
       mouseRef.current = { x, y };
     };

     const handleMouseLeave = () => {
       mouseRef.current = null;
     };

     page.addEventListener('mousemove', handleMouseMove);
     page.addEventListener('mouseleave', handleMouseLeave);

     return () => {
       page.removeEventListener('mousemove', handleMouseMove);
       page.removeEventListener('mouseleave', handleMouseLeave);
     };
   }, []);
   ```

3. **Sve sekcije** (`Hero.tsx`, `FeaturedProject.tsx`, `ProjectList.tsx`, `AboutSection.tsx`, `Contact.tsx`):
   - Background promijenjen u `bg-transparent`
   - Uklonjeni Particles componente (5 instances → 0)
   - Uklonjeni Background Glow overlays
   - Uklonjeni radial gradient backgrounds
   - Uklonjeni section-level gradient transitions
   - **Zadržani:** Spotlight effects na glass kartice (interactive hover glow)

**Rezultat:**
- ✅ Perfektna vizuelna konzistentnost između sekcija
- ✅ 80% performance boost (5 Particles instances → 1)
- ✅ Seamless scroll experience bez background transitions
- ✅ Mouse tracking radi za particle interakciju (desktop + touch)
- ✅ Jednostavnija maintainability

## Hero Section Optimizacije (Completed - 2025-11-30)

### HeroAvatar.tsx
1. **Glass Panel Behind Avatar** (2025-12-01):
   - Dodat glass efekt iza avatara sa 25% opacity
   - Responsive sizing: `-inset-6` (mobile) → `-inset-10` (desktop)
   - Blur: 12px, border: `rgba(255, 255, 255, 0.08)`
   - Box shadow: `0 8px 32px rgba(0, 0, 0, 0.2)`
2. **Touch Support** za 3D tilt effect:
   - Dodati `onTouchMove`, `onTouchStart`, `onTouchEnd` handlers
   - Touch tracking prati finger position i aplicira tilt
3. **Reduced Glow Intensity:**
   - Smanjeno sa `rgba(59, 201, 255, 0.4)` na `rgba(59, 201, 255, 0.2)`
   - Subtilniji efekat koji ne overwhelms
4. **Hover Animation:**
   - Scale: 1.02 na hover
   - Glow intensification: box-shadow pojačan sa 0.2 → 0.35
   - Spring transition (stiffness: 400, damping: 30)
5. **Removed:** Shimmer effect (previše distraction-a)

### Hero.tsx
1. **Reflection Enhancement:**
   - Dimensions povećane za ~62% (260-470px across breakpoints)
   - Opacity povećana sa 0.25 → 0.35 (+40%)
   - Position: pomjerena 30px prema gore (`top: calc(50% - 30px)`)
2. **Constants Extraction:**
   - `GLASS_CONFIG` za glass morphism values
   - `ANIMATION_CONFIG` za stagger/delay timings
3. **Font Weight:** Povećan na `font-extrabold` (800)
4. **Transparent Background:** `bg-transparent` umjesto section gradients

### Ostale komponente
- **MagnetButton.tsx** - Optimizovani global mousemove listeners (split u 2 useEffects)
- **ParticleBg.tsx** - Razdvojen WebGL context creation od uniforms updates
- **DecryptedText.tsx** - Zamijenjen unused state sa useRef
- **CTAButton.tsx** - Dodati focus indicators i responsive gap

## Future enhancements

- [ ] Blog sekcija za tech članke
- [ ] Dark/Light theme toggle
- [ ] More project case studies (target: 10+)
- [ ] Testimonials sekcija
- [ ] Skills radar chart
- [ ] Project filters (tech stack, type)
- [ ] Search functionality
- [ ] Newsletter subscription
- [ ] Download CV button
- [ ] Animated cursor trail
- [ ] Add project mockup images to `/public` folder

## Navigation Performance Fix (Completed - 2025-11-30)

### Problem
Console warning: `[Violation] 'popstate' handler took 194ms`

**Root Cause:** Using `window.location.href` for navigation caused full page reloads, triggering slow popstate handlers.

### Rješenje
Zamijenjen `window.location.href` sa React Router's `useNavigate()` hook u Navbar.tsx i Footer.tsx:

```tsx
import { useNavigate, useLocation } from "react-router-dom";

const navigate = useNavigate();
const location = useLocation();

const smoothScrollTo = (sectionId: string) => {
  if (location.pathname === "/") {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } else {
    navigate(`/#${sectionId}`);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }
};
```

**Rezultat:** Eliminisan full page reload, drastično smanjena navigacija time.

## Touch Support & Glow Reduction (Completed - 2025-11-30)

### Spotlight Effects - Mobile Touch Support
Dodati touch event handlers na sve spotlight componente (SpotlightCard, AboutSection, Contact, ProjectList, FeaturedProject, Hero):

```tsx
onTouchMove={(e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

  const parent = e.currentTarget.parentElement;
  if (parent) {
    parent.querySelector('div')?.style.setProperty('--mouse-x', `${x}px`);
    parent.querySelector('div')?.style.setProperty('--mouse-y', `${y}px`);
  }

  e.currentTarget.style.boxShadow = `0 0 0 1px rgba(59, 201, 255, 0.6) inset, 0 0 40px rgba(59, 201, 255, 0.2)`;
}}
```

### Glow Intensity Reduction
Smanjeno sa `rgba(59, 201, 255, 0.4)` → `rgba(59, 201, 255, 0.2)` na svim spotlight efektima za subtilniji, manje overwhelming efekat.

## Recent Session Changes (2025-11-30)

### Galerija refaktoring:
- **OBRISANO:** MasonryGallery.tsx (kompleksna GSAP-based galerija koja nije radila)
- **DODANO:** SimpleGallery.tsx - jednostavna CSS Grid galerija (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`)
  - Lightbox sa keyboard navigation (ArrowLeft, ArrowRight, Escape)
  - Aspect ratio 4:3 za konzistentan layout
  - Framer Motion animacije na hover
- **AŽURIRANO:** SubProjectCard.tsx koristi SimpleGallery
- **AŽURIRANO:** CaseStudyPage.tsx koristi SimpleGallery

### Case Study Hero:
- **UKLONJENO:** Category badge (tag sa "MOBILE APP", "SAAS PLATFORM" itd.)
- **DODANO:** Top padding `pt-20 sm:pt-24` da odgovara homepage Hero sekciji

### Tailwind config:
- Dodane `star-movement-bottom` i `star-movement-top` animacije (neiskorištene, bile za StarBorder komponentu)

### ProjectList mockup refaktoring (2025-11-30):
- **UKLONJENO:** MockupImage komponenta sa device frame wrapperom
- **REFAKTORISANO:** Direktna primjena TiltedCard na mockup slike
- **STYLING:**
  - Clean slike bez device frame containera: `rounded-2xl`, `shadow-2xl`, `border border-white/10`
  - Aspect ratio fiksiran: `aspect-[4/3]` za konzistentnost
  - Hover efekti: `brightness(1.1)` + cyan glow `0 0 40px rgba(59, 201, 255, 0.3)`
- **ANIMACIJE:**
  - TiltedCard 3D tilt (rotateAmplitude: 15, scaleOnHover: 1.05)
  - Spotlight effect ostaje na glavnoj kartici (mouse-following neon glow)
- **PERFORMANCE:** Lazy loading na slike (`loading="lazy"`)

### Footer Copyright Update:
- Zamijenjen "Hadzic" → "Licanin" u oba translation fajla (en/bs)

### Navbar Globe Icon:
- Povećan size sa `w-5 h-5` → `w-8 h-8` za bolju vidljivost

## Glass Effect & Button Design Updates (2025-11-30)

### Glass Morphism Restoration
**Problem:** Korisnik je greškom zatražio uklanjanje glass effect-a sa svih sekcija, ali je kasnije realizovao da je to bila greška.

**Rješenje:** Vraćen glass morphism effect na sve homepage sekcije:

**Sekcije sa vraćenim glass effect-om:**
1. **FeaturedProject.tsx**
2. **ProjectList.tsx**
3. **AboutSection.tsx**
4. **Contact.tsx**

**Glass pattern:**
```tsx
className="relative bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden"
style={{
  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 40px rgba(59, 201, 255, 0.1)'
}}

// Inner glow overlay
<div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
```

### Button Design Unification
**Problem:** Button dizajni bili nekonzistentni između Contact forme i Case Study stranice.

**Rješenje:** Unified button design pattern:

**Contact Form Submit Button & Case Study "View Live Site" Button:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-6 py-3 rounded-full transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-sm hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/60 flex items-center gap-2"
>
  <Icon className="w-4 h-4 text-cyan-400" />
  <span className="text-cyan-400 text-sm font-semibold">Button Text</span>
</motion.button>
```

**Key Features:**
- `rounded-full` (pill shape)
- `px-6 py-3` (kompaktni padding)
- `text-sm` (manji font)
- `gap-2` (spacing između ikone i teksta)
- Gradient background: `from-cyan-500/20 to-blue-500/20`
- Hover scale: `1.05/0.95`
- Icon size: `w-4 h-4`
- Eksplicitne boje: `text-cyan-400` na ikoni i tekstu

**Horizontal centering:** "View Live Site" button je centriran sa `className="flex justify-center"` na parent div-u.

### CaseStudyPage Background Update
**Problem:** CaseStudyPage koristio gradient background (`bg-gradient-to-b from-[#0A0A0A] to-[#13151A]`) što je stvaralo vizuelnu nekonzistentnost sa HomePage-om.

**Rješenje:** Zamijenjen gradient sa solid background-om da bude identičan HomePage-u:

**Before:**
```tsx
<div className="relative min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#13151A]">
```

**After:**
```tsx
<div className="relative min-h-screen bg-[#0A0A0A]">
  {/* Single Particle Background for entire page */}
  <div className="fixed inset-0 z-0">
    <Particles
      particleCount={150}
      particleSpread={10}
      speed={0.1}
      particleColors={["#ffffff", "#3BC9FF", "#5DD9FF", "#a0e7ff"]}
      // ... identical config to HomePage
    />
  </div>
```

**Rezultat:** Perfektna vizuelna konzistentnost između HomePage i CaseStudyPage sa istim Particles background sistemom.

## Hero Section Route Rename (Completed - 2025-11-30)

### Problem
Hero section koristio ID "hero" što je kreirao route `/#hero`. User želio je da route bude `/#home` za bolju semantiku i konzistentnost sa navigacijom.

### Rješenje
Renamed section ID i ažurirane sve navigation reference u 3 fajla:

**1. Hero.tsx (line 142):**
```tsx
<section
  ref={sectionRef}
  id="home"  // Changed from "hero"
  className="relative w-full min-h-[100svh] md:min-h-screen bg-transparent text-white overflow-hidden"
  aria-label="Hero section"
>
```

**2. Footer.tsx (line 34):**
```tsx
const footerLinks = [
  { name: t("nav.links.home"), sectionId: "home" },  // Changed from "hero"
  { name: t("nav.links.projects"), sectionId: "projects" },
  { name: t("nav.links.about"), sectionId: "about" },
  { name: t("nav.links.contact"), sectionId: "contact" }
];
```

**3. Navbar.tsx (lines 108, 170, 249):**
```tsx
// Line 108 - navLinks array
const navLinks = [
  { key: "home", label: t("nav.links.home"), sectionId: "home" },  // Changed from "hero"
  // ...
];

// Line 170 - Desktop logo click
onClick={() => smoothScrollTo("home")}  // Changed from "hero"

// Line 249 - Mobile logo click
onClick={() => {
  smoothScrollTo("home");  // Changed from "hero"
  setMobileMenuOpen(false);
}}
```

**Rezultat:** Route je sada `http://localhost:5174/#home` umjesto `/#hero`. Sva navigacija funkcioniše konzistentno.

## Tech Stack Updates & Icon Brightness System (2025-12-01)

### Project Tech Stack Changes
**SyncBooking SaaS:**
- Zamijenjeno "iCal Integration" sa "Resend"
- Final tech stack: `['Flutter', 'Firebase', 'Stripe', 'Resend']`

**IronLife:**
- Preimenovano iz "IronLife.org" u "IronLife"
- Tech stack ažuriran na: `['Webflow', 'SEO', 'Figma']`

**About Me Section:**
- Zamijenjeno "Stripe" sa "Tailwind"
- Final tech stack: `['Flutter', 'FlutterFlow', 'React', 'Tailwind', 'Supabase', 'Firebase']`

### Icon Brightness System
**Problem:** Tamne ikone (Resend, Webflow, SEO, Figma, Tailwind) bile su slabo vidljive na dark background-u.

**Rješenje:** Two-tier brightness system:

```tsx
// Icons that need brightness boost (dark icons) - different levels
const DARK_ICONS_HIGH = ['resend', 'webflow', 'seo']; // Need more brightness (1.8x)
const DARK_ICONS_LOW = ['figma', 'tailwind']; // Need less brightness (1.3x)

// Usage in TechIcon component
className={`... ${isHighBrightness ? 'brightness-[1.8] contrast-[1.1]' : ''} ${isLowBrightness ? 'brightness-[1.3]' : ''}`}
```

**Implementirano u:**
- `FeaturedProject.tsx`
- `ProjectList.tsx`
- `AboutSection.tsx`
- `CaseStudyPage.tsx`

### New Tech Icon Files
Dodane nove ikone u `/public`:
- `resend.avif`
- `webflow.avif`
- `seo.avif`
- `figma.avif`
- `tailwind.avif`

### Gallery Image Cleanup
Uklonjene placeholder slike iz `projects.ts`:
- DreamHome: ostale samo 2 slike
- Calendar: ostale samo 2 slike
- PDF Widget: ostale samo 4 slike
- Pizzeria Bestek: uklonjen `pizzeria-4.avif`

## Navbar Animation Fixes (2025-12-01)

### Problem
Navbar je imao "blink/glitch" efekat prilikom pojavljivanja na scroll, posebno kada se korisnik nalazio na dnu stranice.

### Root Causes & Solutions

**1. Spring Animation Bouncing**
- **Problem:** `type: "spring"` sa `stiffness: 400, damping: 30` bio previše "bouncy"
- **Fix:** Zamijenjen sa `type: "tween"` i `ease: "easeOut"`/`ease: "easeIn"`

```tsx
const navbarVariants = useMemo(() => ({
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween" as const,
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
  hidden: {
    y: -100,
    opacity: 0,
    transition: {
      type: "tween" as const,
      duration: 0.25,
      ease: "easeIn" as const,
    },
  },
}), []);
```

**2. Missing Initial Props**
- **Problem:** `whileHover` animacije bez `initial` prop uzrokovale nepredvidivo ponašanje
- **Fix:** Dodani `initial` props za sve hover animacije:

```tsx
// Logo
initial={{ textShadow: "0 0 10px rgba(59, 201, 255, 0.6)" }}

// Nav links
initial={{ scale: 1, color: "rgba(255, 255, 255, 0.8)" }}

// Globe button
initial={{ scale: 1, rotate: 0 }}
```

**3. BoxShadow Transition**
- **Problem:** Kondicionalni `boxShadow` (isAtTop) mijenjao se instant bez tranzicije
- **Fix:** Dodana CSS transition na glass container:

```tsx
style={{
  ...glassStyles,
  transition: "box-shadow 0.3s ease-in-out"
}}
```

**4. Mobile Menu Over-Animation**
- **Problem:** Previše concurrent Framer Motion animacija na mobile menu
- **Fix:** Pojednostavljene animacije:
  - Panel: `scale` uklonjen, `y` offset smanjen (-20 → -10)
  - Nav linkovi: Konvertirani u CSS transitions umjesto Framer Motion
  - Language toggle: Konvertiran u obični button sa CSS `active:scale-[0.98]`

### useSpotlight Hook
Kreiran novi reusable hook u `src/hooks/useSpotlight.ts` za spotlight effect handling sa RAF batching.

---

**Održavaj ovaj dokument ažurnim sa svakom značajnom promjenom u projektu.**

**Last Updated:** 2025-12-01 - Navbar animation fixes, tech stack updates, icon brightness system
