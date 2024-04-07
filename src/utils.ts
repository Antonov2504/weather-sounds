import { SoundTypes } from "./types";

type CreateElementOptions = {
  tagName: string;
  className: string;
  innerHTML?: string;
};

const createElement = <T extends HTMLElement>({ tagName, className }: CreateElementOptions): T => {
  const element = <T>document.createElement(tagName);
  element.classList.add(className);

  return element;
};

type CreateElementSoundOptions = {
  type: SoundTypes;
  image: string;
  icon: string;
};

export const createElementSound = ({ type, image, icon }: CreateElementSoundOptions): HTMLButtonElement => {
  const buttonElement: HTMLButtonElement = createElement<HTMLButtonElement>({ tagName: 'button', className: 'button' });
  buttonElement.setAttribute('type', 'button');
  buttonElement.setAttribute('data-type', type);
  buttonElement.style.backgroundImage = `url(${image})`;
  
  const iconElement = new Image();
  iconElement.src = icon;
  iconElement.classList.add('icon');

  buttonElement.append(iconElement);

  return buttonElement;
};
