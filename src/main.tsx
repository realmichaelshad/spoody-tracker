import { render } from 'preact';
import { App } from './app';
import '@fontsource-variable/pixelify-sans';
import '@fontsource/jersey-10';
import '@fontsource/jersey-25';
import '@fontsource-variable/bitcount-prop-single';
import './styles/tokens.css';
import './styles/hud.css';

render(<App />, document.getElementById('app')!);
