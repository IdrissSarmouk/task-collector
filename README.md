# Task Collector

A Chrome extension that automatically collects and claims tasks from the SNOC platform with intelligent rate limiting and filtering.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [How It Works](#how-it-works)
- [Troubleshooting](#troubleshooting)
- [Version History](#version-history)

## Features

### Automation
- **Automatic Task Selection**: Scans and selects eligible tasks without manual intervention
- **Automatic Claiming**: Claims selected tasks with proper timing and confirmation handling

### Rate Limiting
- **Configurable Rate Limit**: Default 10 tasks per minute (adjustable 1-100)
- **Minute-based Counter**: Automatically resets every 60 seconds
- **Real-time Tracking**: Shows current tasks collected in the popup

### Task Filtering
- **Age-based Filtering**: Only collects tasks up to 10 minutes old (adjustable 1-60 minutes)
- **Intelligent Selection**: Validates task timing before selection

### User Interface
- **Control Panel**: Easy-to-use popup interface
- **Live Status**: Real-time display of bot status (Running/Stopped)
- **Statistics Dashboard**: Shows tasks collected and rate limits
- **Settings Panel**: Adjust configuration without restarting

## Installation

### Prerequisites
- Google Chrome or Chromium-based browser
- Access to SNOC platform

### Steps

1. **Download the Extension**
   - Download all extension files or clone the repository

2. **Create Extension Folder**
   ```
   auto-task-collector/
   ├── autoCollector.js
   ├── popup.html
   ├── popup.js
   ├── manifest.json
   └── icons/ (optional)
       ├── icon16.png
       ├── icon48.png
       └── icon128.png
   ```

3. **Add Icons (Optional)**
   - Create or download three PNG icons (16x16, 48x48, 128x128 pixels)
   - Place them in the extension folder
   - Or remove the icon references from `manifest.json`

4. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select your `auto-task-collector` folder
   - The extension icon should appear in your browser toolbar

## Usage

### Starting the Collector

1. Navigate to the SNOC task page:
   ```
   https://newsnoc/uiSNOC/main/service?cat=viewTaskPage_cs
   ```

2. Click the extension icon in your browser toolbar

3. In the popup, click the **Start** button

4. The bot will begin:
   - Scanning for eligible tasks
   - Selecting tasks within the age limit
   - Claiming selected tasks
   - Refreshing when no tasks are found

### Stopping the Collector

- Click the **Stop** button in the popup
- Or close the browser tab
- Or reload the page

### Adjusting Settings

1. Open the extension popup
2. Scroll to the **Configuration** section
3. Adjust:
   - **Max Tasks per Minute**: Set your rate limit (1-100)
   - **Max Task Age**: Set maximum task age in minutes (1-60)
4. Click **Save Settings**
5. Settings apply immediately without restarting

## Configuration

### Default Settings

| Setting | Default | Range | Description |
|---------|---------|-------|-------------|
| Max Tasks per Minute | 10 | 1-100 | Maximum tasks to collect per minute |
| Max Task Age | 10 | 1-60 | Maximum age of tasks to collect (minutes) |
| Check Interval | 2000ms | Fixed | Time between task scans |
| Claim Delay | 350ms | Fixed | Delay between claim confirmation steps |

### Advanced Configuration

To modify advanced settings, edit `autoCollector.js`:

```javascript
const CONFIG = {
  maxTasksPerMinute: 10,    // Adjustable via popup
  maxTaskAge: 10,           // Adjustable via popup
  checkInterval: 2000,      // ms between checks
  claimDelay: 350,          // ms between claim steps
};
```

##  How It Works

### Task Collection Flow

1. **Scan**: Bot scans the task list every 2 seconds
2. **Filter**: Checks task timing (must be ≤10 minutes old)
3. **Rate Check**: Verifies rate limit not exceeded
4. **Select**: Clicks checkbox for eligible tasks
5. **Claim**: Initiates claim process with proper delays
6. **Confirm**: Handles all confirmation dialogs automatically
7. **Fill**: Populates address field with commune data
8. **Repeat**: Returns to step 1 or refreshes if no tasks found

### Rate Limiting Logic

- Counter starts at 0 when bot starts
- Increments with each claimed task
- Resets to 0 every 60 seconds
- Stops selecting new tasks when limit reached
- Resumes selection after counter resets

### Address Mapping

The bot automatically maps commune variations to standard names:

```javascript
"Les Eucaliptus/ Cherarba" → "Les Eucaliptus"
"B E Bahri" → "Bordj El Bahri"
"O Fayet" → "Ouled Fayet"
// ... and 30+ more mappings
```

## Troubleshooting

### Extension Not Working

**Problem**: Extension doesn't start or no tasks are collected

**Solutions**:
- Verify you're on the correct URL
- Check if page has loaded completely
- Open browser console (F12) and look for `[AutoCollector]` messages
- Reload the extension in `chrome://extensions/`
- Try reloading the page

### Rate Limit Issues

**Problem**: Bot stops collecting tasks

**Solutions**:
- Check the "This Minute" counter in popup
- Wait for the minute to reset (automatic)
- Adjust rate limit in settings if needed

### Claim Failures

**Problem**: Tasks are selected but not claimed

**Solutions**:
- Check console for error messages
- Verify claim button selector hasn't changed
- Increase `claimDelay` in CONFIG if dialogs appear too quickly
- Try claiming manually once to verify the flow

### Page Refresh Loop

**Problem**: Page keeps refreshing continuously

**Solutions**:
- Stop the bot using the popup
- Check if tasks match the age criteria
- Lower the max task age setting
- Verify task list is loading properly

### Console Debugging

Open browser console (F12) to see detailed logs:

```
[AutoCollector] Extension loaded
[AutoCollector] Started
[AutoCollector] Checking for tasks...
[AutoCollector] Selected task: 28-10-2025 14:30
[AutoCollector] Claimed 1 tasks. Total this minute: 1
```

## Version History

### Version 2.0 (Current)
- Full automation (no keyboard shortcuts needed)
- Control panel with start/stop buttons
- Live statistics display
- Configurable rate limiting
- Configurable task age filtering
- Auto-refresh functionality
- Real-time status updates

### Version 1.0 (Legacy - gammaCode.js)
- Manual operation with keyboard shortcuts
  - Press `S` to select tasks
  - Press `D` to claim tasks
  - Press `X` to fill address field
- No rate limiting
- No GUI control panel

## File Structure

```
auto-task-collector/
│
├── manifest.json          # Extension configuration
├── autoCollector.js       # Main automation logic
├── popup.html            # Control panel interface
├── popup.js              # Popup functionality
├── README.md             # This file
│
└── icons/ (optional)
    ├── icon16.png        # 16x16 toolbar icon
    ├── icon48.png        # 48x48 management icon
    └── icon128.png       # 128x128 store icon
```

## Privacy & Security

- Extension only runs on the specified SNOC URL
- No data is collected or transmitted externally
- All operations happen locally in your browser
- No external API calls or tracking

## Support

For issues, questions, or suggestions:
- Check the [Troubleshooting](#troubleshooting) section
- Review console logs for error messages
- Verify you're using the latest version

## Disclaimer

This extension is provided as-is for automation purposes. Users are responsible for:
- Compliance with SNOC platform terms of service
- Appropriate use of rate limiting
- Monitoring bot behavior
- Any consequences of automated task collection

Use responsibly and in accordance with your organization's policies.

---

