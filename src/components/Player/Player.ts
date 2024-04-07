import IconVolumeHigh from '@src/assets/icons/volume-high.svg';
import IconVolumeLow from '@src/assets/icons/volume-low.svg';
import IconVolumeMute from '@src/assets/icons/volume-mute.svg';
import IconPause from '@src/assets/icons/pause.svg';

import { SoundProps, SoundTypes } from '../../types';
import { ISound, Sound } from '../Sound';

interface IPlayerOptions {
  sounds: SoundProps[];
  title?: string;
};

interface IPlayerState {
  activeSound: ISound;
  background: string;
  title: string;
  sounds: Record<string, ISound>;
  currentTime: number;
  currentVolume: number;
  volumeIcon: string;
  timer?: NodeJS.Timeout;
};

interface IPlayerElements {
  player: HTMLAudioElement;
  background: HTMLDivElement;
  title: HTMLHeadingElement;
  sounds: HTMLDivElement;
  volume: HTMLButtonElement;
  range: HTMLInputElement;
  output: HTMLSpanElement;
}

export class Player {
  public container: HTMLDivElement;

  private state: IPlayerState;
  private elements: IPlayerElements;
  private VALUE_VOLUME_HIGH = 50;

  constructor(container: HTMLDivElement, playerOptions: IPlayerOptions) {
    this.container = this.renderTemplate(container);
    this.state = this.getInitialState(playerOptions);
    this.elements = this.initElements();
  }

  private renderTemplate(container: HTMLDivElement) {
    const template = `
    <div class="background" id="background"></div>
    <section class="content">
      <h1 class="title" id="title"></h1>
      <div class="sounds" id="sounds"></div>
      <div class="controls">
        <button class="volume" id="volume"></button>
        <input type="range" id="range" />
        <span class="output" id="output"></span>
      </div>
    </section>
    `;

    container.insertAdjacentHTML('beforeend', template);

    return container;
  }

  private getInitialState({ sounds, title }: IPlayerOptions) {
    const soundsMap = sounds.reduce<Record<string, ISound>>((acc, curr) => {
      acc[curr.type] = new Sound(curr);

      return acc;
    }, {});

    const firstSoundType = sounds[0].type;
    const activeSound = soundsMap[firstSoundType];

    const state: IPlayerState = {
      activeSound,
      background: activeSound.image,
      title: title ?? 'Weather sounds',
      sounds: soundsMap,
      currentTime: 0,
      currentVolume: 50,
      volumeIcon: IconVolumeHigh,
    };

    return state;
  }

  private initElements() {
    const background = <HTMLDivElement>document.querySelector('#background');
    const title = <HTMLHeadingElement>document.querySelector('#title');
    const sounds = <HTMLDivElement>document.querySelector('#sounds');

    const volume = <HTMLButtonElement>document.querySelector('#volume');
    const range = <HTMLInputElement>document.querySelector('#range');
    const output = <HTMLInputElement>document.querySelector('#output');

    const player = new Audio();

    player.loop = true;
    player.src = this.state.activeSound.audio;

    title.textContent = this.state.title;

    Object.values(this.state.sounds).forEach((sound) => {
      sounds.append(sound.element);
    });

    const volumeIconElement = new Image();
    volumeIconElement.src = this.state.volumeIcon;
    volumeIconElement.classList.add('icon');
    volume.append(volumeIconElement);

    output.textContent = `${this.state.currentVolume}`;

    const elements = {
      player,
      title,
      background,
      sounds,
      volume,
      range,
      output,
    };

    return elements;
  }

  private renderVolumeIcon() {
    const volumeIcon = <HTMLImageElement>this.elements.volume.children[0];
    volumeIcon.src = this.state.volumeIcon;
  };

  private setVolumeIcon(value: number): this {
    if (value <= 0) {
      this.state.volumeIcon = IconVolumeMute;
      return this;
    }

    if (value < this.VALUE_VOLUME_HIGH) {
      this.state.volumeIcon = IconVolumeLow;
      return this;
    }

    this.state.volumeIcon = IconVolumeHigh;
    return this;
  }

  private setVolumeTimeout() {
    if (this.state?.timer) {
      clearTimeout(this.state.timer);
    }

    const timer = setTimeout(() => {
      this.elements.output.classList.add('output_hidden');
    }, 2000);

    this.state.timer = timer;
  }

  private play(type: SoundTypes) {
    this.state.sounds[type].setSoundIcon(IconPause);
    this.elements.player.currentTime = this.state.currentTime;
    this.elements.player.play();
  }

  private pause(type: SoundTypes) {
    this.state.sounds[type].setSoundIcon(this.state.activeSound.icon);
    this.state.currentTime = this.elements.player.currentTime;
    this.elements.player.pause();
  }

  private toggleSound(newType: SoundTypes) {
    const { type, icon } = this.state.activeSound;

    if (type === newType) {
      this.elements.player.paused ? this.play(newType) : this.pause(newType);

      return;
    }

    this.state.sounds[type].setSoundIcon(icon);
    this.state.currentTime = 0;
    this.state.activeSound = this.state.sounds[newType];
    this.elements.player.src = this.state.sounds[newType].audio;
    this.elements.background.style.backgroundImage = `url(${this.state.sounds[newType].image})`;

    this.play(newType);
  }

  private onSoundClick() {
    this.elements.sounds.addEventListener('click', (e: MouseEvent) => {
      if (e.target instanceof HTMLButtonElement) {
        const newType = <SoundTypes>e.target.dataset?.type;

        if (newType) {
          this.toggleSound(newType);
        }
      }
    });
  }

  private onChangeVolume() {
    this.elements.range.addEventListener('input', (e: Event) => {
      if (e.target instanceof HTMLInputElement) {
        this.elements.player.volume = +e.target.value / 100;

        this.setVolumeIcon(+e.target.value).renderVolumeIcon();

        this.elements.output.classList.remove('output_hidden');
        this.elements.output.textContent = e.target.value;
        this.setVolumeTimeout();

        this.state.currentVolume = +e.target.value;
      }
    });
  }

  private onClickMute() {
    this.elements.volume.addEventListener('click', () => {
      if (this.elements.player.volume) {
        this.elements.player.volume = 0;

        this.setVolumeIcon(0).renderVolumeIcon();
        this.elements.range.value = '0';

        this.elements.output.classList.remove('output_hidden');
        this.elements.output.textContent = '0';
        this.setVolumeTimeout();

        return;
      }

      const volume = this.state.currentVolume;
      this.elements.player.volume = volume / 100;
      this.setVolumeIcon(volume).renderVolumeIcon();
      this.elements.range.value = `${volume}`;

      this.elements.output.classList.remove('output_hidden');
      this.elements.output.textContent = `${volume}`;
      this.setVolumeTimeout();
    });
  }

  private addEventListeners() {
    this.onSoundClick();
    this.onChangeVolume();
    this.onClickMute();
  }

  public init() {
    this.addEventListeners();
    this.setVolumeTimeout();
  }
}
