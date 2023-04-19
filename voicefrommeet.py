import pyaudio
import wave
import os

# Set the recording parameters
chunk = 1024
sample_format = pyaudio.paInt16
channels = 2
fs = 44100
OUTPUT_FILE_NAME = "out.wav"    # file name.

# Create an instance of PyAudio
p = pyaudio.PyAudio()

# Open the microphone stream
stream = p.open(format=sample_format,
                channels=channels,
                rate=fs,
                frames_per_buffer=chunk,
                input=True)

# Create a list to store the recorded data
frames = []

# Record the audio
while True:
    data = stream.read(chunk)
    frames.append(data)

    # Check if stop recording file exists
    
    if os.path.isfile('stop_recording'):
        print("inside it")
        os.remove('stop_recording')
        break
print("outside")
# Stop and close the microphone stream
stream.stop_stream()
stream.close()

# Terminate the PyAudio instance
p.terminate()

# Save the recorded audio as a WAV file
wf = wave.open(OUTPUT_FILE_NAME, "wb")
wf.setnchannels(channels)
wf.setsampwidth(p.get_sample_size(sample_format))
wf.setframerate(fs)
wf.writeframes(b"".join(frames))
wf.close()


































