import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

// Default keywords for SEO
const DEFAULT_KEYWORDS_BS = "web razvoj, izrada web stranica, SaaS razvoj, Flutter aplikacije, React programer, full-stack developer, Banja Luka, Bosna i Hercegovina";
const DEFAULT_KEYWORDS_EN = "web development, website design, SaaS development, Flutter apps, React developer, full-stack developer, Banja Luka, Bosnia";

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = "/hero-me.avif",
  url = "https://duskolicanin.com",
  type = "website",
}) => {
  const { t, i18n, ready } = useTranslation();

  // Get current language with fallback to Bosnian (primary SEO language)
  const currentLang = i18n.language || "bs";

  // Use props or fallback to i18n translations
  // Check if translations are ready to avoid showing keys
  const seoTitle = title || (ready ? t("meta.title") : "Dusko Licanin - Full-Stack Developer");
  const seoDescription = description || (ready ? t("meta.description") : "Full-Stack Development Enhanced with AI");
  const seoKeywords = keywords || (currentLang === "bs" ? DEFAULT_KEYWORDS_BS : DEFAULT_KEYWORDS_EN);

  // Construct full image URL
  const fullImageUrl = image.startsWith("http") ? image : `${url}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={currentLang} />
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="Dusko Licanin" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:locale" content={currentLang === "bs" ? "bs_BA" : "en_US"} />
      <meta property="og:site_name" content="Dusko Licanin - Full-Stack Developer" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Alternate languages */}
      <link rel="alternate" hrefLang="en" href={`${url}?lng=en`} />
      <link rel="alternate" hrefLang="bs" href={`${url}?lng=bs`} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </Helmet>
  );
};
