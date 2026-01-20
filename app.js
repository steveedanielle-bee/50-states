// All 50 US States
const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
    'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// BeePurple features with icons
const features = [
    { name: 'recovery', icon: '🔄' },
    { name: 'treatment', icon: '💊' },
    { name: 'wellness', icon: '🧘' },
    { name: 'housing', icon: '🏠' },
    { name: 'courts', icon: '⚖️' },
    { name: 'jails', icon: '🔒' },
    { name: 'state', icon: '🏛️' }
];

// Status cycle: none -> check -> x -> warning -> none
const statusCycle = ['none', 'check', 'x', 'warning'];

// Storage key
const STORAGE_KEY = 'beepurple-states-data';

// Initialize data storage
let statesData = loadData();

// Load data from localStorage
function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error loading data:', e);
            return initializeData();
        }
    }
    return initializeData();
}

// Initialize empty data structure
function initializeData() {
    const data = {};
    states.forEach(state => {
        data[state] = {
            features: {},
            mrr: ''
        };
        features.forEach(feature => {
            data[state].features[feature.name] = 'none';
        });
    });
    return data;
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(statesData));
    } catch (e) {
        console.error('Error saving data:', e);
    }
}

// Get status symbol
function getStatusSymbol(status) {
    switch (status) {
        case 'check':
            return '✓';
        case 'x':
            return '✗';
        case 'warning':
            return '!';
        default:
            return '';
    }
}

// Toggle status (cycle through states)
function toggleStatus(state, featureName) {
    const currentStatus = statesData[state].features[featureName];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    statesData[state].features[featureName] = statusCycle[nextIndex];
    saveData();
    return statusCycle[nextIndex];
}

// Update MRR value
function updateMRR(state, value) {
    statesData[state].mrr = value;
    saveData();
}

// Create a state tile
function createStateTile(state) {
    const tile = document.createElement('div');
    tile.className = 'state-tile';

    // State name
    const stateName = document.createElement('div');
    stateName.className = 'state-name';
    stateName.textContent = state;
    tile.appendChild(stateName);

    // Features list
    const featuresList = document.createElement('div');
    featuresList.className = 'features-list';

    features.forEach(feature => {
        const featureRow = document.createElement('div');
        featureRow.className = 'feature-row';

        // Feature label with icon
        const featureLabel = document.createElement('div');
        featureLabel.className = 'feature-label';

        const icon = document.createElement('span');
        icon.className = 'feature-icon';
        icon.textContent = feature.icon;

        const name = document.createElement('span');
        name.textContent = feature.name;

        featureLabel.appendChild(icon);
        featureLabel.appendChild(name);

        // Status toggle button
        const statusToggle = document.createElement('button');
        statusToggle.className = 'status-toggle';
        const currentStatus = statesData[state].features[feature.name];
        statusToggle.classList.add(`status-${currentStatus}`);
        statusToggle.textContent = getStatusSymbol(currentStatus);

        // Add click handler
        statusToggle.addEventListener('click', () => {
            const newStatus = toggleStatus(state, feature.name);
            statusToggle.className = 'status-toggle';
            statusToggle.classList.add(`status-${newStatus}`);
            statusToggle.textContent = getStatusSymbol(newStatus);
        });

        featureRow.appendChild(featureLabel);
        featureRow.appendChild(statusToggle);
        featuresList.appendChild(featureRow);
    });

    tile.appendChild(featuresList);

    // MRR section
    const mrrSection = document.createElement('div');
    mrrSection.className = 'mrr-section';

    const mrrLabel = document.createElement('div');
    mrrLabel.className = 'mrr-label';
    mrrLabel.textContent = 'Monthly Recurring Revenue (MRR)';

    const mrrInputWrapper = document.createElement('div');
    mrrInputWrapper.className = 'mrr-input-wrapper';

    const mrrInput = document.createElement('input');
    mrrInput.className = 'mrr-input';
    mrrInput.type = 'number';
    mrrInput.min = '0';
    mrrInput.step = '0.01';
    mrrInput.placeholder = '0.00';
    mrrInput.value = statesData[state].mrr;

    // Add input handler with debouncing
    let timeout;
    mrrInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            updateMRR(state, e.target.value);
        }, 500);
    });

    mrrInputWrapper.appendChild(mrrInput);
    mrrSection.appendChild(mrrLabel);
    mrrSection.appendChild(mrrInputWrapper);
    tile.appendChild(mrrSection);

    return tile;
}

// Render all state tiles
function renderStates() {
    const container = document.getElementById('statesContainer');
    container.innerHTML = '';

    states.forEach(state => {
        const tile = createStateTile(state);
        container.appendChild(tile);
    });
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        statesData = initializeData();
        saveData();
        renderStates();
    }
}

// Initialize the app
function init() {
    renderStates();

    // Add clear data button handler
    const clearButton = document.getElementById('clearData');
    clearButton.addEventListener('click', clearAllData);
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
