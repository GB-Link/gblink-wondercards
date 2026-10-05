// The save backup and restore, listed with the cards: no card of their own,
// they run src/link/save.js on any FireRed, LeafGreen or Emerald.
import { createEventDescriptor, mysteryGiftStep } from './descriptor.js';
import { SAVE_ROMS } from '../link/save.js';
import { defaultWonderDistributorIdentity, RFU_SERIAL_WONDER_DISTRIBUTOR } from './rfu-identity.js';

const identity = defaultWonderDistributorIdentity();
const all = { games: ['frlg', 'emerald'], language: null, japanese: true };

const saveEvent = (partial) => createEventDescriptor({
  serialNo: RFU_SERIAL_WONDER_DISTRIBUTOR,
  gnameLabel: 'Wonder Card',
  unameLabel: 'DISTRIB',
  gnameBytes: identity.gnameBytes,
  unameBytes: identity.unameBytes,
  roms: SAVE_ROMS,
  game: null,
  ...partial,
});

export const saveEvents = [
  saveEvent({
    id: 'save-backup',
    label: 'Back up the save (.sav file)',
    kind: 'backup',
    description: 'Copies the whole save of FireRed, LeafGreen or Emerald to this page, as a .sav file for PKHeX or an emulator. Nothing on the cartridge changes: the game shows a message and does not save. It takes a few minutes.',
    guideSteps: ['Select this, click Connect, and wait for “Armed”.', mysteryGiftStep(all), 'Save the .sav file when the page offers it.'],
  }),
  saveEvent({
    id: 'save-restore',
    label: 'Restore a save (.sav file)',
    kind: 'restore',
    description: 'Writes a .sav file over the whole save of FireRed, LeafGreen or Emerald: a backup from this page, or a save from PKHeX or an emulator, for the same game and language. It goes beside the cartridge’s newest save and checks every sector before the game loads it and saves; until then, the cartridge keeps the save it had. Back up the save first.',
    guideSteps: ['Select this, choose the .sav file, click Connect, and wait for “Armed”.', mysteryGiftStep(all), 'Let the game finish saving.'],
  }),
];
