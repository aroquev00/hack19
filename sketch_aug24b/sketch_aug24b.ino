volatile int pulsos;
int sensor = 2;
float factor = 7.5;
long dt =0;
long t0 = 0;
float litrosTotales = 0;
int cont = 0;
int mes =0;
int year = 2019;
int dia = 0;
double tarifa[26];
double num=0,money;
double metros = 0;


void contarPulsos(){
  pulsos++;
}

int diasMes(int mes, int year){
  switch(mes){
    case 1 :
    case 3 :
    case 5 : 
    case 7 :
    case 8 :
    case 10 :
    case 12 :
      return 31;
      break;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
      break;
    case 2:
      if((year % 4 == 0)&&(year % 100 != 0)&&(year % 400 != 0)){
        return 29;
      }
      else{
        return 28;
      }
      break;
  }
}

int cuentaFrecuencia(){
  int frecuencia;
  pulsos = 0;
  interrupts();
  delay(1000);
  noInterrupts();
  frecuencia = pulsos;
  return frecuencia;
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(sensor, INPUT);
  attachInterrupt(0,contarPulsos,RISING);
  t0 = millis();
  tarifa[0]=0;
  for(int x=1;x<6;x++){
      tarifa[x]=num+1.68;
  }
  tarifa[7]=25.14;
  tarifa[8]=38.35;
  tarifa[9]=51.51;
  tarifa[10]=64.64;
  tarifa[11]=89.95;
  tarifa[12]=105.2;
  tarifa[13]=120.45;
  tarifa[14]=135.66;
  tarifa[15]=150.92;
  tarifa[16]=163.04;
  tarifa[17]=175.34;
  tarifa[18]=187.65;
  tarifa[19]=199.88;
  tarifa[20]=212.15;
  tarifa[21]=237.75;
  tarifa[22]=263.34;
  tarifa[23]=288.83;
  tarifa[24]=314.49;
  tarifa[25]=340.22;
}

void loop() {
  // put your main code here, to run repeatedly:
  float frecuencia = cuentaFrecuencia();
  float caudalM = frecuencia/factor;

  dt = millis() - t0;
  t0 = millis(); 

  litrosTotales += (caudalM/60)*(dt/1000);
  metros += ((caudalM/60)*(dt/1000));

  Serial.print("Agua#"); 
  Serial.print(caudalM,3); 
  Serial.print("#");
  Serial.print(litrosTotales,3);
  Serial.print("#");

 if(metros<7){
      money=tarifa[int(metros)];
      Serial.println(money+47.88);
      
  }
  if((metros>6)&&(metros<11)){
      money=tarifa[int(metros)];
      Serial.println(money+56.97);
       
  }
  if(metros>10){
      money=tarifa[int(metros)];
      Serial.println(money+65.84);
       
  }

  cont++;

  if(cont >= 86400){
    Serial.print("nuevoDia#");
    Serial.println(litrosTotales); 
    cont = 0;
    dia++;
    if(dia >= diasMes(mes, year)){
      Serial.print("nuevoMes#");
      Serial.println(litrosTotales);
      mes++;
      dia = 0;
    }
    litrosTotales = 0;
  }
}
