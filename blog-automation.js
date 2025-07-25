const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Site structure
  rootDir: './',
  blogDir: './blog/',
  postsDir: './',
  
  // Affiliate links
  affiliateLinks: {
    wordpress: 'https://automattic.pxf.io/XYBQ1G',
    webDesign: 'https://automattic.pxf.io/XYBQ1G',
    hosting: 'https://automattic.pxf.io/XYBQ1G',
    themes: 'https://automattic.pxf.io/XYBQ1G'
  },
  
  // Internal linking keywords
  internalLinkKeywords: {
    'freelance web design': 'how-to-start-freelance-web-design-2025.html',
    'UI design tools': 'best-free-ui-design-tools-2025.html',
    'web design tools': 'best-free-ui-design-tools-2025.html',
    'design tools': 'best-free-ui-design-tools-2025.html',
    'freelance': 'how-to-start-freelance-web-design-2025.html',
    'web design career': 'how-to-start-freelance-web-design-2025.html'
  },
  
  // Blog post template
  blogTemplate: {
    title: '',
    description: '',
    keywords: '',
    category: '',
    readTime: '5 min read',
    publishDate: '',
    featuredImage: '',
    content: ''
  }
};

class BlogAutomation {
  constructor() {
    this.posts = this.loadExistingPosts();
  }

  // Load existing blog posts
  loadExistingPosts() {
    const posts = [];
    const files = fs.readdirSync(CONFIG.rootDir);
    
    files.forEach(file => {
      if (file.includes('.html') && file !== 'index.html' && 
          file.includes('2025') && !file.includes('blog')) {
        const content = fs.readFileSync(path.join(CONFIG.rootDir, file), 'utf8');
        const title = this.extractTitle(content);
        const description = this.extractDescription(content);
        const category = this.extractCategory(content);
        
        posts.push({
          filename: file,
          title: title,
          description: description,
          category: category,
          url: file
        });
      }
    });
    
    return posts;
  }

  // Extract title from HTML content
  extractTitle(content) {
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    return titleMatch ? titleMatch[1].replace(' | Deepthink Studio', '') : '';
  }

  // Extract description from HTML content
  extractDescription(content) {
    const descMatch = content.match(/<meta name="description" content="(.*?)"/);
    return descMatch ? descMatch[1] : '';
  }

  // Extract category from HTML content
  extractCategory(content) {
    const categoryMatch = content.match(/<span style="background: #C6FF1A;.*?">(.*?)<\/span>/);
    return categoryMatch ? categoryMatch[1] : 'WEB DESIGN';
  }

  // Generate new blog post
  generateBlogPost(postData) {
    const template = this.getBlogPostTemplate(postData);
    const processedContent = this.processContent(template.content);
    const finalHTML = this.buildHTML(template, processedContent);
    
    const filename = this.generateFilename(postData.title);
    fs.writeFileSync(path.join(CONFIG.rootDir, filename), finalHTML);
    
    // Update blog index
    this.updateBlogIndex();
    
    // Update all pages with new blog link
    this.updateAllPages();
    
    console.log(`✅ Blog post created: ${filename}`);
    return filename;
  }

  // Get blog post template
  getBlogPostTemplate(postData) {
    const template = fs.readFileSync('./blog-template.html', 'utf8');
    
    return template
      .replace(/{{TITLE}}/g, postData.title)
      .replace(/{{DESCRIPTION}}/g, postData.description)
      .replace(/{{KEYWORDS}}/g, postData.keywords)
      .replace(/{{CATEGORY}}/g, postData.category)
      .replace(/{{READ_TIME}}/g, postData.readTime)
      .replace(/{{PUBLISH_DATE}}/g, postData.publishDate)
      .replace(/{{FEATURED_IMAGE}}/g, postData.featuredImage)
      .replace(/{{CONTENT}}/g, postData.content);
  }

  // Process content with internal links and affiliate links
  processContent(content) {
    let processedContent = content;
    
    // Add internal links
    Object.entries(CONFIG.internalLinkKeywords).forEach(([keyword, url]) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      processedContent = processedContent.replace(regex, 
        `<a href="${url}" style="color: #C6FF1A; text-decoration: underline;">$&</a>`);
    });
    
    // Add affiliate links
    processedContent = this.addAffiliateLinks(processedContent);
    
