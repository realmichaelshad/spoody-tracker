import { openPanel } from '../state/settings';
import { ActivityLog } from './ActivityLog';

interface Props {
  onReport: () => void;
  onJump: (id: string) => void;
}

export function MenuDrawer({ onReport, onJump }: Props) {
  const panel = openPanel.value;
  if (panel === 'none') return null;

  return (
    <div class="drawer-wrap" onClick={(e) => e.target === e.currentTarget && (openPanel.value = 'none')}>
      <div class="drawer">
        <div class="drawer-head">
          <span>{panel === 'menu' ? 'TRACKER MENU' : panel === 'log' ? 'ACTIVITY LOG' : 'HELP'}</span>
          <button class="drawer-close" onClick={() => (openPanel.value = 'none')} aria-label="Close">
            ×
          </button>
        </div>

        {panel === 'menu' && (
          <div class="panel-body menu-body">
            <button class="menu-item" onClick={() => (openPanel.value = 'log')}>
              ACTIVITY LOG
            </button>
            <button
              class="menu-item"
              onClick={() => {
                openPanel.value = 'none';
                onReport();
              }}
            >
              REPORT SIGHTING
            </button>
            <button class="menu-item" onClick={() => (openPanel.value = 'help')}>
              HELP
            </button>
          </div>
        )}

        {panel === 'log' && <ActivityLog onJump={onJump} />}

        {panel === 'help' && (
          <div class="panel-body help-body">
            <p class="help-line">
              <span class="help-pin" /> STAR = A SIGHTING. TAP IT.
            </p>
            <p class="help-line">
              <span class="help-web" /> WEB = A BUNCH OF THEM. TAP TO SPLIT.
            </p>
            <p>
              SEE SOMETHING? HIT <b>REPORT SIGHTING</b>, DROP A PIN, SAY WHAT YOU SAW. THE WHOLE
              WORLD SEES IT. NO ACCOUNT NEEDED.
            </p>
            <p>LIKE REPORTS, LEAVE REPLIES, AND WATCH THE SPIDER BUTTON FOR NEW ALERTS.</p>
            <p class="help-foot">
              UNOFFICIAL FAN PROJECT · OPEN SOURCE · BE COOL, DON'T POST ANYTHING GROSS.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
