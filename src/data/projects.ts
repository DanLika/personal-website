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
}

export const projectsData: Record<string, ProjectData> = {
  'syncbooking-saas': {
    id: 'syncbooking-saas',
    title: 'SyncBooking SaaS',
    category: 'SAAS PLATFORM',
    description: 'A multi-tenant booking platform offering real-time availability widgets and iCal synchronization for property managers.',
    overview: [
      'A comprehensive SaaS solution designed for property managers',
      'Allows users to manage reservations across platforms (Airbnb, Booking.com) via iCal sync',
      'Provides embeddable widgets for direct website bookings',
      'Real-time availability updates and calendar synchronization'
    ],
    techStack: ['Flutter', 'Firebase', 'Stripe', 'iCal Integration'],
    galleryImages: [
      '/syncbooking-dashboard.png',
      '/syncbooking-widget.png',
      '/syncbooking-calendar.png',
      '/syncbooking-payments.png'
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
    client: 'SyncBooking Ltd.',
    duration: '6 months',
    role: 'Lead Full-Stack Developer'
  },
  ironlife: {
    id: 'ironlife',
    title: 'IronLife.org',
    category: 'WEBFLOW CMS',
    description: 'A high-performance fitness and nutrition brand website built on Webflow.',
    overview: [
      'Professional fitness and nutrition brand website',
      'Built with Webflow CMS for easy content management',
      'Optimized for SEO and Core Web Vitals',
      'Responsive design across all devices'
    ],
    techStack: ['Webflow', 'CMS', 'SEO Optimization'],
    galleryImages: [
      '/ironlife-home.png',
      '/ironlife-programs.png',
      '/ironlife-blog.png',
      '/ironlife-mockup.avif'
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
      '95+ Lighthouse performance score',
      '100% SEO score',
      '50% increase in organic traffic',
      'Featured in Webflow showcase'
    ],
    client: 'IronLife Nutrition',
    duration: '2 months',
    role: 'Webflow Developer & Designer',
    liveUrl: 'https://ironlife-org.webflow.io'
  },
  'pizzeria-bestek': {
    id: 'pizzeria-bestek',
    title: 'Pizzeria Bestek',
    category: 'WEB APP',
    description: 'Full ordering system with an Admin Dashboard for real-time order acceptance/rejection.',
    overview: [
      'Complete online ordering system for a local pizzeria',
      'Real-time order management with admin dashboard',
      'Email notifications using Resend API',
      'Customer order tracking and history'
    ],
    techStack: ['React', 'Tailwind CSS', 'Supabase', 'Resend'],
    galleryImages: [
      '/pizzeria-menu.png',
      '/pizzeria-checkout.png',
      '/pizzeria-admin.png',
      '/pizzeria-mockup.avif'
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
      '100+ orders in first week',
      '30% increase in online orders',
      '95% order accuracy rate',
      '4.8★ customer satisfaction'
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
      'Premium template suite for FlutterFlow marketplace',
      'DreamHome: Complete booking app with Stripe integration',
      'Advanced Calendar: Sync with Google Calendar and iCal',
      'PDF Viewer: Full-featured document viewer and annotator'
    ],
    techStack: ['FlutterFlow', 'Firebase', 'Stripe', 'Google Calendar API'],
    galleryImages: [
      '/flutterflow-dreamhome.png',
      '/flutterflow-calendar.png',
      '/flutterflow-pdf.png',
      '/flutterflow-mockup.avif'
    ],
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
      '500+ template purchases',
      '4.9★ average rating',
      'Top-rated in marketplace',
      'Featured by FlutterFlow'
    ],
    client: 'Self-Published',
    duration: '4 months',
    role: 'Template Creator & Developer',
    liveUrl: 'https://marketplace.flutterflow.io/creator/65d766a45ade49b3d5dfe437e8a52f87f5b9599e'
  }
};

// Helper function to get next project
export const getNextProject = (currentProjectId: string): ProjectData | null => {
  const projectIds = Object.keys(projectsData);
  const currentIndex = projectIds.indexOf(currentProjectId);
  const nextIndex = (currentIndex + 1) % projectIds.length;
  return projectsData[projectIds[nextIndex]] || null;
};
