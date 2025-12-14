const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// In-memory storage for sessions and results
const sessions = new Map();
const probeResults = new Map();
const targetAnalysis = new Map();

// ==================== WHATSAPP PROBING ENGINE ====================

class WhatsAppProber {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.isAuthenticated = false;
    this.targetNumber = null;
    this.probeHistory = [];
    this.devices = [];
    this.currentRTTs = [];
    this.behaviorPatterns = new Map();
  }

  // Simulate WhatsApp authentication
  async authenticate() {
    this.isAuthenticated = true;
    console.log(`[${this.sessionId}] Authenticated with WhatsApp`);
    return { success: true, qrCode: this.generateMockQR() };
  }

  generateMockQR() {
    return `QR_${this.sessionId.substring(0, 8)}`;
  }

  // Primary attack: Send stealthy reactions and measure RTT
  async probeTarget(targetNumber, frequency = 1000, duration = 10000) {
    if (!this.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    this.targetNumber = targetNumber;
    const probeId = crypto.randomBytes(8).toString('hex');
    const startTime = Date.now();
    const measurements = [];

    console.log(`[${this.sessionId}] Starting probe on ${targetNumber}`);
    console.log(`[${this.sessionId}] Frequency: ${frequency}ms, Duration: ${duration}ms`);

    // Simulate continuous probing with realistic RTT patterns
    const probeInterval = setInterval(() => {
      const timestamp = Date.now();
      const elapsed = timestamp - startTime;

      if (elapsed > duration) {
        clearInterval(probeInterval);
        return;
      }

      // Generate RTT based on device state simulation
      const rtt = this.generateRealisticRTT();
      const measurement = {
        timestamp,
        rtt,
        sequence: measurements.length,
        messageId: `msg_${crypto.randomBytes(4).toString('hex')}`
      };

      measurements.push(measurement);
      this.probeHistory.push(measurement);
    }, frequency);

    // Wait for probe to complete
    await new Promise(resolve => setTimeout(resolve, duration + 500));

    return {
      probeId,
      targetNumber,
      duration,
      frequency,
      totalProbes: measurements.length,
      measurements,
      analysis: this.analyzeMeasurements(measurements)
    };
  }

  // Generate realistic RTT values based on device state
  generateRealisticRTT() {
    const patterns = {
      screenOn: { mean: 1000, std: 150 },
      screenOff: { mean: 2000, std: 300 },
      appActive: { mean: 350, std: 50 },
      appInactive: { mean: 500, std: 100 },
      phoneCall: { mean: 800, std: 150 },
      deepSleep: { mean: 2500, std: 400 }
    };

    // Randomly select pattern to simulate different device states
    const patternKeys = Object.keys(patterns);
    const pattern = patterns[patternKeys[Math.floor(Math.random() * patternKeys.length)]];

    // Box-Muller transform for Gaussian distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    return Math.max(50, Math.round(pattern.mean + z0 * pattern.std));
  }

  // Analyze RTT measurements to detect device state
  analyzeMeasurements(measurements) {
    const rtts = measurements.map(m => m.rtt);
    const mean = rtts.reduce((a, b) => a + b) / rtts.length;
    const variance = rtts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / rtts.length;
    const stdDev = Math.sqrt(variance);

    return {
      mean: Math.round(mean),
      stdDev: Math.round(stdDev),
      min: Math.min(...rtts),
      max: Math.max(...rtts),
      median: this.getMedian(rtts),
      deviceState: this.inferDeviceState(mean),
      confidence: this.calculateConfidence(variance)
    };
  }

  getMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  inferDeviceState(mean) {
    if (mean < 100) return 'Web client active';
    if (mean < 400) return 'App active (foreground)';
    if (mean < 600) return 'App suspended (30s window)';
    if (mean < 1200) return 'Screen ON';
    if (mean < 2200) return 'Screen OFF';
    return 'Deep sleep state';
  }

  calculateConfidence(variance) {
    // Lower variance = higher confidence
    const maxVariance = 100000;
    return Math.round((1 - Math.min(variance / maxVariance, 1)) * 100);
  }

  // Track multiple devices
  async detectDevices(targetNumber) {
    console.log(`[${this.sessionId}] Detecting devices for ${targetNumber}`);

    // Simulate device detection via key directory leakage
    const devices = [
      { id: 0, type: 'mobile', os: 'Android', status: 'online', lastSeen: Date.now() },
      { id: 1, type: 'web', os: 'Web', status: 'online', lastSeen: Date.now() - 5000 },
      { id: 9, type: 'desktop', os: 'macOS', status: 'offline', lastSeen: Date.now() - 300000 }
    ];

    this.devices = devices;
    return devices;
  }

  // Monitor device online/offline status
  async monitorDeviceStatus(targetNumber, interval = 2000, duration = 60000) {
    console.log(`[${this.sessionId}] Monitoring device status for ${targetNumber}`);

    const monitoring = [];
    const startTime = Date.now();

    const monitor = setInterval(() => {
      const timestamp = Date.now();
      
      if (timestamp - startTime > duration) {
        clearInterval(monitor);
        return;
      }

      // Simulate device status changes
      this.devices.forEach(device => {
        if (Math.random() > 0.9) {
          device.status = device.status === 'online' ? 'offline' : 'online';
          device.lastSeen = timestamp;
        }
      });

      monitoring.push({
        timestamp,
        devices: JSON.parse(JSON.stringify(this.devices))
      });
    }, interval);

    await new Promise(resolve => setTimeout(resolve, duration + 500));
    return monitoring;
  }

  // Extract behavioral patterns from RTT analysis
  async fingerprintBehavior(targetNumber, probeCount = 100) {
    console.log(`[${this.sessionId}] Fingerprinting behavior for ${targetNumber}`);

    const activities = {
      screenOn: [],
      screenOff: [],
      appActive: [],
      phoneCall: []
    };

    // Simulate collecting RTT samples for different activities
    for (let i = 0; i < probeCount; i++) {
      const activity = Object.keys(activities)[Math.floor(Math.random() * Object.keys(activities).length)];
      activities[activity].push(this.generateRealisticRTT());
    }

    const fingerprint = {};
    for (const [activity, rtts] of Object.entries(activities)) {
      const mean = rtts.reduce((a, b) => a + b) / rtts.length;
      const variance = rtts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / rtts.length;
      
      fingerprint[activity] = {
        mean: Math.round(mean),
        stdDev: Math.round(Math.sqrt(variance)),
        samples: rtts.length,
        pattern: this.inferDeviceState(mean)
      };
    }

    this.behaviorPatterns = fingerprint;
    return fingerprint;
  }

  // Resource exhaustion attack
  async exhaustResources(targetNumber, payloadSize = 1024, frequency = 50, duration = 3600000) {
    console.log(`[${this.sessionId}] Exhaustion attack on ${targetNumber}`);
    console.log(`Payload: ${payloadSize}KB, Frequency: ${frequency}/sec, Duration: ${duration/1000}s`);

    const result = {
      targetNumber,
      payloadSize,
      frequency,
      duration,
      startTime: Date.now(),
      metrics: {
        messagesQueued: Math.round(frequency * (duration / 1000)),
        dataGenerated: Math.round((payloadSize * frequency * (duration / 1000)) / 1024), // MB
        estimatedBatteryDrain: this.calculateBatteryDrain(frequency, duration),
        notificationCount: 0 // Silent attacks have 0 notifications
      }
    };

    // Simulate attack execution
    const attackLog = [];
    let messageCount = 0;
    const startTime = Date.now();

    const attacker = setInterval(() => {
      const timestamp = Date.now();
      
      if (timestamp - startTime > duration) {
        clearInterval(attacker);
        return;
      }

      // Send payload
      messageCount++;
      attackLog.push({
        timestamp,
        messageId: `attack_${messageCount}`,
        payloadSize,
        delivered: true,
        notificationTriggered: false // Silent!
      });
    }, 1000 / frequency);

    await new Promise(resolve => setTimeout(resolve, Math.min(duration, 10000))); // Simulate 10s of attack

    result.attackLog = attackLog;
    return result;
  }

  calculateBatteryDrain(frequency, duration) {
    // Based on paper: WhatsApp can drain 14-18% per hour
    const durationHours = duration / 3600000;
    const drainPerHour = 15; // Average
    return Math.round(drainPerHour * durationHours);
  }

  // Get complete analysis report
  getAnalysisReport() {
    return {
      sessionId: this.sessionId,
      targetNumber: this.targetNumber,
      probeCount: this.probeHistory.length,
      devices: this.devices,
      behaviorPatterns: this.behaviorPatterns,
      threats: this.identifyThreats()
    };
  }

  identifyThreats() {
    return {
      deviceTracking: 'HIGH - Devices identified and monitored',
      behaviorInference: 'HIGH - Screen time and app usage detectable',
      locationTracking: 'MEDIUM - Device online/offline patterns reveal location',
      resourceExhaustion: 'CRITICAL - Battery and data drain possible',
      notificationLevel: 'NONE - All attacks are silent'
    };
  }
}

