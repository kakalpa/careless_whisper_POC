# 🎉 Careless Whisper Web Tool - Complete Setup & Installation Guide

## 📦 Project Summary

A comprehensive **interactive web-based demonstration** of delivery receipt vulnerabilities in messaging apps, based on the research paper **"Careless Whisper: Exploiting Silent Delivery Receipts to Monitor Users on Mobile Instant Messengers"** (arXiv:2411.11194).

### 📊 Project Statistics
- **2,148** lines of code
- **356** lines backend (Node.js/Express)
- **568** lines frontend JavaScript
- **395** lines HTML UI
- **829** lines CSS styling
- **9** project files
- **124 KB** total size

### 🎯 7 Interactive Demonstrations
1. Overview & Threat Assessment
2. RTT Analysis & Timing Side-Channels
3. Multi-Device Tracking Simulation
4. Device & OS Fingerprinting
5. Resource Exhaustion Calculator
6. Real-World Attack Scenarios
7. Vulnerability Assessment Report

---

## 🚀 Quick Start (2 Minutes)

### Option 1: Using Shell Script (Easiest)

```bash
cd /run/media/kalpa/9530f1e7-4f57-4bf2-b7f2-b03a2b8d4111/Data3/Projects/CarelessWisper/web-tool
./start.sh
```

Then open: **http://localhost:3000**

### Option 2: Manual Start

```bash
cd /run/media/kalpa/9530f1e7-4f57-4bf2-b7f2-b03a2b8d4111/Data3/Projects/CarelessWisper/web-tool
npm install
npm start
```

Then open: **http://localhost:3000**

### Option 3: Development Mode (Auto-reload)

```bash
cd /run/media/kalpa/9530f1e7-4f57-4bf2-b7f2-b03a2b8d4111/Data3/Projects/CarelessWisper/web-tool
npm install --save-dev nodemon
npm run dev
```

---

## 📂 Project Structure

```
web-tool/
│
├── 🌐 PUBLIC FRONTEND
│   ├── index.html          (395 lines) - Main UI structure
│   ├── app.js              (568 lines) - Interactive logic
│   └── styles.css          (829 lines) - Responsive design
│
├── 🖥️ BACKEND SERVER
│   └── server.js           (356 lines) - Express API endpoints
│
├── 📚 DOCUMENTATION
│   ├── README.md           - Full documentation
│   ├── QUICKSTART.md       - Quick reference guide
│   ├── FEATURES.md         - Detailed feature breakdown
│   └── INSTALL.md          - This file
│
├── 🚀 LAUNCH SCRIPTS
│   ├── start.sh            - Automated launcher
│   └── package.json        - Dependencies & scripts
│
└── 📖 PROJECT FILES
    └── [9 files total]
```

---

## 🛠️ System Requirements

### Minimum Requirements
- **Node.js**: v14+ (recommended v18+)
- **npm**: v6+ (comes with Node.js)
- **Browser**: Modern (Chrome, Firefox, Safari, Edge)
- **RAM**: 512 MB
- **Disk**: 200 MB

### Recommended
- **Node.js**: v20+
- **Browser**: Latest Chrome/Firefox/Edge
- **RAM**: 2+ GB
- **Disk**: 500 MB

### Check Installation

```bash
node --version      # Should be v14+
npm --version       # Should be v6+
```

---

## 📥 Installation Steps

### Step 1: Navigate to Project

