void setup() {
  Serial.begin(9600); // Starts the serial communication
}
int counter = 0;
void loop() {
  Serial.println(counter);
  counter ++;
  delay(1000);
}
