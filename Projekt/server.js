const express = require('express');
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
app.use(express.static(__dirname));

const wss = new WebSocket.Server({ port: 8081 });
let arduinoPort = null;

async function connectToArduino() {
  try {
    const ports = await SerialPort.list();
    const arduino = ports.find(p => p.manufacturer?.includes('Silicon Labs'));
    
    console.log(ports);
    console.log(arduino);

    if (arduino) {
      arduinoPort = new SerialPort({ 
        path: arduino.path, 
        baudRate: 9600 
      });
      
      arduinoPort.on('open', () => {
        console.log(`Arduino connected at ${arduino.path}`);
        
                const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));
        
        parser.on('data', (data) => {
          const msg = data.toString().trim();
          console.log('Arduino:', msg);
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(msg);
            }
          });
        });
      });
      
      arduinoPort.on('error', (err) => {
        console.error('Arduino error:', err.message);
      });
    } else {
      console.warn('Arduino not found');
    }
  } catch (err) {
    console.error('Port listing error:', err);
  }
}

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (msg) => {
    const command = msg.toString().trim();
    console.log('Received command:', command);
    
    if (arduinoPort?.isOpen) {
      arduinoPort.write(command + '\n', (err) => {
        if (err) console.error('Write error:', err);
      });
    } else {
      console.log("Arduino closed. ");
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

connectToArduino();
app.listen(8081, () => console.log('HTTP server running on http://localhost:8081'));