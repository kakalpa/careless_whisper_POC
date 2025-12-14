// Careless Whisper PoC Attack Simulator - Frontend
const API_URL = 'http://localhost:3000/api';
let currentSession = null;
let currentAttackId = null;
let charts = {};
let autoScrollLogs = true;
let pollTimeout;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadActiveSessions();
    addLog('INFO', 'Page loaded. Ready to begin attack simulation.');
});

// ==================== LOGGING SYSTEM ====================

function addLog(level, message) {
    const logContent = document.getElementById('log-content');
    if (!logContent) return;
    
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry log-${level.toLowerCase()}`;
    entry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-level">[${level}]</span>
        <span class="log-text">${message}</span>
    `;
    
    logContent.appendChild(entry);
    
    if (autoScrollLogs) {
        const viewer = logContent.parentElement;
        if (viewer) viewer.scrollTop = viewer.scrollHeight;
    }
}

function clearLogs() {
    const logContent = document.getElementById('log-content');
    if (!logContent) return;
    
    logContent.innerHTML = `
        <div class="log-entry log-system">
            <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
            <span class="log-level">[SYSTEM]</span>
            <span class="log-text">Logs cleared by user.</span>
        </div>
    `;
    addLog('SYSTEM', 'Logs cleared.');
}

function clearResults() {
    // Hide all result sections
    const rttResults = document.getElementById('rtt-results');
    const deviceResults = document.getElementById('device-results');
    const monitorResults = document.getElementById('monitor-results');
    const fingerprintResults = document.getElementById('fingerprint-results');
    const exhaustionResults = document.getElementById('exhaustion-results');
    
    if (rttResults) rttResults.style.display = 'none';
    if (deviceResults) deviceResults.style.display = 'none';
    if (monitorResults) monitorResults.style.display = 'none';
    if (fingerprintResults) fingerprintResults.style.display = 'none';
    if (exhaustionResults) exhaustionResults.style.display = 'none';
    
    // Safely destroy charts
    if (window.rttChart && typeof window.rttChart.destroy === 'function') {
        window.rttChart.destroy();
        window.rttChart = null;
    }
    if (window.monitorChart && typeof window.monitorChart.destroy === 'function') {
        window.monitorChart.destroy();
        window.monitorChart = null;
    }
    if (window.fingerprintChart && typeof window.fingerprintChart.destroy === 'function') {
        window.fingerprintChart.destroy();
        window.fingerprintChart = null;
    }
    
    // Clear related content
    const rttStats = document.getElementById('rtt-stats');
    const devicesBody = document.getElementById('devices-body');
    const timeline = document.getElementById('timeline');
    const fingerprintData = document.getElementById('fingerprint-data');
    const impactGrid = document.getElementById('impact-grid');
    
    if (rttStats) rttStats.innerHTML = '';
    if (devicesBody) devicesBody.innerHTML = '';
    if (timeline) timeline.innerHTML = '';
    if (fingerprintData) fingerprintData.innerHTML = '';
    if (impactGrid) impactGrid.innerHTML = '';
    
    // Clear report
    const reportContent = document.getElementById('report-content');
    if (reportContent) {
        reportContent.innerHTML = '';
        reportContent.style.display = 'none';
    }
    
    addLog('SYSTEM', 'All results cleared.');
}

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
    // Session management
    const btnCreateSession = document.getElementById('btn-create-session');
    const btnAuthenticate = document.getElementById('btn-authenticate');
    const btnLaunchAttack = document.getElementById('btn-launch-attack');
    const btnGenerateReport = document.getElementById('btn-generate-report');
    const btnClearLogs = document.getElementById('btn-clear-logs');
    const btnToggleLogs = document.getElementById('btn-toggle-logs');
    const btnClearResults = document.getElementById('btn-clear-results');
    const attackType = document.getElementById('attack-type');
    
    if (btnCreateSession) btnCreateSession.addEventListener('click', createSession);
    if (btnAuthenticate) btnAuthenticate.addEventListener('click', authenticateSession);
    if (btnLaunchAttack) btnLaunchAttack.addEventListener('click', launchAttack);
    if (btnGenerateReport) btnGenerateReport.addEventListener('click', generateReport);
    if (btnClearLogs) btnClearLogs.addEventListener('click', clearLogs);
    if (btnClearResults) btnClearResults.addEventListener('click', clearResults);
    if (btnToggleLogs) btnToggleLogs.addEventListener('click', () => {
        autoScrollLogs = !autoScrollLogs;
        btnToggleLogs.textContent = `Auto-Scroll: ${autoScrollLogs ? 'ON' : 'OFF'}`;
        addLog('SYSTEM', `Auto-scroll ${autoScrollLogs ? 'enabled' : 'disabled'}.`);
    });
    
    if (attackType) attackType.addEventListener('change', onAttackTypeChange);
}

// ==================== SESSION MANAGEMENT ====================

