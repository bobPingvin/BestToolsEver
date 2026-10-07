// High-Fidelity Occult & Celestial Web Audio Synthesizer (Zero external dependencies)
class OccultAudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cursed_tools_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  public ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // ignore
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cursed_tools_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  // =========================================================================
  // 1. CELESTIAL SOUND: VIBRATING ANGELIC CHOIR (Вибрирующий ангельский хор)
  // =========================================================================
  public playVibratingAngelicChoir() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Master Choir Gain & Compressor for lush, full sound
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, t);
    compressor.knee.setValueAtTime(12, t);
    compressor.ratio.setValueAtTime(8, t);
    compressor.attack.setValueAtTime(0.005, t);
    compressor.release.setValueAtTime(0.25, t);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, t);
    masterGain.gain.linearRampToValueAtTime(0.75, t + 0.6); // Loud and clear
    masterGain.gain.setValueAtTime(0.75, t + 2.2);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 5.2);

    masterGain.connect(compressor);
    compressor.connect(ctx.destination);

    // Vibrato LFO: 5.5 Hz frequency pitch oscillation for trembling angelic voices
    const vibratoLfo = ctx.createOscillator();
    vibratoLfo.frequency.setValueAtTime(5.5, t);

    const vibratoGain = ctx.createGain();
    vibratoGain.gain.setValueAtTime(4.8, t); // Pitch deviation in Hz
    vibratoLfo.connect(vibratoGain);

    // Tremolo LFO: 5.5 Hz amplitude pulsation (vibrato tremolo)
    const tremoloLfo = ctx.createOscillator();
    tremoloLfo.frequency.setValueAtTime(5.5, t);

    const tremoloGain = ctx.createGain();
    tremoloGain.gain.setValueAtTime(0.12, t);
    tremoloLfo.connect(tremoloGain.gain);

    // Formant Vowel Filter Bank 1 (Choral Formant ~800 Hz "Aaaah")
    const formantA = ctx.createBiquadFilter();
    formantA.type = 'bandpass';
    formantA.frequency.setValueAtTime(820, t);
    formantA.Q.setValueAtTime(3.2, t);
    formantA.connect(masterGain);

    // Formant Vowel Filter Bank 2 (Choral High Air ~2400 Hz)
    const formantB = ctx.createBiquadFilter();
    formantB.type = 'bandpass';
    formantB.frequency.setValueAtTime(2450, t);
    formantB.Q.setValueAtTime(2.8, t);
    formantB.connect(masterGain);

    // Wide Direct Mix (Low-passed for body)
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(3800, t);
    bodyFilter.connect(masterGain);

    // Polyphonic Angelic Chord: D Major 9 / Celestial Triads
    // D3, A3, D4, F#4, A4, C#5, E5, A5
    const choirChord = [146.83, 220.00, 293.66, 369.99, 440.00, 554.37, 659.25, 880.00];

    choirChord.forEach((freq, idx) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const voiceGain = ctx.createGain();

      osc1.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
      osc2.type = 'sine';

      // Chorus detuning
      const detune = (idx % 2 === 0 ? 1 : -1) * (4 + idx * 1.5);
      osc1.frequency.setValueAtTime(freq, t);
      osc2.frequency.setValueAtTime(freq * Math.pow(2, detune / 1200), t);

      // Connect vibrato
      vibratoGain.connect(osc1.frequency);
      vibratoGain.connect(osc2.frequency);

      const amp = 0.28 / Math.sqrt(choirChord.length);
      voiceGain.gain.setValueAtTime(amp, t);

      osc1.connect(voiceGain);
      osc2.connect(voiceGain);

      voiceGain.connect(formantA);
      voiceGain.connect(formantB);
      voiceGain.connect(bodyFilter);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 5.3);
      osc2.stop(t + 5.3);
    });

    // Angelic harp bell shimmer sweep across the chord
    choirChord.slice(2).forEach((freq, i) => {
      const shimmerOsc = ctx.createOscillator();
      const shimmerGain = ctx.createGain();

      shimmerOsc.type = 'sine';
      shimmerOsc.frequency.setValueAtTime(freq * 2, t + i * 0.08);

      shimmerGain.gain.setValueAtTime(0, t);
      shimmerGain.gain.setValueAtTime(0.18, t + i * 0.08);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 2.0);

      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(masterGain);

      shimmerOsc.start(t + i * 0.08);
      shimmerOsc.stop(t + i * 0.08 + 2.1);
    });

    vibratoLfo.start(t);
    tremoloLfo.start(t);
    vibratoLfo.stop(t + 5.4);
    tremoloLfo.stop(t + 5.4);
  }

  // =========================================================================
  // 2. INFERNAL SOUND: REVERSED PIANO + DEVIL'S ROAR (Проклятое пианино + рык)
  // =========================================================================
  public playCursedReversePianoWithRoar() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Master Limiter / Compressor for heavy bass punch without clipping
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-14, t);
    compressor.knee.setValueAtTime(8, t);
    compressor.ratio.setValueAtTime(12, t);
    compressor.attack.setValueAtTime(0.002, t);
    compressor.release.setValueAtTime(0.2, t);
    compressor.connect(ctx.destination);

    // --- PART 1: HAUNTING REVERSED PIANO SWELL ---
    const reverseDuration = 1.5;
    const pianoGain = ctx.createGain();
    pianoGain.gain.setValueAtTime(0.0001, t);
    // Reverse envelope: exponential crescendo from silence to peak volume at reverseDuration
    pianoGain.gain.exponentialRampToValueAtTime(0.85, t + reverseDuration);
    // Sudden sharp cutoff / dark decaying ring
    pianoGain.gain.exponentialRampToValueAtTime(0.0001, t + reverseDuration + 2.5);

    const pianoFilter = ctx.createBiquadFilter();
    pianoFilter.type = 'lowpass';
    pianoFilter.frequency.setValueAtTime(280, t);
    pianoFilter.frequency.exponentialRampToValueAtTime(4500, t + reverseDuration);
    pianoFilter.frequency.exponentialRampToValueAtTime(250, t + reverseDuration + 2.2);

    pianoGain.connect(pianoFilter);
    pianoFilter.connect(compressor);

    // Creepy Dissonant Devil's Tritone Piano Chords: C3, D#3, F#3, A3, C4, D#4, F#4
    const pianoNotes = [130.81, 155.56, 185.00, 220.00, 261.63, 311.13, 369.99];

    pianoNotes.forEach((freq, idx) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';

      // Reverse tape pitch bend effect: pitch rises into the chord
      osc1.frequency.setValueAtTime(freq * 0.92, t);
      osc1.frequency.exponentialRampToValueAtTime(freq, t + reverseDuration);

      osc2.frequency.setValueAtTime(freq * 0.92 * 1.01, t);
      osc2.frequency.exponentialRampToValueAtTime(freq * 1.01, t + reverseDuration);

      const amp = 0.28 / Math.sqrt(pianoNotes.length);
      noteGain.gain.setValueAtTime(amp, t);

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(pianoGain);

      osc1.start(t + idx * 0.02);
      osc2.start(t + idx * 0.02);
      osc1.stop(t + reverseDuration + 2.6);
      osc2.stop(t + reverseDuration + 2.6);
    });

    // --- PART 2: VISCERAL DEMONIC ROAR / DEVIL'S BEAST GROWL ---
    const roarGain = ctx.createGain();
    roarGain.gain.setValueAtTime(0.0001, t);
    // Growl builds up underneath the piano and roars powerfully as piano reaches peak
    roarGain.gain.setValueAtTime(0.1, t + 0.5);
    roarGain.gain.linearRampToValueAtTime(0.9, t + reverseDuration);
    roarGain.gain.exponentialRampToValueAtTime(0.0001, t + reverseDuration + 2.8);

    // Demonic Throat Formant Resonant Filter (sweeping down from 750Hz to 85Hz)
    const throatFilter = ctx.createBiquadFilter();
    throatFilter.type = 'lowpass';
    throatFilter.frequency.setValueAtTime(750, t);
    throatFilter.frequency.exponentialRampToValueAtTime(110, t + reverseDuration + 2.2);
    throatFilter.Q.setValueAtTime(6.0, t); // High resonance for growl bite

    // Sub-bass boost
    const bassBoost = ctx.createBiquadFilter();
    bassBoost.type = 'peaking';
    bassBoost.frequency.setValueAtTime(80, t);
    bassBoost.gain.setValueAtTime(14, t);

    // Demonic Roar Sub-oscillators (35 Hz - 55 Hz)
    const roarOsc1 = ctx.createOscillator();
    roarOsc1.type = 'sawtooth';
    roarOsc1.frequency.setValueAtTime(58, t);
    roarOsc1.frequency.exponentialRampToValueAtTime(28, t + reverseDuration + 2.2);

    const roarOsc2 = ctx.createOscillator();
    roarOsc2.type = 'square';
    roarOsc2.frequency.setValueAtTime(46, t);
    roarOsc2.frequency.exponentialRampToValueAtTime(24, t + reverseDuration + 2.2);

    // Throat Flutter LFO (FM growl at 36 Hz)
    const flutterLfo = ctx.createOscillator();
    flutterLfo.type = 'sawtooth';
    flutterLfo.frequency.setValueAtTime(36, t);
    flutterLfo.frequency.linearRampToValueAtTime(18, t + reverseDuration + 2.0);

    const flutterGain = ctx.createGain();
    flutterGain.gain.setValueAtTime(32, t);
    flutterLfo.connect(flutterGain);
    flutterGain.connect(roarOsc1.frequency);
    flutterGain.connect(roarOsc2.frequency);

    // Distortion WaveShaper for visceral monstrous crunch
    const distortion = ctx.createWaveShaper();
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    const k = 60;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = '4x';

    // Gritty rasping breath noise of the demon
    const noiseDuration = reverseDuration + 2.5;
    const noiseBufferSize = ctx.sampleRate * noiseDuration;
    const noiseBuffer = ctx.createBuffer(1, noiseBufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBufferSize; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.sin((i / noiseBufferSize) * Math.PI);
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(500, t);
    noiseFilter.Q.setValueAtTime(2.2, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, t);
    noiseGain.gain.linearRampToValueAtTime(0.35, t + reverseDuration);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + reverseDuration + 2.2);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(distortion);

    roarOsc1.connect(distortion);
    roarOsc2.connect(distortion);
    distortion.connect(throatFilter);
    throatFilter.connect(bassBoost);
    bassBoost.connect(roarGain);
    roarGain.connect(compressor);

    roarOsc1.start(t);
    roarOsc2.start(t);
    flutterLfo.start(t);
    noiseSource.start(t);

    roarOsc1.stop(t + reverseDuration + 2.8);
    roarOsc2.stop(t + reverseDuration + 2.8);
    flutterLfo.stop(t + reverseDuration + 2.8);
    noiseSource.stop(t + reverseDuration + 2.8);
  }

  // --- OTHER SOUNDS ---
  public playDemonBell() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(110, t);
    osc1.frequency.exponentialRampToValueAtTime(104, t + 3.5);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(223, t);
    osc2.frequency.exponentialRampToValueAtTime(215, t + 2.5);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 3.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 3.8);
    osc2.stop(t + 3.8);
  }

  public playDoomHit() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + 1.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, t);
    filter.frequency.exponentialRampToValueAtTime(45, t + 1.2);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 1.4);
  }

  public playBloodSizzle() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.Q.setValueAtTime(4, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
  }

  public playRitualPulse() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const mainGain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, t);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(6, t);
    lfoGain.gain.setValueAtTime(15, t);
    lfo.connect(osc.frequency);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, t);

    mainGain.gain.setValueAtTime(0.3, t);
    mainGain.gain.linearRampToValueAtTime(0.4, t + 0.5);
    mainGain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

    osc.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(ctx.destination);

    osc.start(t);
    lfo.start(t);
    osc.stop(t + 2.2);
    lfo.stop(t + 2.2);
  }

  public playHolyBells() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.18);

      gain.gain.setValueAtTime(0, t);
      gain.gain.setValueAtTime(0.4 - idx * 0.05, t + idx * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + idx * 0.18 + 4.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + idx * 0.18);
      osc.stop(t + idx * 0.18 + 4.2);
    });
  }

  public playHarpShimmer() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 830.61, 880, 1108.73, 1318.51];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.06);

      gain.gain.setValueAtTime(0, t);
      gain.gain.setValueAtTime(0.25, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 1.3);
    });
  }

  public playAngelicChant() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const chord = [261.63, 329.63, 392.00, 523.25];
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 3.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 4.0);
    });
  }
}

export const occultAudio = new OccultAudioEngine();
