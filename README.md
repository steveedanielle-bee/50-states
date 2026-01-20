# 50 States - BeePurple Feature Tracker

A simple web application to track BeePurple features across all 50 US states with MRR (Monthly Recurring Revenue) tracking.

## Features

- **50 State Tiles**: One tile for each US state
- **7 Feature Tracking**: Track status of recovery, treatment, wellness, housing, courts, jails, and state features
- **3-State Status System**:
  - ✓ Green checkmark = Available
  - ✗ Red X = Not Available
  - ! Orange exclamation = Partial/Pending
- **MRR Tracking**: Enter dollar amounts for Monthly Recurring Revenue per state
- **Data Persistence**: All data saved automatically to browser localStorage
- **Clean, Modern UI**: Responsive design that works on desktop and mobile

## How to Run

### Option 1: Open Directly in Browser

Simply open `index.html` in your web browser:

```bash
# Navigate to the project directory
cd 50-states

# Open in your default browser (Mac)
open index.html

# Open in your default browser (Linux)
xdg-open index.html

# Open in your default browser (Windows)
start index.html
```

### Option 2: Use a Local Server (Recommended)

For the best experience, run a local web server:

**Using Node.js (if installed):**

```bash
# Quick server with npx (no installation needed)
npx serve .
# Then open http://localhost:3000

# OR use live-server for auto-reload
npx live-server .
# Then open http://127.0.0.1:8080
```

**Using Python:**

```bash
# Python 3
python -m http.server 8000
# Then open http://localhost:8000

# Python 2
python -m SimpleHTTPServer 8000
```

## How to Use

### Tracking Feature Status

1. Find the state tile you want to update
2. Click on any feature's status box to cycle through states:
   - Click once: ✓ (Green - Available)
   - Click twice: ✗ (Red - Not Available)
   - Click three times: ! (Orange - Partial/Pending)
   - Click four times: Empty (No status)

### Adding MRR Data

1. Locate the MRR input box at the bottom of each state tile
2. Enter the dollar amount (e.g., 1500.00)
3. Data saves automatically after you stop typing

### Viewing the Legend

The legend at the top shows what each status symbol means.

### Clearing All Data

Click the "Clear All Data" button in the header to reset everything. **Warning: This cannot be undone!**

## Data Storage

All data is stored in your browser's localStorage:
- Data persists across browser sessions
- Data is stored locally on your device only
- Clearing browser data will delete all tracked information
- Data does NOT sync across devices or browsers

## Technical Details

### Project Structure

```
50-states/
├── index.html              # Main HTML file
├── styles.css              # All styling
├── app.js                  # Application logic
├── package.json            # Project metadata
├── README.md              # This file
└── DEPENDENCY_RECOMMENDATIONS.md  # Dependency guidelines
```

### No Dependencies Required

This is a vanilla JavaScript application with:
- No build process needed
- No npm packages required
- No framework dependencies
- Pure HTML/CSS/JavaScript

### Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Customization

### Changing Features

Edit the `features` array in `app.js`:

```javascript
const features = [
    { name: 'recovery', icon: '🔄' },
    { name: 'treatment', icon: '💊' },
    // Add or modify features here
];
```

### Changing Colors

Edit the CSS variables and classes in `styles.css`:

```css
.status-toggle.status-check {
    background: #34c759;  /* Green - change this */
}
```

### Adding More States/Regions

Edit the `states` array in `app.js` to add territories or change regions.

## Future Enhancements

Potential features that could be added:
- Export data to CSV/Excel
- Import data from spreadsheet
- Filter/search states
- Summary statistics dashboard
- User authentication and cloud sync
- Multi-user collaboration
- Historical tracking and charts

## License

MIT