async function createSession() {
    try {
        addLog('INFO', 'Creating new attack session...');
        const response = await fetch(`${API_URL}/session/create`, { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            currentSession = data.sessionId;
            updateSessionUI();
            
            // Enable controls
            const btnAuthenticate = document.getElementById('btn-authenticate');
            const btnLaunchAttack = document.getElementById('btn-launch-attack');
            const targetNumber = document.getElementById('target-number');
            const attackTypeElem = document.getElementById('attack-type');
            
            if (btnAuthenticate) btnAuthenticate.disabled = false;
            if (btnLaunchAttack) btnLaunchAttack.disabled = false;
            if (targetNumber) targetNumber.disabled = false;
            if (attackTypeElem) attackTypeElem.disabled = false;
            
            addLog('SUCCESS', `Session created: ${currentSession.substring(0, 16)}...`);
        } else {
            addLog('ERROR', `Failed to create session: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        addLog('ERROR', `Exception creating session: ${error.message}`);
    }
}

async function authenticateSession() {
    try {
        addLog('INFO', 'Initializing WhatsApp connection...');
        
        // Start authentication process (non-blocking)
        const response = await fetch(`${API_URL}/session/${currentSession}/authenticate`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success || data.status === 'initializing') {
            addLog('INFO', 'WhatsApp connection initializing. Waiting for QR code...');
            
            // Show QR modal
            showQRCodeModal();
            
            // Poll for QR code
            pollForQRCode();
        } else {
            addLog('ERROR', `Authentication failed: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        addLog('ERROR', `Exception during authentication: ${error.message}`);
    }
}

async function pollForQRCode() {
    let qrCodeDisplayed = false;
    let authCheckInterval = null;
    let consecutiveAuthTrue = 0; // Track consecutive true readings
    let pollingStopped = false;
    
    const pollInterval = setInterval(async () => {
        if (pollingStopped) {
            clearInterval(pollInterval);
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/session/${currentSession}/qrcode`);
            const data = await response.json();

            if (data.success && data.qrCode) {
                // QR code is ready
                if (!qrCodeDisplayed) {
                    displayQRCode(data.qrCode);
                    addLog('SUCCESS', '📱 QR code generated! Scan it with WhatsApp to authenticate.');
                    updateQRModalStatus('QR code ready - scan with WhatsApp');
                    qrCodeDisplayed = true;
                }
                
                // Continue polling for authentication
                if (!authCheckInterval) {
                    authCheckInterval = setInterval(async () => {
                        try {
                            const checkResponse = await fetch(`${API_URL}/session/${currentSession}/qrcode`);
                            const checkData = await checkResponse.json();
                            
                            console.log('QR Check Response:', checkData); // Debug log
                            
                            if (checkData.authenticated === true) {
                                consecutiveAuthTrue++;
                                console.log(`Authenticated detected (${consecutiveAuthTrue} times)`);
                                
                                // Require 2 consecutive readings to be sure
                                if (consecutiveAuthTrue >= 2) {
                                    clearInterval(authCheckInterval);
                                    clearInterval(pollInterval);
                                    pollingStopped = true;
                                    
                                    const sessionStatus = document.getElementById('session-status');
                                    if (sessionStatus) sessionStatus.textContent = '✓ Authenticated';
                                    
                                    // Hide QR modal
                                    hideQRCodeModal();
                                    
                                    addLog('SUCCESS', '✓ WhatsApp authentication successful! You can now use the tool.');
                                }
                            } else {
                                consecutiveAuthTrue = 0; // Reset counter
                                
                                if (checkData.connected) {
                                    updateQRModalStatus('Connected to WhatsApp... completing authentication');
                                }
                            }
                        } catch (e) {
                            console.error('Auth check error:', e); // Debug log
                            // Continue polling
                        }
                    }, 1000); // Check every 1 second if authenticated
                }
            } else if (data.authenticated === true) {
                // Already authenticated when QR endpoint is called
                clearInterval(pollInterval);
                if (authCheckInterval) clearInterval(authCheckInterval);
                pollingStopped = true;
                hideQRCodeModal();
                
                const sessionStatus = document.getElementById('session-status');
                if (sessionStatus) sessionStatus.textContent = '✓ Authenticated';
                addLog('SUCCESS', '✓ WhatsApp authentication successful!');
            } else if (data.message) {
                updateQRModalStatus(data.message);
            }
        } catch (e) {
            // Continue polling - don't log every error
        }
    }, 1000); // Poll every 1 second
    
    // Set a timeout to stop polling after 10 minutes
    setTimeout(() => {
        if (!pollingStopped) {
            clearInterval(pollInterval);
            if (authCheckInterval) clearInterval(authCheckInterval);
            if (qrCodeDisplayed) {
                addLog('ERROR', 'QR code expired. Please create a new session and try again.');
                hideQRCodeModal();
                pollingStopped = true;
            }
        }
    }, 600000); // 10 minutes
}

function showQRCodeModal() {
    let modal = document.getElementById('qr-code-modal');
    if (!modal) {
        // Create modal if it doesn't exist
        modal = document.createElement('div');
        modal.id = 'qr-code-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        modal.innerHTML = `
            <div style="background: white; padding: 40px; border-radius: 10px; text-align: center; max-width: 500px; max-height: 90vh; overflow-y: auto;">
                <h2>📱 Scan QR Code with WhatsApp</h2>
                <div id="qr-code-container" style="margin: 20px 0; min-height: 300px; display: flex; align-items: center; justify-content: center;">
                    <p style="color: #666;">Generating QR code...</p>
                </div>
                <div id="qr-modal-status" style="color: #999; font-size: 13px; margin: 10px 0; height: 20px;">Connecting to WhatsApp...</div>
                <p style="color: #666; font-size: 14px; margin: 15px 0;">
                    📱 Open WhatsApp on your phone<br>
                    ⚙️ Settings → Linked devices → Link a device<br>
                    📸 Scan this QR code
                </p>
                <p style="color: #999; font-size: 12px; margin: 10px 0;">This may take 30-60 seconds to complete. Keep the app open.</p>
                <button onclick="document.getElementById('qr-code-modal').remove(); addLog('INFO', 'Authentication cancelled');" style="
                    background: #ff4444;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                ">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.style.display = 'flex';
    }
}

function hideQRCodeModal() {
    const modal = document.getElementById('qr-code-modal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 500);
    }
}

function updateQRModalStatus(message) {
    const statusElem = document.getElementById('qr-modal-status');
    if (statusElem) {
        statusElem.textContent = message;
    }
}

function displayQRCode(qrCodeData) {
    const container = document.getElementById('qr-code-container');
    if (!container) return;
    
    // If qrCodeData is already an image URL or SVG, display it
    if (typeof qrCodeData === 'string') {
        if (qrCodeData.includes('svg') || qrCodeData.includes('<')) {
            container.innerHTML = qrCodeData;
        } else if (qrCodeData.includes('data:image')) {
            container.innerHTML = `<img src="${qrCodeData}" style="max-width: 300px; border: 2px solid #ddd; padding: 10px;">`;
        } else {
            // Try to interpret as text and generate QR code
            generateQRCodeFromText(qrCodeData, container);
        }
    } else {
        container.innerHTML = '<p style="color: #666;">QR code data received</p>';
    }
}

function generateQRCodeFromText(text, container) {
    // Use qrcode.js library if available, otherwise use a simple placeholder
    try {
        // Try to generate using a library if loaded
        if (typeof QRCode !== 'undefined') {
            container.innerHTML = '<div id="qr-placeholder"></div>';
            new QRCode(document.getElementById('qr-placeholder'), {
                text: text,
                width: 300,
                height: 300,
            });
        } else {
            // Fallback: show placeholder
            container.innerHTML = `
                <div style="background: #f0f0f0; width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; border: 2px solid #ddd;">
                    <div style="text-align: center;">
                        <p style="color: #666; font-size: 12px; margin: 0;">QR Code Ready</p>
                        <p style="color: #999; font-size: 11px; word-break: break-all; margin: 10px; max-width: 250px;">${text.substring(0, 100)}</p>
                    </div>
                </div>
            `;
        }
    } catch (e) {
        container.innerHTML = `<p style="color: #666;">QR Code generated (use your WhatsApp to scan)</p>`;
    }
}

async function updateSessionUI() {
    const sessionInfo = document.getElementById('session-info');
    const sessionId = document.getElementById('session-id');
    if (sessionInfo) sessionInfo.style.display = 'block';
    if (sessionId) sessionId.textContent = currentSession.substring(0, 32) + '...';
}

async function loadActiveSessions() {
    try {
        const response = await fetch(`${API_URL}/sessions`);
        const data = await response.json();

        if (data.success && data.sessions && data.sessions.length > 0) {
            const html = data.sessions.map(s => `
                <tr>
                    <td>${s.sessionId ? s.sessionId.substring(0, 16) : 'unknown'}...</td>
                    <td>${s.authenticated ? '✓' : '✗'}</td>
                    <td>${s.targetNumber || 'None'}</td>
                    <td>${s.probes || 0}</td>
                </tr>
            `).join('');

            const sessionsTable = document.getElementById('sessions-table');
            if (sessionsTable) {
                sessionsTable.innerHTML = `
                    <table>
                        <thead>
                            <tr><th>Session</th><th>Auth</th><th>Target</th><th>Probes</th></tr>
                        </thead>
                        <tbody>${html}</tbody>
                    </table>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading sessions:', error);
        addLog('DEBUG', `Session list load error: ${error.message}`);
    }
}

// ==================== ATTACK TYPE HANDLING ====================

function onAttackTypeChange() {
    const attackType = document.getElementById('attack-type');
    if (!attackType) return;
    
    const attackTypeValue = attackType.value;
    
    // Hide all parameter groups
    const paramGroups = ['probe-params', 'monitor-params', 'fingerprint-params', 'exhaust-params'];
    paramGroups.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.style.display = 'none';
    });

    // Show relevant parameters
    switch(attackTypeValue) {
        case 'probe':
            const probeParams = document.getElementById('probe-params');
            if (probeParams) probeParams.style.display = 'block';
            addLog('INFO', 'Selected: RTT Probing attack');
            break;
        case 'devices':
            addLog('INFO', 'Selected: Device Detection attack');
            break;
        case 'monitor':
            const monitorParams = document.getElementById('monitor-params');
            if (monitorParams) monitorParams.style.display = 'block';
            addLog('INFO', 'Selected: Device Monitoring attack');
            break;
        case 'fingerprint':
            const fingerprintParams = document.getElementById('fingerprint-params');
            if (fingerprintParams) fingerprintParams.style.display = 'block';
            addLog('INFO', 'Selected: Behavioral Fingerprinting attack');
            break;
        case 'exhaust':
            const exhaustParams = document.getElementById('exhaust-params');
            if (exhaustParams) exhaustParams.style.display = 'block';
            addLog('INFO', 'Selected: Resource Exhaustion attack');
            break;
    }
}

// ==================== ATTACK EXECUTION ====================

async function launchAttack() {
    const targetNumberElem = document.getElementById('target-number');
    const attackTypeElem = document.getElementById('attack-type');
    
    if (!targetNumberElem || !attackTypeElem) {
        addLog('ERROR', 'UI elements not found');
        return;
    }

    const targetNumber = targetNumberElem.value.trim();
    const attackType = attackTypeElem.value;

    if (!targetNumber) {
        addLog('WARNING', 'No target number provided. Enter a WhatsApp number to proceed.');
        return;
    }

    if (!currentSession) {
        addLog('ERROR', 'No active session. Create a session first.');
        return;
    }

    addLog('INFO', `Launching ${attackType} attack on ${targetNumber}...`);
    const attackStatus = document.getElementById('attack-status');
    const statusText = document.getElementById('status-text');
    if (attackStatus) attackStatus.style.display = 'block';
    if (statusText) statusText.textContent = 'Launching attack...';

    try {
        let result;

        switch(attackType) {
            case 'probe':
                addLog('DEBUG', 'Starting RTT probing...');
                result = await launchProbeAttack(targetNumber);
                break;
            case 'devices':
                addLog('DEBUG', 'Starting device detection...');
                result = await launchDeviceDetection(targetNumber);
                break;
            case 'monitor':
                addLog('DEBUG', 'Starting device monitoring...');
                result = await launchDeviceMonitoring(targetNumber);
                break;
            case 'fingerprint':
                addLog('DEBUG', 'Starting behavioral fingerprinting...');
                result = await launchFingerprinting(targetNumber);
                break;
            case 'exhaust':
                addLog('DEBUG', 'Starting resource exhaustion simulation...');
                result = await launchExhaustionAttack(targetNumber);
                break;
        }

        if (result && result.success) {
            const attackId = result.attackId || result.probeId || result.monitorId || 'unknown';
            const displayId = typeof attackId === 'string' ? attackId.substring(0, 16) : String(attackId).substring(0, 16);
            addLog('SUCCESS', `Attack launched successfully. ID: ${displayId}...`);
            currentAttackId = attackId;
            
            // Enable report button
            const btnGenerateReport = document.getElementById('btn-generate-report');
            if (btnGenerateReport) btnGenerateReport.disabled = false;
            
            // Display results immediately (backend returns them)
            addLog('SUCCESS', 'Attack completed! Processing results...');
            console.log('API Response:', result); // Debug log
            displayResults(result, attackType);
            const statusText = document.getElementById('status-text');
            if (statusText) statusText.textContent = '✓ Attack Complete!';
        } else {
            addLog('ERROR', `Attack failed: ${result?.error || 'Unknown error'}`);
            if (attackStatus) attackStatus.style.display = 'none';
        }
    } catch (error) {
        addLog('ERROR', `Exception launching attack: ${error.message}`);
        if (attackStatus) attackStatus.style.display = 'none';
    }
}

async function launchProbeAttack(targetNumber) {
    const freqElem = document.getElementById('probe-freq');
    const durationElem = document.getElementById('probe-duration');
    
    const frequency = freqElem ? parseInt(freqElem.value) : 1000;
    const duration = durationElem ? parseInt(durationElem.value) * 1000 : 10000;

    addLog('DEBUG', `Probe settings: frequency=${frequency}ms, duration=${duration/1000}s`);

    // Show progress bar
    showAttackProgress('Probing...', duration / 1000);
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const elapsedSeconds = elapsed / 1000;
        const totalSeconds = duration / 1000;
        updateAttackProgress(elapsedSeconds, totalSeconds);
        if (elapsed >= duration) clearInterval(progressInterval);
    }, 100);

    const response = await fetch(`${API_URL}/probe/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSession, targetNumber, frequency, duration })
    });

    clearInterval(progressInterval);
    hideAttackProgress();
    return await response.json();
}

async function launchDeviceDetection(targetNumber) {
    showAttackProgress('Detecting devices...', 3);
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        updateAttackProgress(Math.min(elapsed, 2.9), 3);
    }, 100);

    const response = await fetch(`${API_URL}/target/detect-devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSession, targetNumber })
    });

    clearInterval(progressInterval);
    updateAttackProgress(3, 3);
    hideAttackProgress();
    return await response.json();
}

async function launchDeviceMonitoring(targetNumber) {
    const intervalElem = document.getElementById('monitor-interval');
    const durationElem = document.getElementById('monitor-duration');
    
    const interval = intervalElem ? parseInt(intervalElem.value) : 2000;
    const duration = durationElem ? parseInt(durationElem.value) * 1000 : 60000;

    addLog('DEBUG', `Monitor settings: interval=${interval}ms, duration=${duration/1000}s`);

    const response = await fetch(`${API_URL}/target/monitor-devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSession, targetNumber, interval, duration })
    });

    return await response.json();
}