```bash
cd /run/media/kalpa/9530f1e7-4f57-4bf2-b7f2-b03a2b8d4111/Data3/Projects/CarelessWisper/web-tool
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- **express**: ^4.18.2 (Web server framework)
- **cors**: ^2.8.5 (Cross-origin request handling)
- **nodemon**: ^3.0.1 (Dev auto-reload, optional)

**Expected Output**:
```
added X packages in Ys
```

### Step 3: Start Server

```bash
npm start
```

**Expected Output**:
```
Careless Whisper Demo running on http://localhost:3000
Open the tool in your browser to explore the vulnerabilities
```

### Step 4: Open in Browser

Navigate to: **http://localhost:3000**

---

## 🎮 Using the Tool

### Main Interface

```
┌─────────────────────────────────────────────────────┐
│ 🔓 Careless Whisper Demo Tool                      │
│ Based on arXiv:2411.11194                          │
├─────────────────────────────────────────────────────┤
│ [Overview] [RTT] [Tracking] [Fingerprint] [...]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Interactive Content Area (changes per tab)        │
│                                                     │
│  - Charts and visualizations                       │
│  - Control sliders and buttons                     │
│  - Real-time analysis results                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Tab Navigation

| Tab | Purpose | Try This |
|-----|---------|----------|
| **1. Overview** | Understand vulnerability | Read risk assessment |
| **2. RTT Analysis** | Timing side-channels | Select "Screen ON" vs "Screen OFF" |
| **3. Device Tracking** | Multi-device surveillance | Click "Simulate Real-World" |
| **4. Fingerprinting** | OS/device identification | Select iPhone vs Samsung |
| **5. Resource Exhaustion** | Calculate attack impact | Adjust frequency slider |
| **6. Scenarios** | Real-world examples | Click any scenario button |
| **7. Assessment** | App security comparison | Click "Generate Assessment" |

---

## 🎯 Key Features Explained

### Feature 1: RTT Analysis
**What it does**: Shows how device state manifests as network timing differences

**Try this**:
1. Go to "RTT Analysis" tab
2. Select "Screen ON"
3. Click "Analyze RTT Pattern"
4. See chart with ~1000ms response times
5. Switch to "Screen OFF" and see ~2000ms
6. Notice 1000ms difference reveals screen state!

**Key Insight**: Small timing changes leak big information

---

### Feature 2: Device Tracking
**What it does**: Simulate complete tracking over 2 hours

**Try this**:
1. Go to "Device Tracking" tab
2. Click "Simulate Real-World Tracking"
3. Watch RTT chart showing devices coming online/offline
4. Read timeline showing:
   - When person left home
   - When person traveled
   - When person arrived at work
5. See "Attack Findings" showing what's revealed

**Key Insight**: Complete behavioral tracking possible

---

### Feature 3: Fingerprinting
**What it does**: Extract device signatures from RTT patterns

**Try this**:
1. Go to "Fingerprinting" tab
2. Select "iPhone 13 Pro"
3. Click "Generate Fingerprint"
4. See device profile (iOS, A15 chip)
5. See OS signature (receipt pattern)
6. Switch to "Samsung Galaxy S23"
7. Notice different patterns!

**Key Insight**: Device OS is uniquely identifiable

---

### Feature 4: Resource Exhaustion
**What it does**: Calculate battery/data drain from attack

**Try this**:
1. Go to "Resource Exhaustion" tab
2. Leave default (1000 KB payload, 10/sec, 1 hour)
3. Click "Calculate Impact"
4. See results:
   - **13.3 GB/hour** data used
   - **14-18% battery** drained
   - **Zero notifications** to victim
5. Try adjusting sliders to see impact changes

**Key Insight**: Massive damage with no detection

---

### Feature 5: Real-World Scenarios
**What it does**: Show how attacks apply in practice

**Try this**:
1. Go to "Scenarios" tab
2. Click "Workplace Surveillance"
3. Read what employer can learn:
   - Employee device count
   - When they work
   - Time on messaging apps
4. Click "Stalking & Harassment"
5. See how ex-partner can track completely
6. Click "Resource Exhaustion"
7. See financial impact

**Key Insight**: Real harms from research vulnerability

---

### Feature 6: Vulnerability Assessment
**What it does**: Compare security of different apps

