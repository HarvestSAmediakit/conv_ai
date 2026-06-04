/**
 * Minimal Audio Processor Worklet
 * Converts Float32 PCM (Browser) to Int16 PCM (Live API)
 */
class AudioProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];
    const int16Buffer = new Int16Array(channelData.length);
    
    for (let i = 0; i < channelData.length; i++) {
        // Clamp and scale to Int16
        const s = Math.max(-1, Math.min(1, channelData[i]));
        int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    // Send to main thread
    this.port.postMessage(int16Buffer.buffer, [int16Buffer.buffer]);

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