    return processedContent;
  }

  // Add affiliate links
  addAffiliateLinks(content) {
    // WordPress affiliate links
    const wordpressRegex = /\b(WordPress|wordpress)\b/gi;
    content = content.replace(wordpressRegex, 
      `<a href="${CONFIG.affiliateLinks.wordpress}" target="_blank" rel="nofollow" style="color: #C6FF1A; text-decoration: underline;">$&</a>`);
    
    // Web design affiliate links
    const webDesignRegex = /\b(web design|website design|web development)\b/gi;
    content = content.replace(webDesignRegex, 
      `<a href="${CONFIG.affiliateLinks.webDesign}" target="_blank" rel="nofollow" style="color: #C6FF1A; text-decoration: underline;">$&</a>`);
    
    return content;
  }

  // Build final HTML
  buildHTML(template, content) {
    return template.replace('{{CONTENT}}', content);
  }

  // Generate filename from title
  generateFilename(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-2025.html';
  }

  // Update blog index page
  updateBlogIndex() {
    const blogIndexPath = path.join(CONFIG.blogDir, 'index.html');
    let blogIndex = fs.readFileSync(blogIndexPath, 'utf8');
    
    // Add new post to featured section
    const newPost = this.posts[this.posts.length - 1];
    const featuredSection = this.generateFeaturedSection(newPost);
    
    // Insert new featured post
    blogIndex = blogIndex.replace(
      /<!-- Featured Post -->/,
      `<!-- Featured Post -->\n${featuredSection}`
    );
    
    // Update recent posts
    blogIndex = this.updateRecentPosts(blogIndex);
    
    fs.writeFileSync(blogIndexPath, blogIndex);
    console.log('✅ Blog index updated');
  }

  // Generate featured section
  generateFeaturedSection(post) {
    return `
          <article class="featured-blog-post" style="background: #e9ecef; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); margin-bottom: 3rem; overflow: hidden;">
            <img src="../images/${post.featuredImage || 'default-featured.jpg'}" alt="${post.title}" style="width: 100%; height: 300px; object-fit: cover;" />
            <div style="padding: 2rem;">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span style="background: #C6FF1A; color: #222; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">FEATURED</span>
                <span style="color: #666; font-size: 0.9rem;">${post.readTime}</span>
                <span style="color: #666; font-size: 0.9rem;">·</span>
                <span style="color: #666; font-size: 0.9rem;">${post.publishDate}</span>
              </div>
              <h2 style="font-size: 2rem; color: #222; font-weight: 700; margin-bottom: 1rem; line-height: 1.2;">${post.title}</h2>
              <p style="color: #444; font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.6;">${post.description}</p>
              <a href="../${post.filename}" style="color: #C6FF1A; font-weight: 700; text-decoration: none; font-size: 1.1rem;">Read Full Article →</a>
            </div>
          </article>`;
  }

  // Update recent posts section
  updateRecentPosts(blogIndex) {
    const recentPosts = this.posts.slice(-3).reverse();
    let recentPostsHTML = '';
    
    recentPosts.forEach(post => {
      recentPostsHTML += `
              <article style="display: flex; gap: 0.8rem;">
                <a href="../${post.filename}" style="text-decoration: none; color: inherit; display: flex; gap: 0.8rem;">
                  <img src="../images/${post.featuredImage || 'default-thumbnail.jpg'}" alt="${post.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />
                  <div>
                    <h4 style="margin: 0 0 0.3rem 0; font-size: 0.9rem; color: #222;">${post.title}</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: #666;">${post.readTime}</p>
                  </div>
                </a>
              </article>`;
    });
    
    return blogIndex.replace(
      /<!-- Recent Posts Content -->[\s\S]*?<!-- End Recent Posts Content -->/,
      `<!-- Recent Posts Content -->\n${recentPostsHTML}\n<!-- End Recent Posts Content -->`
    );
  }

  // Update all pages with new blog links
  updateAllPages() {
    const pages = ['index.html', 'about.html', 'contact.html', 'portfolio.html', 'packages.html'];
    
    pages.forEach(page => {
      const pagePath = path.join(CONFIG.rootDir, page);
      if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        
        // Ensure blog link points to correct location
        content = content.replace(
          /href="blog\/"/g,
          'href="blog/index.html"'
        );
        
        fs.writeFileSync(pagePath, content);
      }
    });
    
    console.log('✅ All pages updated with blog links');
  }

  // Add internal links to existing posts
  addInternalLinksToExistingPosts() {
    this.posts.forEach(post => {
      const postPath = path.join(CONFIG.rootDir, post.filename);
      let content = fs.readFileSync(postPath, 'utf8');
      
      // Process content with internal links
      const processedContent = this.processContent(content);
      
      fs.writeFileSync(postPath, processedContent);
      console.log(`✅ Added internal links to ${post.filename}`);
    });
  }

  // Add affiliate links to existing posts
  addAffiliateLinksToExistingPosts() {
    this.posts.forEach(post => {
      const postPath = path.join(CONFIG.rootDir, post.filename);
      let content = fs.readFileSync(postPath, 'utf8');
      
      // Add affiliate links
      content = this.addAffiliateLinks(content);
      
      fs.writeFileSync(postPath, content);
      console.log(`✅ Added affiliate links to ${post.filename}`);
    });
  }
}

// CLI Interface
const automation = new BlogAutomation();

// Command line interface
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'create':
    if (args.length < 1) {
      console.log('Usage: node blog-automation.js create "Post Title"');
      process.exit(1);
    }
    
    const postData = {
      title: args[0],
      description: args[1] || 'A comprehensive guide on ' + args[0].toLowerCase(),
      keywords: args[2] || 'web design, development, tips',
      category: args[3] || 'WEB DESIGN',
      readTime: args[4] || '5 min read',
      publishDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      featuredImage: args[5] || 'default-featured.jpg',
      content: args[6] || 'Your blog post content here...'
    };
    
    automation.generateBlogPost(postData);
    break;
    
  case 'add-links':
    automation.addInternalLinksToExistingPosts();
    break;
    
  case 'add-affiliate':
    automation.addAffiliateLinksToExistingPosts();
    break;
    
  case 'update-all':
    automation.addInternalLinksToExistingPosts();
    automation.addAffiliateLinksToExistingPosts();
    automation.updateAllPages();
    break;
    
  default:
    console.log(`
Blog Automation System

Usage:
  node blog-automation.js create "Post Title" [description] [keywords] [category] [readTime] [image] [content]
  node blog-automation.js add-links
  node blog-automation.js add-affiliate
  node blog-automation.js update-all

Examples:
  node blog-automation.js create "10 Best WordPress Themes for 2025"
  node blog-automation.js update-all
    `);
}

module.exports = BlogAutomation; 