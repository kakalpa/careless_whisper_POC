# Careless Whisper: Interactive Delivery Receipt Vulnerability Demo

A comprehensive web-based tool demonstrating the vulnerabilities in messaging app delivery receipts as described in the paper "Careless Whisper: Exploiting Silent Delivery Receipts to Monitor Users on Mobile Instant Messengers" (arXiv:2411.11194).

## Overview

This tool provides interactive visualizations and demonstrations of:

- **RTT Analysis**: Round-trip time variations revealing device state
- **Device Tracking**: Monitor multiple devices across different activity patterns
- **Behavior Fingerprinting**: Extract unique OS and hardware signatures
- **Resource Exhaustion**: Calculate impact of sustained attacks on data and battery
- **Real-World Scenarios**: Explore practical attack use cases
- **Vulnerability Assessment**: Compare security postures of different messaging apps

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm

### Quick Start

1. **Install dependencies**:
```bash
cd web-tool
npm install
```

2. **Start the server**:
```bash
npm start
```

The tool will start at `http://localhost:3000`

3. **Open in browser**:
```
http://localhost:3000
```

### Development Mode

For development with auto-reload:
```bash
npm run dev
```
(Requires nodemon to be installed)

## Features

### 1. RTT Analysis Tab
**What it shows**: How different device states manifest as distinct Round-Trip Time patterns

- Select from 8 different activity states
- View real-time RTT measurements with statistical analysis
- See distributions and characteristic patterns
- Understand how OS power management affects response times

**Key Findings**:
- Screen ON: ~1000ms
- Screen OFF: ~2000ms  
- App Active: ~350ms
- Web Tab Active: ~50ms
- Deep Sleep: ~2500ms

### 2. Device Tracking Tab
**What it shows**: Real-world scenario of tracking user across multiple devices over time

- Monitor smartphone, desktop, and laptop simultaneously
- See when devices come online/offline
- Track activity transitions (WiFi→LTE, app focus changes)
- Identify device types and OS from receipt patterns
- Timeline visualization of user movements

**Simulated Scenario**: 
- User leaves home (desktop goes offline)
- Commute to office (phone on LTE, phone call detected)
- Arrives at office (switches to Wi-Fi, work laptop comes online)

### 3. Behavior Fingerprinting Tab
**What it shows**: How to extract unique device fingerprints from behavioral patterns

- Select target device (iPhone, Samsung, Xiaomi)
- View characteristic RTT patterns for different activities
- See OS-specific signatures
- Understand device-specific rate limiting behaviors

**Key Insight**: Different manufacturers and chipsets show distinct RTT patterns allowing attackers to:
- Identify exact device model
- Detect operating system
- Recognize custom Android implementations

### 4. Resource Exhaustion Tab
**What it shows**: Impact of sustained attack payloads on victim's resources

Interactive calculator showing:
- **Data Traffic Impact**: Up to 13.3 GB/hour with 1MB payloads
- **Battery Drain**: 14-18% per hour on iPhone, mitigated on Signal
- **Duration to Battery Depletion**: ~6-7 hours at full attack intensity
- **Financial Impact**: Data plan overages

Real-world scenarios:
- 1-hour attack: 13.3 GB consumed
- 24-hour campaign: 319 GB consumed
- Persistent background attack: Slow undetectable drain

### 5. Real-World Scenarios Tab
**What it shows**: Practical attack applications

Three main scenarios:
1. **Workplace Surveillance**: Employer monitoring employee device usage
2. **Stalking & Harassment**: Ex-partner tracking victim's location and routines  
3. **Resource Exhaustion**: Malicious actor draining data and battery

Each scenario includes:
- Attack profile and requirements
- What information can be extracted
- Legal implications
- Detection difficulty

### 6. Vulnerability Assessment Tab
**What it shows**: Comprehensive security analysis of three messaging platforms

**WhatsApp**: 🔴 CRITICAL (9.2/10)
- No rate limiting
- Large payload support (1MB)
- Independent device receipts (amplification)
- Vulnerable to both creepy companions and spooky strangers

**Signal**: 🟡 HIGH (6.5/10)
- Rate limiting helps (1 msg/sec max)
- Still vulnerable to RTT-based fingerprinting
- Better battery protection due to limits
- Less severe resource exhaustion