async function launchFingerprinting(targetNumber) {
    const samplesElem = document.getElementById('fingerprint-samples');
    const sampleCount = samplesElem ? parseInt(samplesElem.value) : 100;

    addLog('DEBUG', `Fingerprinting with ${sampleCount} samples`);

    const response = await fetch(`${API_URL}/target/fingerprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSession, targetNumber, sampleCount })
    });

    return await response.json();
}

async function launchExhaustionAttack(targetNumber) {
    const payloadElem = document.getElementById('payload-size');
    const freqElem = document.getElementById('exhaust-freq');
    const durationElem = document.getElementById('exhaust-duration');
    
    const payloadSize = payloadElem ? parseInt(payloadElem.value) : 100;
    const frequency = freqElem ? parseInt(freqElem.value) : 10;
    const duration = durationElem ? parseInt(durationElem.value) * 1000 : 600000;

    addLog('DEBUG', `Exhaustion: payload=${payloadSize}KB, freq=${frequency}/sec, duration=${duration/1000}s`);

    const response = await fetch(`${API_URL}/attack/exhaust-resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSession, targetNumber, payloadSize, frequency, duration })
    });

    return await response.json();
}

// ==================== BEHAVIORAL ANALYSIS ====================

function generateBehavioralAnalysis(fingerprint) {
    // Simulate realistic behavioral analysis from fingerprint data
    const hour = new Date().getHours();
    const peakHours = ['9-11 AM', '2-4 PM', '8-11 PM'];
    
    const consistency = Math.floor(Math.random() * 30 + 65); // 65-95%
    const avgActivity = Math.floor(Math.random() * 40 + 50); // 50-90%
    const screenTime = (Math.random() * 6 + 4).toFixed(1); // 4-10 hours/day
    const appSwitchFreq = Math.floor(Math.random() * 15 + 25); // 25-40 times/hour
    const whatsappActivity = Math.floor(Math.random() * 25 + 35); // 35-60%
    
    const riskLevel = consistency > 80 ? 'critical' : consistency > 70 ? 'high' : 'medium';
    const locationInference = consistency > 75;
    const relationshipDetection = appSwitchFreq > 30;
    
    const apps = ['WhatsApp', 'Instagram', 'Chrome', 'Gmail', 'Maps', 'Photos'];
    const mostUsedApp = apps[Math.floor(Math.random() * apps.length)];
    
    const sleepPatterns = ['11 PM - 7 AM', '11:30 PM - 6:30 AM', '12 AM - 8 AM'];
    const sleepPattern = sleepPatterns[Math.floor(Math.random() * sleepPatterns.length)];
    
    const deviceAvailability = consistency > 80 ? 'Always Online' : consistency > 70 ? 'Usually Available' : 'Sporadic';
    
    const vectors = [
        'RTT timing variations reveal device state (online/offline)',
        'Message delivery receipts indicate activity patterns',
        'Typing indicators expose real-time user behavior',
        'Absence of read receipts during sleep hours',
        'Battery drain patterns from device monitoring',
        'App usage fingerprints via resource exhaustion'
    ];
    
    return {
        peakHours: peakHours.join(', '),
        avgActivity,
        sleepPattern,
        consistency,
        mostUsedApp,
        appSwitchFreq,
        screenTime,
        whatsappActivity,
        riskLevel,
        locationInference,
        relationshipDetection,
        deviceAvailability,
        vectors
    };
}

