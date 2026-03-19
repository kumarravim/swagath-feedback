# 🚀 QUICK START GUIDE

## Your Swagath Customer Feedback App is Ready!

This guide will have you up and running in **5 minutes**.

---

## ⏱️ Step 1: Quick Local Setup (2 minutes)

### Windows (PowerShell)
```powershell
cd c:\MyVisualStudio\Swagath\FB365
.\setup.ps1
```

### macOS/Linux (Bash)
```bash
cd ~/path/to/FB365
chmod +x setup.sh
./setup.sh
```

The setup script will:
- ✅ Check Node.js installation
- ✅ Install `http-server` (simple dev server)
- ✅ Show you next steps

---

## 🌐 Step 2: Start Local Server (< 1 minute)

```bash
cd wwwroot_static
http-server -p 8080
```

You should see:
```
Starting up http-server, serving ./
http-server version: v14.1.1

http://127.0.0.1:8080 is being served
```

**Open your browser** to: `http://localhost:8080`

---

## ✅ Step 3: Test Features (2-3 minutes)

### Test Customer Feedback Form
1. **Fill out the form:**
   - Category: "Fruits & Vegetables"
   - Subcategory: "Fresh Fruits"
   - Product: "Apples"
   - Comment: "Great quality!"
   - Photos: (optional, can add up to 5)

2. **Click "Submit Feedback"**
3. See success animation ✨
4. Click "Submit Another Feedback" to test again

### Test Admin Dashboard
1. **Click the "Admin" tab** (top navigation)
2. **Login with:**
   - Username: `supreme`
   - Password: `lakshmi`
   
3. **You'll see 3 new admin tabs:**
   - 📊 Dashboard (feedback submissions)
   - 🎯 QR Code (for in-store display)
   - ⚙️ Settings (email notifications)

4. **Test Dashboard:**
   - See all your feedback
   - Try date filtering
   - Click photos to enlarge

5. **Test QR Code:**
   - Download as PNG
   - Copy feedback URL

6. **Click "Logout"** when done

---

## 📊 Step 4: Check Data Storage

Press `F12` to open Developer Tools:
1. Go to **Application** tab
2. Click **Local Storage**
3. Click `http://localhost:8080`
4. See your stored feedback! 📝

Data persists until you manually clear it.

---

## 🐙 Step 5: Setup GitHub (5 minutes)

### Initialize Git
```bash
cd c:\MyVisualStudio\Swagath\FB365
git init
git add .
git commit -m "Initial commit: Swagath feedback app"
```

### Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name: `swagath-feedback`
3. **Don't** initialize with README
4. Click **Create repository**

### Connect & Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/swagath-feedback.git
git branch -M main
git push -u origin main
```

**Your app is now in GitHub!** ✨

---

## ☁️ Step 6: Deploy to Azure (10 minutes)

### Create Azure Static Web App

1. **Go to [Azure Portal](https://portal.azure.com)**

2. **Click "Create a resource"**

3. **Search & choose "Static Web App"**

4. **Fill in the form:**
   ```
   Resource Group: Create New
   Name: swagath-feedback
   Plan Type: Free
   Region: East US
   Deployment Details: GitHub
   ```

5. **Authenticate GitHub**
   - Click "Sign in with GitHub"
   - Authorize Azure

6. **Select your repo:**
   ```
   Organization: Your username
   Repository: swagath-feedback
   Branch: main
   ```

7. **Build details:**
   ```
   Build Presets: Other
   App Location: wwwroot_static
   API Location: api
   Output Location: (leave empty)
   ```

8. **Click "Review + Create" → "Create"**

9. **Wait for deployment** (2-5 minutes)

10. **Go to your resource, copy the URL:**
    ```
    https://generous-tree-xyz.azurestaticapps.net
    ```

11. **Open that URL** - Your app is LIVE! 🎉

---

## 🎯 What You Now Have

✅ **Complete Application** with all features  
✅ **Mobile-Responsive Design** for all devices  
✅ **Admin Dashboard** for feedback review  
✅ **QR Code Generator** for in-store use  
✅ **Deployed to Azure** globally accessible  
✅ **GitHub Repository** for version control  
✅ **CI/CD Pipeline** (automatic redeploy on push)  

---

## 📋 Admin Credentials

These are used for testing. **Change before production:**
- **Username**: `supreme`
- **Password**: `lakshmi`

In `wwwroot_static/app.js`, find:
```javascript
const CONFIG = {
    ADMIN_USERNAME: 'supreme',
    ADMIN_PASSWORD: 'lakshmi',
    // ...
};
```

---

## 🔗 Your URLs

### Local Development
```
http://localhost:8080
```

### Azure Live (after deployment)
```
https://YOUR-APP-NAME.azurestaticapps.net
```

### GitHub Repository
```
https://github.com/YOUR_USERNAME/swagath-feedback
```

---

## 📸 Screenshots Checklist

Share these with your store team:

- [ ] Customer feedback form (mobile view)
- [ ] Submitted feedback success screen
- [ ] Admin dashboard with feedback list
- [ ] QR code image (for printing)
- [ ] Feedback form on mobile device

---

## 🐛 Troubleshooting

### "http-server command not found"
```bash
npm install -g http-server
```

### Admin login not working
- Username: `supreme` (exactly)
- Password: `lakshmi` (exactly)
- Check browser console: F12 → Console tab

### Photos not uploading locally
- Photos are converted to base64
- Limit is ~5-10MB localStorage
- Try with smaller test images

### Azure deployment stuck
- Check GitHub Actions: Your repo → Actions tab
- Review workflow logs for errors
- Common fix: Ensure `wwwroot_static` is correct path

### QR code not displaying
- Requires internet (uses CDN)
- Open DevTools: F12 → Network tab
- Check qrcode.js loaded

---

## 📚 Full Documentation

For detailed instructions:
- **Setup & Deployment**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Project Details**: [README.md](README.md)
- **Requirements**: [PRD.md](PRD.md)

---

## 🎓 What's Next?

### Today
- [x] Test locally
- [ ] Deploy to Azure
- [ ] Share live link

### This Week
- [ ] Print QR codes
- [ ] Deploy in-store
- [ ] Collect first feedback

### Next Month
- [ ] Review feedback trends
- [ ] Iterate on design
- [ ] Set up email notifications
- [ ] Add more features

---

## 📞 Need Help?

### Quick Issues
1. Check Troubleshooting section above
2. Clean browser cache (Ctrl+Shift+Delete)
3. Restart local server

### Technical Questions
1. Review DEPLOYMENT_GUIDE.md
2. Check code comments in app.js
3. Use Azure Portal debugging

### Store-Related Questions
Email: `contact@swagathhomefoods.com`

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Local page loads at `http://localhost:8080`  
✅ Feedback form submits successfully  
✅ Admin login works with `supreme` / `lakshmi`  
✅ Data appears in browser's localStorage  
✅ Azure deployment shows "Ready" status  
✅ Live URL works in browser  
✅ Mobile view is responsive  
✅ QR code displays correctly  

---

## 🍛 Celebrate! 🎊

You've successfully:
1. Built a modern web application
2. Deployed it globally on Azure
3. Set up professional CI/CD
4. Created feedback collection system
5. Generated in-store QR codes

**Your Swagath app is ready to collect customer feedback!**

---

**Next Step**: Open terminal and run `http-server` to get started! 🚀

For more detailed setup: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
