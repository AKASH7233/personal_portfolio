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

export default function SEOHead({
  title = "Akash Yadav | Full Stack Developer | React, Node.js, MongoDB Expert",
  description = "Experienced Full Stack Developer specializing in React.js, Next.js, Node.js, MongoDB, and TypeScript. Building innovative web applications with modern technologies. View my portfolio, projects, and LeetCode achievements.",
  keywords = [],
  image = "/og-image.png",
  url = "https://akash-portfolio-sage.vercel.app",
  type = "website",
  author = "Akash Yadav",
  publishedTime,
  modifiedTime
}: SEOProps) {
  
  const defaultKeywords = [
    "Akash Yadav",
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "MongoDB",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "Express.js",
    "Web Developer",
    "Software Engineer",
    "Portfolio",
    "LeetCode",
    "GitHub",
    "AKASH7233",
    "Connectify",
    "IntellibudgetAI",
    "TravelGuide AI",
    "TeamMate",
    "Frontend Developer",
    "Backend Developer",
    "MERN Stack",
    "Tailwind CSS",
    "Vite",
    "Git",
    "REST API",
    "Database Design",
    "Responsive Design",
    "UI/UX",
    "Vercel",
    "Netlify",
    "AWS"
  ];

  const allKeywords = [...defaultKeywords, ...keywords];
  const canonicalUrl = url;
  const imageUrl = image.startsWith('http') ? image : `${url}${image}`;

  // JSON-LD Structured Data
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Akash Yadav",
    "headline": "Full Stack Developer | React & Node.js Expert",
    "description": description,
    "url": url,
    "image": imageUrl,
    "sameAs": [
      "https://github.com/AKASH7233",
      "https://leetcode.com/u/akashyadv7233",
      "https://linkedin.com/in/akash-yadav",
      "https://twitter.com/akashyadav"
    ],
    "jobTitle": "Full Stack Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "knowsAbout": [
      "React.js",
      "Node.js", 
      "MongoDB",
      "TypeScript",
      "JavaScript",
      "Next.js",
      "Express.js",
      "Full Stack Development",
      "Web Development",
      "Database Design",
      "API Development",
      "Frontend Development",
      "Backend Development"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization", 
      "name": "Computer Science Graduate"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Akash Yadav Portfolio",
    "url": url,
    "description": description,
    "author": {
      "@type": "Person",
      "name": "Akash Yadav"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": url
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Portfolio",
        "item": `${url}/#projects`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "About",
        "item": `${url}/#about`
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={`${author} - Portfolio Screenshot`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Akash Yadav Portfolio" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${author} - Portfolio Screenshot`} />
      <meta name="twitter:creator" content="@akashyadav" />
      <meta name="twitter:site" content="@akashyadav" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#0070f3" />
      <meta name="msapplication-TileColor" content="#0070f3" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />

      {/* Verification Meta Tags (you'll need to add your actual verification codes) */}
      {/* <meta name="google-site-verification" content="your-verification-code" /> */}
      {/* <meta name="msvalidate.01" content="your-bing-verification-code" /> */}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}