**Try this**:
1. Go to "Assessment" tab
2. Click "Generate Assessment"
3. See app comparison:
   - WhatsApp 🔴 CRITICAL (9.2/10)
   - Signal 🟡 HIGH (6.5/10)
   - Threema 🟢 LOW (2.1/10)
4. Expand each to see vulnerabilities & recommendations

**Key Insight**: Design choices determine security

---

## 🔧 Troubleshooting

### Problem: "Cannot find module 'express'"

**Solution**: Run `npm install` again
```bash
npm install
```

### Problem: "Port 3000 already in use"

**Solution**: Kill the existing process or change port

**Option A** (Kill existing):
```bash
# Find process on port 3000
lsof -i :3000
# Kill it (replace PID with actual number)
kill -9 <PID>
```

**Option B** (Change port in server.js):
```bash
# Edit server.js, change "3000" to "3001"
# Then npm start
```

### Problem: Blank page in browser

**Solution**: Check browser console for errors

```bash
1. Press F12 to open developer tools
2. Click "Console" tab
3. Look for error messages
4. Common fixes:
   - Refresh page (Ctrl+R)
   - Hard refresh (Ctrl+Shift+R)
   - Check server is running (see terminal output)
```

### Problem: Charts not showing

**Solution**: Check if Chart.js loaded

```bash
1. Press F12
2. Go to Network tab
3. Look for "cdn.jsdelivr.net"
4. If 404: Check internet connection
5. Refresh page
```

### Problem: Server won't start

**Solution**: Check Node.js installation

```bash
# Check Node version
node --version

# Check npm version
npm --version

# If errors, reinstall Node.js
# Visit https://nodejs.org/
```

---

## 📊 API Endpoints (For Advanced Users)

The tool includes 6 main API endpoints:

### 1. RTT Analysis
```
GET /api/rtt-analysis?activity=screenOn&duration=60

Response: {
  activity: "screenOn",
  samples: [{timestamp, rtt, activity}, ...],
  statistics: {mean, stdDev, min, max},
  pattern: {...}
}
```

### 2. Device Tracking
```
GET /api/device-tracking?scenario=realistic&duration=120

Response: {
  devices: [{id, name, type, status}, ...],
  tracking: [{timestamp, device, rtt, ...}, ...],
  timeline: [{type, duration, description}, ...]
}
```

### 3. Fingerprinting
```
GET /api/fingerprinting?device=iphone13Pro&activities=5

Response: {
  device: {name, os, chipset},
  behaviors: [{activity, samples, mean, ...}, ...],
  os_signature: "Stacked (Reversed)"
}
```

### 4. Resource Exhaustion
```
POST /api/resource-exhaustion

Body: {
  payloadSize: 1000,
  frequency: 10000,
  duration: 3600,
  app: "whatsapp"
}

Response: {
  traffic: {perSecond, perHour, totalGB},
  battery: {drainPerHour, drainTotal, timeToFullDrain},
  impact: {...}
}
```

### 5. Scenarios
```
GET /api/scenario/workplace

Response: {
  title: "Workplace Surveillance",
  description: "...",
  attacker: "...",
  findings: [...],
  implications: "..."
}
```

### 6. Vulnerability Assessment
```
GET /api/vulnerability-assessment

Response: {
  applications: {
    whatsapp: {riskLevel, vulnerabilities, defenses, score},
    signal: {...},
    threema: {...}
  },
  summary: {...}
}
```

---

## 🎓 Learning Path

### Beginner (30 minutes)
1. Read Overview tab
2. Try RTT Analysis with different activities
3. Run Device Tracking simulation
4. Check Vulnerability Assessment

**Outcome**: Understand the vulnerability exists and is serious

### Intermediate (1-2 hours)
1. Explore all Fingerprinting device types
2. Adjust Resource Exhaustion parameters
3. Read all Real-World Scenarios
4. Check paper references in README.md

**Outcome**: Understand how attacks work and their impact

