import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

class VoiceService {
  private isListening = false;

  constructor() {
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechError = this.onSpeechError;
    
    // Initialize TTS
    Tts.setDefaultLanguage('en-IN');
    Tts.setDefaultRate(0.5);
  }

  // Speech to Text
  async startListening(language: string = 'en-IN'): Promise<void> {
    try {
      if (this.isListening) {
        await this.stopListening();
      }
      await Voice.start(language);
      this.isListening = true;
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      throw error;
    }
  }

  async stopListening(): Promise<void> {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
      throw error;
    }
  }

  private onSpeechResults = (event: any) => {
    const text = event.value[0];
    console.log('Speech recognized:', text);
    return text;
  };

  private onSpeechError = (event: any) => {
    console.error('Speech recognition error:', event.error);
  };

  // Text to Speech
  async speak(text: string, language: string = 'en-IN'): Promise<void> {
    try {
      await Tts.setDefaultLanguage(language);
      await Tts.speak(text);
    } catch (error) {
      console.error('Error speaking:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await Tts.stop();
    } catch (error) {
      console.error('Error stopping TTS:', error);
      throw error;
    }
  }

  // Language support
  getSupportedLanguages(): string[] {
    return [
      'en-IN', // English (India)
      'hi-IN', // Hindi
      'ta-IN', // Tamil
      'te-IN', // Telugu
      'bn-IN', // Bengali
      'mr-IN', // Marathi
      'gu-IN', // Gujarati
      'kn-IN', // Kannada
    ];
  }

  async setLanguage(language: string): Promise<void> {
    try {
      await Tts.setDefaultLanguage(language);
    } catch (error) {
      console.error('Error setting language:', error);
      throw error;
    }
  }
}

export default new VoiceService();
