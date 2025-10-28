// Popup control script
const statusEl = document.getElementById('status');
const tasksCollectedEl = document.getElementById('tasksCollected');
const taskLimitEl = document.getElementById('taskLimit');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const saveBtn = document.getElementById('saveBtn');
const maxTasksInput = document.getElementById('maxTasks');
const maxAgeInput = document.getElementById('maxAge');

// Get current tab
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Send message with error handling
async function sendMessageToTab(message) {
  try {
    const tab = await getCurrentTab();
    
    // Check if we're on the correct page
    if (!tab.url || !tab.url.includes('viewTaskPage_cs')) {
      showError('Please navigate to the task page first');
      return null;
    }
    
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, message, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Connection error:', chrome.runtime.lastError.message);
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

// Show error message
function showError(message) {
  statusEl.textContent = message;
  statusEl.className = 'status-value stopped';
}

// Update UI based on status
function updateUI(data) {
  if (!data) {
    showError('Not Connected');
    startBtn.disabled = false;
    stopBtn.disabled = true;
    return;
  }
  
  const isRunning = data.status === 'running';
  
  statusEl.textContent = isRunning ? 'Running' : 'Stopped';
  statusEl.className = `status-value ${data.status}`;
  
  tasksCollectedEl.textContent = data.tasksCollected || 0;
  taskLimitEl.textContent = data.limit || 10;
  
  startBtn.disabled = isRunning;
  stopBtn.disabled = !isRunning;
}

// Start collector
startBtn.addEventListener('click', async () => {
  startBtn.disabled = true;
  const response = await sendMessageToTab({ action: 'start' });
  
  if (response && response.success) {
    updateUI(response);
  } else {
    startBtn.disabled = false;
    showError('Failed to start - refresh page');
  }
});

// Stop collector
stopBtn.addEventListener('click', async () => {
  stopBtn.disabled = true;
  const response = await sendMessageToTab({ action: 'stop' });
  
  if (response && response.success) {
    updateUI(response);
  } else {
    stopBtn.disabled = false;
  }
});

// Save settings
saveBtn.addEventListener('click', async () => {
  const config = {
    maxTasksPerMinute: parseInt(maxTasksInput.value),
    maxTaskAge: parseInt(maxAgeInput.value)
  };
  
  const response = await sendMessageToTab({ action: 'updateConfig', config });
  
  if (response && response.success) {
    taskLimitEl.textContent = config.maxTasksPerMinute;
    saveBtn.textContent = 'Saved!';
    setTimeout(() => {
      saveBtn.textContent = 'Save Settings';
    }, 1500);
  }
});

// Get initial status when popup opens
async function initialize() {
  const response = await sendMessageToTab({ action: 'getStatus' });
  updateUI(response);
}

// Refresh status every 2 seconds
let statusInterval = setInterval(async () => {
  const response = await sendMessageToTab({ action: 'getStatus' });
  if (response) {
    updateUI(response);
  }
}, 2000);

// Initialize on load
initialize();

// Cleanup on popup close
window.addEventListener('unload', () => {
  if (statusInterval) {
    clearInterval(statusInterval);
  }
});