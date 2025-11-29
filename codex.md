# Portfolio Codex

Ovaj fajl je "source of truth" za dizajn i arhitekturu tvog 2026 AI-powered portfolia.

## Osnovni ciljevi
- Prikazati te kao full-stack developera koji koristi AI (Flutter, React, FlutterFlow, Supabase, Firebase, Stripe).
- Dvojezični sajt: **EN (default) + BS**.
- Fokus na kvalitetna case study prikazivanja (RabBooking + 4 dodatna projekta).

## Vizuelni stil
- **Theme:** Dark mode + futuristički glassmorphism + dark elegant.
- **Boje:**
  - Background: #0A0A0A gradient + subtle particles.
  - Akcent: Neon plava #3BC9FF + glow varijante.
- **Font:** Space Grotesk (tech sans), koristi se kroz Tailwind `font-space`.
- **Logo:** `hadzic` smallcaps u gornjem lijevom uglu, subtle neon glow.

## Globalni layout
- Jedna landing stranica (Home) + pojedinačne **/project/:id** case study stranice.
- Sticky navbar sa:
  - Logo `hadzic` (lijevo).
  - Linkovi: Home, Projects, About Me, Contact (centar).
  - Language toggle EN / BS (desno).

## Hero sekcija
- Centrirana fotografija u rounded-square glass okviru (tvoja stvarna slika sa neon rim lightom).
- Ispod fotke:
  - H1: **Full-Stack Development** / **Enhanced with AI**.
  - Tagline (1 rečenica, marketinška) – value za klijenta.
  - Jedan CTA: **Get in Touch**.
- Pozadina: veliki glass frame unutar kojeg živi cijeli hero (kao u referentnoj slici).

## Home sekcije
1. **Hero** (kao gore).
2. **Projects – "What I’ve Built"**
   - ~5 projekata.
   - Svaki projekt: TAG (Mobile App / Web App / SaaS / Template) + naziv + kratak opis + tech ikone + mockup.
   - RabBooking kao featured kartica.
3. **About Me**
   - Kratki friendly ali samouvjeren tekst (EN/BS).
   - AI badge (npr. "AI-Assisted Development").
   - Tech Stack ikone (Flutter, FlutterFlow, React, Supabase, Firebase, Stripe, AI tools).
   - Manja fotka u glass-card okviru.
4. **Contact**
   - Forma (ime, email, poruka).
   - Email + social ikone.
5. **Footer**
   - Glass footer bar.
   - Tekst: `© 2025 Hadzic`.

## Case Study stranice
- Ruta: `/project/:id`.
- Layout (scroll-based):
  1. Veliki hero mockup projekta (glass card) + naziv + kratki opis.
  2. "Project Overview" blok (opis / kontekst).
  3. Galerija (3–6 mockupa / screenshotova).
  4. Tech Stack blok (neon ikone u glass panelu).
  5. "Project Results" blok – 3–4 bullet tačke.
- Bez "My Role" boxa, bez dodatnih info kartica.
- Sticky navbar ostaje isti kao na Home.

## Animacije
- **On load:** staggered fade-up + blur-in (avatar → naslov → tekst → CTA).
- **On scroll:** blagi fade/slide-up efekti za sekcije.
- **Micro:** floating particles (tsparticles), neon glow hover na dugmad, lagani parallax na glass panelima.
- Animacije moraju ostati suptilne – nikad previše "gaming".

## i18n
- Koristimo `react-i18next` + `i18next-http-backend`.
- Fajlovi:
  - `public/locales/en/translation.json`
  - `public/locales/bs/translation.json`
- Ključevi:
  - `hero.title`, `hero.subtitle`, `hero.cta`, `hero.scrollLabel`.
  - `nav.links.home`, `nav.links.projects`, `nav.links.about`, `nav.links.contact`.
  - Kasnije: `projects.*`, `about.*`, `contact.*`.

## Tehnički stack
- Vite + React + TypeScript.
- TailwindCSS (v3) + custom tema u `tailwind.config.js` (obsidian, charcoal, neon, teal, glass, font-space).
- Framer Motion za animacije.
- react-tsparticles + tsparticles za particles background.
- react-router-dom (Home + /project/:id).

Ovaj codex služi da se dizajn i UX odluke ne izgube tokom razvoja. Svaka nova komponenta/seksija treba biti provjerena u odnosu na ove principe prije nego se implementira.

