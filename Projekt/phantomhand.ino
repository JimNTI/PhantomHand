#include <Servo.h>

Servo pushServo;
Servo wheelServo;
Servo positionServo;

const int pushServoPin = 3;
const int posServoPin = 4;
const int wheelServoPin = 5;

int amountLeft = 0;
int amountRight = 0;
bool isExecuting = false; // Flag to track execution state

void setup() {
  Serial.begin(9600);

  pushServo.attach(pushServoPin);
  wheelServo.attach(wheelServoPin);
  positionServo.attach(posServoPin);

  wheelServo.write(90);
  positionServo.write(88);
  pushServo.write(90);
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    if (command == "reset") {
    reset();  // Only reset when explicitly commanded
    }
    if (command == "left") {
      amountLeft++;
    //  Serial.println("Added 1 to amountLeft");
    } else if (command == "right") {
      amountRight++;
    //  Serial.println("Added 1 to amountRight");
    }
  }

  // Process left turns - only decrement AFTER completion
  if (amountLeft > 0 && !isExecuting) {
    isExecuting = true;
    turnPage("left");
    amountLeft--; // Decrement only after successful completion
    isExecuting = false;
  }

  // Process right turns - only decrement AFTER completion
  if (amountRight > 0 && !isExecuting) {
    isExecuting = true;
    turnPage("right");
    amountRight--; // Decrement only after successful completion
    isExecuting = false;
  }

  if (amountRight == 0 && amountLeft == 0) {
    reset();
  }
}

void reset() {
  amountLeft = 0;
  amountRight = 0;
  wheelServo.write(90);
  positionServo.write(88);
  pushServo.write(90);
}

void turnPage(String direction) {
  moveServo(direction);
  spinPage(direction);
  pushPage(direction);
  sendInfo(direction);
}
void sendInfo(String direction) {
  if (direction == "right"){
    Serial.println("r");
  }
    if (direction == "left"){
    Serial.println("l");
  }
}
void moveServo(String direction) {
  if (direction == "right") {
    wheelServo.write(0);
    pushServo.write(180);
    positionServo.write(180);
    delay(500);
  } else if (direction == "left") {
    wheelServo.write(180);
    pushServo.write(0);
    positionServo.write(0);
    delay(500);
  }
}

void spinPage(String direction) {
  if (direction == "right") {
    wheelServo.write(180);
    delay(500);
  } else if (direction == "left") {
    wheelServo.write(0);
    delay(500);
  }
}

void pushPage(String direction) {
  if (direction == "right") {
    positionServo.write(160);
    delay(500);
    pushServo.write(0);
    delay(200);
    positionServo.write(88);
    delay(800);
    pushServo.write(0);
  } else if (direction == "left") {
    positionServo.write(20);
    delay(500);
    pushServo.write(180);
    delay(200);
    positionServo.write(88);
    delay(800);
    pushServo.write(0);
  }
}