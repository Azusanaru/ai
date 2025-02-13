import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

type VoiceConfig = {
  language: 'zh' | 'en';
  rate?: number;
};

export class VoiceNavigator {
  private currentLanguage: string = 'zh';
  
  async init(config: VoiceConfig) {
    this.currentLanguage = config.language;
    await Audio.requestPermissionsAsync();
    await Speech.speak('导航系统已就绪', { language: this.currentLanguage });
  }

  giveInstruction(instruction: string) {
    Speech.stop();
    Speech.speak(instruction, {
      language: this.currentLanguage,
      rate: 0.9
    });
  }

  switchLanguage(lang: 'zh' | 'en') {
    this.currentLanguage = lang;
  }
}

declare module 'expo-speech' {
  export function speak(text: string, options?: { language?: string }): void;
  export function stop(): void;
} 