## Design System (Tailwind + UI)

### Boje i font (tailwind.config.js)
- U `tailwind.config.js` **obavezno** koristimo:
  - `obsidian: "#0A0A0A"` – glavni dark background.
  - `charcoal: "#13151A"` – sekundarni dark (card background).
  - `neon` objekt:
    - `DEFAULT: "#3BC9FF"` – primarni akcent.
    - `glow: "rgba(59, 201, 255, 0.5)"` – za sjaj/shadows.
    - `dim: "#2A8FB5"` – hover stanja.
  - `teal` objekt:
    - `light: "#4ccae2"` – highlight za ikone.
    - `dark: "#399fb1"` – shadow za ikone.
  - `glass` objekt:
    - `border: "rgba(255, 255, 255, 0.1)"` – tanki bijeli rub.
    - `surface: "rgba(255, 255, 255, 0.03)"` – površina stakla.
- `fontFamily.space = ["'Space Grotesk'", "sans-serif"]` kao globalni font.
- `boxShadow`:
  - `neon: '0 0 20px -5px rgba(59, 201, 255, 0.6)'` – signature glow.
  - `glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'` – dubina stakla.
- `backgroundImage['gradient-dark']` – linearni gradient od obsidian do charcoal.

### Globalni glass stil (src/index.css)
- Na vrhu:
  - `@tailwind base;`
  - `@tailwind components;`
  - `@tailwind utilities;`
- `@layer base { body { ... } }`:
  - `@apply bg-obsidian text-white font-space antialiased overflow-x-hidden;`
  - Background:
    - `radial-gradient(circle at 50% 0%, rgba(59, 201, 255, 0.08) 0%, transparent 50%),`
    - `linear-gradient(to bottom, #0A0A0A, #0A0A0A);`
- Custom scrollbar (`::-webkit-scrollbar*`) u dark + neon plavoj.
- `@layer utilities { @keyframes shine ...; .animate-shine { animation: shine 1s ease-in-out forwards; } }` – koristi se za diagonalni glass sheen preko avatara/slika.

### Atomic UI komponente

#### GlassCard / GlassFrame
- Osnovni stakleni kontejner za:
  - hero avatar okvir,
  - About kartice,
  - projects preview,
  - case-study blokove.
- Tailwind klasice (osnova):
  - `relative overflow-hidden bg-glass-surface backdrop-blur-xl border border-glass-border rounded-[24px] shadow-glass` + custom `className`.
- Hover varijanta:
  - blagi `scale: 1.02` i `borderColor: rgba(59, 201, 255, 0.4)` preko Framer Motion `whileHover`.
- Opcionalni gradient sheen:
  - `absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none` sloj iznad sadržaja.

#### NeonButton
- Koristi se za CTA "Get in Touch", "View Project", itd.
- Bazne klase:
  - `px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2`.
- Varijante:
  - **primary**: `bg-neon text-obsidian shadow-neon hover:shadow-[0_0_30px_rgba(59,201,255,0.8)] hover:scale-105`.
  - **secondary**: `bg-transparent border border-neon text-neon hover:bg-neon/10`.
- Framer Motion:
  - `whileTap={{ scale: 0.95 }}` za click feedback.

#### SectionTitle
- Jedinstven stil za sekcijske naslove:
  - Subtitle tag iznad naslova: `text-neon text-sm font-bold tracking-widest uppercase mb-2 block`.
  - `h2` naslov: `text-4xl md:text-5xl font-bold text-white leading-tight`.
  - Dekorativna neon linija ispod: `w-20 h-1 bg-neon mt-4 rounded-full shadow-neon`.

### Ikonice (lucide-react)
- Koristimo `lucide-react` ikonice za tech/feature simbole.
- Stil za neon/teal glow:
  - `className="text-teal-light drop-shadow-[0_0_8px_rgba(76,202,226,0.5)]"`.
- Na ovaj način ikone se vizuelno uklapaju sa neon/glass stilom kroz cijeli sajt.

## Hero Section Spec

