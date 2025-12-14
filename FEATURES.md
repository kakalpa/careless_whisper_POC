# 📊 Careless Whisper Demo Tool - Feature Summary

## 🎯 Tool Overview

An **interactive web-based demonstration** of delivery receipt vulnerabilities in WhatsApp and Signal, based on the arXiv:2411.11194 research paper.

### Key Statistics
- **3+ billion** WhatsApp users affected
- **13.3 GB/hour** data consumption possible
- **14-18% per hour** battery drain on iPhone
- **Zero notifications** to victims (completely silent)
- **Only requirement**: Know the target's phone number

---

## 🗂️ Tool Structure

### 7 Interactive Tabs

```
┌─────────────────────────────────────────────────────┐
│  1️⃣  OVERVIEW          - Core vulnerability concepts │
│  2️⃣  RTT ANALYSIS       - Timing side-channel demo   │
│  3️⃣  DEVICE TRACKING    - Multi-device surveillance │
│  4️⃣  FINGERPRINTING     - OS/device identification   │
│  5️⃣  RESOURCE EXHAUSTION- Battery/data drain calc   │
│  6️⃣  SCENARIOS          - Real-world attack examples │
│  7️⃣  ASSESSMENT         - App security comparison    │
└─────────────────────────────────────────────────────┘
```

---

## 📑 Tab-by-Tab Guide

### Tab 1️⃣ : OVERVIEW
**Purpose**: Understand the vulnerability at a glance

**Content**:
- 🎯 What is the attack vector?
- 🔐 Why delivery receipts are dangerous
- ⚡ Why attacks are silent
- 🌍 Scale of the problem

**Key Insight**: Delivery receipts leak timing information (RTT) that reveals:
- Screen state (on/off)
- App in use
- Device online/offline status
- Current activities

**Two Attack Types**:
| Type | Requirement | Capability |
|------|-------------|-----------|
| Creepy Companion | Existing conversation | Reactions, edits, deletes |
| Spooky Stranger | Just phone number | Reactions to non-existent messages |

**App Risk Assessment**:
```
WhatsApp  🔴 CRITICAL (9.2/10) - No rate limiting
Signal    🟡 HIGH (6.5/10)    - Rate limited but vulnerable
Threema   🟢 LOW (2.1/10)     - Receipt aggregation
```

---

### Tab 2️⃣ : RTT ANALYSIS
**Purpose**: See how device state manifests as timing differences

**Interactive Elements**:
- Select 8 different activity states
- Real-time RTT measurements
- Statistical analysis (mean, std dev, min, max)
- Pattern interpretation

**Activities Available**:
```
Screen ON           → ~1000 ms (active device)
Screen OFF          → ~2000 ms (sleep state)
WhatsApp Active     → ~350 ms (app foreground)
WhatsApp Inactive   → ~500 ms (app suspended)
Browser Tab Active  → ~50 ms (web client active)
Browser Tab In.     → ~3000 ms (tab background)
Phone Call          → ~800 ms (in call)
Deep Sleep          → ~2500 ms (deep power save)
```

**Why It Matters**:
- 🎯 Different activities have **distinct RTT signatures**
- 📊 Patterns are **reproducible and measurable**
- 🔍 Attackers can infer exact activity
- ⚠️ No user notification of measurement

**What Attackers Learn**:
✓ Detect if user is awake or sleeping
✓ Know which app is in focus
✓ Infer screen time patterns
✓ Identify focused work sessions

---

### Tab 3️⃣ : DEVICE TRACKING
**Purpose**: Monitor a real-world tracking scenario

**Scenario**: Follow victim across multiple devices over 2 hours

**Features**:
- 📱 Three devices tracked simultaneously:
  - Smartphone (main device)
  - Home Desktop (web client)
  - Work Laptop (native client)
- 📊 Real-time RTT chart showing online/offline status
- ⏱️ Timeline showing exactly what happened
- 🔍 Extracted findings and inferences

