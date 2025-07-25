const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const imageLibrary = require('./image-library');
const SmartLinkingSystem = require('./smart-linking-system');

// Configuration
const CONFIG = {
  // Affiliate links
  affiliateLinks: {
    wordpress: 'https://automattic.pxf.io/XYBQ1G',
    webDesign: 'https://automattic.pxf.io/XYBQ1G'
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
  
  // Image sources and API keys
  imageSources: {
    pixabay: 'https://pixabay.com/api/',
    pexels: 'https://api.pexels.com/v1/search'
  },
  // Pixabay API key (free, no registration required for basic usage)
  pixabayApiKey: '36891722-1234567890abcdef1234567890abcdef', // Replace with your key
  // Pexels API key (free, requires registration)
  pexelsApiKey: 'your-pexels-api-key-here' // Replace with your key
};

class SimpleBlogAutomation {
  constructor() {
    this.posts = this.loadExistingPosts();
    this.smartLinking = new SmartLinkingSystem();
  }

  // Load existing blog posts
  loadExistingPosts() {
    const posts = [];
    const files = fs.readdirSync('./');
    
    files.forEach(file => {
      if (file.includes('.html') && file !== 'index.html' && 
          file.includes('2025') && !file.includes('blog')) {
        const content = fs.readFileSync(file, 'utf8');
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
  async generateBlogPost(postData) {
    const filename = this.generateFilename(postData.title);
    
    // Get relevant image for the post
    console.log('🖼️ Finding relevant image...');
    const imageData = await this.getRelevantImage(postData.title, postData.category || 'WEB DESIGN');
    
    if (imageData && imageData.url) {
      // Extract just the filename from the path
      const imageFilename = imageData.url.split('/').pop();
      postData.featuredImage = imageFilename;
      console.log(`✅ Image assigned: ${imageFilename}`);
    } else {
      postData.featuredImage = 'pexels-divinetechygirl-1181359.jpg';
    }
    
    const html = this.createBlogPostHTML(postData, filename);
    
    fs.writeFileSync(filename, html);
    
    // Update blog index with new post
    this.updateBlogIndex(postData, filename);
    
    console.log(`✅ Blog post created: ${filename}`);
    console.log(`✅ Blog index updated with new post`);
    return filename;
  }

  // Create blog post HTML
  createBlogPostHTML(postData, filename) {
    const publishDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y7QRMN2TMY"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-Y7QRMN2TMY');
</script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${postData.title} | Deepthink Studio</title>
  <link rel="stylesheet" href="styles.css" />
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/x-icon" href="images/favicon.ico" />
  <meta name="description" content="${postData.description || 'A comprehensive guide on ' + postData.title.toLowerCase()}" />
  <meta name="keywords" content="${postData.keywords || 'web design, development, tips'}" />
  <meta name="author" content="Deepthink Studio" />
  <meta name="robots" content="index, follow" />
  <!-- Open Graph / Facebook -->
  <meta property="og:title" content="${postData.title} | Deepthink Studio" />
  <meta property="og:description" content="${postData.description || 'A comprehensive guide on ' + postData.title.toLowerCase()}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://deepthinkstudio.com/${filename}" />
  <meta property="og:image" content="https://deepthinkstudio.com/images/${postData.featuredImage || 'default-featured.jpg'}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="article:author" content="Deepthink Studio" />
  <meta property="article:published_time" content="${new Date().toISOString()}" />
  <meta property="article:section" content="${postData.category || 'WEB DESIGN'}" />
  <meta property="article:tag" content="${postData.keywords || 'web design, development, tips'}" />
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${postData.title}" />
  <meta name="twitter:description" content="${postData.description || 'A comprehensive guide on ' + postData.title.toLowerCase()}" />
  <meta name="twitter:image" content="https://deepthinkstudio.com/images/${postData.featuredImage || 'default-featured.jpg'}" />
  <!-- Canonical URL -->
  <link rel="canonical" href="https://deepthinkstudio.com/${filename}" />
</head>
<body>
  <div id="contact-modal" class="contact-modal" style="display:none;">
    <div class="contact-modal-content">
      <button class="contact-modal-close" aria-label="Close">&times;</button>
      <h2>Get In Touch</h2>
      <form action="https://formspree.io/f/mjkognjj" method="POST" class="contact-form">
        <div class="contact-form-row">
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email Address" required />
        </div>
        <input type="text" name="phone" placeholder="Your Phone Number" />
        <textarea name="message" placeholder="Your Message" rows="4" required></textarea>
        <div class="contact-form-newsletter">
          <input type="checkbox" id="newsletter" name="newsletter" />
          <label for="newsletter">To receive our weekly Newsletter/SMS and offers check here. You can unsubscribe at any time.</label>
        </div>
        <button type="submit" class="contact-form-submit">Submit</button>
      </form>
    </div>
  </div>
  <header class="navbar glassy-header">
    <div class="navbar-inner">
      <div class="logo-group">
        <a href="index.html" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
          <span class="logo-icon">
            <img src="images/logo.png" alt="Deepthink Studio Logo" class="logo-flip" style="height: 52px; width: 52px; object-fit: contain;" />
          </span>
          <span class="logo-text">DEEPTHINK<br><span class="logo-sub">STUDIO</span></span>
        </a>
      </div>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <div class="dropdown">
          <a href="#services" class="dropdown-toggle">Services <span class="dropdown-arrow">▼</span></a>
          <div class="dropdown-menu">
            <a href="packages.html#logo-packages">Logo Design</a>
            <a href="packages.html#website-packages">Website Design</a>
            <a href="packages.html#ecommerce-packages">E-commerce</a>
            <a href="packages.html#webportal-packages">Web Portal</a>
            <a href="packages.html#mobile-packages">Mobile Application</a>
            <a href="packages.html#digital-packages">Digital Marketing</a>
            <a href="packages.html#seo-packages">SEO</a>
            <a href="packages.html#animation-packages">Video Animation</a>
          </div>
        </div>
        <a href="portfolio.html">Portfolio</a>
        <a href="about.html">About</a>
        <a href="packages.html">Packages</a>
        <a href="contact.html">Contact Us</a>
        <a href="blog/index.html" style="font-weight:700;color:#C6FF1A;">Blog</a>
      </nav>
      <div class="header-actions">
        <button class="start-project-btn">Start Project</button>
        <button class="arrow-btn" aria-label="Next">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#C6FF1A"/>
            <path d="M13 10l6 6-6 6" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="contact-btn" aria-label="Contact">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#222"/>
            <path d="M10 16c2.5 2.5 6.5 2.5 9 0" stroke="#C6FF1A" stroke-width="2" stroke-linecap="round"/>
            <circle cx="16" cy="13" r="2" fill="#C6FF1A"/>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Breadcrumb Navigation -->
  <nav style="background: #f8f9fa; padding: 1rem 0; border-bottom: 1px solid #e9ecef;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 24px;">
      <ol style="list-style: none; display: flex; align-items: center; gap: 0.5rem; margin: 0; padding: 0; font-size: 0.9rem;">
        <li><a href="index.html" style="color: #666; text-decoration: none;">Home</a></li>
        <li style="color: #666;">›</li>
        <li><a href="blog/index.html" style="color: #666; text-decoration: none;">Blog</a></li>
        <li style="color: #666;">›</li>
        <li style="color: #222; font-weight: 600;">${postData.title}</li>
      </ol>
    </div>
  </nav>

  <!-- Blog Post Content -->
  <main style="background: #fff; padding: 60px 0;">
    <div style="max-width: 800px; margin: 0 auto; padding: 0 24px;">
      <article style="line-height: 1.7;">
        <!-- Post Header -->
        <header style="margin-bottom: 3rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="background: #C6FF1A; color: #222; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">${postData.category || 'WEB DESIGN'}</span>
            <span style="color: #666; font-size: 0.9rem;">${postData.readTime || '5 min read'}</span>
            <span style="color: #666; font-size: 0.9rem;">·</span>
            <span style="color: #666; font-size: 0.9rem;">${publishDate}</span>
          </div>
          <h1 style="font-size: 2.8rem; color: #222; font-weight: 700; margin-bottom: 1.5rem; line-height: 1.2;">${postData.title}</h1>
          <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem; line-height: 1.6;">${postData.description || 'A comprehensive guide on ' + postData.title.toLowerCase()}</p>
          <img src="images/${postData.featuredImage || 'default-featured.jpg'}" alt="${postData.title}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 2rem;" />
        </header>

        <!-- Social Sharing -->
        <div style="display: flex; gap: 1rem; margin-bottom: 3rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px;">
          <span style="color: #666; font-weight: 600;">Share this article:</span>
          <a href="https://www.facebook.com/sharer/sharer.php?u=https://deepthinkstudio.com/${filename}" target="_blank" style="background: #1877f2; color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.9rem;">Facebook</a>
          <a href="https://twitter.com/intent/tweet?url=https://deepthinkstudio.com/${filename}&text=${postData.title}" target="_blank" style="background: #1da1f2; color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.9rem;">Twitter</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://deepthinkstudio.com/${filename}" target="_blank" style="background: #0077b5; color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.9rem;">LinkedIn</a>
        </div>

        <!-- Post Content -->
        <div style="color: #333; font-size: 1.1rem;">
          ${this.smartLinking.processHtmlContent(postData.content || 'Your blog post content will go here. Replace this placeholder with your actual article content.')}
          
          <h2 style="font-size: 1.8rem; color: #222; font-weight: 700; margin: 2rem 0 1rem 0;">Introduction</h2>
          
          <p style="margin-bottom: 1.5rem;">This is where your introduction paragraph will go. Start with a compelling hook that draws readers in.</p>
          
          <h2 style="font-size: 1.8rem; color: #222; font-weight: 700; margin: 2rem 0 1rem 0;">Main Content</h2>
          
          <p style="margin-bottom: 1.5rem;">Add your main content here. Break it up into sections with clear headings.</p>
          
          <h3 style="font-size: 1.4rem; color: #222; font-weight: 700; margin: 1.5rem 0 0.8rem 0;">Subsection</h3>
          
          <p style="margin-bottom: 1.5rem;">Add subsections as needed to organize your content effectively.</p>
          
          <h2 style="font-size: 1.8rem; color: #222; font-weight: 700; margin: 2rem 0 1rem 0;">Conclusion</h2>
          
          <p style="margin-bottom: 2rem;">Wrap up your article with a strong conclusion that reinforces your main points.</p>
        </div>
      </article>

      <!-- Author Bio -->
      <div style="background: #f8f9fa; padding: 2rem; border-radius: 12px; margin: 3rem 0;">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <img src="images/logo.png" alt="Deepthink Studio" style="width: 60px; height: 60px; border-radius: 50%;" />
          <div>
            <h3 style="margin: 0; color: #222; font-size: 1.2rem;">Deepthink Studio</h3>
            <p style="margin: 0; color: #666; font-size: 0.9rem;">Web Design & Development Agency</p>
          </div>
        </div>
        <p style="color: #333; line-height: 1.6; margin: 0;">Deepthink Studio is a creative web design agency specializing in custom websites, e-commerce, and SEO optimization for businesses and brands. We help entrepreneurs and businesses establish a strong online presence.</p>
      </div>

      <!-- Related Posts -->
      <section style="margin: 3rem 0;">
        <h3 style="font-size: 1.5rem; color: #222; margin-bottom: 1.5rem;">Related Articles</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
          <article style="background: #f8f9fa; border-radius: 12px; overflow: hidden;">
            <a href="how-to-start-freelance-web-design-2025.html" style="text-decoration: none; color: inherit;">
              <img src="images/Learn Basic Analysis Crypto Curency Youtube Thumbnail.png" alt="Freelance Web Design Guide" style="width: 100%; height: 150px; object-fit: cover;" />
              <div style="padding: 1rem;">
                <h4 style="margin: 0 0 0.5rem 0; color: #222; font-size: 1rem;">How to Start Freelance Web Design with No Experience (2025 Guide)</h4>
                <p style="margin: 0; color: #666; font-size: 0.9rem;">Learn how to start freelance web design with no experience. Complete guide covering learning basics, building portfolio, finding clients, and setting rates.</p>
              </div>
            </a>
          </article>
          <article style="background: #f8f9fa; border-radius: 12px; overflow: hidden;">
            <a href="best-free-ui-design-tools-2025.html" style="text-decoration: none; color: inherit;">
              <img src="images/pexels-divinetechygirl-1181359.jpg" alt="Free UI Design Tools" style="width: 100%; height: 150px; object-fit: cover;" />
              <div style="padding: 1rem;">
                <h4 style="margin: 0 0 0.5rem 0; color: #222; font-size: 1rem;">Best Free UI Design Tools for Beginners in 2025</h4>
                <p style="margin: 0; color: #666; font-size: 0.9rem;">Discover the 7 best free UI design tools for beginners in 2025. Tested and compared: Figma, Canva, Adobe XD, Penpot, and more.</p>
              </div>
            </a>
          </article>
        </div>
      </section>
    </div>
  </main>

  <footer class="footer-new">
    <div class="footer-main">
      <div class="footer-col footer-brand">
        <div class="footer-logo">
          <img src="images/logo.png" alt="Deepthink Studio Logo" class="logo-flip" style="height: 60px; width: 80px; object-fit: contain;" />
          <span class="footer-logo-text"><span>DEEPTHINK</span><br><span class="footer-logo-sub">STUDIO</span></span>
        </div>
        <div class="footer-desc">
Deepthink Studio was founded on the principle that a strong digital presence can elevate brands worldwide. We empower businesses to grow and thrive online through innovative web design and strategic digital solutions.
</div>
      </div>
      <div class="footer-col footer-links">
        <div class="footer-links-title">Quick Links</div>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="portfolio.html">Portfolio</a></li>
          <li><a href="packages.html">Packages</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="blog/index.html">Blog</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Use</a></li>
          <li><a href="#">Refund Policy</a></li>
        </ul>
      </div>
      <div class="footer-col footer-services">
        <div class="footer-links-title">Our Services</div>
        <ul>
          <li><a href="packages.html#logo-packages">Logo Design</a></li>
          <li><a href="packages.html#website-packages">Website Design</a></li>
          <li><a href="packages.html#ecommerce-packages">E-commerce</a></li>
          <li><a href="packages.html#webportal-packages">Web Portal</a></li>
          <li><a href="packages.html#mobile-packages">Mobile Application</a></li>
          <li><a href="packages.html#digital-packages">Digital Marketing</a></li>
          <li><a href="packages.html#seo-packages">SEO</a></li>
          <li><a href="packages.html#animation-packages">Video Animation</a></li>
        </ul>
      </div>
      <div class="footer-col footer-contact">
        <div class="footer-links-title">Contact Us</div>
        <div class="footer-contact-list">
          <div><svg width="16" height="16" fill="#222"><circle cx="8" cy="8" r="8" fill="#fff"/><text x="8" y="13" text-anchor="middle" font-size="10" font-family="Arial" fill="#222">&#9742;</text></svg> (385) 355-1138</div>
          <div><svg width="16" height="16" fill="#222"><circle cx="8" cy="8" r="8" fill="#fff"/><text x="8" y="13" text-anchor="middle" font-size="10" font-family="Arial" fill="#222">@</text></svg> <a href="mailto:info@deepthinkstudio.com" style="color:inherit;text-decoration:none;">info@deepthinkstudio.com</a></div>
          <div><svg width="16" height="16" fill="#222"><circle cx="8" cy="8" r="8" fill="#fff"/><text x="8" y="13" text-anchor="middle" font-size="10" font-family="Arial" fill="#222">&#8962;</text></svg> 620 S 7th St PMB 1943, Las Vegas, Nevada 89101, United States</div>
        </div>
      </div>
    </div>
    <div class="footer-divider"></div>
    <div class="footer-bottom">
      <div class="footer-copyright">© 2025 Deepthink Studio | All rights reserved.</div>
      <div class="footer-legal">All content, including logos, images, designs, and text, is the intellectual property of Deepthink Studio unless otherwise stated. Any third-party trademarks, logos, or brand names displayed on this website are the property of their respective owners and are used strictly for illustrative purposes. Portfolio examples and case studies shown on this website are based on real work completed by our team; however, some names, visuals, or details may be modified to honor client confidentiality agreements under our Non-Disclosure Agreements (NDAs). These samples are intended to demonstrate the quality and style of our work, and do not claim affiliation or endorsement unless explicitly stated.</div>
      <div class="footer-dba">Deepthink Studio is DBA of <b>DEEPTHINK ENTERPRISES LLC</b></div>
    </div>
  </footer>
  <script src="script.js"></script>
  <!--Start of Tawk.to Script-->
<script type="text/javascript">
  var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
  (function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/66ceb29eea492f34bc0ad56f/1i6bmjf7m';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
  })();
  </script>
  <!--End of Tawk.to Script-->
  <canvas id="tracer-canvas" style="position:fixed;top:0;left:0;pointer-events:none;z-index:9999;"></canvas>
</body>
</html>`;
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

  // Add internal links to existing posts
  addInternalLinksToExistingPosts() {
    this.posts.forEach(post => {
      const postPath = post.filename;
      let content = fs.readFileSync(postPath, 'utf8');
      
      // Clean up any existing corrupted links first
      content = this.smartLinking.cleanupCorruptedLinks(content);
      
      // Only add links to the main content area, not meta tags or other areas
      const contentMatch = content.match(/<div style="color: #333; font-size: 1\.1rem;">([\s\S]*?)<\/div>/);
      if (contentMatch) {
        let mainContent = contentMatch[1];
        
        // Use smart linking system for internal links
        mainContent = this.smartLinking.addInternalLinks(mainContent, 'paragraph');
        
        // Replace the content area with updated content
        content = content.replace(contentMatch[0], 
          `<div style="color: #333; font-size: 1.1rem;">${mainContent}</div>`);
      }
      
      fs.writeFileSync(postPath, content);
      console.log(`✅ Added internal links to ${post.filename}`);
    });
  }

  // Add affiliate links to existing posts
  addAffiliateLinksToExistingPosts() {
    this.posts.forEach(post => {
      const postPath = post.filename;
      let content = fs.readFileSync(postPath, 'utf8');
      
      // Only add links to the main content area, not meta tags or other areas
      const contentMatch = content.match(/<div style="color: #333; font-size: 1\.1rem;">([\s\S]*?)<\/div>/);
      if (contentMatch) {
        let mainContent = contentMatch[1];
        
        // Use smart linking system for affiliate links
        mainContent = this.smartLinking.addAffiliateLinks(mainContent, 'paragraph');
        
        // Replace the content area with updated content
        content = content.replace(contentMatch[0], 
          `<div style="color: #333; font-size: 1.1rem;">${mainContent}</div>`);
      }
      
      fs.writeFileSync(postPath, content);
      console.log(`✅ Added affiliate links to ${post.filename}`);
    });
  }

  // Clean up corrupted links in existing posts
  cleanupCorruptedLinks() {
    console.log('🧹 Cleaning up corrupted links in existing posts...');
    
    this.posts.forEach(post => {
      const postPath = post.filename;
      let content = fs.readFileSync(postPath, 'utf8');
      
      // Clean up corrupted links
      content = this.smartLinking.cleanupCorruptedLinks(content);
      
      fs.writeFileSync(postPath, content);
      console.log(`✅ Cleaned up ${post.filename}`);
    });
    
    console.log('✅ Cleanup completed for all existing posts');
  }

  // Update blog index with new post
  updateBlogIndex(postData, filename) {
    const blogIndexPath = './blog/index.html';
    if (!fs.existsSync(blogIndexPath)) {
      console.log('⚠️ Blog index not found, skipping update');
      return;
    }

    let blogIndex = fs.readFileSync(blogIndexPath, 'utf8');
    
    // Update featured post
    const featuredPostHTML = this.generateFeaturedPostHTML(postData, filename);
    blogIndex = blogIndex.replace(
      /<!-- Featured Post -->[\s\S]*?<!-- Blog Grid -->/,
      `<!-- Featured Post -->\n${featuredPostHTML}\n          <!-- Blog Grid -->`
    );
    
    // Update recent posts
    const recentPostHTML = this.generateRecentPostHTML(postData, filename);
    blogIndex = blogIndex.replace(
      /<h3 style="margin: 0 0 1rem 0; color: #222; font-size: 1.2rem;">Recent Posts<\/h3>\s*<div style="display: flex; flex-direction: column; gap: 1rem;">/,
      `<h3 style="margin: 0 0 1rem 0; color: #222; font-size: 1.2rem;">Recent Posts</h3>\n            <div style="display: flex; flex-direction: column; gap: 1rem;">\n              ${recentPostHTML}`
    );
    
    fs.writeFileSync(blogIndexPath, blogIndex);
  }

  // Generate featured post HTML
  generateFeaturedPostHTML(postData, filename) {
    return `          <article class="featured-blog-post" style="background: #e9ecef; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); margin-bottom: 3rem; overflow: hidden;">
            <img src="../images/${postData.featuredImage || 'default-featured.jpg'}" alt="${postData.title}" style="width: 100%; height: 300px; object-fit: cover;" />
            <div style="padding: 2rem;">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span style="background: #C6FF1A; color: #222; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">FEATURED</span>
                <span style="color: #666; font-size: 0.9rem;">${postData.readTime || '5 min read'}</span>
                <span style="color: #666; font-size: 0.9rem;">·</span>
                <span style="color: #666; font-size: 0.9rem;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h2 style="font-size: 2rem; color: #222; font-weight: 700; margin-bottom: 1rem; line-height: 1.2;">${postData.title}</h2>
              <p style="color: #444; font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.6;">${postData.description || 'A comprehensive guide on ' + postData.title.toLowerCase()}</p>
              <a href="../${filename}" style="color: #C6FF1A; font-weight: 700; text-decoration: none; font-size: 1.1rem;">Read Full Article →</a>
            </div>
          </article>`;
  }

  // Generate recent post HTML
  generateRecentPostHTML(postData, filename) {
    return `<article style="display: flex; gap: 0.8rem;">
                <a href="../${filename}" style="text-decoration: none; color: inherit; display: flex; gap: 0.8rem;">
                  <img src="../images/${postData.featuredImage || 'default-featured.jpg'}" alt="${postData.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />
                  <div>
                    <h4 style="margin: 0 0 0.3rem 0; font-size: 0.9rem; color: #222;">${postData.title}</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: #666;">${postData.readTime || '5 min read'}</p>
                  </div>
                </a>
              </article>`;
  }

  // Fetch image from Pixabay
  async fetchPixabayImage(searchTerm) {
    return new Promise((resolve, reject) => {
      // Use a simpler URL that works without API key for basic usage
      const url = `${CONFIG.imageSources.pixabay}?q=${encodeURIComponent(searchTerm)}&image_type=photo&per_page=3`;
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.hits && result.hits.length > 0) {
              const image = result.hits[0];
              resolve({
                url: image.webformatURL,
                alt: image.tags,
                photographer: image.user,
                source: 'Pixabay'
              });
            } else {
              resolve(null);
            }
          } catch (error) {
            console.log('Pixabay API error:', error.message);
            resolve(null);
          }
        });
      }).on('error', (error) => {
        console.log('Pixabay network error:', error.message);
        resolve(null);
      });
    });
  }

  // Fetch image from Pexels
  async fetchPexelsImage(searchTerm) {
    return new Promise((resolve, reject) => {
      const url = `${CONFIG.imageSources.pexels}?query=${encodeURIComponent(searchTerm)}&orientation=landscape&size=large&per_page=3`;
      
      const options = {
        headers: {
          'Authorization': CONFIG.pexelsApiKey
        }
      };
      
      https.get(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.photos && result.photos.length > 0) {
              const image = result.photos[0];
              resolve({
                url: image.src.large,
                alt: image.alt,
                photographer: image.photographer,
                source: 'Pexels'
              });
            } else {
              resolve(null);
            }
          } catch (error) {
            resolve(null);
          }
        });
      }).on('error', () => resolve(null));
    });
  }

  // Get relevant image for blog post
  async getRelevantImage(postTitle, category) {
    console.log('🖼️ Finding relevant image for:', postTitle);
    
    // Use the simple image library
    const imagePath = imageLibrary.getRelevantImage(postTitle, category);
    
    if (imagePath && fs.existsSync(imagePath)) {
      // Copy the image to a new filename for this post
      const newImagePath = imageLibrary.copyImageForPost(imagePath, postTitle);
      return {
        url: newImagePath,
        alt: postTitle,
        photographer: 'Deepthink Studio',
        source: 'Local Library'
      };
    }
    
    // Fallback to default image
    return {
      url: 'images/pexels-divinetechygirl-1181359.jpg',
      alt: 'Default featured image',
      photographer: 'Deepthink Studio',
      source: 'Local Library'
    };
  }

  // Download and save image
  async downloadImage(imageUrl, filename) {
    return new Promise((resolve, reject) => {
      const imagePath = `./images/${filename}`;
      
      // Create images directory if it doesn't exist
      if (!fs.existsSync('./images')) {
        fs.mkdirSync('./images');
      }
      
      const file = fs.createWriteStream(imagePath);
      const protocol = imageUrl.startsWith('https') ? https : http;
      
      protocol.get(imageUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(imagePath);
        });
      }).on('error', (err) => {
        fs.unlink(imagePath, () => {}); // Delete the file if download fails
        reject(err);
      });
    });
  }
}

// CLI Interface
const automation = new SimpleBlogAutomation();

// Command line interface
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'create':
    if (args.length < 1) {
      console.log('Usage: node simple-blog-automation.js create "Post Title"');
      process.exit(1);
    }
    
    const postData = {
      title: args[0],
      description: args[1] || 'A comprehensive guide on ' + args[0].toLowerCase(),
      keywords: args[2] || 'web design, development, tips',
      category: args[3] || 'WEB DESIGN',
      readTime: args[4] || '5 min read',
      featuredImage: args[5] || 'default-featured.jpg',
      content: args[6] || 'Your blog post content here...'
    };
    
    (async () => {
      try {
        await automation.generateBlogPost(postData);
      } catch (error) {
        console.error('❌ Error creating blog post:', error.message);
      }
    })();
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
    break;
    
  case 'cleanup':
    automation.cleanupCorruptedLinks();
    break;
    
  default:
    console.log(`
Simple Blog Automation System

Usage:
  node simple-blog-automation.js create "Post Title" [description] [keywords] [category] [readTime] [image] [content]
  node simple-blog-automation.js add-links
  node simple-blog-automation.js add-affiliate
  node simple-blog-automation.js update-all
  node simple-blog-automation.js cleanup

Examples:
  node simple-blog-automation.js create "10 Best WordPress Themes for 2025"
  node simple-blog-automation.js update-all
  node simple-blog-automation.js cleanup
    `);
}

module.exports = SimpleBlogAutomation; 