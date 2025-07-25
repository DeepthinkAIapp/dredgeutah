// Smart Linking System for Blog Automation
// Prevents over-linking and ensures SEO-friendly link placement

class SmartLinkingSystem {
  constructor() {
    // Areas where links should NEVER be placed
    this.noLinkZones = [
      'title',
      'meta',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'alt',
      'breadcrumb',
      'social-share'
    ];
    
    // Maximum links per paragraph to avoid spam
    this.maxLinksPerParagraph = 1;
    
    // Maximum links per article
    this.maxLinksPerArticle = 5;
    
    // Track used keywords to avoid repetition
    this.usedKeywords = new Set();
    
    // Internal linking keywords with their target URLs
    this.internalLinkKeywords = {
      'freelance web design': 'how-to-start-freelance-web-design-2025.html',
      'UI design tools': 'best-free-ui-design-tools-2025.html',
      'web design tools': 'best-free-ui-design-tools-2025.html',
      'design tools': 'best-free-ui-design-tools-2025.html',
      'freelance': 'how-to-start-freelance-web-design-2025.html',
      'web design career': 'how-to-start-freelance-web-design-2025.html'
    };
    
    // Affiliate keywords with their URLs
    this.affiliateKeywords = {
      'wordpress': 'https://automattic.pxf.io/XYBQ1G',
      'web design': 'https://automattic.pxf.io/XYBQ1G'
    };
  }

  // Check if content is in a no-link zone
  isInNoLinkZone(content, context) {
    const lowerContent = content.toLowerCase();
    const lowerContext = context.toLowerCase();
    
    // Check for HTML tags that shouldn't contain links
    for (const zone of this.noLinkZones) {
      if (lowerContext.includes(zone) || lowerContent.includes(`<${zone}`)) {
        return true;
      }
    }
    
    // Check for specific contexts
    if (lowerContext.includes('title') || lowerContext.includes('meta') || 
        lowerContext.includes('breadcrumb') || lowerContext.includes('social')) {
      return true;
    }
    
    return false;
  }

  // Add internal links intelligently
  addInternalLinks(content, context = '') {
    // Reset used keywords for new content
    this.usedKeywords.clear();
    
    // Don't add links in no-link zones
    if (this.isInNoLinkZone(content, context)) {
      return content;
    }
    
    let linkCount = 0;
    let modifiedContent = content;
    
    // Sort keywords by length (longest first) to avoid partial matches
    const sortedKeywords = Object.keys(this.internalLinkKeywords)
      .sort((a, b) => b.length - a.length);
    
    for (const keyword of sortedKeywords) {
      // Skip if we've already used this keyword
      if (this.usedKeywords.has(keyword)) {
        continue;
      }
      
      // Skip if we've reached the limit
      if (linkCount >= this.maxLinksPerParagraph) {
        break;
      }
      
      // Create regex to match the keyword (case insensitive, word boundaries)
      const regex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'gi');
      
      // Check if keyword exists in content
      if (regex.test(modifiedContent)) {
        const targetUrl = this.internalLinkKeywords[keyword];
        const linkHtml = `<a href="${targetUrl}" style="color: #C6FF1A; text-decoration: underline;">${keyword}</a>`;
        
        // Replace only the first occurrence
        modifiedContent = modifiedContent.replace(regex, linkHtml);
        
        this.usedKeywords.add(keyword);
        linkCount++;
      }
    }
    
    return modifiedContent;
  }

  // Add affiliate links intelligently
  addAffiliateLinks(content, context = '') {
    // Don't add links in no-link zones
    if (this.isInNoLinkZone(content, context)) {
      return content;
    }
    
    let linkCount = 0;
    let modifiedContent = content;
    
    // Sort keywords by length (longest first)
    const sortedKeywords = Object.keys(this.affiliateKeywords)
      .sort((a, b) => b.length - a.length);
    
    for (const keyword of sortedKeywords) {
      // Skip if we've already used this keyword
      if (this.usedKeywords.has(keyword)) {
        continue;
      }
      
      // Skip if we've reached the limit
      if (linkCount >= this.maxLinksPerParagraph) {
        break;
      }
      
      // Create regex to match the keyword (case insensitive, word boundaries)
      const regex = new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'gi');
      
      // Check if keyword exists in content
      if (regex.test(modifiedContent)) {
        const targetUrl = this.affiliateKeywords[keyword];
        const linkHtml = `<a href="${targetUrl}" target="_blank" rel="nofollow" style="color: #C6FF1A; text-decoration: underline;">${keyword}</a>`;
        
        // Replace only the first occurrence
        modifiedContent = modifiedContent.replace(regex, linkHtml);
        
        this.usedKeywords.add(keyword);
        linkCount++;
      }
    }
    
    return modifiedContent;
  }

  // Process entire HTML content intelligently
  processHtmlContent(htmlContent) {
    // Reset used keywords for new content
    this.usedKeywords.clear();
    
    let linkCount = 0;
    let modifiedContent = htmlContent;
    
    // Process content in <p> tags only (main content areas)
    modifiedContent = modifiedContent.replace(
      /<p[^>]*>(.*?)<\/p>/gs,
      (match, content) => {
        // Skip if we've reached the article limit
        if (linkCount >= this.maxLinksPerArticle) {
          return match;
        }
        
        let processedContent = content;
        
        // Add internal links first
        processedContent = this.addInternalLinks(processedContent, 'paragraph');
        
        // Add affiliate links if we haven't reached the limit
        if (linkCount < this.maxLinksPerArticle) {
          processedContent = this.addAffiliateLinks(processedContent, 'paragraph');
        }
        
        // Count new links added
        const newLinks = (processedContent.match(/<a[^>]*>/g) || []).length;
        const originalLinks = (content.match(/<a[^>]*>/g) || []).length;
        linkCount += (newLinks - originalLinks);
        
        return `<p>${processedContent}</p>`;
      }
    );
    
    return modifiedContent;
  }

  // Escape regex special characters
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Clean up any existing corrupted links
  cleanupCorruptedLinks(content) {
    // Remove nested links (links within links)
    let cleaned = content.replace(/<a[^>]*>.*?<a[^>]*>.*?<\/a>.*?<\/a>/g, (match) => {
      // Keep only the outer link
      return match.replace(/<a[^>]*>(.*?)<a[^>]*>(.*?)<\/a>(.*?)<\/a>/g, '<a href="#" style="color: #C6FF1A; text-decoration: underline;">$1$2$3</a>');
    });
    
    // Remove links from titles and meta tags
    cleaned = cleaned.replace(
      /(<title>.*?)(<a[^>]*>.*?<\/a>)(.*?<\/title>)/gi,
      '$1$3'
    );
    
    cleaned = cleaned.replace(
      /(<meta[^>]*content="[^"]*)(<a[^>]*>.*?<\/a>)([^"]*"[^>]*>)/gi,
      '$1$3'
    );
    
    // Remove links from headings
    cleaned = cleaned.replace(
      /(<h[1-6][^>]*>.*?)(<a[^>]*>.*?<\/a>)(.*?<\/h[1-6]>)/gi,
      '$1$3'
    );
    
    // Remove links from alt attributes
    cleaned = cleaned.replace(
      /(alt="[^"]*)(<a[^>]*>.*?<\/a>)([^"]*")/gi,
      '$1$3'
    );
    
    return cleaned;
  }
}

module.exports = SmartLinkingSystem; 