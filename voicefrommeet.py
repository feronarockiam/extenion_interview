import pyaudio
import wave
import keyboard
from pydub import AudioSegment
import os
# Set the recording parameters
chunk = 1024
sample_format = pyaudio.paInt16
channels = 2
fs = 44100
OUTPUT_FILE_NAME = "out.wav"    # file name.
OUTPUT_FILE_NAME_MP3 = "out.mp3"    # mp3 file name.
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

# Record the audio until the specified key is pressed
while not keyboard.is_pressed('q'):
    data = stream.read(chunk)
    frames.append(data)

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
AudioSegment.from_wav(OUTPUT_FILE_NAME).export(OUTPUT_FILE_NAME_MP3, format="mp3")
os.remove("out.wav")