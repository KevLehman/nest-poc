import { Injectable } from '@nestjs/common';
import { SESEventDto } from './dtos/SESEvent.dto';
import { converter } from './utils/converter';
import * as moment from 'moment';
import { SESData } from './types/SESData';

@Injectable()
export class AppService {
  convert(data: SESEventDto): SESData {
    return converter(data, [
      {
        dstKey: 'spam',
        transform: (value: SESEventDto) => {
          return value.Records[0].ses.receipt.spamVerdict?.status === 'PASS';
        },
      },
      {
        dstKey: 'virus',
        transform: (value: SESEventDto) => {
          // Note to reviewer: Shouldn't be `status === 'PASS' === no virus found?
          return value.Records[0].ses.receipt.virusVerdict?.status === 'PASS';
        },
      },
      {
        dstKey: 'dns',
        transform: (value: SESEventDto) => {
          const { spfVerdict, dkimVerdict, dmarcVerdict } =
            value.Records[0].ses.receipt;

          return (
            spfVerdict?.status === 'PASS' &&
            dkimVerdict?.status === 'PASS' &&
            dmarcVerdict?.status === 'PASS'
          );
        },
      },
      {
        dstKey: 'mes',
        transform: function (value: SESEventDto) {
          return moment(value.Records[0].ses.mail.timestamp).format('MMMM');
        },
      },
      {
        dstKey: 'retrasado',
        transform: (value: SESEventDto) => {
          const { processingTimeMillis = 0 } = value.Records[0].ses.receipt;
          return processingTimeMillis > 1000;
        },
      },
      {
        dstKey: 'emisor',
        transform: (value: SESEventDto) => {
          const { source } = value.Records[0].ses.mail;
          return source.split('@')[0];
        },
      },
      {
        dstKey: 'receptor',
        transform: (value: SESEventDto) => {
          const { destination } = value.Records[0].ses.mail;
          return destination.map((d) => d.split('@')[0]);
        },
      },
    ]);
  }
}
