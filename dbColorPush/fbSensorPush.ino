// Reads color sensor data
// connects to firebase RTDB
// stores color readings in db

//Required WiFiNINA Library for Arduino from https://github.com/arduino-libraries/WiFiNINA
#include "secret.hpp"
#include <WiFiNINA.h>
#include "Firebase_Arduino_WiFiNINA.h"
#define DATABASE_URL "arduino-test-5f775-default-rtdb.firebaseio.com"  //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app

#include <Arduino_JSON.h>       // for simplifying JSON formatting:
#include "Adafruit_APDS9960.h"  //for the color sensor

// secrets!
char WIFI_SSID[] = SECRET_SSID;  // your network SSID (name)
char WIFI_PASSWORD[] = SECRET_PASS;
char DATABASE_SECRET[] = SECRET_DB;

//Define Firebase data object
FirebaseData fbdo;
//TODO: change this
String path = "/demo";

JSONVar data;


//color sensor business
Adafruit_APDS9960 apds;

int rgb[] = { 255, 120, 0 };

void setup() {

  Serial.begin(115200);
  delay(100);
  Serial.println();

  Serial.print("Connecting to Wi-Fi");
  int status = WL_IDLE_STATUS;
  while (status != WL_CONNECTED) {
    status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print(".");
    delay(100);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  //Provide the autntication data
  Firebase.begin(DATABASE_URL, " ", WIFI_SSID, WIFI_PASSWORD);
  Firebase.reconnectWiFi(true);

  //setup the sensor
  if (!apds.begin()) {
    Serial.println("failed to initialize device! Please check your wiring.");
  } else Serial.println("Device initialized!");

  //enable color sensign mode
  apds.enableColor(true);
}

void loop() {
  setColor();  //update the color values

  // unsigned long long val = millis();
  data["time"] = String(WiFi.getTime());                                             //use the wifi to get time, hits zero on the first go?
  data["reading"] = String(rgb[0]) + ", " + String(rgb[1]) + ", " + String(rgb[2]);  //send as a string
  //Serial.println(JSON.stringify(data));

  //sedning json
  Serial.print("Push json... ");


  //set the current reading
  //TODO: add a time stamp to this as well, see below functino
  if (Firebase.setString(fbdo, path + "/current/", data["reading"])) {
    Serial.println("ok");
    Serial.println("path: " + fbdo.dataPath());
    Serial.print("push name: ");
  } else {
    Serial.println("error, " + fbdo.errorReason());
  }

  //push the current reading to an array
  //TODO, get a location?
  //TODO, add a unique identifier to the path at the start of each "portrait"
  if (Firebase.pushJSON(fbdo, path + "/readings/", JSON.stringify(data))) {
    Serial.println("ok");
    Serial.println("path: " + fbdo.dataPath());
    Serial.print("push name: ");
    Serial.println(fbdo.pushName());
  } else {
    Serial.println("error, " + fbdo.errorReason());
  }

  Serial.println();

  // clear internal memory used
  fbdo.clear();

  delay(10000);  //delay, only hit the server every 10 seconds
}

void setColor() {
  //create some variables to store the color data in
  uint16_t r, g, b, c;
  // int red, green, blue;

  //wait for color data to be ready
  while (!apds.colorDataReady()) {
    delay(5);
  }

  //get the raw data and print the different channels
  apds.getColorData(&r, &g, &b, &c);
  //Serial.print("red: ");
  //Serial.print(r);
  //Serial.print(" green: ");
  //Serial.print(" blue: ");
  //Serial.print(b);
  //Serial.print(" clear: ");
  //Serial.println(c);
  //Serial.println();

  //calculate rgb
  //individual values are a % of the ambient(c) light
  //so dividing any channel by the ambient light gives you a value from 0 to 1
  //multiplying by 255 moves it into rgb value mode.
  //TODO, see about other methods for converting color to the rgb spectrum
  rgb[0] = int(255 * r / c);
  rgb[1] = int(255 * g / c);
  rgb[2] = int(255 * b / c);
}

// from chat gpt, bit shift
//convert to store colors in an array
// Function to convert 16-bit color values to 8-bit
void convertTo8bit(uint16_t red_16bit, uint16_t green_16bit, uint16_t blue_16bit, uint8_t &red_8bit, uint8_t &green_8bit, uint8_t &blue_8bit) {
  // Right shift by 8 bits (equivalent to dividing by 256)
  red_8bit = red_16bit >> 8;
  green_8bit = green_16bit >> 8;
  blue_8bit = blue_16bit >> 8;
}
