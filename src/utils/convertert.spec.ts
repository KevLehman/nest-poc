import { Test } from '@nestjs/testing';
import { converter } from './converter';
import { SESEventDto } from '../dtos/SESEvent.dto';
import * as moment from 'moment';
import { testData } from './testdata';

describe('converter', () => {
  it('should throw an error when rules is not an array', () => {
    // @ts-expect-error - tests
    expect(() => converter(null, null)).toThrow('Rules must be an array');
  });
  it('should throw an error when rules is empty', () => {
    // @ts-expect-error - tests
    expect(() => converter(null, [])).toThrow('Rules must not be empty');
  });
  it('should throw an error when source is empty', () => {
    expect(() =>
      // @ts-expect-error - tests
      converter(null, [{ dstKey: 'foo', transform: () => null }]),
    ).toThrow('Source must not be empty');
  });
  it('should return an object with the expected keys', () => {
    const result = converter(testData as SESEventDto, [
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

    expect(result).toEqual({
      spam: true,
      virus: true,
      dns: true,
      mes: 'September',
      retrasado: false,
      emisor: '61967230-7A45-4A9D-BEC9-87CBCF2211C9',
      receptor: ['recipient'],
    });
  });
});
