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
}

export const projectsData: Record<string, ProjectData> = {
  rabbooking: {
    id: "rabbooking",
    title: "RabBooking App",
    category: "MOBILE APP",
    description: "A comprehensive booking platform for religious accommodations in Saudi Arabia, featuring real-time availability, secure payments, and multilingual support.",
    overview: [
      "Designed and developed a Flutter-based mobile application for booking religious accommodations",
      "Implemented real-time availability checking and reservation system",
      "Created secure payment integration with Stripe for international transactions",
      "Built admin dashboard for property management and analytics"
    ],
    techStack: ["Flutter", "Firebase", "Stripe", "NodeJS", "MongoDB"],
    galleryImages: [
      "/rabbooking-1.png",
      "/rabbooking-2.png", 
      "/rabbooking-3.png",
      "/rabbooking-4.png"
    ],
    challenges: [
      "Real-time synchronization between multiple users booking the same properties",
      "Handling complex payment flows across different countries and currencies",
      "Implementing Arabic RTL support alongside English LTR interface",
      "Managing high-quality image uploads and optimization for mobile networks"
    ],
    solutions: [
      "Used Firebase real-time database with conflict resolution for booking management",
      "Implemented Stripe Connect with multi-currency support and webhooks",
      "Created flexible localization system with automatic RTL/LTR switching",
      "Built image compression and CDN integration for optimal performance"
    ],
    results: [
      "10,000+ downloads in first 3 months",
      "4.8★ average rating on app stores",
      "95% booking completion rate",
      "40% reduction in administrative overhead"
    ],
    client: "RabBooking Ltd.",
    duration: "4 months",
    role: "Lead Mobile Developer"
  },
  saasDashboard: {
    id: "saas-dashboard", 
    title: "SaaS Analytics Dashboard",
    category: "WEB APPLICATION",
    description: "A modern analytics dashboard for SaaS companies featuring real-time data visualization, custom reporting, and team collaboration tools.",
    overview: [
      "Developed responsive React-based dashboard with real-time data updates",
      "Implemented interactive charts and data visualization using Chart.js",
      "Created custom report builder with export functionality",
      "Built team collaboration features with real-time notifications"
    ],
    techStack: ["React", "TypeScript", "Next.js", "Tailwind", "Chart.js", "Webflow"],
    galleryImages: [
      "/dashboard-1.png",
      "/dashboard-2.png",
      "/dashboard-3.png",
      "/dashboard-4.png"
    ],
    challenges: [
      "Handling large datasets with real-time updates without performance degradation",
      "Creating responsive charts that work across all device sizes",
      "Implementing complex filtering and data aggregation logic",
      "Managing user permissions and data access controls"
    ],
    solutions: [
      "Used React Query with WebSocket integration for efficient data fetching",
      "Implemented custom chart components with responsive design principles",
      "Built advanced filtering system with memoized calculations",
      "Created role-based access control with JWT authentication"
    ],
    results: [
      "50% faster data loading times",
      "200% increase in user engagement",
      "30% reduction in support tickets",
      "Successfully scaled to 10,000+ users"
    ],
    client: "TechStart Inc.",
    duration: "6 months", 
    role: "Full-Stack Developer"
  },
  aiChatbot: {
    id: "ai-chatbot",
    title: "AI Customer Service Bot",
    category: "AI SOLUTION",
    description: "An intelligent chatbot powered by machine learning that handles customer service inquiries with 95% accuracy and natural language processing.",
    overview: [
      "Developed AI-powered chatbot using Python and machine learning frameworks",
      "Implemented natural language processing for understanding customer queries",
      "Created training pipeline for continuous model improvement",
      "Built analytics dashboard for monitoring bot performance"
    ],
    techStack: ["Python", "TensorFlow", "React", "NodeJS", "MongoDB", "AI"],
    galleryImages: [
      "/chatbot-1.png",
      "/chatbot-2.png", 
      "/chatbot-3.png",
      "/chatbot-4.png"
    ],
    challenges: [
      "Training model to understand industry-specific terminology",
      "Handling multilingual customer queries",
      "Maintaining context throughout long conversations",
      "Ensuring fast response times under high load"
    ],
    solutions: [
      "Used transfer learning with industry-specific fine-tuning",
      "Implemented language detection and translation pipeline",
      "Created conversation state management with context tracking",
      "Deployed model with auto-scaling and load balancing"
    ],
    results: [
      "95% query resolution rate",
      "60% reduction in human support costs",
      "24/7 availability across all time zones",
      "2-second average response time"
    ],
    client: "Global Services Corp.",
    duration: "5 months",
    role: "AI/ML Engineer"
  },
  uiuxDesign: {
    id: "uiux-design",
    title: "FinTech Mobile App Design",
    category: "UI/UX DESIGN",
    description: "Complete UI/UX redesign for a financial technology mobile app, focusing on user experience, accessibility, and modern design principles.",
    overview: [
      "Conducted user research and competitive analysis",
      "Designed complete UI/UX system with component library",
      "Created interactive prototypes and user testing",
      "Developed design system and brand guidelines"
    ],
    techStack: ["Figma", "UI/UX Design", "React", "FlutterFlow"],
    galleryImages: [
      "/fintech-1.png",
      "/fintech-2.png",
      "/fintech-3.png", 
      "/fintech-4.png"
    ],
    challenges: [
      "Balancing complex financial data with simple user interface",
      "Ensuring accessibility compliance for users with disabilities",
      "Creating consistent design across multiple platforms",
      "User onboarding for complex financial products"
    ],
    solutions: [
      "Designed progressive disclosure patterns for complex information",
      "Implemented WCAG 2.1 AA accessibility standards",
      "Created comprehensive design system with reusable components",
      "Built interactive onboarding flow with step-by-step guidance"
    ],
    results: [
      "40% improvement in user task completion",
      "25% reduction in support inquiries",
      "100% accessibility compliance score",
      "Successfully launched in 5 markets"
    ],
    client: "FinanceFlow Ltd.",
    duration: "3 months",
    role: "Lead UI/UX Designer"
  }
};

// Helper function to get next project
export const getNextProject = (currentProjectId: string): ProjectData | null => {
  const projectIds = Object.keys(projectsData);
  const currentIndex = projectIds.indexOf(currentProjectId);
  const nextIndex = (currentIndex + 1) % projectIds.length;
  return projectsData[projectIds[nextIndex]] || null;
};