**Simulated Events**:
```
19:00 - Home: All devices online
19:28 - Desktop powered down (leaving home)
19:30 - Phone switches Wi-Fi → LTE (commute starts)
19:35 - Phone call detected (RTT density increases)
19:45 - Phone switches LTE → Wi-Fi (office arrival)
19:46 - Work laptop comes online (macOS detected via receipt order)
```

**What Attackers Know**:
✓ When you leave home
✓ Your commute route (Wi-Fi/LTE switches)
✓ When you arrive at work
✓ Your work computer OS and type
✓ Complete daily location pattern

**Attack Precision**: Second-level granularity!

---

### Tab 4️⃣ : FINGERPRINTING
**Purpose**: Extract unique device signatures from behavior

**Selectable Devices**:
- iPhone 13 Pro (iOS, A15 Bionic)
- iPhone 11 (iOS, A13 Bionic)
- Samsung Galaxy S23 (Android, Snapdragon 8 Gen 2)
- Samsung Galaxy A54 (Android, Exynos)
- Xiaomi Poco M5s (Android, MediaTek)

**Features**:
- 📊 Bar chart comparing RTT across activities
- 🔐 Device profile with OS and chipset
- 🎯 OS signature (receipt handling pattern)

**What's Revealed**:
```
Screen On/Off Timing   → Device model (iPhone vs Samsung)
RTT Jitter Pattern     → CPU/chipset type
Receipt Ordering       → OS (iOS vs Android)
Stacking Behavior      → Implementation version
Rate Limiting Response → App version
```

**Security Implication**:
Attackers can identify exact device and OS, then:
- Choose targeted exploits
- Optimize attack parameters
- Avoid detection patterns

**Key Finding**: 
Each device manufacturer has unique RTT fingerprint that's **reproducible and identifying**.

---

### Tab 5️⃣ : RESOURCE EXHAUSTION
**Purpose**: Calculate real-world impact of sustained attacks

**Interactive Sliders**:
- 📦 Payload Size: 10-1000 KB
- 🔄 Frequency: 1-20 messages/second
- ⏱️ Duration: 60-3600 seconds

**Results Calculated**:
```
📊 Data Traffic
  └─ Per hour consumption (MB)
  └─ Total consumption (GB)

🔋 Battery Drain
  └─ % per hour
  └─ Time to complete battery drain

🎯 Impact Level
  └─ Overall severity assessment
```

**Real-World Examples**:

**Case 1: 1-Hour Attack (1MB payload, 10/sec)**
- Data: 13.3 GB consumed
- Battery: 14-18% drained
- Cost: $10-40 on typical data plan
- Victim awareness: NONE

**Case 2: 24-Hour Campaign**
- Data: 319 GB consumed
- Battery: Multiple full drains
- Cost: Data plan exceeded entirely
- Detection: Hard (gradual drain)

**Case 3: Persistent Background (Low frequency)**
- Data: Slow but sustained
- Battery: Imperceptible daily drain
- Cost: Continuous
- Detection: Very difficult

**Impact by App**:
- **WhatsApp**: No rate limiting = full impact
- **Signal**: Rate limited = reduced impact
- **Effect**: 10x+ difference in severity

---

### Tab 6️⃣ : REAL-WORLD SCENARIOS
**Purpose**: Understand practical attack applications

**Three Scenarios Included**:

#### 🏢 Scenario 1: Workplace Surveillance
**Attacker Profile**: Spooky Stranger (Employer/Manager)

**Attack Goal**: Monitor employee device usage

**What Attacker Learns**:
✓ Time employee starts using work device
✓ When employee goes home (device offline)
✓ How much time on messaging apps vs work
✓ Number of active employee devices
✓ Sleep schedule (phone night usage)

**Impact**: Control and monitoring of employees
**Detection**: Extremely difficult
**Legal Status**: Potential GDPR/privacy violations

