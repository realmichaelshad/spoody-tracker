import { render } from 'preact';
import '../styles/tokens.css';

function AdminApp() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div>TRACKER CONTROL — COMING ONLINE IN M8</div>
    </div>
  );
}

render(<AdminApp />, document.getElementById('admin')!);
