import { createEventDescriptor } from './descriptor.js';
import {
  BLISY_TICKET_PAYLOAD,
  BLISY_PAYLOAD_SOURCE,
} from './blisy-payload.js';
import {
  defaultWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';

const identity = defaultWonderDistributorIdentity();

export const blisyMysteryEvent = createEventDescriptor({
  id: 'blisy-mystery-event',
  label: 'Blisy Mystery Event (e-Reader Unlock)',
  description:
    'Wireless Mystery Gift of Blisy’s Mystery Event unlock card. '
    + `Payload embedded (${BLISY_TICKET_PAYLOAD.length} bytes). ${BLISY_PAYLOAD_SOURCE}`,
  serialNo: RFU_SERIAL_WONDER_DISTRIBUTOR,
  mbootFlag: 0,
  maxPlayers: 0,
  gnameLabel: 'Wonder Card',
  unameLabel: 'DISTRIB',
  gnameBytes: identity.gnameBytes,
  unameBytes: identity.unameBytes,
  payloadBytes: BLISY_TICKET_PAYLOAD,
  guideSteps: [
    'Plug GB-Link into the GBA link port (6-pin cable — SI must be wired).',
    'Select this event, click Connect, and wait for “Armed”.',
    'On Emerald MAIN MENU select Mystery Gift → Wireless Communication.',
    'After the card saves, talk to the green-clad delivery person on Pokémon Center 2F.',
    'Save, then use Mystery Event from the menu as the card instructs.',
  ],
});
