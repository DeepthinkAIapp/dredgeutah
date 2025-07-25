@echo off
echo ========================================
echo    Deepthink Studio Blog Automation
echo ========================================
echo.

if "%~1"=="" (
    echo Usage: create-blog-post.bat "Post Title"
    echo.
    echo Example: create-blog-post.bat "10 Best WordPress Themes for 2025"
    echo.
    echo Features:
    echo - Creates SEO-optimized blog post
    echo - Automatically fetches relevant images from Pixabay/Pexels
    echo - Downloads and saves images to images/ folder
    echo - Updates blog index with new post
    echo - Adds internal and affiliate links
    echo.
    pause
    exit /b 1
)

REM Concatenate all arguments into TITLE
set "TITLE=%~1"
shift
:loop
if "%~1"=="" goto aftertitle
set "TITLE=%TITLE% %~1"
shift
goto loop
:aftertitle

echo Creating blog post: %TITLE%
echo.
echo This will:
echo - Create the blog post HTML
echo - Fetch a relevant image from Pixabay/Pexels
echo - Download and save the image
echo - Update the blog index
echo.

node simple-blog-automation.js create "%TITLE%"

echo.
echo Blog post created successfully!
echo.
echo Next steps:
echo 1. Edit the content in the generated HTML file
echo 2. Replace the auto-fetched image if needed
echo 3. Upload to your web server
echo.
pause 