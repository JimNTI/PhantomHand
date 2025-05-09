# 📖 Arduino Page Turner Controller

This project is a **serial-controlled page-turning mechanism** built using Arduino and a web interface written in HTML, JavaScript, and CSS. It controls three servos to turn pages left or right and tracks the number of completed and pending turns via a browser-based UI.

---

## 🛠️ Features

- ✅ Serial communication with Arduino via Web Serial API
- ✅ Controls 3 servos:
  - `wheelServo`: spins the turning mechanism
  - `positionServo`: adjusts the page position
  - `pushServo`: pushes the page to complete the turn
- ✅ Supports turning pages **left** or **right**
- ✅ Tracks completed and pending turns
- ✅ UI-based **Reset** to reset amount of pages turning

---

## 🧩 Components

### Hardware

- Arduino board (Uno, Mega, Nano, etc.)
- 3x Servo motors
- External 5V power supply (recommended for servos)
- Jumper wires, breadboard, etc.
- USB cable for Arduino connection

### Software

- `Arduino IDE` to upload the sketch
- Chrome-based browser (Chrome, Edge, Brave) with **Web Serial API** support
- This project folder (HTML, CSS, JS, and `.ino` file)

---

## 🚀 Getting Started

### 1. Upload the Arduino Code

Open `page_turner.ino` in the Arduino IDE and upload it to your board.

### 2. Serve the Web Files

You must host the web page via **HTTPS** or **localhost** to use Web Serial.

Use any local server:

- **Live Server** extension in VS Code  
  _Right-click your HTML file and choose “Open with Live Server”_

- **Node.js** (if installed):
  ```bash
  npx http-server
