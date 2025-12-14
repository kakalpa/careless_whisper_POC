const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// WhatsApp Web.js - Simulated client for POC
// In production, this would use: npm install whatsapp-web.js
// For now, we'll create a mock client that simulates probing behavior
const clients = new Map();
const probeResults = new Map();
const targetDevices = new Map();

// RTT simulation data based on paper findings
const rttPatterns = {
  screenOn: { mean: 1000, std: 150, description: 'Screen is active' },
  screenOff: { mean: 2000, std: 300, description: 'Screen is inactive' },
  appActive: { mean: 350, std: 50, description: 'WhatsApp in foreground' },
  appInactive: { mean: 500, std: 100, description: 'App minimized (30s transition)' },
  webActive: { mean: 50, std: 10, description: 'Browser tab active' },
  webInactive: { mean: 3000, std: 300, description: 'Browser tab in background' },
  phoneCall: { mean: 800, std: 150, description: 'Active phone call' },
  sleeping: { mean: 2500, std: 400, description: 'Deep sleep state' }
};

const deviceProfiles = {
  iphone13Pro: { name: 'iPhone 13 Pro', os: 'iOS', chipset: 'A15 Bionic' },
  iphone11: { name: 'iPhone 11', os: 'iOS', chipset: 'A13 Bionic' },
  samsungS23: { name: 'Samsung Galaxy S23', os: 'Android', chipset: 'Snapdragon 8 Gen 2' },
  samsungA54: { name: 'Samsung Galaxy A54', os: 'Android', chipset: 'Exynos 1280' },
  xiaomiPoco: { name: 'Xiaomi Poco M5s', os: 'Android', chipset: 'MediaTek Helio G99' }
};

// Helper: Generate RTT with gaussian distribution
function generateRTT(pattern) {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.max(50, pattern.mean + z0 * pattern.std);
}

// Helper: Simulate user activity
function simulateActivity(activityType, duration) {
  const samples = [];
  const startTime = Date.now();
  
  for (let i = 0; i < duration; i += 2) {
    const rtt = generateRTT(rttPatterns[activityType]);
    samples.push({
      timestamp: startTime + (i * 1000),
      rtt: Math.round(rtt),
      activity: activityType
    });
  }
  
  return samples;
}

// API Routes

// 1. RTT Analysis Endpoint
app.get('/api/rtt-analysis', (req, res) => {
  const { activity = 'screenOn', duration = 60 } = req.query;
  
  if (!rttPatterns[activity]) {
    return res.status(400).json({ error: 'Invalid activity type' });
  }
  
  const samples = simulateActivity(activity, parseInt(duration));
  
  // Calculate statistics
  const rtts = samples.map(s => s.rtt);
  const mean = rtts.reduce((a, b) => a + b) / rtts.length;
  const variance = rtts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / rtts.length;
  const stdDev = Math.sqrt(variance);
  const min = Math.min(...rtts);
  const max = Math.max(...rtts);
  
  res.json({
    activity,
    duration,
    samples,
    statistics: { mean: Math.round(mean), stdDev: Math.round(stdDev), min, max },
    pattern: rttPatterns[activity]
  });
});

