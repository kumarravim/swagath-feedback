# 🍛 Swagath Customer Feedback Application - Deployment Guide

## Overview
This is a fully-featured customer feedback web application for Swagath Indian Grocery in Redmond, WA. It includes:
- **Customer Feedback Form** - Submit product feedback with photos
- **Admin Dashboard** - Review feedback with date filtering
- **QR Code Generation** - Encourage in-store scanning
- **Email Notifications** - Get alerts for new feedback
- **Mobile-Responsive Design** - Works perfectly on all devices

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v14+) - for running a local server
- **Git** - for version control
- **Azure CLI** - for deployment
- **Azure Subscription** - personal subscription as mentioned
- **GitHub Account** - for repository management
- **Visual Studio Code** - for development

### Installation Commands
```bash
# Check Node.js
node --version

# Check Git
git --version

# Install Azure CLI (if not installed)
# Windows: https://aka.ms/installazurecliwindows
# Or via package manager:
# brew install azure-cli (macOS)
# apt-get install azure-cli (Linux)
```

## 🚀 Local Testing Setup

### Step 1: Install Node.js Local Server
```bash
# Navigate to the root project directory
cd c:\MyVisualStudio\Swagath\FB365

# Install http-server globally (simple development server)
npm install -g http-server
```

### Step 2: Run Locally
```bash
# Navigate to the static files directory
cd wwwroot_static

# Start the development server
http-server -p 8080 -c-1

# Access the application at: http://localhost:8080
```

### Step 3: Test Features

#### Customer Feedback Submission
1. Open http://localhost:8080 in your browser
2. Click on "Feedback" tab
3. Fill out the form:
   - Select a category (e.g., "Fruits & Vegetables")
   - Select a subcategory
   - Enter product name
   - Write feedback (up to 500 characters)
   - Optionally add photos (up to 5)
4. Click "Submit Feedback"
5. Verify success message appears
6. Data is stored in browser's localStorage

#### Admin Features
1. Access the "Admin" tab
2. Login with credentials:
   - **Username**: `supreme`
   - **Password**: `lakshmi`
3. After successful login, you'll see:
   - **Dashboard Tab**: View all feedback with filters
   - **QR Code Tab**: Generate and download QR code
   - **Settings Tab**: Configure email notifications

#### Date Filtering
1. In Dashboard, use date range filters
2. Click "Apply Filter" to see filtered results
3. Click "Clear Filter" to reset

#### QR Code
1. In QR Code tab, see generated code
2. Click "Download QR Code" to save PNG
3. Click "Copy URL" to copy feedback form link

#### Settings
1. Toggle "Email Notifications"
2. Enter your email address
3. Click "Save Settings"
4. *(Email integration requires backend setup - see below)*

### Step 4: Verify Data Persistence
- Feedback is stored in browser's localStorage
- Admin login persists for 30 minutes
- Try refreshing page - data remains
- Open DevTools (F12) → Application → Local Storage to review stored data

## 🔧 Local Storage Structure

The application uses localStorage with these keys:
```javascript
'swagath_feedback'        // All feedback submissions (array)
'swagath_admin_login'     // Login status flag
'swagath_admin_login_time' // Login timestamp for session management
'swagath_email_settings'  // Email notification settings
```

## 🐙 GitHub Repository Setup

### Step 1: Initialize Git Repository
```bash
cd c:\MyVisualStudio\Swagath\FB365

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Swagath feedback app"
```

### Step 2: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Create repository named `swagath-feedback` (or your preferred name)
3. **Don't** initialize with README (we already have files)
4. Click "Create repository"

### Step 3: Connect Local to GitHub
```bash
# Add remote (replace YOUR_USERNAME and repo name)
git remote add origin https://github.com/YOUR_USERNAME/swagath-feedback.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Create .gitignore
Create a `.gitignore` file in the root directory:
```
# Node modules
node_modules/
package-lock.json

# IDE
.vscode/
*.code-workspace

# Local development
local.settings.json
bin/
obj/

# Azure
.funcignore
.env
.env.local

# OS
.DS_Store
Thumbs.db
```

## ☁️ Azure Static Web App Deployment

### Step 1: Create Azure Static Web App via Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web App"
4. Click "Create"

**Fill in the form:**
```
- Resource Group: Create new (or choose existing)
- Name: swagath-feedback (or your preferred name)
- Plan Type: Free
- Region: East US (or closest to you)
- Deployment Details: GitHub (connect your account)
- Organization: Select your GitHub organization
- Repository: swagath-feedback (select your repo)
- Branch: main
- Build Presets: Other (custom setup)
- Location: wwwroot_static
- API Location: api
- Output Location: (leave empty)
```

5. Click "Review + create"
6. Click "Create"

### Step 2: GitHub Actions Workflow

Azure will automatically create a GitHub Actions workflow. A `.github/workflows/` directory will be created in your repo with an auto-generated workflow file. Review and merge any pull requests Azure creates.

### Step 3: Verify Deployment

Once the workflow completes (check Actions tab in GitHub):
1. Go to Static Web App resource in Azure Portal
2. Click "Overview"
3. Copy the **URL** (e.g., `https://generous-tree-xyz.azurestaticapps.net`)
4. Open URL in browser to test

Your app is now live! 🎉

## 📧 Email Notifications Setup (Optional)

For email functionality, you'll need to set up an Azure Function backend:

