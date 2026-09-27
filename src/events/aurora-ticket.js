import { createEventDescriptor } from './descriptor.js';
import {
  AURORA_TICKET_PAYLOAD,
  AURORA_PAYLOAD_SOURCE,
} from './aurora-payload.js';
import {
  defaultWonderDistributorIdentity,
  RFU_SERIAL_WONDER_DISTRIBUTOR,
} from './rfu-identity.js';

const identity = defaultWonderDistributorIdentity();

export const auroraTicket = createEventDescriptor({
  id: 'aurora-ticket',
  label: 'Aurora Ticket (Emerald)',
  description:
    'Wireless Mystery Gift distribution of the Aurora Ticket. '
    + `Payload embedded (${AURORA_TICKET_PAYLOAD.length} bytes). ${AURORA_PAYLOAD_SOURCE}`,
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
    'Click Connect here and wait for “Wireless adapter mode ready”.',
    'On Emerald MAIN MENU select Mystery Gift — that is when the adapter check runs.',
    'If the log shows SoftReset≥1 and checkID words, detect is working; then Start session and choose Wireless Communication.',
    'If SoftReset stays 0 and SC↓ stays 0, the GBA is not reaching the Pico link pins.',
  ],
});