// 2. Device Tracking Endpoint
app.get('/api/device-tracking', (req, res) => {
  const { scenario = 'realistic', duration = 120 } = req.query;
  
  let activities = [];
  
  if (scenario === 'realistic') {
    activities = [
      { type: 'screenOn', duration: 10, device: 'smartphone', description: 'User wakes up' },
      { type: 'appActive', duration: 15, device: 'smartphone', description: 'Using WhatsApp' },
      { type: 'screenOff', duration: 20, device: 'smartphone', description: 'Phone locked' },
      { type: 'screenOn', duration: 15, device: 'smartphone', description: 'Back at home' },
      { type: 'webActive', duration: 10, device: 'desktop', description: 'Desktop turned on' },
      { type: 'phoneCall', duration: 10, device: 'smartphone', description: 'Phone call made' },
      { type: 'screenOff', duration: 25, device: 'smartphone', description: 'Sleep time' }
    ];
  }
  
  const devices = [
    { id: 0, name: 'Smartphone (Main)', type: 'mobile', status: 'online' },
    { id: 1, name: 'Home Desktop (Web)', type: 'desktop', status: 'online' },
    { id: 9, name: 'Work Laptop (Native)', type: 'laptop', status: 'offline' }
  ];
  
  const tracking = [];
  let currentTime = Date.now();
  
  activities.forEach(activity => {
    for (let i = 0; i < activity.duration; i++) {
      const rtt = generateRTT(rttPatterns[activity.type]);
      tracking.push({
        timestamp: currentTime + (i * 1000),
        device: activity.device,
        rtt: Math.round(rtt),
        activity: activity.type,
        description: activity.description
      });
    }
    currentTime += activity.duration * 1000;
  });
  
  res.json({
    scenario,
    devices,
    tracking,
    timeline: activities
  });
});

// 3. Behavior Fingerprinting Endpoint
app.get('/api/fingerprinting', (req, res) => {
  const { device = 'iphone13Pro', activities = 5 } = req.query;
  
  if (!deviceProfiles[device]) {
    return res.status(400).json({ error: 'Invalid device' });
  }
  
  const profile = deviceProfiles[device];
  const activityTypes = ['screenOn', 'screenOff', 'appActive', 'appInactive', 'webActive', 'webInactive'];
  
  const fingerprint = {
    device: profile,
    behaviors: [],
    os_signature: null
  };
  
  // Generate characteristic patterns
  for (let i = 0; i < Math.min(parseInt(activities), activityTypes.length); i++) {
    const actType = activityTypes[i];
    const samples = [];
    
    for (let j = 0; j < 50; j++) {
      samples.push(generateRTT(rttPatterns[actType]));
    }
    
    const mean = samples.reduce((a, b) => a + b) / samples.length;
    const variance = samples.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / samples.length;
    
    fingerprint.behaviors.push({
      activity: actType,
      samples,
      mean: Math.round(mean),
      variance: Math.round(variance),
      min: Math.round(Math.min(...samples)),
      max: Math.round(Math.max(...samples))
    });
  }
  
  // Generate OS signature
  if (profile.os === 'iOS') {
    fingerprint.os_signature = 'Stacked (Reversed)';
  } else {
    fingerprint.os_signature = 'Separate Receipts';
  }
  
  res.json(fingerprint);
});

// 4. Resource Exhaustion Calculator
app.post('/api/resource-exhaustion', (req, res) => {
  const { 
    payloadSize = 1000,
    frequency = 50,
    duration = 3600,
    app = 'whatsapp'
  } = req.body;
  
  // Based on paper: WhatsApp generates 3.7MB per second with 1MB payloads
  const baseTrafficPerMessage = 3.7; // MB
  const messagesPerSecond = frequency / 1000; // Convert from per minute
  
  const trafficPerSecond = baseTrafficPerMessage * (payloadSize / 1000);
  const trafficPerHour = trafficPerSecond * 3600;
  const trafficPerDuration = (trafficPerSecond * duration) / 1024; // Convert to GB
  
  // Battery drain estimation (Paper findings)
  let batteryDrainPerHour = 0;
  if (app === 'whatsapp') {
    batteryDrainPerHour = 15; // Average of 14-18% for iPhone
  } else if (app === 'signal') {
    batteryDrainPerHour = 1; // Strict rate limiting
  }
  
  const batteryDrainTotal = (batteryDrainPerHour / 100) * (duration / 3600) * 100;
  
  res.json({
    payloadSize,
    frequency,
    duration,
    app,
    traffic: {
      perSecond: Math.round(trafficPerSecond * 100) / 100,
      perHour: Math.round(trafficPerHour),
      totalGB: Math.round(trafficPerDuration * 100) / 100
    },
    battery: {
      drainPerHour: batteryDrainPerHour,
      drainTotal: Math.round(batteryDrainTotal),
      timeToFullDrain: Math.round((100 / batteryDrainPerHour))
    },
    impact: {
      dataUsageLevel: trafficPerHour > 1000 ? 'CRITICAL' : trafficPerHour > 100 ? 'HIGH' : 'MODERATE',
      notificationToVictim: 'NONE (Silent Attack)'
    }
  });
});

