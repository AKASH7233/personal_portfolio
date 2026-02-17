import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SITE_URL = 'https://akashyadav-one.vercel.app';
const SITE_NAME = 'Akash Yadav — Full Stack Developer';

export default function SEOHead({
  title = "Akash Yadav | Full Stack Developer — React, Node.js, MongoDB Expert",
  description = "Portfolio of Akash Yadav — Full Stack Developer specializing in React.js, Next.js, Node.js, MongoDB, and TypeScript. 627+ LeetCode problems solved. View projects, skills, and achievements.",
  keywords = [],
  image = "/og-image.svg",
  url = SITE_URL,
  type = "website",
  author = "Akash Yadav",
  publishedTime,
  modifiedTime
}: SEOProps) {
  
  const defaultKeywords = [
    "Akash Yadav",
    "Akash Yadav developer",
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "MERN Stack Developer",
    "Web Developer Portfolio",
    "MongoDB",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "Express.js",
    "Software Engineer",
    "LeetCode Knight",
    "Competitive Programming",
    "Frontend Developer",
    "Backend Developer",
    "Tailwind CSS",
    "REST API",
    "Thakur College Computer Engineering"
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];
  const canonicalUrl = url.endsWith('/') ? url : `${url}/`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${author} — Full Stack Developer Portfolio`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${author} — Full Stack Developer Portfolio`} />
      <meta name="twitter:creator" content="@akashyadv7233" />
    </Helmet>
  );
}