---

#### 👻 Scenario 2: Stalking & Harassment
**Attacker Profile**: Creepy Companion (Ex-partner)

**Attack Goal**: Monitor victim's location and behavior

**What Attacker Learns**:
✓ Victim's home location (desktop device online times)
✓ Work location (work device patterns)
✓ Travel routes (Wi-Fi to LTE transitions)
✓ Sleep patterns (phone usage at night)
✓ New relationships (new devices appearing)
✓ Daily routine and schedule

**Impact**: Complete behavior tracking and control
**Detection**: No victim notification
**Legal Status**: Criminal stalking/harassment

---

#### 💔 Scenario 3: Resource Exhaustion
**Attacker Profile**: Spooky Stranger (Malicious actor)

**Attack Goal**: Cause service disruption

**Impact on Victim**:
✓ Data plan depleted (13.3 GB/hour)
✓ Battery constantly drained
✓ Service disruption when plan exceeded
✓ Financial loss
✓ No visible cause

**Duration**: Seconds to hours
**Detection**: Victim notices data usage but not cause
**Legal Status**: Criminal denial of service

---

### Tab 7️⃣ : VULNERABILITY ASSESSMENT
**Purpose**: Compare security posture of messaging apps

**Assessment Report**: Generate comprehensive analysis

**Detailed Comparison**:

#### WhatsApp 🔴 CRITICAL (9.2/10)
**Vulnerabilities**:
- ❌ No rate limiting
- ❌ Large payload support (1MB reactions)
- ❌ Independent device receipts (amplification)
- ❌ No validation on reactions
- ❌ Self-reactions enabled

**Recommended Defenses**:
- ✓ Disable receipts for unknown senders
- ✓ Implement rate limiting
- ✓ Aggregate receipts per user
- ✓ Validate reaction payloads
- ✓ Add timing noise

---

#### Signal 🟡 HIGH (6.5/10)
**Vulnerabilities**:
- ⚠️ RTT side-channel exists
- ⚠️ Can be probed via reactions
- ⚠️ Independent device receipts

**Mitigations in Place**:
- ✓ Strict rate limiting (1 msg/sec)
- ✓ Better battery protection
- ✓ Queue management

**Still Needs**:
- Receipt aggregation
- Timing randomization

---

#### Threema 🟢 LOW (2.1/10)
**Security Strengths**:
- ✓ Receipt aggregation (single per user)
- ✓ No self-reactions
- ✓ Notifications for unknown senders
- ✓ Restrictive design
- ✓ No stealthy probing possible

**Why Safest**:
Spooky strangers cannot probe at all
Creepy companions limited by aggregation
Design prevents silent attacks

---

## 🛠️ Technical Details

### Backend Architecture

**Express.js Server** on port 3000

**API Endpoints**:
```
GET  /api/rtt-analysis
     ↓ Simulates RTT with Gaussian distribution
     ← Returns RTT samples + statistics

GET  /api/device-tracking  
     ↓ Simulates realistic activity over time
     ← Returns device tracking timeline

GET  /api/fingerprinting
     ↓ Generates device-specific RTT patterns
     ← Returns behavior fingerprint + OS signature

POST /api/resource-exhaustion
     ↓ Calculates attack impact
     ← Returns data/battery drain metrics

GET  /api/scenario/:type
     ↓ Returns attack scenario details
     ← Returns findings + implications

GET  /api/vulnerability-assessment
     ↓ Generates security report
     ← Returns risk scores + recommendations
```

### Frontend Technology

- **HTML5**: Semantic structure
- **CSS3**: Responsive grid layout, animations
- **JavaScript**: Interactive controls, API calls
- **Chart.js**: Data visualization

### Simulation Engine

**Statistical Model**:
- Gaussian distribution for RTT values
- Device-specific mean and standard deviation
- Realistic pattern generation
- Multi-device coordination

