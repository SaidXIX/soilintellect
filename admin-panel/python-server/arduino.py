import serial
import time

# Define the serial port and baud rate
ser = serial.Serial('COM3', 9600)  # Replace 'COMX' with the appropriate port on your computer

try:
    while True:
        message = input("Enter message to send to Arduino: ")  # Get user input
        ser.write(message.encode())  # Send the message to the Arduino
        time.sleep(0.1)  # Optional: add a small delay
        while ser.in_waiting:
            print("Message received from Arduino:", ser.readline().decode().strip())  # Read and print incoming messages from Arduino
except KeyboardInterrupt:
    ser.close()