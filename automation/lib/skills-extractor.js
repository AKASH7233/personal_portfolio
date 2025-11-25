/**
 * Extract Skills from GitHub Projects
 * Analyzes repositories to extract technologies and skills
 */

/**
 * Extract skills from repository data
 * @param {Array} repositories - Array of GitHub repositories
 * @returns {Object} Categorized skills with counts
 */
export function extractSkills(repositories) {
  const skillsMap = new Map();
  const languageCount = new Map();
  const topicCount = new Map();

  // Extract from languages
  repositories.forEach(repo => {
    if (repo.language) {
      languageCount.set(
        repo.language,
        (languageCount.get(repo.language) || 0) + 1
      );
    }

    // Extract from topics
    if (repo.topics && repo.topics.length > 0) {
      repo.topics.forEach(topic => {
        topicCount.set(
          topic,
          (topicCount.get(topic) || 0) + 1
        );
      });
    }
  });

  // Categorize skills
  const categories = {
    languages: new Set(),
    frameworks: new Set(),
    tools: new Set(),
    databases: new Set(),
    cloud: new Set(),
    other: new Set()
  };

  // Language mappings
  const languageMap = {
    'JavaScript': 'languages',
    'TypeScript': 'languages',
    'Python': 'languages',
    'Java': 'languages',
    'C++': 'languages',
    'C': 'languages',
    'Go': 'languages',
    'Rust': 'languages',
    'PHP': 'languages',
    'Ruby': 'languages',
    'Swift': 'languages',
    'Kotlin': 'languages',
    'Dart': 'languages',
    'HTML': 'languages',
    'CSS': 'languages',
    'SCSS': 'languages'
  };

  // Framework/Tool mappings
  const techMap = {
    'react': 'frameworks',
    'reactjs': 'frameworks',
    'nextjs': 'frameworks',
    'next': 'frameworks',
    'vue': 'frameworks',
    'vuejs': 'frameworks',
    'angular': 'frameworks',
    'svelte': 'frameworks',
    'express': 'frameworks',
    'expressjs': 'frameworks',
    'nestjs': 'frameworks',
    'fastapi': 'frameworks',
    'django': 'frameworks',
    'flask': 'frameworks',
    'spring': 'frameworks',
    'laravel': 'frameworks',
    'tailwind': 'frameworks',
    'tailwindcss': 'frameworks',
    'bootstrap': 'frameworks',
    'mui': 'frameworks',
    'material-ui': 'frameworks',
    'chakra-ui': 'frameworks',
    'redux': 'frameworks',
    'zustand': 'frameworks',
    'mobx': 'frameworks',
    'git': 'tools',
    'github': 'tools',
    'docker': 'tools',
    'kubernetes': 'tools',
    'jenkins': 'tools',
    'webpack': 'tools',
    'vite': 'tools',
    'babel': 'tools',
    'eslint': 'tools',
    'prettier': 'tools',
    'jest': 'tools',
    'testing-library': 'tools',
    'cypress': 'tools',
    'playwright': 'tools',
    'mongodb': 'databases',
    'mongoose': 'databases',
    'postgresql': 'databases',
    'mysql': 'databases',
    'redis': 'databases',
    'sqlite': 'databases',
    'firebase': 'databases',
    'supabase': 'databases',
    'prisma': 'databases',
    'aws': 'cloud',
    'azure': 'cloud',
    'gcp': 'cloud',
    'vercel': 'cloud',
    'netlify': 'cloud',
    'heroku': 'cloud',
    'railway': 'cloud'
  };

  // Add languages
  languageCount.forEach((count, language) => {
    const category = languageMap[language] || 'languages';
    categories[category].add(language);
  });

  // Add technologies from topics
  topicCount.forEach((count, topic) => {
    const normalizedTopic = topic.toLowerCase();
    const category = techMap[normalizedTopic] || 'other';
    
    // Only add if it appears in at least 2 repos or has high count
    if (count >= 2 || topicCount.size < 10) {
      // Capitalize properly
      const formatted = topic
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      categories[category].add(formatted);
    }
  });

  // Convert Sets to sorted arrays
  const result = {};
  Object.keys(categories).forEach(category => {
    result[category] = Array.from(categories[category])
      .sort()
      .slice(0, category === 'languages' ? 15 : 20); // Limit per category
  });

  return result;
}

/**
 * Generate skill proficiency levels
 * @param {Array} repositories - Array of repositories
 * @param {Object} skills - Extracted skills
 * @returns {Object} Skills with proficiency levels
 */
export function generateSkillLevels(repositories, skills) {
  const skillLevels = {};

  // Count usage across repos
  const usageCounts = new Map();

  repositories.forEach(repo => {
    // Count language
    if (repo.language) {
      usageCounts.set(
        repo.language,
        (usageCounts.get(repo.language) || 0) + 1
      );
    }

    // Count topics
    repo.topics?.forEach(topic => {
      const formatted = topic
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      usageCounts.set(
        formatted,
        (usageCounts.get(formatted) || 0) + 1
      );
    });
  });

  // Assign levels based on usage
  const maxUsage = Math.max(...usageCounts.values(), 1);

  Object.keys(skills).forEach(category => {
    skills[category].forEach(skill => {
      const count = usageCounts.get(skill) || 0;
      const percentage = (count / maxUsage) * 100;

      let level = 'Beginner';
      let proficiency = 40;

      if (percentage >= 80) {
        level = 'Expert';
        proficiency = 95;
      } else if (percentage >= 60) {
        level = 'Advanced';
        proficiency = 85;
      } else if (percentage >= 40) {
        level = 'Intermediate';
        proficiency = 70;
      } else if (percentage >= 20) {
        level = 'Familiar';
        proficiency = 55;
      }

      if (!skillLevels[category]) {
        skillLevels[category] = [];
      }

      skillLevels[category].push({
        name: skill,
        level,
        proficiency,
        projectCount: count
      });
    });
  });

  // Sort by proficiency within each category
  Object.keys(skillLevels).forEach(category => {
    skillLevels[category].sort((a, b) => b.proficiency - a.proficiency);
  });

  return skillLevels;
}
