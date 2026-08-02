/* Must run before any module reads persisted settings. */
import './lib/migrateStorage';
import { render } from 'preact';
import { primeLocation } from './map/ipLocate';
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
import './styles/radar.css';
import './styles/card.css';
import './styles/mobile.css';

/* Resolve the viewer's location in parallel with the map booting so the
   opening swoop starts immediately instead of waiting on the network. */
void primeLocation();

render(<App />, document.getElementById('app')!);