- Global background: `#0A0A0A` (deep black) + particles ("slow starry universe" efekat) preko **tsparticles** ili custom Framer Motion čestica.
- Sve na desktopu živi unutar jednog velikog, tankog, rounded-square glass okvira (`rounded-[40px]`, `border-white/10`, `bg-white/5`, `backdrop-blur-2xl`, multi-layer blur + noise overlay + progressive border: `border-t-white/20 border-b-white/5 border-l-white/10`, inner glow `box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.1)`).
- Hero kontejnar sadrži:
  - **Navbar**: logo `hadzic` (smallcaps, subtle neon text-glow), centrirane linkove (Home, Projects, About Me, Contact), EN/BS toggle desno.
  - **Centralni sadržaj**: AvatarWithGlow + naslov + podnaslov + `NeonButton` CTA.

### Avatar (HeroAvatar)
- Koristi se uploadovani `hero-me.png` (transparent PNG portret).
- Smješten u `rounded-[30px]` glass kvadrat:
  - pozadina: deep dark gradient (npr. `from-[#020619] via-[#050816] to-[#020617]`).
  - neon rim light: `shadow-[0_0_40px_-10px_#3BC9FF]` + dodatni gradient glow iza slike.
  - diagonal glass sheen: bijeli gradient overlay (`bg-gradient-to-tr from-white/10 via-white/4 to-transparent`) sa `opacity` na hover.
  - reflection line: linear gradient (`from-transparent via-white/10 to-transparent`) koji prelazi preko slike koristeći `.animate-shine` animaciju.
- Framer Motion ulaz: `initial={{ scale: 0.9, opacity: 0 }}` → `animate={{ scale: 1, opacity: 1 }}` sa `duration ~0.8`.

### Tekst & i18n
- Font: `font-space` (Space Grotesk) u svim hero elementima.
- Tekst se **ne hardcodira** nego koristi `useTranslation`:
  - `hero.title` (EN: `Full-Stack Development<br />Enhanced with AI`; BS: `Full-Stack Razvoj<br />Poboljšan uz AI`).
  - `hero.subtitle` (EN: `Helping businesses build modern web & mobile apps faster.`; BS: `Pomažem biznisima da brže grade moderne web i mobilne aplikacije.`).
  - `hero.cta` (EN: `Get in Touch`; BS: `Kontaktiraj me`).
  - `nav.links.*` (Home, Projects, About, Contact).
- H1: veliki, bold, centriran, sa blagim text-bloom (`text-shadow: 0 0 10px rgba(59, 201, 255, 0.3)`).
- Tagline/podnaslov: tanji, `text-white/70`, jedan red.

### CTA (Neon dugme)
- Hollow pill oblik:
  - border: `border-neon` (`#3BC9FF`).
  - pozadina: `bg-black/50` ili transparent glass.
  - glow ispod: `shadow-[0_0_20px_#3BC9FF]` ili varijante `shadow-neon`.
- Hover efekti:
  - scale `1.05` (breathing), pojačan glow.
  - `whileTap={{ scale: 0.95 }}`.

### Animacije
- **Entrance (load)**:
  - Staggered fade-up: Avatar → Title → Subtitle → Button (delay ~0.1s između). Framer Motion `variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}`.
  - Blur-in za veće naslove: start `filter: blur(10px)` → `blur(0)` tokom animacije.
- **Hover**:
  - Avatar: sheen overlay i reflection line se pomjeraju, glow jači.
  - Dugme: scale 1.05 + jači glow.
  - Project cards (drugdje): 3D tilt prema kursoru.
- **Scroll indicator**: mali "mouse" icon na dnu glass frame-a, bouncing animacija gore-dolje.

### Ambient (pozadina)
- Čestice:
  - Preporučeno: `react-tsparticles` + `tsparticles` konfigurisan kao spori "starry universe" (male bijele/plave tačke, random kretanje, niska opacity, suptilan hover repulse/parallax).
- Background pulsiranje:
  - spor gradient pulse (npr. varijacija `backgroundImage['gradient-dark']`) ili blag opacity oscillation preko dodatnog sloja.

### Responsive ponašanje
- **Desktop**:
  - Sve (navbar + hero content) je unutar velikog glass frame-a (rounded-[40px]) centriranog na ekranu.
- **Mobile**:
  - Nema velikog outer frame-a – navbar je sticky glass bar gore, hero sadržaj stackovan ispod.
  - Avatar puni širinu (`w-full` max-width), tekst i CTA ispod.
  - Hamburger otvara fullscreen mobile meni.
