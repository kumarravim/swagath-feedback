#!/bin/bash

# Swagath Feedback App - Quick Start Setup Script (Bash)
# Run: chmod +x setup.sh && ./setup.sh

echo ""
echo "================================="
echo "🍛 Swagath Customer Feedback App"
echo "Setup & Local Development"
echo "================================="
echo ""

# Check if Node.js is installed
echo "📦 Checking prerequisites..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js $NODE_VERSION found"
else
    echo "❌ Node.js not found. Please install Node.js v14+"
    echo "   Download from: https://nodejs.org/"
    echo "   Or install via package manager:"
    echo "   - macOS: brew install node"
    echo "   - Linux: sudo apt-get install nodejs npm"
    exit 1
fi

# Install http-server globally if not already installed
echo ""
echo "🔧 Setting up development server..."
if npm list -g http-server &> /dev/null; then
    echo "✅ http-server already installed"
else
    echo "📥 Installing http-server globally..."
    npm install -g http-server
    echo "✅ http-server installed"
fi

echo ""
echo "================================="
echo "✅ Setup Complete!"
echo "================================="
echo ""

echo "🚀 To start local development:"
echo "   1. cd wwwroot_static"
echo "   2. http-server -p 8080"
echo ""

echo "🌐 Then open in your browser:"
echo "   http://localhost:8080"
echo ""

echo "🔐 Admin Credentials:"
echo "   Username: supreme"
echo "   Password: lakshmi"
echo ""

echo "📚 See DEPLOYMENT_GUIDE.md for complete instructions"
echo ""
