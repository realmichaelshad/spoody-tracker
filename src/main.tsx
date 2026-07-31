import { render } from 'preact';
import { App } from './app';
import '@fontsource-variable/pixelify-sans';
import '@fontsource/jersey-10';
import '@fontsource/jersey-25';
import '@fontsource-variable/bitcount-prop-single';
import './styles/tokens.css';
import './styles/hud.css';
import './styles/popup.css';
import './styles/report.css';
import './styles/drawer.css';
import './styles/toast.css';
import './styles/preloader.css';
import './styles/radar.css';
import './styles/card.css';
import './styles/mobile.css';

render(<App />, document.getElementById('app')!);
