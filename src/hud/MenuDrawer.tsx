import { openPanel } from '../state/settings';
import { config } from '../config';
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
            <p>
              {config.siteName} IS A COMMUNITY SIGHTINGS MAP. ANYONE, ANYWHERE ON EARTH CAN PUT
              A SIGHTING ON THE MAP — AND EVERYONE ELSE SEES IT.
            </p>
            <p class="help-line">
              <span class="help-pin" /> A STAR PIN IS A SIGHTING. TAP IT TO READ THE REPORT.
            </p>
            <p class="help-line">
              <span class="help-web" /> A WEB IS A CLUSTER. TAP TO ZOOM IN AND SPLIT IT.
            </p>
            <p>SCROLL TO ZOOM IN CHUNKY STEPS. LEAVE THE MAP ALONE AND THE GLOBE SPINS.</p>
            <p>
              TO REPORT: HIT <b>REPORT SIGHTING</b>, DROP YOUR PIN, SAY WHAT YOU SAW. NO ACCOUNT
              NEEDED.
            </p>
            <p class="help-foot">
              UNOFFICIAL FAN PROJECT · OPEN SOURCE · BE COOL, DON'T POST ANYTHING GROSS.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
