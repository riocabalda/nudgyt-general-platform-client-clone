import { LANGUAGE_CODES } from './languageCodes'

export const DEFAULT_VOICE_TYPES = [
  {
    name: 'Male',
    voice_value: 'Male',
    sample_link:
      'https://storage.googleapis.com/tts-voice-samples/MALE_sampleVoice.wav',
    gender: 'MALE',
    lang_codes: LANGUAGE_CODES
  },
  {
    name: 'Female',
    voice_value: 'Female',
    sample_link:
      'https://storage.googleapis.com/tts-voice-samples/FEMALE_sampleVoice.wav',
    gender: 'FEMALE',
    lang_codes: LANGUAGE_CODES
  }
]
