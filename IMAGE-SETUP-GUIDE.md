# 🖼️ Image Setup Guide for Blog Automation

## Overview
The blog automation system now automatically fetches relevant images from Pixabay and Pexels for each blog post. This ensures every post has a professional featured image that you can replace later.

## 🔑 API Key Setup

### Option 1: Pixabay (Recommended - Free, No Registration Required)
Pixabay offers free API access with generous limits:

1. **Get API Key:**
   - Go to [Pixabay API](https://pixabay.com/api/docs/)
   - Click "Get API Key"
   - Sign up for a free account
   - Copy your API key

2. **Update Configuration:**
   - Open `simple-blog-automation.js`
   - Find the `pixabayApiKey` line
   - Replace the placeholder with your actual key:
   ```javascript
   pixabayApiKey: 'your-actual-pixabay-api-key-here'
   ```

### Option 2: Pexels (Alternative - Free, Registration Required)
Pexels also offers free API access:

1. **Get API Key:**
   - Go to [Pexels API](https://www.pexels.com/api/)
   - Sign up for a free account
   - Copy your API key

2. **Update Configuration:**
   - Open `simple-blog-automation.js`
   - Find the `pexelsApiKey` line
   - Replace the placeholder with your actual key:
   ```javascript
   pexelsApiKey: 'your-actual-pexels-api-key-here'
   ```

## 🚀 How It Works

### Automatic Image Selection
The system automatically:
1. **Analyzes your post title** and category
2. **Searches for relevant images** using keywords
3. **Downloads high-quality images** (1200x630 minimum)
4. **Saves them to your `images/` folder**
5. **Updates your blog post** with the image

### Search Strategy
The system searches for images using these terms (in order):
1. Your exact post title
2. Your post category
3. "web design"
4. "digital design"
5. "technology"
6. "business"

### Image Quality
- **Minimum size:** 1200x630 pixels
- **Orientation:** Horizontal/landscape
- **Type:** High-quality photos
- **Safe search:** Enabled

## 📁 File Structure
```
your-blog/
├── images/
│   ├── your-post-title-2025-featured.jpg
│   ├── another-post-2025-featured.jpg
│   └── default-featured.jpg
├── your-post-title-2025.html
├── another-post-2025.html
└── simple-blog-automation.js
```

## 🎯 Usage Examples

### Create a New Post with Auto-Image
```bash
create-blog-post.bat "10 Best WordPress Themes for 2025"
```

**What happens:**
1. ✅ Creates the blog post HTML
2. 🖼️ Searches for "WordPress themes" images
3. 📥 Downloads the best matching image
4. 💾 Saves as `10-best-wordpress-themes-for-2025-2025-featured.jpg`
5. 🔗 Updates the blog post with the image
6. 📝 Updates the blog index

### Manual Image Replacement
After the post is created:
1. **Find your image** in the `images/` folder
2. **Replace it** with your custom image
3. **Keep the same filename** or update the HTML
4. **Upload to your server**

## ⚙️ Configuration Options

### Customize Search Terms
Edit the `getRelevantImage` method in `simple-blog-automation.js`:

```javascript
const searchTerms = [
  postTitle.toLowerCase(),
  category.toLowerCase(),
  'web design',           // Add your custom terms
  'digital design',       // Add your custom terms
  'technology',           // Add your custom terms
  'business'              // Add your custom terms
];
```

### Change Image Size Requirements
Edit the API URLs in the fetch methods:

```javascript
// For Pixabay
const url = `${CONFIG.imageSources.pixabay}?key=${CONFIG.pixabayApiKey}&q=${encodeURIComponent(searchTerm)}&image_type=photo&orientation=horizontal&min_width=1200&min_height=630&safesearch=true&per_page=3`;

// For Pexels
const url = `${CONFIG.imageSources.pexels}?query=${encodeURIComponent(searchTerm)}&orientation=landscape&size=large&per_page=3`;
```

## 🔧 Troubleshooting

### No Images Found
- **Check API keys** are correctly set
- **Verify internet connection**
- **Try different search terms**
- **Check API rate limits**

### Image Download Fails
- **Check folder permissions** for `images/` directory
- **Verify image URL** is accessible
- **Check disk space**
- **Try manual download**

### Poor Image Quality
- **Adjust minimum size** requirements
- **Add more specific search terms**
- **Use different image sources**
- **Manually replace with better images**

## 💡 Pro Tips

1. **Start with Pixabay** - It's free and doesn't require registration for basic usage
2. **Use specific titles** - "WordPress Themes" gets better results than "Web Design"
3. **Replace images later** - The automation gives you a starting point
4. **Keep backups** - Original images are saved in your `images/` folder
5. **Customize search terms** - Add industry-specific keywords for better matches

## 📞 Support

If you need help:
1. Check the console output for error messages
2. Verify your API keys are correct
3. Test with a simple post title first
4. Check the troubleshooting section above

---

**Happy blogging! 🚀** 