// 5. Real-World Scenario Endpoint
app.get('/api/scenario/:type', (req, res) => {
  const { type } = req.params;
  
  const scenarios = {
    workplace: {
      title: 'Workplace Surveillance',
      description: 'Monitoring employee device usage patterns',
      attacker: 'Spooky Stranger (Employer)',
      target: 'Employee with work laptop',
      duration: '8 hours (workday)',
      findings: [
        'When employee leaves office (device goes offline)',
        'Time spent on messaging apps vs work',
        'Number of work devices in use',
        'Location patterns (office vs home)',
        'Sleep schedule via phone night patterns'
      ],
      legalImplications: 'Potential GDPR/employee privacy violations',
      detectionDifficulty: 'Nearly impossible without logging probe packets'
    },
    stalking: {
      title: 'Stalking & Harassment',
      description: 'Tracking a victim\'s movements and activities',
      attacker: 'Creepy Companion (Ex-partner)',
      target: 'Victim',
      duration: '24/7 Continuous',
      findings: [
        'Home location (desktop device online hours)',
        'Work location (laptop comes online)',
        'Travel patterns (Wi-Fi to LTE transitions)',
        'Sleep patterns (screen off periods)',
        'Relationship changes (new devices appearing)'
      ],
      legalImplications: 'Criminal stalking, harassment, cyberstalking',
      detectionDifficulty: 'Very difficult - no notifications'
    },
    dataTheft: {
      title: 'Resource Exhaustion Attack',
      description: 'Draining victim\'s data plan and battery',
      attacker: 'Spooky Stranger (Malicious actor)',
      target: 'Any user',
      duration: '1 hour continuous attack',
      findings: [
        '13.3 GB of data consumed (expensive)',
        '14-18% battery drain on iPhone',
        'Potential denial of service',
        'No visible notifications to victim'
      ],
      impact: 'Financial (data bill) + Service disruption',
      detectionDifficulty: 'Victim sees increased data usage but not cause'
    }
  };
  
  if (!scenarios[type]) {
    return res.status(404).json({ error: 'Scenario not found' });
  }
  
  res.json(scenarios[type]);
});

// 6. Vulnerability Assessment Endpoint
app.get('/api/vulnerability-assessment', (req, res) => {
  const assessment = {
    applications: {
      whatsapp: {
        name: 'WhatsApp',
        riskLevel: 'CRITICAL',
        vulnerabilities: [
          'No rate limiting on reactions',
          'Large payload sizes (1MB)',
          'Independent device receipts (amplification)',
          'No validation on reaction targets',
          'Self-reactions enabled'
        ],
        defenses: [
          'Disable delivery receipts for unknown senders',
          'Implement rate limiting',
          'Aggregate receipts per user',
          'Validate reaction payloads'
        ],
        score: 9.2
      },
      signal: {
        name: 'Signal',
        riskLevel: 'HIGH',
        vulnerabilities: [
          'Can be probed via reactions',
          'Independent device receipts',
          'RTT timing side-channel'
        ],
        mitigations: [
          'Stricter rate limiting (1 msg/sec)',
          'Better battery protection'
        ],
        score: 6.5
      },
      threema: {
        name: 'Threema',
        riskLevel: 'LOW',
        strengths: [
          'Receipt aggregation (single per user)',
          'No self-reactions',
          'Notifications for unknown senders'
        ],
        score: 2.1
      }
    },
    summary: {
      totalAppsAnalyzed: 3,
      criticalVulnerabilities: 1,
      highVulnerabilities: 1,
      lowVulnerabilities: 1
    }
  };
  
  res.json(assessment);
});

app.listen(PORT, () => {
  console.log(`Careless Whisper Demo running on http://localhost:${PORT}`);
  console.log('Open the tool in your browser to explore the vulnerabilities');
});