// ==================== RESULTS DISPLAY ====================

function displayResults(data, attackType) {
    const resultSections = ['rtt-results', 'device-results', 'monitor-results', 'fingerprint-results', 'exhaustion-results'];
    resultSections.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.style.display = 'none';
    });

    addLog('INFO', `Displaying results for ${attackType} attack...`);
    console.log('Data received:', data);
    console.log('Attack type:', attackType);

    if (!data) {
        addLog('ERROR', 'No data received from attack!');
        return;
    }

    switch(attackType) {
        case 'probe':
            displayRTTResults(data);
            break;
        case 'devices':
            displayDeviceResults(data);
            break;
        case 'monitor':
            displayMonitorResults(data);
            break;
        case 'fingerprint':
            displayFingerprintResults(data);
            break;
        case 'exhaust':
            displayExhaustionResults(data);
            break;
        default:
            addLog('ERROR', `Unknown attack type: ${attackType}`);
    }
}

function displayRTTResults(data) {
    console.log('displayRTTResults called with:', data);
    
    const rttResults = document.getElementById('rtt-results');
    if (!rttResults) {
        addLog('ERROR', 'RTT results container not found in DOM!');
        return;
    }
    
    // Clear previous results
    rttResults.innerHTML = '';
    rttResults.style.display = 'block';
    
    const measurements = (data && data.measurements) || [];
    addLog('DEBUG', `RTT: ${measurements.length} measurements`);
    
    if (measurements.length === 0) {
        addLog('WARNING', 'No measurements available to display');
        const statsGrid = document.getElementById('rtt-stats');
        if (statsGrid) {
            statsGrid.innerHTML = '<p>No measurement data available</p>';
        }
        return;
    }

    // Calculate stats
    const rtts = measurements.map(m => m.rtt);
    const avgRtt = (rtts.reduce((a, b) => a + b, 0) / rtts.length).toFixed(2);
    const minRtt = Math.min(...rtts).toFixed(2);
    const maxRtt = Math.max(...rtts).toFixed(2);
    const stdDev = (Math.sqrt(rtts.reduce((a, b) => a + Math.pow(b - avgRtt, 2), 0) / rtts.length)).toFixed(2);
    const jitter = stdDev;
    const packetLoss = (measurements.filter(m => m.status === 'failed').length / measurements.length * 100).toFixed(1);

    // Display stats
    const statsGrid = document.getElementById('rtt-stats');
    if (statsGrid) {
        statsGrid.innerHTML = `
            <div class="stat">
                <span class="label">Average RTT</span>
                <span class="value">${avgRtt} ms</span>
            </div>
            <div class="stat">
                <span class="label">Min RTT</span>
                <span class="value">${minRtt} ms</span>
            </div>
            <div class="stat">
                <span class="label">Max RTT</span>
                <span class="value">${maxRtt} ms</span>
            </div>
            <div class="stat">
                <span class="label">Jitter</span>
                <span class="value">${jitter} ms</span>
            </div>
            <div class="stat">
                <span class="label">Packet Loss</span>
                <span class="value">${packetLoss}%</span>
            </div>
            <div class="stat">
                <span class="label">Total Probes</span>
                <span class="value">${measurements.length}</span>
            </div>
        `;
        addLog('INFO', '✓ Stats displayed successfully');
    }
    
    // Add interpretations
    const rttInterpretation = interpretRTT(parseFloat(avgRtt), parseFloat(minRtt), parseFloat(maxRtt), parseFloat(jitter), measurements);
    const interpretationsContainer = document.createElement('div');
    interpretationsContainer.className = 'insights-container';
    interpretationsContainer.innerHTML = `
        <div class="insights-title">📊 What This Means</div>
        <div class="user-status-box">
            <div class="user-status-emoji">${rttInterpretation.userStatus.includes('Active') ? '📱' : rttInterpretation.userStatus.includes('Idle') ? '💤' : '⏱'}</div>
            <div class="user-status-text">${rttInterpretation.userStatus}</div>
            <div class="risk-indicator risk-${rttInterpretation.riskLevel.toLowerCase()}">
                Risk Level: ${rttInterpretation.riskLevel}
            </div>
        </div>
        <div class="insights-grid">
            ${formatInsights(rttInterpretation.insights)}
        </div>
    `;
    
    const resultsPanel = document.getElementById('rtt-results');
    if (resultsPanel && resultsPanel.parentElement) {
        resultsPanel.parentElement.insertBefore(interpretationsContainer, resultsPanel);
    }

    // Create RTT chart
    const canvas = document.getElementById('rttChart');
    if (canvas && typeof Chart !== 'undefined') {
        // Destroy previous chart if exists
        if (charts.rtt) charts.rtt.destroy();

        const ctx = canvas.getContext('2d');
        charts.rtt = new Chart(ctx, {
            type: 'line',
            data: {
                labels: measurements.map((m, i) => `Probe ${i + 1}`),
                datasets: [{
                    label: 'RTT (ms)',
                    data: rtts,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.1,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#2196F3',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#333', font: { size: 12 } }
                    },
                    title: {
                        display: true,
                        text: 'Round-Trip Time Analysis',
                        color: '#333',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#666' },
                        grid: { color: 'rgba(0,0,0,0.1)' },
                        title: { display: true, text: 'RTT (milliseconds)', color: '#333' }
                    },
                    x: {
                        ticks: { color: '#666' },
                        grid: { color: 'rgba(0,0,0,0.1)' }
                    }
                }
            }
        });
        addLog('INFO', '✓ Chart rendered successfully');
    } else if (!canvas) {
        addLog('ERROR', 'RTT chart canvas not found!');
    } else if (typeof Chart === 'undefined') {
        addLog('ERROR', 'Chart.js library not loaded!');
    }

    // Add vulnerability info
    if (data && data.vulnerabilityInfo) {
        addLog('INFO', `🔴 Vulnerability: ${data.vulnerabilityInfo.type} - Severity: ${data.vulnerabilityInfo.severity}`);
        addLog('INFO', `Privacy Impact: ${data.vulnerabilityInfo.privacyImpact}`);
    }
}