### Advanced (2-4 hours)
1. Review backend code in server.js
2. Modify simulation parameters
3. Add custom device profiles
4. Implement additional attack scenarios
5. Read the full arXiv paper

**Outcome**: Master the technical details and can explain vulnerabilities

---

## 📚 Documentation Files

### Quick Reference (5 minutes)
→ Read: `QUICKSTART.md`
- Fast setup
- Tab overview
- Key numbers

### Complete Feature List (15 minutes)
→ Read: `FEATURES.md`
- Each tab explained in detail
- Key statistics
- Technical architecture

### Full Documentation (30+ minutes)
→ Read: `README.md`
- Complete feature guide
- Installation details
- Educational use cases
- Recommendations

### Setup & Installation (This file)
→ You're reading it!

---

## 🔗 Resources

### Original Research
- **Paper**: https://arxiv.org/abs/2411.11194
- **Title**: "Careless Whisper: Exploiting Silent Delivery Receipts..."
- **Authors**: Gegenhuber, Günther, Maier, Judmayer, Holzbauer, Frenzel, Ullrich
- **Published**: October 2024

### Technology
- **Node.js**: https://nodejs.org/
- **Express.js**: https://expressjs.com/
- **Chart.js**: https://www.chartjs.org/

### Security Resources
- **OWASP**: https://owasp.org/
- **CWE**: https://cwe.mitre.org/
- **Privacy**: https://www.eff.org/

---

## 📞 Support & Issues

### Getting Help
1. Check QUICKSTART.md for quick answers
2. Review README.md for detailed info
3. Check browser console (F12) for errors
4. Try restarting server and browser

### Common Questions

**Q: Can I use this against real people?**
A: No. This is educational only. Unauthorized access is illegal.

**Q: Will this tool work offline?**
A: No, it requires internet for Chart.js library. You could modify to use local version.

**Q: Can I modify the simulation parameters?**
A: Yes! Edit server.js rttPatterns and deviceProfiles sections.

**Q: How do I host this online?**
A: Use Heroku, AWS, DigitalOcean, etc. Just make sure to add authentication.

---

## 🎯 Next Steps

1. **Install & Run**: Follow Quick Start section above
2. **Explore**: Click through all 7 tabs
3. **Learn**: Read documentation files
4. **Understand**: Study how each attack works
5. **Apply**: Think about defenses and improvements

---

## ⚖️ Legal & Ethical Notice

**⚠️ IMPORTANT**

This tool is for **educational and authorized security research purposes only**.

✓ **Allowed Uses**:
- Learning about security vulnerabilities
- Authorized security testing with permission
- Academic research and teaching
- Internal corporate security assessments

✗ **NOT Allowed**:
- Attacking real users without permission
- Unauthorized network access
- Violating laws in your jurisdiction
- Harassing or stalking anyone

**Remember**: With great power comes great responsibility. Use this knowledge to improve security and protect people, not to harm them.

---

## 📝 Citation

If you use this tool in research or teaching, please cite:

```bibtex
@article{carelesswhisper2024,
  title={Careless Whisper: Exploiting Silent Delivery Receipts 
         to Monitor Users on Mobile Instant Messengers},
  author={Gegenhuber, Gabriel K and G{\"u}nther, Maximilian and 
          Maier, Markus and Judmayer, Aljosha and 
          Holzbauer, Florian and Frenzel, Philipp E and 
          Ullrich, Johanna},
  journal={arXiv preprint arXiv:2411.11194},
  year={2024}
}
```

---

## 🎉 You're All Set!

You now have a complete interactive demonstration of delivery receipt vulnerabilities in messaging apps.

**Ready to explore?**

```bash
cd /run/media/kalpa/9530f1e7-4f57-4bf2-b7f2-b03a2b8d4111/Data3/Projects/CarelessWisper/web-tool
npm start
# Then visit http://localhost:3000
```

**Happy learning! 🔬**
