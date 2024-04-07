import { SoundProps } from './types';

import BackgroundRainy from '@src/assets/rainy-bg.jpg';
import BackgroundSummer from '@src/assets/summer-bg.jpg';
import BackgroundWinter from '@src/assets/winter-bg.jpg';

import IconSun from '@src/assets/icons/sun.svg';
import IconRain from '@src/assets/icons/cloud-rain.svg';
import IconSnow from '@src/assets/icons/cloud-snow.svg';

import AudioRain from '@src/assets/sounds/rain.mp3';
import AudioSummer from '@src/assets/sounds/summer.mp3';
import AudioWinter from '@src/assets/sounds/winter.mp3';

export const SOUNDS: SoundProps[] = [
  {
    type: 'summer',
    image: BackgroundSummer,
    icon: IconSun,
    audio: AudioSummer,
  },
  {
    type: 'rain',
    image: BackgroundRainy,
    icon: IconRain,
    audio: AudioRain,
  },
  {
    type: 'snow',
    image: BackgroundWinter,
    icon: IconSnow,
    audio: AudioWinter,
  },
];
