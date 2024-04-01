export type SoundTypes = 'summer' | 'rain' | 'snow';

export interface SoundProps {
  type: SoundTypes;
  image: string;
  icon: string;
  audio: string;
};
