// Task Collector
// Configuration
const CONFIG = {
  maxTasksPerMinute: 10,
  maxTaskAge: 10, // minutes
  checkInterval: 2000, // ms between checks
  claimDelay: 350, // ms between claim steps
};

let isRunning = false;
let tasksCollectedThisMinute = 0;
let minuteResetTimer = null;

// Utility functions from original code
function checkTimeWithinNMinutes(timingString, n) {
  const parts = timingString.trim().split(' ');
  if (parts.length !== 2) return false;

  const [datePart, timePart] = parts;
  const [day, month, year] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  const inputDate = new Date(year, month - 1, day, hours, minutes);
  if (isNaN(inputDate.getTime())) return false;

  const now = new Date();
  const diffMs = Math.abs(now - inputDate);
  const diffMinutes = diffMs / (1000 * 60);

  return diffMinutes <= n;
}

// Reset task counter every minute
function resetTaskCounter() {
  tasksCollectedThisMinute = 0;
  console.log('[AutoCollector] Task counter reset');
}

// Check and select eligible tasks
function selectEligibleTasks() {
  const taskList = document.getElementsByClassName("ui-widget-content jqgrow ui-row-ltr");
  let selectedCount = 0;

  for (let task of taskList) {
    if (tasksCollectedThisMinute >= CONFIG.maxTasksPerMinute) {
      console.log('[AutoCollector] Rate limit reached, stopping selection');
      break;
    }

    let timingString = task.children[13].innerText;
    if (checkTimeWithinNMinutes(timingString, CONFIG.maxTaskAge)) {
      task.children[0].click();
      selectedCount++;
      console.log(`[AutoCollector] Selected task: ${timingString}`);
    }
  }

  return selectedCount;
}

// Claim selected tasks
async function claimTasks() {
  return new Promise((resolve) => {
    const claimBtn = document.querySelector("#claimTask");
    if (!claimBtn) {
      console.log('[AutoCollector] Claim button not found');
      resolve(false);
      return;
    }

    claimBtn.click();
    
    setTimeout(() => {
      const confirm = document.querySelector("body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-primary");
      if (confirm) {
        confirm.click();
        
        setTimeout(() => {
          const ok = document.querySelector("body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button");
          if (ok) ok.click();
          
          setTimeout(() => {
            const success = document.querySelector("body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button");
            if (success) success.click();
            resolve(true);
          }, CONFIG.claimDelay);
        }, CONFIG.claimDelay);
      } else {
        resolve(false);
      }
    }, CONFIG.claimDelay);
  });
}