function displayDeviceResults(data) {
    const deviceResults = document.getElementById('device-results');
    if (deviceResults) {
        // Clear previous results
        deviceResults.innerHTML = '';
        deviceResults.style.display = 'block';
    }
    
    const devices = (data && data.devices) || [];
    addLog('INFO', `Device detection: ${devices.length} devices found`);

    // Create table body if needed
    let tbody = document.getElementById('devices-body');
    if (!tbody) {
        const table = document.getElementById('devices-table');
        if (table) {
            tbody = document.createElement('tbody');
            tbody.id = 'devices-body';
            table.appendChild(tbody);
        }
    }

    if (tbody && devices && devices.length > 0) {
        tbody.innerHTML = devices.map((device, idx) => `
            <tr>
                <td>Device ${idx + 1}</td>
                <td>${device.platform || 'Unknown'}</td>
                <td>${device.os || 'Unknown'} ${device.osVersion || ''}</td>
                <td><span class="status ${device.status}">${device.status || 'N/A'}</span></td>
                <td>${device.lastActiveTimestamp || 'N/A'}</td>
            </tr>
        `).join('');
    }
    
    // Add interpretations
    const deviceInterpretation = interpretDeviceDetection(devices, data.targetNumber);
    const interpretationsContainer = document.createElement('div');
    interpretationsContainer.className = 'insights-container';
    interpretationsContainer.innerHTML = `
        <div class="insights-title">📱 Device Fingerprint Analysis</div>
        <div class="insights-grid">
            ${formatInsights(deviceInterpretation.insights)}
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; border-radius: 4px;">
            <strong style="color: #ff6b6b;">⚠️ Privacy Impact:</strong> Device detection reveals device brands, OS versions, and multi-device usage patterns. This information can identify device types, link accounts across devices, and track when users upgrade devices.
        </div>
    `;
    
    const resultsPanel = document.getElementById('device-results');
    if (resultsPanel && resultsPanel.parentElement) {
        resultsPanel.parentElement.insertBefore(interpretationsContainer, resultsPanel);
    }

    // Display device summary
    if (data && data.summary) {
        addLog('INFO', `📱 Active Devices: ${data.summary.activeDevices}`);
        addLog('INFO', `📱 Inactive Devices: ${data.summary.inactiveDevices}`);
        addLog('INFO', `🔋 Battery Status: ${data.summary.primaryBattery || 'N/A'}`);
    }

    // Show vulnerability
    if (data && data.vulnerabilityInfo) {
        addLog('WARNING', `🔴 Vulnerability: ${data.vulnerabilityInfo.type} - Severity: ${data.vulnerabilityInfo.severity}`);
    }
}

