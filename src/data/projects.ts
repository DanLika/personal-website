export interface SubProject {
  id: string;
  title: { en: string; bs: string };
  description: { en: string; bs: string };
  galleryImages: string[]; // Horizontal images
  galleryImagesVertical?: string[]; // Optional vertical images
  features?: { en: string; bs: string }[]; // Bilingual feature badges
  marketplaceUrl?: string; // Optional marketplace link
}

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
  liveUrl?: string; // Optional live website URL
  subProjects?: SubProject[]; // Optional for modular collection projects
}

export const projectsData: Record<string, ProjectData> = {
  'bookbed-saas': {
    id: 'bookbed-saas',
    title: 'BookBed SaaS',
    category: 'SAAS PLATFORM',
    description: 'A multi-tenant booking platform offering real-time availability widgets and iCal synchronization for property managers.',
    overview: [
      'A comprehensive SaaS solution designed for property managers',
      'Allows users to manage reservations across platforms (Airbnb, Booking.com) via iCal sync',
      'Provides embeddable widgets for direct website bookings',
      'Real-time availability updates and calendar synchronization'
    ],
    techStack: ['Flutter', 'Firebase', 'Stripe', 'Resend'],
    galleryImages: [
      '/BookBed/BookBed.avif',
      '/BookBed/BookBed 2.avif',
      '/BookBed/BookBed 3.avif',
      '/BookBed/BookBed 4.avif'
    ],
    challenges: [
      'Real-time synchronization between multiple booking platforms',
      'Handling complex iCal parsing and two-way sync',
      'Multi-tenant architecture with data isolation',
      'Widget performance and embeddability across different websites'
    ],
    solutions: [
      'Implemented real-time Firebase listeners with conflict resolution',
      'Built robust iCal parser with bi-directional synchronization',
      'Designed secure multi-tenant database schema with row-level security',
      'Created lightweight widget with iframe embedding and postMessage communication'
    ],
    results: [
      'Seamless iCal synchronization',
      'Multi-tenant architecture',
      'Real-time widget availability'
    ],
    client: 'BookBed',
    duration: '6 months',
    role: 'Lead Full-Stack Developer'
  },
  ironlife: {
    id: 'ironlife',
    title: 'IronLife',
    category: 'WEBFLOW CMS',
    description: 'A high-performance fitness and nutrition brand website built natively on Webflow.',
    overview: [
      'Comprehensive digital platform for fitness, nutrition, and healthy living',
      'Built entirely in Webflow with custom CMS for easy content management',
      'Optimized for speed, accessibility, and search engine visibility',
      'Allows client to publish articles, recipes, and training guides without code'
    ],
    techStack: ['Webflow', 'SEO', 'Figma'],
    galleryImages: [
      '/IronLife/IronLife.avif',
      '/IronLife/IronLife 2.avif',
      '/IronLife/IronLife 3.avif',
      '/IronLife/IronLife 4.avif'
    ],
    challenges: [
      'Achieving fast page load times with media-rich content',
      'Creating a flexible CMS structure for non-technical editors',
      'Ensuring brand consistency across all pages',
      'Implementing advanced SEO strategies'
    ],
    solutions: [
      'Optimized images with Webflow automatic compression and lazy loading',
      'Designed intuitive CMS collections with custom fields',
      'Created comprehensive style guide and component library',
      'Implemented schema markup and meta optimization'
    ],
    results: [
      '99/100 Performance Score',
      'SEO Optimized Structure',
      'Easy Client Management'
    ],
    client: 'IronLife Nutrition',
    duration: '2 months',
    role: 'Webflow Developer & Designer',
    liveUrl: 'https://ironlife-org.webflow.io'
  },
  'pizzeria-bestek': {
    id: 'pizzeria-bestek',
    title: 'Pizzeria Bestek',
    category: 'WEB APP & DASHBOARD',
    description: 'A complete food ordering platform featuring a customer app and a real-time Admin Dashboard.',
    overview: [
      'A custom-built web application designed to digitize the ordering process for a local pizzeria.',
      'The system consists of two parts: a user-friendly frontend for customers to browse the menu and place orders, and a secure Admin Dashboard for staff to accept or reject orders in real-time.',
      'Supabase handles the live data synchronization, while Resend ensures reliable transactional email notifications for every order status change.'
    ],
    techStack: ['React', 'Tailwind', 'Supabase', 'Resend'],
    galleryImages: [
      '/Pizzeria_Bestek/pizzeria-1.avif',
      '/Pizzeria_Bestek/pizzeria-2.avif',
      '/Pizzeria_Bestek/pizzeria-3.avif',
      '/Pizzeria_Bestek/pizzeria-5.avif'
    ],
    challenges: [
      'Real-time order status updates for both customers and admins',
      'Handling concurrent orders during peak hours',
      'Email delivery reliability and templating',
      'Mobile-first responsive design for on-the-go ordering'
    ],
    solutions: [
      'Implemented Supabase real-time subscriptions for instant updates',
      'Used database transactions with row-level security for data consistency',
      'Integrated Resend API with custom HTML email templates',
      'Built mobile-optimized UI with Tailwind responsive utilities'
    ],
    results: [
      'Real-time Supabase Sync',
      'Resend Email Integration',
      'Full Admin Management'
    ],
    client: 'Pizzeria Bestek',
    duration: '3 months',
    role: 'Full-Stack Developer',
    liveUrl: 'https://pizzeriabestek.com'
  },
  'flutterflow-templates': {
    id: 'flutterflow-templates',
    title: 'FlutterFlow Templates',
    category: 'MARKETPLACE',
    description: 'A suite of premium templates (Booking, Calendar Sync, PDF Viewer) for developers.',
    overview: [
      'A collection of premium, high-performance templates built for the FlutterFlow Marketplace. These solutions provide developers with robust foundations for booking systems, productivity tools, and document management.',
      'Each template is designed with modularity in mind, featuring comprehensive documentation, cross-platform compatibility, and extensive customization options to accelerate development workflows.'
    ],
    techStack: ['FlutterFlow', 'Firebase', 'Stripe'],
    galleryImages: ['/flutterflow-mockup.avif'],
    challenges: [
      'Creating reusable components adaptable to different use cases',
      'Documentation for non-developers',
      'Ensuring templates work across iOS and Android',
      'Providing comprehensive customization options'
    ],
    solutions: [
      'Built modular architecture with clearly defined component boundaries',
      'Created video tutorials and step-by-step setup guides',
      'Tested thoroughly on both platforms with edge case handling',
      'Implemented theme system with easy color and style customization'
    ],
    results: [
      'Rapid Deployment',
      'Monetizable Assets',
      'Clean Low-Code'
    ],
    client: 'Self-Published',
    duration: '4 months',
    role: 'Template Creator & Developer',
    liveUrl: 'https://marketplace.flutterflow.io/creator/65d766a45ade49b3d5dfe437e8a52f87f5b9599e',
    subProjects: [
      {
        id: 'dreamhome',
        title: {
          en: 'DreamHome Booking App',
          bs: 'DreamHome Aplikacija za Rezervacije'
        },
        description: {
          en: 'A comprehensive rental booking solution featuring advanced search filtering, automated check-in logic via Cloud Functions, and seamless Stripe payment integration.',
          bs: 'Sveobuhvatno rješenje za rezervaciju smještaja sa naprednim filtriranjem pretrage, automatizovanom logikom prijave putem Cloud funkcija i integrisanim Stripe plaćanjem.'
        },
        galleryImages: [
          '/DreamHome_Template/DreamHome Booking App Template 1.avif',
          '/DreamHome_Template/DreamHome Booking App Template 2.avif'
        ],
        features: [
          { en: 'Night Mode', bs: 'Noćni Režim' },
          { en: 'Cloud Functions', bs: 'Cloud Funkcije' },
          { en: 'Stripe Payments', bs: 'Stripe Plaćanja' }
        ],
        marketplaceUrl: 'https://marketplace.flutterflow.io/item/dMCTLGxAqIpJ4HKv7mXI'
      },
      {
        id: 'calendar-tasks',
        title: {
          en: 'Advanced Calendar & Tasks',
          bs: 'Napredni Kalendar i Zadaci'
        },
        description: {
          en: 'An integrated productivity suite that syncs Firestore tasks with Google Calendar events in real-time, featuring a unified dashboard for complete schedule management.',
          bs: 'Integrisani paket za produktivnost koji sinhronizuje Firestore zadatke sa Google Calendar događajima u stvarnom vremenu, uz jedinstvenu kontrolnu ploču za upravljanje rasporedom.'
        },
        galleryImages: [
          '/Schedule_template/Calendar Template - Tasks and Google events.avif',
          '/Schedule_template/Calendar Template - Tasks and Google events 2.avif'
        ],
        features: [
          { en: 'Google Sync', bs: 'Google Sinhronizacija' },
          { en: 'Real-time', bs: 'Real-time' },
          { en: 'Firestore', bs: 'Firestore' }
        ],
        marketplaceUrl: 'https://marketplace.flutterflow.io/item/L4hgO6NrRMXqAIQp3uBD'
      },
      {
        id: 'pdf-viewer',
        title: {
          en: 'PDF Viewer Widgets',
          bs: 'PDF Viewer Widgeti'
        },
        description: {
          en: 'A set of custom widgets enabling robust PDF viewing capabilities on both web and mobile, including night mode, page snapping, and secure Firebase Storage access.',
          bs: 'Set prilagođenih widgeta koji omogućavaju napredan pregled PDF dokumenata na webu i mobilnim uređajima, uključujući noćni režim i siguran pristup Firebase pohrani.'
        },
        galleryImages: [
          '/PDF_widget/PDF Viewer Widgets for Mobile & Web 1.avif',
          '/PDF_widget/PDF Viewer Widgets for Mobile & Web 3.avif',
          '/PDF_widget/PDF Viewer Widgets for Mobile & Web 5.avif'
        ],
        features: [
          { en: 'Web + Mobile', bs: 'Web + Mobilni' },
          { en: 'Page Snapping', bs: 'Brzo Listanje' },
          { en: 'Firebase Storage', bs: 'Firebase Storage' }
        ],
        marketplaceUrl: 'https://marketplace.flutterflow.io/item/VtMN9fBXhPgGSNWgctQI'
      }
    ]
  }
};

// Helper function to get next project
export const getNextProject = (currentProjectId: string): ProjectData | null => {
  const projectIds = Object.keys(projectsData);
  const currentIndex = projectIds.indexOf(currentProjectId);
  const nextIndex = (currentIndex + 1) % projectIds.length;
  return projectsData[projectIds[nextIndex]] || null;
};
