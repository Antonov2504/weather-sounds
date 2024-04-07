import { SoundProps, SoundTypes } from '../../types';
import { createElementSound } from '../../utils';

export interface ISound {
  element: HTMLButtonElement;
  type: SoundTypes;
  image: string;
  icon: string;
  audio: string;
  setSoundIcon(src: string): void;
}

export class Sound implements ISound {
  element;
  type;
  image;
  icon;
  audio;

  constructor({ type, image, icon, audio }: SoundProps) {
    this.element = createElementSound({ type, image, icon });

    this.type = type;
    this.image = image;
    this.icon = icon;
    this.audio = audio;
  }

  setSoundIcon(src: string) {
    const imgElement = <HTMLImageElement>this.element.children[0];
    imgElement.src = src;
  }
};
