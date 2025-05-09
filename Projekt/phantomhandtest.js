let leftCount = 0;
let rightCount = 0;
let pendingLeft = 0;
let pendingRight = 0;
const socket = new WebSocket('ws://localhost:8081');

// WebSocket event handlers
socket.addEventListener('open', () => {
  logMessage("✅ Connected to server", 'system');
  updateCounters();
});

socket.addEventListener('error', (error) => {
  logMessage(`❌ WebSocket error: ${error.message}`, 'error');
});

socket.addEventListener('close', () => {
  logMessage("⚠️ Disconnected from server", 'error');
});

socket.addEventListener('message', (event) => {
  const msg = event.data.trim();
  console.log("Received:", msg);
  
  if (msg === "l") {
    pendingLeft = Math.max(0, pendingLeft - 1);
    leftCount++;
    updateCounters();
    logMessage("✔️ Left turn completed", 'completed');
  }
  else if (msg === "r") {
    pendingRight = Math.max(0, pendingRight - 1);
    rightCount++;
    updateCounters();
    logMessage("✔️ Right turn completed", 'completed');
  }
});

function updateCounters() {
  document.getElementById("leftCount").textContent = leftCount;
  document.getElementById("rightCount").textContent = rightCount;
  document.getElementById("pendingLeft").textContent = pendingLeft;
  document.getElementById("pendingRight").textContent = pendingRight;
}

function logMessage(msg, type = 'system') {
  const log = document.getElementById("log");
  const message = document.createElement("div");
  message.textContent = msg;
  message.className = 'message ' + type;
  log.appendChild(message);
  log.scrollTop = log.scrollHeight;
}

async function sendCommand(command) {
  if (socket.readyState !== WebSocket.OPEN) {
    logMessage("⚠️ Not connected to server", 'error');
    return;
  }

  try {
    if (command === "left") {
      socket.send("l");
      pendingLeft++;
      logMessage(`⏳ Queued LEFT turn (Pending: ${pendingLeft})`, 'pending');
    } 
    else if (command === "right") {
      socket.send("r");
      pendingRight++;
      logMessage(`⏳ Queued RIGHT turn (Pending: ${pendingRight})`, 'pending');
    }
    else if (command === "reset") {
      leftCount = 0;
      rightCount = 0;
      pendingLeft = 0;
      pendingRight = 0;
      logMessage("🔄 Reset all counters", 'reset');
    }
    
    updateCounters();
  } catch (err) {
    logMessage(`❌ Send failed: ${err}`, 'error');
  }
}

// Initialize and set up event listeners
document.addEventListener('DOMContentLoaded', () => {
  updateCounters();
  document.getElementById("leftBtn").addEventListener("click", () => sendCommand("left"));
  document.getElementById("rightBtn").addEventListener("click", () => sendCommand("right"));
  document.getElementById("resetBtn").addEventListener("click", () => sendCommand("reset"));
});