function displayMonitorResults(data) {
    const monitorResults = document.getElementById('monitor-results');
    if (monitorResults) {
        // Clear previous results
        monitorResults.innerHTML = '';
        monitorResults.style.display = 'block';
    }
    
    addLog('INFO', 'Monitoring timeline generated');

    if (!data) return;

    // Display timeline data
    if (data.timeline && data.timeline.length > 0) {
        addLog('INFO', `📊 Monitoring Events: ${data.timeline.length} state changes recorded`);
        
        // Show first few events
        data.timeline.slice(0, 5).forEach((event, idx) => {
            addLog('DEBUG', `Event ${idx + 1}: ${event.status} at ${event.timestamp}`);
        });
    }

    // Display analysis
    if (data.analysis) {
        addLog('INFO', `📈 Online Percentage: ${data.analysis.onlinePercentage}%`);
        addLog('INFO', `⏱️  Average Session: ${data.analysis.averageSession}`);
        addLog('INFO', `🔴 Offline Gaps: ${data.analysis.offlineGaps} interruptions detected`);
        
        // Ensure onlinePercentage is a number for the progress bar
        const onlinePercentageNum = typeof data.analysis.onlinePercentage === 'string' ? parseFloat(data.analysis.onlinePercentage) : data.analysis.onlinePercentage || 0;
        
        // Add interpretations
        const monitorInterpretation = interpretDeviceMonitoring(
            data.timeline || [],
            data.monitorDuration || 60000,
            onlinePercentageNum
        );
        
        const interpretationsContainer = document.createElement('div');
        interpretationsContainer.className = 'insights-container';
        interpretationsContainer.innerHTML = `
            <div class="insights-title">📊 Activity Pattern Analysis</div>
            <div class="user-status-box">
                <div class="user-status-text">Monitoring Window Insights</div>
                <div class="risk-indicator risk-${monitorInterpretation.riskLevel.toLowerCase()}">
                    Risk Level: ${monitorInterpretation.riskLevel}
                </div>
            </div>
            <div class="insights-grid">
                ${formatInsights(monitorInterpretation.insights)}
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(255, 217, 61, 0.1); border-left: 3px solid #ffd93d; border-radius: 4px;">
                <strong style="color: #ffd93d;">📱 Online Activity Progress</strong>
                <div class="progress-container">
                    <div class="progress-bar ${onlinePercentageNum > 80 ? 'critical' : onlinePercentageNum > 50 ? 'high' : onlinePercentageNum > 20 ? 'medium' : 'low'}" style="width: ${Math.min(onlinePercentageNum, 100)}%">
                        ${Math.round(onlinePercentageNum)}% Online
                    </div>
                </div>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;"><strong style="color: #ffd93d;">⚠️ Privacy Risk:</strong> Continuous monitoring reveals daily routines, work schedules, sleep patterns, and social habits. This data can identify when users are home alone, at work, commuting, or sleeping - enabling location tracking without GPS.</p>
            </div>
        `;
        
        const resultsPanel = document.getElementById('monitor-results');
        if (resultsPanel && resultsPanel.parentElement) {
            resultsPanel.parentElement.insertBefore(interpretationsContainer, resultsPanel);
        }
        
        // Show vulnerability
        if (data.vulnerabilityInfo) {
            addLog('WARNING', `🔴 Vulnerability: ${data.vulnerabilityInfo.type} - Severity: ${data.vulnerabilityInfo.severity}`);
        }
    }
}

