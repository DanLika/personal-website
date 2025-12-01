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

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = "/hero-me.avif",
  url = "https://licanin.com",
  type = "website",
}) => {
  const { t, i18n } = useTranslation();

  // Use props or fallback to i18n translations
  const seoTitle = title || t("meta.title");
  const seoDescription = description || t("meta.description");
  const seoKeywords = keywords || t("meta.keywords");
  const currentLang = i18n.language;

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
