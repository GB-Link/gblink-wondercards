import { createEventDescriptor, mysteryGiftStep } from './descriptor.js';
import { BLISY_TICKET_PAYLOAD } from './blisy-payload.js';
import {
  defaultWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';

const identity = defaultWonderDistributorIdentity();

export const blisyMysteryEvent = createEventDescriptor({
  id: 'blisy-mystery-event',
  label: 'Blisy Mystery Event (e-Reader Unlock)',
  description: 'Unlocks Mystery Event on the main menu, the option Emerald uses to read e-Reader cards. The deliveryman asks you to save; after that, Mystery Event is on the main menu.',
  serialNo: RFU_SERIAL_WONDER_DISTRIBUTOR,
  mbootFlag: 0,
  maxPlayers: 0,
  gnameLabel: 'Wonder Card',
  unameLabel: 'DISTRIB',
  gnameBytes: identity.gnameBytes,
  unameBytes: identity.unameBytes,
  payloadBytes: BLISY_TICKET_PAYLOAD,
  // English Emerald's unlock: the other languages' Emerald never finish its script.
  roms: ['BPEE 1.0'],
  guideSteps: [
    'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
    'Select this event, click Connect, and wait for “Armed”.',
    mysteryGiftStep({ games: ['emerald'] }),
    'After the card saves, talk to the green-clad delivery person on Pokémon Center 2F.',
    'Save, then use Mystery Event from the menu as the card instructs.',
  ],
});
