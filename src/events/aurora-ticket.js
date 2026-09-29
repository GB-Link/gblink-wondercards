import { createEventDescriptor, mysteryGiftStep } from './descriptor.js';
import { AURORA_TICKET_PAYLOAD } from './aurora-payload.js';
import {
  defaultWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';

const identity = defaultWonderDistributorIdentity();

export const auroraTicket = createEventDescriptor({
  id: 'aurora-ticket',
  label: 'Aurora Ticket (Deoxys) (Emerald)',
  description: 'Gives the Aurora Ticket. Show it at the harbor in Lilycove City to sail to Birth Island, where Deoxys appears.',
  serialNo: RFU_SERIAL_WONDER_DISTRIBUTOR,
  mbootFlag: 0,
  maxPlayers: 0,
  gnameLabel: 'Wonder Card',
  unameLabel: 'DISTRIB',
  gnameBytes: identity.gnameBytes,
  unameBytes: identity.unameBytes,
  payloadBytes: AURORA_TICKET_PAYLOAD,
  guideSteps: [
    'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
    'Select this event, click Connect, and wait for “Armed”.',
    mysteryGiftStep({ games: ['emerald'] }),
    'After the card saves, talk to the green-clad delivery person on Pokémon Center 2F.',
  ],
});