// ==================== API ENDPOINTS ====================

// 1. Create/Initialize attack session
app.post('/api/session/create', (req, res) => {
  try {
    const sessionId = crypto.randomBytes(16).toString('hex');
    const prober = new WhatsAppProber(sessionId);
    sessions.set(sessionId, prober);

    console.log(`✓ Session created: ${sessionId}`);
    
    res.json({
      success: true,
      sessionId,
      message: 'Session created. Ready for authentication.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Authenticate with WhatsApp
app.post('/api/session/:sessionId/authenticate', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const prober = sessions.get(sessionId);

    if (!prober) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const result = await prober.authenticate();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Start probing target
app.post('/api/probe/start', async (req, res) => {
  try {
    const { sessionId, targetNumber, frequency = 1000, duration = 10000 } = req.body;
    
    if (!targetNumber) {
      return res.status(400).json({ error: 'Target number required' });
    }

    const prober = sessions.get(sessionId);
    if (!prober) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const probeId = crypto.randomBytes(8).toString('hex');
    
    // Start probe in background
    prober.probeTarget(targetNumber, frequency, duration)
      .then(result => {
        probeResults.set(probeId, result);
        console.log(`✓ Probe completed: ${probeId}`);
      })
      .catch(err => console.error(`✗ Probe failed: ${err.message}`));

    res.json({
      success: true,
      probeId,
      message: 'Probe started. Check status with probe ID.',
      estimatedCompletion: Date.now() + duration
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get probe results
app.get('/api/probe/:probeId', (req, res) => {
  try {
    const { probeId } = req.params;
    const result = probeResults.get(probeId);

    if (!result) {
      return res.status(404).json({ error: 'Probe not found or still running' });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Detect devices
app.post('/api/target/detect-devices', async (req, res) => {
  try {
    const { sessionId, targetNumber } = req.body;
    const prober = sessions.get(sessionId);

    if (!prober) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const devices = await prober.detectDevices(targetNumber);
    res.json({
      success: true,
      devices
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Monitor device status
app.post('/api/target/monitor-devices', async (req, res) => {
  try {
    const { sessionId, targetNumber, interval = 2000, duration = 60000 } = req.body;
    const prober = sessions.get(sessionId);

    if (!prober) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const monitorId = crypto.randomBytes(8).toString('hex');
    
    prober.monitorDeviceStatus(targetNumber, interval, duration)
      .then(monitoring => {
        targetAnalysis.set(monitorId, {
          targetNumber,
          monitoring,
          startTime: Date.now(),
          endTime: Date.now() + duration
        });
      });

    res.json({
      success: true,
      monitorId,
      message: 'Device monitoring started'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Fingerprint behavior
app.post('/api/target/fingerprint', async (req, res) => {
  try {
    const { sessionId, targetNumber, sampleCount = 100 } = req.body;
    const prober = sessions.get(sessionId);

    if (!prober) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const fingerprint = await prober.fingerprintBehavior(targetNumber, sampleCount);
    
    res.json({
      success: true,
      fingerprint,
      targetNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Resource exhaustion attack
app.post('/api/attack/exhaust-resources', async (req, res) => {
  try {
    const { sessionId, targetNumber, payloadSize = 1024, frequency = 50, duration = 3600000 } = req.body;
    const prober = sessions.get(sessionId);

    if (!prober) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const attackId = crypto.randomBytes(8).toString('hex');
    
    prober.exhaustResources(targetNumber, payloadSize, frequency, duration)
      .then(result => {
        probeResults.set(attackId, result);
      });

    res.json({
      success: true,
      attackId,
      warning: '⚠️ ATTACK SIMULATION IN PROGRESS',
      message: 'Resource exhaustion attack initialized'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Get complete analysis report
app.get('/api/session/:sessionId/report', (req, res) => {
  try {
    const { sessionId } = req.params;
    const prober = sessions.get(sessionId);

    if (!prober) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const report = prober.getAnalysisReport();
    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Get monitoring results
app.get('/api/monitoring/:monitorId', (req, res) => {
  try {
    const { monitorId } = req.params;
    const result = targetAnalysis.get(monitorId);

    if (!result) {
      return res.status(404).json({ error: 'Monitoring not found or still running' });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. List all active sessions
app.get('/api/sessions', (req, res) => {
  try {
    const sessionList = Array.from(sessions.entries()).map(([id, prober]) => ({
      sessionId: id,
      authenticated: prober.isAuthenticated,
      targetNumber: prober.targetNumber || 'none',
      probes: prober.probeHistory.length
    }));

    res.json({
      success: true,
      sessions: sessionList,
      totalActive: sessionList.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 12. Delete session
app.delete('/api/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (sessions.delete(sessionId)) {
      res.json({ success: true, message: 'Session deleted' });
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`╔════════════════════════════════════════════════════╗`);
  console.log(`║  🔓 CARELESS WHISPER - POC Attack Simulator       ║`);
  console.log(`║  WhatsApp Delivery Receipt Vulnerability Demo     ║`);
  console.log(`║  Based on arXiv:2411.11194                        ║`);
  console.log(`╚════════════════════════════════════════════════════╝`);
  console.log(``);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(``);
  console.log(`⚠️  WARNING: This is a PoC for authorized security research only`);
  console.log(`   Unauthorized use is illegal and unethical`);
  console.log(``);
});
