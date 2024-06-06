#include <SoftwareSerial.h>

#define RE 8
#define DE 7

const byte readCommand[] = {0x01, 0x03, 0x00, 0x00, 0x00, 0x07, 0x04, 0x08};
byte values[17];
SoftwareSerial mod(10, 11);

void setup() {
  Serial.begin(9600);
  mod.begin(4800);
  pinMode(RE, OUTPUT);
  pinMode(DE, OUTPUT);
}

void loop() {
  byte nitro, phos, pota, humidity, temperature, ph;
  if (readSensorData()) {
    nitro = values[10];
    phos = values[12];
    pota = values[14];
    humidity = values[3];
    temperature = values[5];
    ph = values[7];
  
    // Serial.print("N: ");
    // Serial.print(nitro);
    // Serial.println(" mg/kg");
    // Serial.print("P: ");
    // Serial.print(phos);
    // Serial.println(" mg/kg");
    // Serial.print("K: ");
    // Serial.print(pota);
    // Serial.println(" mg/kg");
    // Serial.print("humidity: ");
    // Serial.print(humidity / 10.0);
    // Serial.println(" %");
    // Serial.print("temperature: ");
    // Serial.print(temperature / 10.0);
    // Serial.println(" C");
    // Serial.print("ph: ");
    // Serial.print(ph / 10.0);
    // Serial.println();

    Serial.print("{\"N\":");
    Serial.print(nitro);
    Serial.print(",\"P\":");
    Serial.print(phos);
    Serial.print(",\"K\":");
    Serial.print(pota);
    Serial.print(",\"humidity\":");
    Serial.print(humidity / 10.0);
    Serial.print(",\"temperature\":");
    Serial.print(temperature / 10.0);
    Serial.print(",\"ph\":");
    Serial.print(ph / 10.0);
    Serial.println("}");
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
    delay(100);
    if (mod.available() > 0) {
      for (byte i = 0; i < 17; i++) {
        if (mod.available()) {
          values[i] = mod.read();
          // Serial.print(values[i], HEX);
          Serial.print(" ");
        }
      }
      Serial.println();
      return true;
    }
  }
  return false;
}
