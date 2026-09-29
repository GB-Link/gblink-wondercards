import { createEventDescriptor, eventGames, mysteryGiftStep } from './descriptor.js';
import { GOPPIER_WONDERCARDS } from './goppier-wondercards.js';
import {
  defaultWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';

const identity = defaultWonderDistributorIdentity();

function guideFor(card) {
  return [
    'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
    'Select this event, click Connect, and wait for “Armed”.',
    mysteryGiftStep(eventGames({ variants: card.payloads })),
    'After the card saves, talk to the green-clad delivery person on Pokémon Center 2F.',
  ];
}

export const goppierWondercardEvents = GOPPIER_WONDERCARDS.map((card) => {
  const games = Object.keys(card.payloads);
  return createEventDescriptor({
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
    payloadBytes: card.payloads[games[0]][0],
    variants: card.payloads,
    game: games.length === 1 ? games[0] : null,
    guideSteps: guideFor(card),
  });
});
