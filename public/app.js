// Chart instances
let rttChart = null;
let trackingChart = null;
let fingerprintChart = null;

// API Base URL
const API_URL = 'http://localhost:3000/api';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupRTTAnalysis();
    setupDeviceTracking();
    setupFingerprinting();
    setupResourceExhaustion();
    setupScenarios();
    setupVulnerabilityAssessment();
});

// ==================== NAVIGATION ====================
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active from all buttons and tabs
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active to clicked button and corresponding tab
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// ==================== RTT ANALYSIS ====================
function setupRTTAnalysis() {
    const btn = document.getElementById('btn-rtt-analyze');
    const activitySelect = document.getElementById('rtt-activity');

    btn.addEventListener('click', analyzeRTT);

    // Auto-analyze on load
    analyzeRTT();
}

async function analyzeRTT() {
    const activitySelect = document.getElementById('rtt-activity');
    const activity = activitySelect.value;
    const duration = 60;

    try {
        const response = await fetch(`${API_URL}/rtt-analysis?activity=${activity}&duration=${duration}`);
        const data = await response.json();

        // Update chart
        updateRTTChart(data);

        // Update statistics
        updateRTTStats(data.statistics);

        // Show interpretation
        showRTTInterpretation(activity, data.pattern);
    } catch (error) {
        console.error('Error analyzing RTT:', error);
        alert('Error analyzing RTT pattern');
    }
}

function updateRTTChart(data) {
    const ctx = document.getElementById('rttChart').getContext('2d');
    
    const labels = data.samples.map((s, i) => i);
    const rtts = data.samples.map(s => s.rtt);
    const meanRTT = data.statistics.mean;

    if (rttChart) {
        rttChart.destroy();
    }

    rttChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'RTT (ms)',
                    data: rtts,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#ff6b6b'
                },
                {
                    label: `Mean (${meanRTT}ms)`,
                    data: Array(rtts.length).fill(meanRTT),
                    borderColor: '#4ecdc4',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Round-Trip Time (ms)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Sample Number'
                    }
                }
            }
        }
    });
}

function updateRTTStats(stats) {
    document.getElementById('stat-mean').textContent = stats.mean + ' ms';
    document.getElementById('stat-stddev').textContent = stats.stdDev + ' ms';
    document.getElementById('stat-min').textContent = stats.min + ' ms';
    document.getElementById('stat-max').textContent = stats.max + ' ms';
    document.getElementById('rtt-stats').style.display = 'grid';
}

function showRTTInterpretation(activity, pattern) {
    const interpretations = {
        screenOn: '📱 When the screen is ON, the device is active and responsive. RTT stays around ~1000ms. This baseline helps attackers distinguish active vs idle states.',
        screenOff: '😴 Screen OFF state shows significantly higher RTT (~2000ms) due to OS power management and deep sleep. The device is slow to respond.',
        appActive: '💬 When WhatsApp is in the foreground, the RTT drops dramatically to ~350ms. App in focus = faster response. Attackers can infer exact usage patterns.',
        appInactive: '📴 App minimized shows intermediate RTT (~500ms) for 30 seconds, then normalizes. This 30s window reveals app suspension behavior.',
        webActive: '🌐 Browser tab active = super fast (~50ms). Shows the web client is being actively used and monitored.',
        webInactive: '⏱️ Browser tab in background = very slow (~3000ms). Complete performance degradation when not focused.',
        phoneCall: '☎️ During active call, RTTs are denser (~800ms) due to increased device activity. The attack can detect when victims are in calls.',
        sleeping: '💤 Deep sleep state shows highest RTT (~2500ms) and high jitter. Device barely responds - only wakes periodically.'
    };

    const text = interpretations[activity] || 'Unknown activity';
    document.getElementById('interpretation-text').textContent = text;
    document.getElementById('rtt-interpretation').style.display = 'block';
}

// ==================== DEVICE TRACKING ====================
function setupDeviceTracking() {
    const btn = document.getElementById('btn-device-track');
    btn.addEventListener('click', trackDevices);
}

async function trackDevices() {
    const scenario = 'realistic';

    try {
        const response = await fetch(`${API_URL}/device-tracking?scenario=${scenario}&duration=120`);
        const data = await response.json();

        // Display devices
        displayDevices(data.devices);

        // Update tracking chart
        updateTrackingChart(data);

        // Display timeline
        displayTimeline(data.timeline);

        // Show findings
        showTrackingFindings(data);
    } catch (error) {
        console.error('Error tracking devices:', error);
    }
}

function displayDevices(devices) {
    const deviceList = document.getElementById('device-list');
    deviceList.innerHTML = '';

    devices.forEach(device => {
        const item = document.createElement('div');
        item.className = 'device-item';
        item.innerHTML = `
            <div class="device-item-name">${device.name}</div>
            <div class="device-item-type">${device.type}</div>
            <span class="device-status ${device.status}">${device.status.toUpperCase()}</span>
        `;
        deviceList.appendChild(item);
    });
}