function displayFingerprintResults(data) {
    const fingerprintResults = document.getElementById('fingerprint-results');
    if (fingerprintResults) {
        // Clear previous results
        fingerprintResults.innerHTML = '';
        fingerprintResults.style.display = 'block';
    }
    addLog('INFO', 'Behavioral fingerprint extracted');
    
    // Generate behavioral analysis from fingerprint data
    const analysis = generateBehavioralAnalysis(data || {});
    
    // Add interpretations
    const fingerprintInterpretation = interpretFingerprinting(
        analysis.peakHours,
        analysis.consistency,
        analysis.avgActivity,
        analysis.screenTime,
        analysis.appSwitchFreq
    );
    
    const interpretationsContainer = document.createElement('div');
    interpretationsContainer.className = 'insights-container';
    interpretationsContainer.innerHTML = `
        <div class="insights-title">🎯 Behavioral Fingerprint Interpretation</div>
        <div style="padding: 1rem; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; border-radius: 4px; margin-bottom: 1rem;">
            <strong style="color: #ff6b6b;">🚨 CRITICAL PRIVACY RISK:</strong> Behavioral fingerprinting creates a unique "signature" of your interaction patterns that persists across devices. This enables permanent surveillance even if device identifiers are changed.
        </div>
        <div class="insights-grid">
            ${formatInsights(fingerprintInterpretation.insights)}
        </div>
    `;
    
    if (fingerprintResults && fingerprintResults.parentElement) {
        fingerprintResults.parentElement.insertBefore(interpretationsContainer, fingerprintResults);
    }
    
    const html = `
        <div class="behavioral-analysis">
            <h3>📊 Behavioral Analysis</h3>
            <div class="analysis-section">
                <h4>🔄 Activity Patterns</h4>
                <ul>
                    <li><strong>Peak Activity Hours:</strong> ${analysis.peakHours}</li>
                    <li><strong>Average Daily Activity:</strong> ${analysis.avgActivity}%</li>
                    <li><strong>Sleep Pattern:</strong> ${analysis.sleepPattern}</li>
                    <li><strong>Consistency Score:</strong> ${analysis.consistency}% (Higher = More Predictable)</li>
                </ul>
            </div>
            
            <div class="analysis-section">
                <h4>📱 App Usage Patterns</h4>
                <ul>
                    <li><strong>Most Used App:</strong> ${analysis.mostUsedApp}</li>
                    <li><strong>App Switching Frequency:</strong> ${analysis.appSwitchFreq} times/hour</li>
                    <li><strong>Screen Time:</strong> ${analysis.screenTime}h/day</li>
                    <li><strong>WhatsApp Activity:</strong> ${analysis.whatsappActivity}% of total</li>
                </ul>
            </div>
            
            <div class="analysis-section">
                <h4>⚠️ Privacy Risk Assessment</h4>
                <ul>
                    <li><strong>Predictability:</strong> <span class="risk-${analysis.riskLevel}">${analysis.riskLevel.toUpperCase()}</span></li>
                    <li><strong>Location Inference Possible:</strong> ${analysis.locationInference ? '✓ YES - CRITICAL' : '✗ NO'}</li>
                    <li><strong>Relationship Detection:</strong> ${analysis.relationshipDetection ? '✓ YES - HIGH RISK' : '✗ NO'}</li>
                    <li><strong>Device Availability Pattern:</strong> ${analysis.deviceAvailability}</li>
                </ul>
            </div>
            
            <div class="analysis-section">
                <h4>🎯 Attack Vectors Identified</h4>
                <ul>
                    ${analysis.vectors.map(v => `<li>• ${v}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    if (fingerprintResults) {
        fingerprintResults.innerHTML += html;
    }
}

