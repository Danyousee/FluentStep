// Web Speech API speech-to-text service

export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: ((res: SpeechRecognitionResultPayload) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let confidence = 0.9;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            confidence = result[0].confidence || 0.9;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (this.onResultCallback && text) {
          this.onResultCallback({
            transcript: text.trim(),
            isFinal: Boolean(finalTranscript),
            confidence,
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        if (this.onErrorCallback) {
          let msg = 'Could not capture microphone audio.';
          if (event.error === 'not-allowed') msg = 'Microphone permission denied. Please allow microphone access in browser settings.';
          if (event.error === 'no-speech') msg = 'No speech detected. Please speak closer to your microphone.';
          this.onErrorCallback(msg);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      };
    }
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public startListening(
    onResult: (res: SpeechRecognitionResultPayload) => void,
    onError?: (err: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) {
      if (onError) onError('Speech Recognition is not supported on this browser.');
      return false;
    }

    try {
      this.onResultCallback = onResult;
      this.onErrorCallback = onError || null;
      this.onEndCallback = onEnd || null;
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e: any) {
      console.warn('Failed to start speech recognition:', e);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