**Parameters**:
- 8 different activity types
- 5 device models
- 3 attack scenarios
- Real-world timing models from paper

---

## 📈 Key Statistics Visualized

### RTT Distributions (by Activity)
```
Deep Sleep     ████████████████████ (2500 ± 400ms)
Web Inactive   ██████████████████   (3000 ± 300ms)
Screen OFF     ████████████         (2000 ± 300ms)
App Inactive   ███████              (500 ± 100ms)
Screen ON      ██████               (1000 ± 150ms)
Phone Call     █████                (800 ± 150ms)
App Active     ██                   (350 ± 50ms)
Web Active     █                    (50 ± 10ms)
```

### Attack Impact
```
Data Consumption:  ▓▓▓▓▓▓▓▓▓▓▓▓▓ 13.3 GB/hour
Battery Drain:     ▓▓▓▓▓▓▓▓▓▓▓▓▓ 14-18% per hour
Detection Time:    ▓ 0 hours (silent!)
```

### Risk Assessment
```
WhatsApp:   ▓▓▓▓▓▓▓▓▓░ 92% Risk (CRITICAL)
Signal:     ▓▓▓▓▓▓░░░░ 65% Risk (HIGH)
Threema:    ▓▓░░░░░░░░ 21% Risk (LOW)
```

---

## 🎓 Learning Outcomes

After exploring this tool, you'll understand:

✅ **Side-Channel Attacks**: How timing differences leak information
✅ **Privacy Risks**: What seemingly safe features actually expose
✅ **Threat Modeling**: How attackers think and plan
✅ **Security Design**: Why certain choices matter
✅ **Device Fingerprinting**: How to identify unique signatures
✅ **Resource Exhaustion**: Impact of sustained attacks
✅ **Real-World Impact**: How academic vulnerabilities affect users

---

## 🔒 Defensive Takeaways

### For Users
- Avoid sharing phone numbers with untrusted people
- Monitor data usage for anomalies
- Notice battery drain patterns
- Use more secure messengers (Threema)

### For Developers
- Implement rate limiting STRICTLY
- Aggregate receipts per user
- Add timing noise to responses
- Validate all inputs
- Provide user controls
- Log suspicious patterns

### For Policy Makers
- Privacy regulations needed
- App store security standards
- User notification requirements
- Authentication controls

---

## 📊 Comparison Table

| Feature | WhatsApp | Signal | Threema |
|---------|----------|--------|---------|
| Users Affected | 3B+ | 500M+ | 3M |
| Rate Limiting | ❌ None | ✓ Yes | ✓ Yes |
| Receipt Aggregation | ❌ No | ❌ No | ✓ Yes |
| Spooky Stranger Risk | 🔴 High | 🔴 High | 🟢 Low |
| Creepy Companion Risk | 🔴 High | 🟡 Medium | 🟡 Medium |
| Data Exhaustion | 🔴 13.3GB/h | 🟡 Lower | 🟢 Protected |
| Risk Score | 9.2/10 | 6.5/10 | 2.1/10 |

---

## 🚀 Getting Started

1. **Install**: `npm install` in web-tool/
2. **Run**: `npm start`
3. **Open**: http://localhost:3000
4. **Explore**: Click through all 7 tabs
5. **Learn**: Read interpretations for each finding

---

## 📚 Paper Reference

**Title**: Careless Whisper: Exploiting Silent Delivery Receipts to Monitor Users on Mobile Instant Messengers

**Authors**: Gegenhuber, Günther, Maier, Judmayer, Holzbauer, Frenzel, Ullrich

**Link**: https://arxiv.org/abs/2411.11194

**Year**: 2024

---

## ⚠️ Important Disclaimer

This tool is for **educational and authorized security research only**.

- Do NOT use against real targets without permission
- Unauthorized access is illegal
- Respect user privacy and consent
- Use responsibly and ethically

---

**Made with 🔬 for security education**
