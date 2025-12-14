#!/bin/bash

# Careless Whisper PoC Server Startup Script
# This script starts the WhatsApp vulnerability PoC server

echo "╔════════════════════════════════════════════════════╗"
echo "║  🔓 CARELESS WHISPER - Real PoC Server            ║"
echo "║  WhatsApp Delivery Receipt Vulnerability Exploit   ║"
echo "║  Based on arXiv:2411.11194                         ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "⚠️  WARNING: This is a real PoC for authorized research only"
echo "   Unauthorized use is ILLEGAL and unethical"
echo "   By using this tool, you accept full legal responsibility"
echo ""

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if server file exists
if [ ! -f "$SCRIPT_DIR/server-real-poc.js" ]; then
    echo "❌ ERROR: server-real-poc.js not found in $SCRIPT_DIR"
    exit 1
fi

# Kill any existing node processes on port 3000
echo "🔄 Checking for existing processes on port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Found existing process on port 3000. Terminating..."
    pkill -f "node server-real-poc" 2>/dev/null || true
    sleep 2
fi

# Start the server
echo "🚀 Starting server..."
cd "$SCRIPT_DIR"
node server-real-poc.js

