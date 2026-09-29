// The Aurora Ticket as Emerald receives it from the Project Wonder cartridge
// (Gen3DistributionRoms, "JPAJ - Aurora Ticket.bps"). The original USA kiosk
// cartridge only serves FireRed and LeafGreen.

function decodeBase64(s) {
  const bin = atob(s.replace(/\s+/g, ''));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const WC_BYTES = 336;

export const AURORA_TICKET_PAYLOAD = decodeBase64(`6AP//wAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAu8/Mycy7zsO9xb/OAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAC/7Nfc1eLb2QC91ebYAAAAAAAAAAAAweMA6OMA6NzZAOfZ1+Pi2ADa4OPj5gDj
2gDo3NkAysnFG8fJyAAAAL2/yM6/zADV4tgA4dnZ6ADo3NkA2Nng3erZ5u0A5Nnm5+PiAN3iAADb
5tnZ4q0AzNnX2d3q2QDo3NkAu8/Mycy7zsO9xb/OANXi2AAAAAAA6NzZ4gDn1erZAOjc2QDb1eHZ
q6sAAAAAAAAAAAAAAAAAAAAAAAAAAL7jAOLj6ADo4+fnAOjc3ecAv+zX3NXi29kAvdXm2AAAAAAA
AAAAAADW2drj5tkA5tnX2d3q3eLbAOjc2QC7z8zJzLvOw73Fv86rqwAAAAAAAAAAAAAAuDxTZwhq
Wis6AbsBoFNnCCutAbsBoFNnCEdzAQEAIQ2AAQC7AaBTZwi9qVNnCGZtRnMBAQAhDYAAALsBl1Nn
CBoAgHMBGgGAAQAJACnVCCk6Ab0GVGcIZm1sAr2XVGcIZm1sAr1qVGcIZm1sAs7c1eLfAO3j6QDa
4+YA6efd4tsA6NzZAMfTzc6/zNP+wcPAzgDN7efo2eGt+9Pj6QDh6efoANbZAP0Brf7O3Nnm2QDd
5wDVAOjd19/Z6ADc2ebZANrj5gDt4+mt/8PoANXk5NnV5ucA6OMA1tkA2uPmAOnn2QDV6ADo3Nn+
xsPG073J0L8AvcPO0wDk4+borfvR3O0A4uPoANvd6tkA3egA1QDo5u0A1eLYAOfZ2QDr3NXo/t3o
AN3nANXW4+norP/O3NXi3wDt4+kA2uPmAOnn3eLbAOjc2QDH083Ov8zT/sHDwM4Aze3n6Nnhrf/J
3LgAw7ThAOfj5ubtuAD9Aa3+0+Pp5gC8u8G05wDFv9MAw86/x80Aysm9xb/OAN3nANrp4OCt+8rg
2dXn2QDn6OPm2QDn4+HZ6Nzd4tsA4+IA7ePp5gDKvbj+6NzZ4gDX4+HZANbV198A2uPmAOjc3eet
/w==`);
export const AURORA_WONDERCARD_BYTES = AURORA_TICKET_PAYLOAD.subarray(0, WC_BYTES);
export const AURORA_SCRIPT_BYTES = AURORA_TICKET_PAYLOAD.subarray(WC_BYTES);
export const AURORA_PAYLOAD_SOURCE = 'Project Wonder Aurora Ticket cartridge, as English Emerald receives it';
