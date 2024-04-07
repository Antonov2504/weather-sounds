import './styles/index';

import { Player } from './components/Player';
import { SOUNDS } from './constants';

const container = <HTMLDivElement>document.querySelector('#container');

const player = new Player(container, { title: 'Weather sounds', sounds: SOUNDS });
player.init();
