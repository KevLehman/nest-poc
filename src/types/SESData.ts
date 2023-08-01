/*
{
    "spam": "spamVerdic a boolean, PASS = true",
    "virus": "virusVerdic a boolean, PASS = true",
    "dns": "spfVerdic, dkimVeredict, dmarcVeredict a boolean, si todos PASS = true",
    "mes": "mail.timestamp a mes como texto",
    "retrasado": "processingTimeMillis a boolean, > 1000 = true"
    "emisor": "mail.source a usuario de correo sin @dominio.com",
    "receptor": ["mail.destination a usuarios de correo sin @domino.com"]
}
*/

export class SESData {
  spam: boolean;
  virus: boolean;
  dns: boolean;
  mes: string;
  retrasado: boolean;
  emisor: string;
  receptor: string[];
}