**Threema**: 🟢 LOW (2.1/10)
- Receipt aggregation (single per user)
- No self-reactions
- Notifications prevent spooky stranger attacks
- Most secure of the three

## Technical Architecture

### Backend (Node.js/Express)

**API Endpoints**:

```
GET  /api/rtt-analysis
GET  /api/device-tracking
GET  /api/fingerprinting
POST /api/resource-exhaustion
GET  /api/scenario/:type
GET  /api/vulnerability-assessment
```

**Simulation Engine**:
- Gaussian distribution for RTT generation
- Realistic activity patterns
- Device-specific characteristics
- Multi-device coordination

### Frontend (HTML/CSS/JavaScript)

**Libraries**:
- Chart.js for data visualization
- Vanilla JavaScript for interactivity
- Responsive CSS Grid layout

**Features**:
- Interactive controls with real-time updates
- Multiple chart types (line, bar, box-plot)
- Responsive mobile design
- Educational interpretations

## Key Insights from Paper

### The Vulnerability

Delivery receipts in WhatsApp and Signal:
1. **Cannot be disabled** (unlike read receipts)
2. **Leak timing information** (RTT varies by device state)
3. **Generate no notifications** (silent attacks)
4. **Available to anyone** (knowing just phone number)

### Attack Types

**Creepy Companion**: 
- Requires existing conversation
- Can use reactions, edits, deletions
- Stealthy monitoring of all devices

**Spooky Stranger**:
- Only needs phone number
- Can send reactions to non-existing messages
- Even more dangerous (no relationship needed)

### Real-World Impact

The paper demonstrated:
- **Screen time inference** with >90% accuracy
- **App activity detection** (screen on/off, app foreground)
- **Device fingerprinting** (OS identification)
- **Location tracking** (device online/offline patterns)
- **Resource exhaustion** at massive scale (13.3 GB/hour)
- **All without any victim notification**

## Educational Use Cases

This tool is useful for:

1. **Security Researchers**: Understanding delivery receipt vulnerabilities
2. **Privacy Advocates**: Demonstrating real privacy risks
3. **App Developers**: Understanding what not to do
4. **Educators**: Teaching security concepts in messaging apps
5. **Policy Makers**: Understanding scope of privacy issues

## Ethical Considerations

⚠️ **This is an educational tool only**

- Do NOT use against real targets without explicit permission
- Only deploy for authorized security research/testing
- Understand the legal implications in your jurisdiction
- Respect user privacy and consent

## Recommendations for Users

To protect yourself:
1. Use apps with better delivery receipt handling (Threema)
2. Disable delivery receipts if possible (manually check conversations)
3. Don't share your phone number with untrusted parties
4. Monitor data usage for anomalies
5. Be aware of battery drain patterns
6. Enable additional security features when available

## Recommendations for Developers

To address these vulnerabilities:
1. **Disable delivery receipts for unknown senders**
2. **Implement aggressive rate limiting**
3. **Aggregate receipts per user** (not per device)
4. **Add timing noise** to defeat RTT analysis
5. **Validate reaction payloads** strictly
6. **Provide user controls** for delivery receipts
7. **Log suspicious activity** patterns

## Paper Citation

```
@inproceedings{carelesswhisper2024,
  title={Careless Whisper: Exploiting Silent Delivery Receipts to Monitor Users on Mobile Instant Messengers},
  author={Gegenhuber, Gabriel K and G{\u00fcnther, Maximilian and Maier, Markus and Judmayer, Aljosha and Holzbauer, Florian and Frenzel, Philipp and Ullrich, Johanna},
  booktitle={arXiv preprint arXiv:2411.11194},
  year={2024}
}
```

## Disclaimer

This tool is provided for educational and authorized security research purposes only. Unauthorized access to computer systems is illegal. Always obtain proper authorization before testing security vulnerabilities.

## License

Educational - Use for learning and authorized security research only

## Support

For questions or issues:
1. Review the paper at https://arxiv.org/abs/2411.11194
2. Check the code comments for detailed explanations
3. Experiment with different parameters to understand the mechanics

---

**Remember**: With great power comes great responsibility. Use this knowledge to improve security and privacy, not to harm others.
