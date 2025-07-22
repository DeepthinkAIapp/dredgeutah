# Deepthink Studio Website

This is the source code for the Deepthink Studio website.

## Local Development

Open `index.html` in your browser, or use a local server (e.g. `npx serve .` or VSCode Live Server) to preview the site.

## Deployment (Vercel)

1. Push all files to your GitHub repository: https://github.com/DeepthinkAIapp/deepthinkstudio.git
2. Connect your repository to Vercel (https://vercel.com/)
3. Vercel will automatically detect the static site and deploy it.
4. All HTML, CSS, JS, and images are served from the root directory.

### Project Structure
- `index.html`, `about.html`, `packages.html`, `contact.html`: Main pages
- `styles.css`, `script.js`: Global styles and scripts
- `images/`: All image assets
- `vercel.json`: Vercel configuration

No build step is required. All files are static. 