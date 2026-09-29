import { createEventDescriptor, mysteryGiftStep } from './descriptor.js';
import { JPAJ_FRLG_WONDERCARDS } from './jpaj-frlg-wondercards.js';
import {
  frlgWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';

const identity = frlgWonderDistributorIdentity();

const GUIDE = [
  'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
  'Select this event, click Connect, and wait for “Armed”.',
  mysteryGiftStep({ games: ['frlg'] }),
  'After the card saves, talk to the green-clad delivery person on Pokémon Center 2F.',
];

export const jpajFrlgWondercardEvents = JPAJ_FRLG_WONDERCARDS.map((card) =>
  createEventDescriptor({
    id: card.id,
    label: card.label,
    description: card.description,
    serialNo: RFU_SERIAL_WONDER_DISTRIBUTOR,
    mbootFlag: 0,
    maxPlayers: 0,
    gnameLabel: 'Wonder Card',
    unameLabel: 'DISTRIB',
    gnameBytes: identity.gnameBytes,
    unameBytes: identity.unameBytes,
    payloadBytes: card.payload,
    guideSteps: GUIDE,
    game: 'frlg',
  }),
);
