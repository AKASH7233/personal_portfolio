export interface ProjectSEOData {
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl?: string;
  stars?: number;
  forks?: number;
  createdDate?: string;
  updatedDate?: string;
}

export function generateProjectSchema(project: ProjectSEOData, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.name,
    "description": project.description,
    "url": project.liveUrl || project.githubUrl,
    "downloadUrl": project.githubUrl,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "author": {
      "@type": "Person",
      "name": "Akash Yadav",
      "url": baseUrl
    },
    "programmingLanguage": project.technologies,
    "codeRepository": project.githubUrl,
    "dateCreated": project.createdDate,
    "dateModified": project.updatedDate,
    "image": project.imageUrl || `${baseUrl}/og-image.png`,
    "aggregateRating": project.stars ? {
      "@type": "AggregateRating", 
      "ratingValue": Math.min(project.stars / 10, 5),
      "ratingCount": project.stars + (project.forks || 0)
    } : undefined
  };
}

export function generateBlogPostSchema(
  title: string,
  description: string,
  publishDate: string,
  modifiedDate: string,
  imageUrl: string,
  url: string,
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": "Akash Yadav",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Person",
      "name": "Akash Yadav",
      "url": baseUrl
    },
    "datePublished": publishDate,
    "dateModified": modifiedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
}

export function generateOrganizationSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Akash Yadav - Full Stack Developer",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Professional Full Stack Developer specializing in React, Node.js, and MongoDB",
    "foundingDate": "2023",
    "founder": {
      "@type": "Person",
      "name": "Akash Yadav"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Professional Services",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://github.com/AKASH7233",
      "https://leetcode.com/u/akashyadv7233",
      "https://linkedin.com/in/akash-yadav"
    ]
  };
}

export function generateSkillsSchema(skills: string[], baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Akash Yadav",
    "url": baseUrl,
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full Stack Developer",
      "skills": skills.map(skill => ({
        "@type": "DefinedTerm",
        "name": skill,
        "inDefinedTermSet": "Programming Technologies"
      }))
    }
  };
}