// Fill address field (from original code)
function fillAddressField() {
  let communes = document.getElementsByClassName('select2-chosen');
  if (communes.length < 2) return;
  
  let communeValue = communes[1].innerText;
  let theCase = document.querySelector('#address1');
  if (!theCase) return;
  
  theCase.value = communeValue;
  theCase.value = theCase.value.replace(/-/g, ' ');
  theCase.value = theCase.value.replace(/'/g, ' ');
  theCase.value = theCase.value.replace(/\//g, ' ');
  theCase.value = theCase.value.replace(/é/g, 'e');

  // Address mappings
  const addressMappings = {
    "Les Eucaliptus/ Cherarba": "Les Eucaliptus",
    "B E Bahri": "Bordj El Bahri",
    "O Fayet": "Ouled Fayet",
    "BIR KADEM R1 TEXRIANE R3": "BIR KADEM",
    "Staoueli R2": "Staoueli",
    "Reghaia R1": "Reghaia",
    "Bologhine R1": "Bologhine Ben Ziri",
    "DOUERA R2": "Douera",
    "El Kennar": "El Kennar Nouchfi",
    "DRARIA R2": "Draria",
    "Alger Haute Casbah R1": "Casbah",
    "Dely ibrahim R2": "Dely Ibrahim",
    "Mohammadia R2": "Mohammadia",
    "KHRAISSIA R3": "Khraissia",
    "Bordj el Kiffan Faizi": "Bordj El Kifan",
    "KOUBA RCE": "Kouba",
    "SAOULA R3": "Saoula",
    "BABA HASSEN R3": "Baba Hassen",
    "BACHDJARAH R1": "BACHDJARAH",
    "BENI MESSOUS R2": "Beni Messous",
    "Staoueli C ": "Staoueli",
    "AYN TAYA R1": "Ayn Taya",
    "HYDRA RHC": "Hydra",
    "EL ACHOUR R4": "El Achour",
    "OUED EL SEMAR R2": "Oued El Semar",
    "Alger Mohamed V": "Mohammed Belouizdad",
    "BARAKI BAR SI LAKHDAR R3": "Baraki",
    "ALGER SIDI M HAMED": "SIDI M HAMED",
    "Souidania R3": "Souidania",
    "Constantine El Gamas": "El Gamas",
    "Les Eucaliptus  Cherarba": "Les Eucaliptus",
    "Constantine Wilaya": "Les Eucaliptus"
  };

  if (addressMappings[theCase.value]) {
    theCase.value = addressMappings[theCase.value];
  }
  
  console.log('[AutoCollector] Address field filled:', theCase.value);
}

// Refresh page by clicking Global
function refreshPage() {
  const globalBtn = document.querySelector("a[href*='viewTaskPage_cs']");
  if (globalBtn) {
    console.log('[AutoCollector] Refreshing page (clicking Global)');
    globalBtn.click();
  } else {
    console.log('[AutoCollector] Global button not found, using location.reload()');
    location.reload();
  }
}

// Main collection loop
async function collectionLoop() {
  if (!isRunning) return;

  console.log('[AutoCollector] Checking for tasks...');
  
  const selectedCount = selectEligibleTasks();
  
  if (selectedCount > 0) {
    console.log(`[AutoCollector] Selected ${selectedCount} tasks, attempting to claim...`);
    const claimed = await claimTasks();
    
    if (claimed) {
      tasksCollectedThisMinute += selectedCount;
      console.log(`[AutoCollector] Claimed ${selectedCount} tasks. Total this minute: ${tasksCollectedThisMinute}`);
      fillAddressField();
    }
  } else {
    console.log('[AutoCollector] No eligible tasks found, refreshing...');
    refreshPage();
    return; // Exit loop, will restart after page reload
  }

  // Schedule next check
  setTimeout(collectionLoop, CONFIG.checkInterval);
}

// Start the collector
function startCollector() {
  if (isRunning) return;
  
  isRunning = true;
  tasksCollectedThisMinute = 0;
  
  // Reset counter every minute
  minuteResetTimer = setInterval(resetTaskCounter, 60000);
  
  console.log('[AutoCollector] Started');
  chrome.runtime.sendMessage({ action: 'updateStatus', status: 'running' });
  
  collectionLoop();
}

// Stop the collector
function stopCollector() {
  isRunning = false;
  
  if (minuteResetTimer) {
    clearInterval(minuteResetTimer);
    minuteResetTimer = null;
  }
  
  console.log('[AutoCollector] Stopped');
  chrome.runtime.sendMessage({ action: 'updateStatus', status: 'stopped' });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[AutoCollector] Received message:', request.action);
  
  try {
    if (request.action === 'start') {
      startCollector();
      sendResponse({ success: true, status: 'running', tasksCollected: tasksCollectedThisMinute, limit: CONFIG.maxTasksPerMinute });
    } else if (request.action === 'stop') {
      stopCollector();
      sendResponse({ success: true, status: 'stopped', tasksCollected: tasksCollectedThisMinute, limit: CONFIG.maxTasksPerMinute });
    } else if (request.action === 'getStatus') {
      sendResponse({ 
        success: true,
        status: isRunning ? 'running' : 'stopped',
        tasksCollected: tasksCollectedThisMinute,
        limit: CONFIG.maxTasksPerMinute
      });
    } else if (request.action === 'updateConfig') {
      if (request.config.maxTasksPerMinute) CONFIG.maxTasksPerMinute = request.config.maxTasksPerMinute;
      if (request.config.maxTaskAge) CONFIG.maxTaskAge = request.config.maxTaskAge;
      sendResponse({ success: true, config: CONFIG });
    } else {
      sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('[AutoCollector] Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  }
  
  return true; // Keep channel open for async response
});

// Notify that script is ready
console.log('[AutoCollector] Extension loaded and ready. Use popup to start/stop.');

// Send ready signal
try {
  chrome.runtime.sendMessage({ action: 'contentScriptReady' });
} catch (e) {
  // Ignore if background script isn't ready yet
}