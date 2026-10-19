/**
 * Daily Red — first GB-Link Team event.
 * Payloads are built in the browser from embedded Wordle answers + Thumb templates.
 */
import { createEventDescriptor, eventGames, mysteryGiftStep } from './descriptor.js';
import {
  defaultWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';
import { generateDailyRed, ROMS } from '../dailyred/index.js';

const identity = defaultWonderDistributorIdentity();

function buildEvent() {
  const { date, variants } = generateDailyRed({ log: false });
  return createEventDescriptor({
    id: 'daily-red',
    label: `Daily Red (${date})`,
    description:
      'A daily Wonder Card battle against RED on stock English FireRed, LeafGreen, or Emerald. '
      + 'Talk to the delivery man in any Pokémon Center: your party is replaced with today’s '
      + 'team (seeded from the Wordle answer), you fight RED, then your original party is restored.',
    note: 'Soft-reset after wireless delivery so Mystery Gift loads cleanly.',
    credit: {
      href: 'https://github.com/danishjuneja/dailyred-improved',
      text: 'Adapted from dailyred-improved',
    },
    serialNo: RFU_SERIAL_WONDER_DISTRIBUTOR,
    mbootFlag: 0,
    maxPlayers: 0,
    gnameLabel: 'Wonder Card',
    unameLabel: 'DISTRIB',
    gnameBytes: identity.gnameBytes,
    unameBytes: identity.unameBytes,
    payloadBytes: Object.values(variants)[0][0],
    variants,
    roms: [...ROMS],
    game: null,
    guideSteps: [
      'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
      'Select Daily Red, click Connect, and wait for “Armed”.',
      mysteryGiftStep(eventGames({ roms: ROMS, variants })),
      'Soft-reset after the card saves, then talk to the delivery person on Pokémon Center 2F.',
    ],
  });
}

/** Built once per page load for today's local calendar date. */
export const dailyRedEvent = buildEvent();