function updateTrackingChart(data) {
    const ctx = document.getElementById('trackingChart').getContext('2d');
    
    const devices = ['smartphone', 'desktop', 'laptop'];
    const datasets = [];
    
    devices.forEach((device, idx) => {
        const deviceData = data.tracking
            .filter(t => t.device === device)
            .map(t => t.rtt);
        
        if (deviceData.length > 0) {
            datasets.push({
                label: device.charAt(0).toUpperCase() + device.slice(1),
                data: deviceData,
                borderColor: ['#ff6b6b', '#4ecdc4', '#667eea'][idx],
                backgroundColor: `rgba(${idx === 0 ? '255,107,107' : idx === 1 ? '78,205,196' : '102,126,234'}, 0.1)`,
                fill: true,
                tension: 0.4
            });
        }
    });

    if (trackingChart) {
        trackingChart.destroy();
    }

    trackingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.tracking.map((_, i) => i),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

function displayTimeline(timeline) {
    const container = document.getElementById('tracking-timeline');
    container.innerHTML = '';

    timeline.forEach((event, idx) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-time">${event.duration}s: ${event.type}</div>
                <div class="timeline-description">${event.description}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function showTrackingFindings(data) {
    const findingsList = document.getElementById('findings-list');
    findingsList.innerHTML = '';

    const findings = [
        'Device 0 (smartphone) is primary device - always online when home',
        'Device 1 (home desktop) comes online at 19:28 - indicates office departure',
        'Phone switches from Wi-Fi to LTE during travel (19:30-19:45)',
        'Phone call detected at 19:35 - visible from receipt density change',
        'Device 9 (work laptop) comes online at 19:46 - confirms office arrival',
        'Receipt ordering differences reveal macOS native client',
        'LAN vs Wi-Fi can be inferred from jitter patterns'
    ];

    findings.forEach(finding => {
        const li = document.createElement('li');
        li.textContent = finding;
        findingsList.appendChild(li);
    });

    document.getElementById('tracking-findings').style.display = 'block';
}

// ==================== FINGERPRINTING ====================
function setupFingerprinting() {
    const btn = document.getElementById('btn-fingerprint');
    btn.addEventListener('click', generateFingerprint);
}

async function generateFingerprint() {
    const deviceSelect = document.getElementById('device-select');
    const device = deviceSelect.value;

    try {
        const response = await fetch(`${API_URL}/fingerprinting?device=${device}&activities=5`);
        const data = await response.json();

        // Display device profile
        displayFingerprintProfile(data.device);

        // Update chart
        updateFingerprintChart(data);

        // Show OS signature
        showOSSignature(data.os_signature);
    } catch (error) {
        console.error('Error generating fingerprint:', error);
    }
}

function displayFingerprintProfile(device) {
    const profile = document.getElementById('fingerprint-profile');
    profile.innerHTML = `
        <p><strong>Device:</strong> ${device.name}</p>
        <p><strong>OS:</strong> ${device.os}</p>
        <p><strong>Chipset:</strong> ${device.chipset}</p>
    `;
    document.getElementById('fingerprint-device-info').style.display = 'block';
}

function updateFingerprintChart(data) {
    const ctx = document.getElementById('fingerprintChart').getContext('2d');
    
    const behaviors = data.behaviors;
    const labels = behaviors.map(b => b.activity);
    const means = behaviors.map(b => b.mean);

    if (fingerprintChart) {
        fingerprintChart.destroy();
    }

    fingerprintChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average RTT (ms)',
                data: means,
                backgroundColor: [
                    '#ff6b6b', '#4ecdc4', '#667eea', '#f39c12', '#e74c3c'
                ],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

function showOSSignature(signature) {
    document.getElementById('os-signature-text').textContent = 
        `Receipt Pattern: ${signature}. This unique OS signature can be used for device fingerprinting and targeted attacks.`;
    document.getElementById('os-signature').style.display = 'block';
}

// ==================== RESOURCE EXHAUSTION ====================
function setupResourceExhaustion() {
    const payloadInput = document.getElementById('payload-size');
    const freqInput = document.getElementById('freq-input');
    const durationInput = document.getElementById('duration-input');
    const btn = document.getElementById('btn-calculate');

    payloadInput.addEventListener('input', (e) => {
        document.getElementById('payload-display').textContent = e.target.value + ' KB';
    });

    freqInput.addEventListener('input', (e) => {
        document.getElementById('freq-display').textContent = e.target.value + '/sec';
    });

    durationInput.addEventListener('input', (e) => {
        const seconds = parseInt(e.target.value);
        const hours = (seconds / 3600).toFixed(1);
        document.getElementById('duration-display').textContent = 
            `${seconds}s (${hours}h)`;
    });

    btn.addEventListener('click', calculateResourceExhaustion);
}

async function calculateResourceExhaustion() {
    const payloadSize = parseInt(document.getElementById('payload-size').value);
    const frequency = parseFloat(document.getElementById('freq-input').value);
    const duration = parseInt(document.getElementById('duration-input').value);
    const app = document.getElementById('app-select').value;

    try {
        const response = await fetch(`${API_URL}/resource-exhaustion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payloadSize,
                frequency: frequency * 1000, // Convert to per minute
                duration,
                app
            })
        });

        const data = await response.json();
        displayExhaustionResults(data);
    } catch (error) {
        console.error('Error calculating:', error);
    }
}

function displayExhaustionResults(data) {
    document.getElementById('traffic-per-hour').textContent = 
        Math.round(data.traffic.perHour).toLocaleString();
    document.getElementById('traffic-total').textContent = 
        data.traffic.totalGB.toFixed(2);
    
    document.getElementById('battery-per-hour').textContent = 
        data.battery.drainPerHour;
    document.getElementById('battery-time').textContent = 
        data.battery.timeToFullDrain;
    
    document.getElementById('impact-level').textContent = 
        data.impact.dataUsageLevel;
    document.getElementById('notification-status').textContent = 
        data.impact.notificationToVictim;

    document.getElementById('exhaustion-results').style.display = 'block';
}

// ==================== SCENARIOS ====================
function setupScenarios() {
    const buttons = document.querySelectorAll('.scenario-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const scenario = btn.getAttribute('data-scenario');
            loadScenario(scenario);
        });
    });
}

async function loadScenario(scenarioType) {
    try {
        const response = await fetch(`${API_URL}/scenario/${scenarioType}`);
        const data = await response.json();

        displayScenarioDetails(data);
    } catch (error) {
        console.error('Error loading scenario:', error);
    }
}

function displayScenarioDetails(scenario) {
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-description').textContent = scenario.description;
    document.getElementById('scenario-attacker').textContent = scenario.attacker;
    document.getElementById('scenario-target').textContent = scenario.target;
    document.getElementById('scenario-duration').textContent = scenario.duration;

    const findingsList = document.getElementById('scenario-findings');
    findingsList.innerHTML = '';
    scenario.findings.forEach(finding => {
        const li = document.createElement('li');
        li.textContent = finding;
        findingsList.appendChild(li);
    });

    document.getElementById('scenario-implications').textContent = 
        scenario.legalImplications || scenario.impact || 'See details above';
    document.getElementById('scenario-detection').textContent = 
        scenario.detectionDifficulty;

    document.getElementById('scenario-details').style.display = 'block';
}

// ==================== VULNERABILITY ASSESSMENT ====================
function setupVulnerabilityAssessment() {
    const btn = document.getElementById('btn-assessment');
    btn.addEventListener('click', generateAssessment);
}

async function generateAssessment() {
    try {
        const response = await fetch(`${API_URL}/vulnerability-assessment`);
        const data = await response.json();

        displayVulnerabilityAssessment(data);
    } catch (error) {
        console.error('Error generating assessment:', error);
    }
}

function displayVulnerabilityAssessment(data) {
    const tbody = document.getElementById('vuln-table-body');
    tbody.innerHTML = '';

    const apps = [data.applications.whatsapp, data.applications.signal, data.applications.threema];
    
    apps.forEach(app => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${app.name}</td>
            <td><span style="color: ${app.riskLevel === 'CRITICAL' ? '#e74c3c' : app.riskLevel === 'HIGH' ? '#f39c12' : '#27ae60'}; font-weight: bold;">${app.riskLevel}</span></td>
            <td>${app.score}/10</td>
            <td>${app.riskLevel === 'CRITICAL' ? '🔴' : app.riskLevel === 'HIGH' ? '🟡' : '🟢'}</td>
        `;
    });

    displayAppDetails(data.applications);
    document.getElementById('assessment-report').style.display = 'block';
}

function displayAppDetails(applications) {
    const container = document.getElementById('app-details');
    container.innerHTML = '';

    ['whatsapp', 'signal', 'threema'].forEach(appKey => {
        const app = applications[appKey];
        let htmlContent = `<div class="app-card"><h3>${app.name}</h3>`;
        
        if (app.vulnerabilities) {
            htmlContent += '<h4>Vulnerabilities</h4><ul>';
            app.vulnerabilities.forEach(v => {
                htmlContent += `<li>${v}</li>`;
            });
            htmlContent += '</ul>';
        }

        if (app.defenses) {
            htmlContent += '<h4>Recommended Defenses</h4><ul>';
            app.defenses.forEach(d => {
                htmlContent += `<li>${d}</li>`;
            });
            htmlContent += '</ul>';
        }

        if (app.mitigations) {
            htmlContent += '<h4>Mitigations in Place</h4><ul>';
            app.mitigations.forEach(m => {
                htmlContent += `<li>${m}</li>`;
            });
            htmlContent += '</ul>';
        }

        if (app.strengths) {
            htmlContent += '<h4>Security Strengths</h4><ul>';
            app.strengths.forEach(s => {
                htmlContent += `<li>${s}</li>`;
            });
            htmlContent += '</ul>';
        }

        htmlContent += '</div>';
        container.innerHTML += htmlContent;
    });
}
