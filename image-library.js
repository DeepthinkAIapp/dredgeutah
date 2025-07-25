// Simple Image Library for Blog Automation
// This provides relevant images for different blog post categories

const IMAGE_LIBRARY = {
  // Web Design & Development
  'web design': [
    'images/pexels-divinetechygirl-1181359.jpg',
    'images/pexels-cottonbro-6940874.jpg',
    'images/pexels-knownasovan-62689.jpg'
  ],
  
  // WordPress
  'wordpress': [
    'images/wordpress.png',
    'images/pexels-divinetechygirl-1181359.jpg',
    'images/pexels-cottonbro-6940874.jpg'
  ],
  
  // UI Design
  'ui design': [
    'images/pexels-divinetechygirl-1181359.jpg',
    'images/pexels-cottonbro-6940874.jpg',
    'images/pexels-knownasovan-62689.jpg'
  ],
  
  // Freelance
  'freelance': [
    'images/pexels-cottonbro-6940874.jpg',
    'images/pexels-divinetechygirl-1181359.jpg',
    'images/pexels-knownasovan-62689.jpg'
  ],
  
  // Technology
  'technology': [
    'images/pexels-divinetechygirl-1181359.jpg',
    'images/pexels-cottonbro-6940874.jpg',
    'images/pexels-knownasovan-62689.jpg'
  ],
  
  // Business
  'business': [
    'images/pexels-cottonbro-6940874.jpg',
    'images/pexels-divinetechygirl-1181359.jpg',
    'images/pexels-knownasovan-62689.jpg'
  ],
  
  // Default fallback
  'default': [
    'images/pexels-divinetechygirl-1181359.jpg',
    'images/pexels-cottonbro-6940874.jpg',
    'images/pexels-knownasovan-62689.jpg'
  ]
};

// Get relevant image for blog post
function getRelevantImage(postTitle, category = 'WEB DESIGN') {
  const title = postTitle.toLowerCase();
  const cat = category.toLowerCase();
  
  // Check for specific keywords in title
  if (title.includes('wordpress')) {
    return getRandomImage('wordpress');
  }
  if (title.includes('ui design') || title.includes('design tools')) {
    return getRandomImage('ui design');
  }
  if (title.includes('freelance')) {
    return getRandomImage('freelance');
  }
  if (title.includes('web design')) {
    return getRandomImage('web design');
  }
  
  // Check category
  if (cat.includes('wordpress')) {
    return getRandomImage('wordpress');
  }
  if (cat.includes('ui design')) {
    return getRandomImage('ui design');
  }
  if (cat.includes('web design')) {
    return getRandomImage('web design');
  }
  
  // Fallback to default
  return getRandomImage('default');
}

// Get random image from category
function getRandomImage(category) {
  const images = IMAGE_LIBRARY[category] || IMAGE_LIBRARY['default'];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

// Copy image to new filename for blog post
function copyImageForPost(originalImagePath, postTitle) {
  const fs = require('fs');
  const path = require('path');
  
  // Generate new filename
  const filename = postTitle.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const newImagePath = `images/${filename}-featured.jpg`;
  
  try {
    // Copy the image file
    fs.copyFileSync(originalImagePath, newImagePath);
    console.log(`✅ Image copied: ${newImagePath}`);
    return newImagePath;
  } catch (error) {
    console.log(`⚠️ Failed to copy image: ${error.message}`);
    return originalImagePath; // Return original if copy fails
  }
}

module.exports = {
  getRelevantImage,
  getRandomImage,
  copyImageForPost,
  IMAGE_LIBRARY
}; 