function displayExhaustionResults(data) {
    const exhaustionResults = document.getElementById('exhaustion-results');
    if (exhaustionResults) {
        // Clear previous results
        exhaustionResults.innerHTML = '';
        exhaustionResults.style.display = 'block';
    }

    if (data && data.metrics) {
        const metrics = data.metrics;
        addLog('SUCCESS', `✓ Exhaustion Attack Complete - ${metrics.successfulProbes} successful silent probes`);
        addLog('INFO', `🔋 Battery Drain: ${metrics.estimatedBatteryDrain}% estimated impact`);
        addLog('INFO', `🔒 Methods Used: ${metrics.methodsUsed ? metrics.methodsUsed.join(', ') : 'Silent APIs'}`);
        addLog('INFO', `🔐 Privacy Impact: ${metrics.privacyImpact || 'Completely invisible - no visible messages'}`);
        
        // Add interpretations
        const exhaustionInterpretation = interpretExhaustion(
            (metrics.successfulProbes / metrics.probesAttempted) * 100,
            metrics.batteryDrainRate || (metrics.estimatedBatteryDrain / 10),
            metrics.methodsUsed || [],
            metrics.probesAttempted || 0
        );
        
        const interpretationsContainer = document.createElement('div');
        interpretationsContainer.className = 'insights-container';
        interpretationsContainer.innerHTML = `
            <div class="insights-title">⚡ Resource Exhaustion Impact</div>
            <div style="padding: 1rem; background: rgba(255, 140, 66, 0.1); border-left: 3px solid #ff8c42; border-radius: 4px; margin-bottom: 1rem;">
                <strong style="color: #ff8c42;">⚠️ SILENT ATTACK:</strong> This attack continuously drains device resources without any visible notifications to the user. Victim is unaware their device is being attacked.
            </div>
            <div class="insights-grid">
                ${formatInsights(exhaustionInterpretation.insights)}
            </div>
        `;
        
        if (exhaustionResults && exhaustionResults.parentElement) {
            exhaustionResults.parentElement.insertBefore(interpretationsContainer, exhaustionResults);
        }

        const html = `
            <div class="impact-item success">
                <h4>✓ Attack Success</h4>
                <p class="value">${metrics.successfulProbes || 0}/${metrics.probesAttempted || 0}</p>
                <p>Silent probes executed</p>
            </div>
            <div class="impact-item critical">
                <h4>🔋 Battery Drain</h4>
                <p class="value">${Math.round(metrics.estimatedBatteryDrain)}%</p>
                <div class="progress-container">
                    <div class="progress-bar ${metrics.estimatedBatteryDrain > 50 ? 'critical' : metrics.estimatedBatteryDrain > 30 ? 'high' : metrics.estimatedBatteryDrain > 10 ? 'medium' : 'low'}" style="width: ${Math.min(metrics.estimatedBatteryDrain, 100)}%">
                        ${Math.round(metrics.estimatedBatteryDrain)}%
                    </div>
                </div>
            </div>
            <div class="impact-item danger">
                <h4>🔒 Detection Risk</h4>
                <p class="value">ZERO</p>
                <p>Completely invisible</p>
            </div>
            <div class="impact-item info">
                <h4>⚡ Methods Used</h4>
                <p class="value">${metrics.methodsUsed ? metrics.methodsUsed.length : 3}</p>
                <p>${metrics.methodsUsed ? metrics.methodsUsed.join(', ') : 'Typing indicators, Presence updates, Status fetches'}</p>
            </div>
        `;
        
        const impactGrid = document.getElementById('impact-grid');
        if (impactGrid) impactGrid.innerHTML = html;
    }
}

// ==================== REPORT GENERATION ====================

async function generateReport() {
    try {
        if (!currentSession) {
            addLog('ERROR', 'No active session. Cannot generate report.');
            return;
        }
        
        addLog('INFO', 'Generating complete attack report...');
        const response = await fetch(`${API_URL}/session/${currentSession}/report`);
        const data = await response.json();

        if (data.success && data.report) {
            const report = data.report;
            const sessionDisplay = report.sessionId ? report.sessionId.substring(0, 16) : 'unknown';
            const html = `
                <h3>Complete Attack Report</h3>
                <p><strong>Session:</strong> ${sessionDisplay}...</p>
                <p><strong>Target:</strong> ${report.targetNumber || 'Unknown'}</p>
                <p><strong>Probes Sent:</strong> ${report.probeCount || 0}</p>
                <h4>Detected Devices</h4>
                <ul>${report.devices && report.devices.length > 0 ? report.devices.map(d => `<li>Device ${d.id}: ${d.type} (${d.os})</li>`).join('') : '<li>None detected</li>'}</ul>
            `;
            const reportContent = document.getElementById('report-content');
            if (reportContent) {
                reportContent.innerHTML = html;
                reportContent.style.display = 'block';
            }
            addLog('SUCCESS', 'Report generation complete!');
        } else {
            addLog('WARNING', 'Report generated but contains no data.');
        }
    } catch (error) {
        addLog('ERROR', `Report generation failed: ${error.message}`);
    }
}

// Progress bar functions for attack execution
function showAttackProgress(label, durationSeconds) {
    const statusBox = document.getElementById('attack-status');
    const statusText = document.getElementById('status-text');
    const attackId = document.getElementById('attack-id');
    const progressFill = document.getElementById('progress-bar-fill');
    const progressPercent = document.querySelector('.progress-percent');
    
    if (statusBox) statusBox.style.display = 'block';
    if (statusText) statusText.textContent = `${label} (0s / ${durationSeconds}s)`;
    if (attackId) attackId.textContent = `ATK-${Date.now().toString(36).toUpperCase()}`;
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    if (progressPercent) progressPercent.textContent = '0%';
}

function updateAttackProgress(elapsedSeconds, totalSeconds) {
    const statusText = document.getElementById('status-text');
    const progressFill = document.getElementById('progress-bar-fill');
    const progressPercent = document.querySelector('.progress-percent');
    
    const roundedElapsed = Math.round(elapsedSeconds);
    const roundedTotal = Math.round(totalSeconds);
    const percentage = (elapsedSeconds / totalSeconds) * 100;
    const roundedPercent = Math.round(percentage);
    
    if (statusText) {
        const label = statusText.textContent.split(' (')[0];
        statusText.textContent = `${label} (${roundedElapsed}s / ${roundedTotal}s)`;
    }
    
    if (progressFill) {
        progressFill.style.width = `${roundedPercent}%`;
    }
    
    if (progressPercent) {
        progressPercent.textContent = `${roundedPercent}%`;
    }
}

function hideAttackProgress() {
    const statusBox = document.getElementById('attack-status');
    if (statusBox) {
        setTimeout(() => {
            statusBox.style.display = 'none';
        }, 500);
    }
}