### Option A: Using Azure Communication Services

1. Create Azure Communication Services resource
2. In the SendNotification.cs function, add SendGrid/ACS integration
3. Update `local.settings.json` with API keys
4. The email feature will work with backend

### Option B: Simple Mailto Links

The current implementation uses localStorage and client-side rendering. For true backend email:

1. Sign up for [SendGrid](https://sendgrid.com) (free tier available)
2. Get API key from SendGrid dashboard
3. Update `api/SendNotification.cs` to use SendGrid
4. Deploy Azure Function alongside Static Web App

**For now**, users can see settings to configure email, and the notification is logged to console.

## 📱 Testing Across Devices

### Desktop Testing
```bash
# Run locally and test in different browsers
http-server -p 8080
# Open http://localhost:8080 in Chrome, Edge, Firefox
```

### Mobile Testing
```bash
# Find your local IP address
ipconfig (Windows)
ifconfig (macOS/Linux)

# Open on mobile (same network):
http://YOUR_LOCAL_IP:8080
```

### Responsive Design Testing
- Open DevTools (F12)
- Click device toolbar icon
- Test on different device sizes
- Check all features work on mobile

## 🔍 Troubleshooting

### Issue: "Cannot connect to http://localhost:8080"
```bash
# Make sure http-server is running
# Check if port 8080 is already in use
netstat -ano | findstr :8080

# Use different port if needed
http-server -p 3000
```

### Issue: Admin login not working
- Verify correct credentials: `supreme` / `lakshmi`
- Check browser console for errors (F12)
- Clear localStorage and try again

### Issue: Photos not uploading
- Check browser console for errors
- Ensure file is actually an image
- Verify file size (use smaller test images)
- Check localStorage size hasn't exceeded limit

### Issue: Azure deployment failed
```bash
# Check workflow logs in GitHub Actions
# Common issues:
# - Build preset wrong (should be "Other")
# - Path to static files incorrect (should be "wwwroot_static")
# - Missing staticwebapp.config.json

# Fix and push again:
git add .
git commit -m "Fix deployment configuration"
git push
```

### Issue: QR Code not displaying
- QR Code library requires internet connection
- Check CDN loading: Open DevTools (F12) → Network tab
- Verify qrcode.js library loaded successfully

## 📊 Project Structure

```
FB365/
├── wwwroot_static/                 # Static web app files
│   ├── index.html                  # Main application
│   ├── styles.css                  # Styling with Indian color palette
│   ├── app.js                       # Application logic
│   └── staticwebapp.config.json     # Azure Static Web App config
├── api/                            # Azure Functions backend
│   ├── SendNotification.cs          # Email notification function
│   └── local.settings.json          # Local development settings
├── .github/workflows/               # GitHub Actions CI/CD
├── README.md                        # This file
├── .gitignore                       # Git ignore rules
└── PRD.md                          # Product requirements
```

## 🎨 Design Features

The application includes:

### Color Palette (Indian Heritage)
- **Primary**: Deep Saffron `oklch(0.58 0.15 55)` - Action buttons, headers
- **Accent**: Vibrant Masala Red `oklch(0.55 0.20 25)` - Important actions
- **Success**: Cardamom Green `oklch(0.45 0.08 145)` - Positive feedback
- **Secondary**: Turmeric Gold `oklch(0.75 0.12 85)` - Highlights

### Typography
- **Headers**: Quicksand (SemiBold) - Friendly, approachable
- **Body**: Inter (Regular) - Clean, highly legible

### Accessibility
- Proper contrast ratios (WCAG AA compliant)
- Touch-optimized buttons (min 44px)
- Keyboard navigation support
- Screen reader friendly

## 🔐 Security Notes

### Authentication
- Admin credentials stored in `app.js` (for development)
- Production: Implement Azure AD B2C or similar
- Session timeout: 30 minutes
- Clear credentials from client code before production

### Data Storage
- Feedback stored in browser localStorage
- Production: Use Azure CosmosDB or SQL Database
- Photos as base64 (limit per browser: ~5-10MB localStorage)
- Production: Use Azure Blob Storage for images

### CORS & API Security
- Static Web App automatically handles CORS with backend
- Implement authentication tokens for API endpoints
- Validate all inputs on backend

## 📈 Next Steps

### Immediate (Next Week)
- [ ] Test all features locally
- [ ] Deploy to Azure Static Web App
- [ ] Generate QR code and print for store
- [ ] Share feedback form link with customers

### Short Term (Next Month)
- [ ] Set up email notifications with SendGrid
- [ ] Implement Azure CosmosDB for persistent storage
- [ ] Add customer name/phone fields
- [ ] Create backend API for admin features

### Long Term (Next Quarter)
- [ ] Add photo verification for quality control
- [ ] Create analytics dashboard
- [ ] Implement category-specific feedback templates
- [ ] Add email reports to store owner

## 📞 Support & Resources

- **Azure Static Web Apps Docs**: https://docs.microsoft.com/azure/static-web-apps/
- **GitHub Pages Help**: https://docs.github.com/pages
- **Azure CLI Commands**: https://docs.microsoft.com/cli/azure/
- **This App Issues**: Check GitHub Issues tab in repository

## 📝 License

This application is created for Swagath Indian Grocery, Redmond WA. All rights reserved.

---

**Last Updated**: March 2026  
**Version**: 1.0  
**Author**: Development Team
