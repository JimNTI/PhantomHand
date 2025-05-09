let port;
let writer;
let leftCount = 0;
let rightCount = 0;
let pendingLeft = 0;
let pendingRight = 0;
const socket = new WebSocket('ws://[YOUR-COMPUTER-IP]:8081');

function updateCounters() {
  document.getElementById("leftCount").textContent = leftCount;
  document.getElementById("rightCount").textContent = rightCount;
  document.getElementById("pendingLeft").textContent = pendingLeft;
  document.getElementById("pendingRight").textContent = pendingRight;
}

async function connectToArduino() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const decoder = new TextDecoderStream();
    const inputDone = port.readable.pipeTo(decoder.writable);
    const inputStream = decoder.readable;
    const reader = inputStream.getReader();

    const encoder = new TextEncoderStream();
    const outputDone = encoder.readable.pipeTo(port.writable);
    writer = encoder.writable.getWriter();

    logMessage("✅ Connected to Arduino", 'system');
    updateCounters();
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        console.log("RAW DATA:", value);
        const msg = value.trim();
        // 🚨 REMOVED: logMessage("⚡ " + msg, 'system'); // No longer show Arduino messages
        
        // When Arduino completes an action, decrement pending count
        if (msg === "l") { // Checks for any left-related signal
          pendingLeft = Math.max(0, pendingLeft - 1);
          leftCount++;
          updateCounters();
          logMessage("✔️ Left turn completed", 'completed'); // User-friendly message
        }
        else if (msg === "r") { // Checks for any right-related signal
          pendingRight = Math.max(0, pendingRight - 1);
          rightCount++;
          updateCounters();
          logMessage("✔️ Right turn completed", 'completed'); // User-friendly message
        }
      }
    }
  } catch (err) {
    logMessage("❌ Connection error: " + err, 'error');
  }
}

// [Rest of your code stays EXACTLY THE SAME]
async function sendCommand(command) {
  if (!writer) {
    logMessage("⚠️ Please connect first", 'error');
    return;
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
    await writer.write(command + "\n");
    
    if (command === "left") {
      pendingLeft++;
      logMessage("⏳ Queued LEFT turn (Pending: " + pendingLeft + ")", 'pending');
    } 
    else if (command === "right") {
      pendingRight++;
      logMessage("⏳ Queued RIGHT turn (Pending: " + pendingRight + ")", 'pending');
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
    logMessage("❌ Send failed: " + err, 'error');
  }
}



// Display messages in log
function logMessage(msg, type = 'system') {
  const log = document.getElementById("log");
  const message = document.createElement("div");
  message.textContent = msg;
  message.className = 'message ' + type;
  log.appendChild(message);
  log.scrollTop = log.scrollHeight;
}

// Initialize
updateCounters();

// Button event listeners
document.getElementById("connectBtn").addEventListener("click", connectToArduino);
document.getElementById("leftBtn").addEventListener("click", () => sendCommand("left"));
document.getElementById("rightBtn").addEventListener("click", () => sendCommand("right"));
document.getElementById("resetBtn").addEventListener("click", () => sendCommand("reset"));