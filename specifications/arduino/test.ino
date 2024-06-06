#include <SoftwareSerial.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128    // OLED display width, in pixels
#define SCREEN_HEIGHT 64    // OLED display height, in pixels
#define OLED_RESET -1       // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define RE 8
#define DE 7

const byte readCommand[] = {0x01, 0x03, 0x00, 0x00, 0x00, 0x07, 0x04, 0x08}; // Read multiple registers
byte values[17];
SoftwareSerial mod(10, 11);

void setup() {
  Serial.begin(9600);
  mod.begin(4800); // Ensure the baud rate matches your sensor's settings
  pinMode(RE, OUTPUT);
  pinMode(DE, OUTPUT);
  
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C); // Initialize with the I2C addr 0x3C (128x64)
  delay(500);
  display.clearDisplay();
  display.setCursor(25, 15);
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.println(" NPK Sensor");
  display.setCursor(25, 35);
  display.setTextSize(1);
  display.print("Initializing");
  display.display();
  delay(3000);
}

void loop() {
  byte nitro, phos, pota, humidity, temperature, pH;
  if (readSensorData()) {
    nitro = values[10];
    phos = values[12];
    pota = values[14];
    humidity = values[3];
    temperature = values[5];
    pH = values[7];
  
    Serial.print("Nitrogen: ");
    Serial.print(nitro);
    Serial.println(" mg/kg");
    Serial.print("Phosphorous: ");
    Serial.print(phos);
    Serial.println(" mg/kg");
    Serial.print("Potassium: ");
    Serial.print(pota);
    Serial.println(" mg/kg");
    Serial.print("Humidity: ");
    Serial.print(humidity / 10.0);
    Serial.println(" %");
    Serial.print("Temperature: ");
    Serial.print(temperature / 10.0);
    Serial.println(" C");
    Serial.print("pH: ");
    Serial.print(pH / 10.0);
    Serial.println();
  
    display.clearDisplay();
  
    display.setTextSize(2);
    display.setCursor(0, 0);
    display.print("N: ");
    display.print(nitro);
    display.setTextSize(1);
    display.print(" mg/kg");

    display.setTextSize(2);
    display.setCursor(0, 15);
    display.print("P: ");
    display.print(phos);
    display.setTextSize(1);
    display.print(" mg/kg");

    display.setTextSize(2);
    display.setCursor(0, 30);
    display.print("K: ");
    display.print(pota);
    display.setTextSize(1);
    display.print(" mg/kg");

    display.setTextSize(2);
    display.setCursor(0, 45);
    display.print("H: ");
    display.print(humidity / 10.0);
    display.setTextSize(1);
    display.print(" %");

    display.setTextSize(2);
    display.setCursor(0, 60);
    display.print("T: ");
    display.print(temperature / 10.0);
    display.setTextSize(1);
    display.print(" C");

    display.setTextSize(2);
    display.setCursor(64, 60);
    display.print("pH: ");
    display.print(pH / 10.0);
    display.setTextSize(1);

    display.display();
  } else {
    Serial.println("Failed to read sensor data");
  }
  delay(2000);
}

bool readSensorData() {
  digitalWrite(DE, HIGH);
  digitalWrite(RE, HIGH);
  delay(10);
  if (mod.write(readCommand, sizeof(readCommand)) == 8) {
    digitalWrite(DE, LOW);
    digitalWrite(RE, LOW);
    delay(100); // Allow some time for response
    if (mod.available() > 0) {
      for (byte i = 0; i < 17; i++) {
        if (mod.available()) {
          values[i] = mod.read();
          Serial.print(values[i], HEX);
          Serial.print(" ");
        }
      }
      Serial.println();
      return true;
    }
  }
  return false;
}
