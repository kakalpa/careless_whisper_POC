# 🚀 Quick Start Guide - Careless Whisper Demo Tool

## Installation & Running

### Step 1: Install Dependencies
```bash
cd web-tool
npm install
```

This will install:
- **express**: Web server
- **cors**: Cross-origin requests
- **nodemon**: Auto-reload (development)

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
Careless Whisper Demo running on http://localhost:3000
Open the tool in your browser to explore the vulnerabilities
```

### Step 3: Open in Browser
Navigate to: http://localhost:3000

## What You Can Do

### 🔴 Tab 1: Overview
Start here! Understand:
- What the vulnerability is
- Two attack types (Creepy Companion vs Spooky Stranger)
- Risk levels for each app

### 📈 Tab 2: RTT Analysis
**Interactive demonstration of timing side-channels**

Try these:
1. Select "Screen ON" → See ~1000ms response time
2. Select "Screen OFF" → See ~2000ms response time
3. Select "WhatsApp Active" → See fast ~350ms (app in focus)
4. Select "Browser Tab Active" → See super fast ~50ms

**Key Insight**: The differences in timing reveal what the user is doing!

### 📱 Tab 3: Device Tracking
**Real-world scenario of tracking someone**

Click "Simulate Real-World Tracking" to see:
- Multiple devices tracked simultaneously
- When devices come online/offline
- Activity changes (Wi-Fi ↔ LTE, calls, etc.)
- Complete movement timeline

**What an attacker learns**:
- When you leave home (desktop goes offline)
- Your commute pattern (Wi-Fi to cellular)
- When you arrive at work (new device comes online)
- What type of computer you use (OS fingerprint)

### 🔬 Tab 4: Fingerprinting
**Extract unique device signatures**

Try different devices:
- iPhone 13 Pro vs iPhone 11 (different patterns!)
- Samsung Galaxy (Exynos vs Qualcomm processors)
- Xiaomi (MediaTek chipset)

Each has **unique RTT patterns** that reveal:
- Exact device model
- Operating system
- CPU/chipset version
- Custom OS implementations

### ⚔️ Tab 5: Resource Exhaustion
**Calculate attack impact**

Adjust sliders to explore:
- **Payload Size**: 1-1000 KB
- **Frequency**: 1-20 messages per second
- **Duration**: Up to 1 hour

See results:
- **Data traffic**: Up to 13.3 GB per HOUR
- **Battery drain**: 14-18% per hour on iPhone
- **Time to battery death**: ~6-7 hours

**Real example**: 1-hour attack = 13.3 GB = $10-40 on typical data plan

### 🌍 Tab 6: Real-World Scenarios
**Practical attack examples**

Explore three scenarios:
1. **Workplace Surveillance** 💼
   - Employer monitoring employee phone usage
   - Know when they're not working
   
2. **Stalking & Harassment** 👻
   - Ex-partner tracking location
   - Infer daily routines and sleep patterns

3. **Resource Exhaustion** 💔
   - Drain data plan secretly
   - Drain battery covertly

### 📋 Tab 7: Vulnerability Assessment
**Compare apps security**

Click "Generate Assessment" to see:
- **WhatsApp**: 🔴 CRITICAL (9.2/10)
- **Signal**: 🟡 HIGH (6.5/10)  
- **Threema**: 🟢 LOW (2.1/10)

Detailed breakdown of:
- Vulnerabilities in each app
- Recommended defenses
- Why Threema is safer

## Key Numbers to Remember

**From the paper:**

| Metric | Value |
|--------|-------|
| WhatsApp users affected | 3+ billion |
| Max data consumption | 13.3 GB/hour |
| Battery drain (iPhone) | 14-18% per hour |
| Time to detect on victim | None (silent!) |
| RTT difference (screen on/off) | ~1000ms |
| RTT on focused app | ~350ms |
| RTT on unfocused browser | ~3000ms |
| Required to attack | Just a phone number |

## Try This Experiment

**Simulate a complete stalking scenario**:

1. Go to **Tab 3: Device Tracking**
2. Click "Simulate Real-World Tracking"
3. Read the timeline - see how complete picture emerges
4. Go to **Tab 6: Real-World Scenarios**
5. Click "Stalking & Harassment"
6. Compare - notice how all the detected patterns enable stalking

## Understanding the Threat

### Why This Is Dangerous

❌ **You cannot turn off delivery receipts** (by design)
❌ **Attacks are completely silent** (no notifications)
❌ **Anyone can target you** (just need phone number)
❌ **Multiple attack scenarios** (tracking, exhaustion, fingerprinting)
❌ **Affects billions of users** (WhatsApp, Signal)

### Who Is At Risk?

✓ Business executives (corporate espionage)
✓ Activists & dissidents (government surveillance)
✓ Domestic abuse victims (stalking)
✓ Employees (workplace monitoring)
✓ Everyone with WhatsApp/Signal

## Protection Tips

### Short-term (What you can do now)
- Use Threema instead (most secure)
- Don't share your number with untrusted people
- Monitor for unusual data usage
- Track battery drain patterns

### Long-term (What apps need to do)
- Disable delivery receipts for unknown senders
- Implement rate limiting
- Add timing noise to RTT
- Aggregate receipts per user
- Give users control

## Educational Value

This tool helps you understand:
- **Side-channel attacks**: Info leaked through timing differences
- **Privacy risks**: What seems safe actually isn't
- **Security design**: Why certain choices matter
- **Threat modeling**: How attackers think

## Files Included

```
web-tool/
├── server.js              # Backend API
├── package.json          # Dependencies
├── README.md            # Full documentation
├── public/
│   ├── index.html       # Main UI
│   ├── app.js          # Frontend logic
│   └── styles.css      # Styling
└── QUICKSTART.md       # This file
```

## Troubleshooting

**"Cannot find module 'express'"**
→ Run `npm install` again

**"Port 3000 already in use"**
→ Change PORT in server.js or kill other process

**Charts not showing**
→ Check browser console (F12) for errors

**No data appearing**
→ Refresh page and try again

## Need More Info?

- **Full README**: See README.md
- **Original Paper**: https://arxiv.org/abs/2411.11194
- **Code Comments**: Check server.js and app.js

## Important Note

⚠️ **This is educational only**

- For learning and authorized testing only
- Do not use against real people without permission
- Unauthorized access is illegal
- Respect privacy and consent

---

Enjoy exploring the vulnerabilities! 🔍
