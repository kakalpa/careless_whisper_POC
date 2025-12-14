#!/bin/bash
# Installation and Launch Script for Careless Whisper Demo Tool

echo "=================================================="
echo "  🔓 Careless Whisper: Delivery Receipt Vuln Demo"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Visit: https://nodejs.org/"
    echo "   Or use: brew install node (macOS) / apt install nodejs (Linux)"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Navigate to web-tool directory
WEB_TOOL_DIR="$(dirname "$0")"
cd "$WEB_TOOL_DIR" || exit 1

echo "📁 Working directory: $(pwd)"
echo ""

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
    echo ""
else
    echo "✓ Dependencies already installed"
    echo ""
fi

# Start the server
echo "🚀 Starting Careless Whisper Demo Server..."
echo ""
echo "   → Server: http://localhost:3000"
echo "   → Press Ctrl+C to stop"
echo ""
echo "=================================================="
echo ""

npm start
