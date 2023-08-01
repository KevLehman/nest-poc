import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class Verdict {
  @IsString()
  status: string;
}

class SESAction {
  @IsString()
  type: string;
  @IsString()
  topicArn: string;
}

class Header {
  @IsString()
  name: string;
  @IsString()
  value: string;
}

class SESReceipt {
  @IsDateString()
  timestamp: string;
  @IsNumber()
  processingTimeMillis: number;
  @IsArray()
  recipients: string[];
  @ValidateNested()
  @Type(() => Verdict)
  spamVerdict: Verdict;
  @ValidateNested()
  @Type(() => Verdict)
  virusVerdict: Verdict;
  @ValidateNested()
  @Type(() => Verdict)
  spfVerdict: Verdict;
  @ValidateNested()
  @Type(() => Verdict)
  dkimVerdict: Verdict;
  @ValidateNested()
  @Type(() => Verdict)
  dmarcVerdict: Verdict;
  @IsString()
  dmarcPolicy: string;
  @ValidateNested()
  @Type(() => SESAction)
  action: SESAction;
}

class SESCommonHeaders {
  @IsString()
  returnPath: string;
  @IsArray()
  from: string[];
  @IsString()
  date: string;
  @IsArray()
  to: string[];
  @IsString()
  messageId: string;
  @IsString()
  subject: string;
}

class SESMail {
  @IsDateString()
  timestamp: string;
  @IsString()
  source: string;
  @IsString()
  messageId: string;
  @IsArray()
  destination: string[];
  @IsBoolean()
  headersTruncated: boolean;
  @IsArray()
  @ValidateNested()
  @Type(() => Header)
  headers: Header[];
  @ValidateNested()
  @Type(() => SESCommonHeaders)
  commonHeaders: SESCommonHeaders;
}

class SESEvent {
  @ValidateNested({ each: true })
  @Type(() => SESReceipt)
  receipt: SESReceipt;
  @ValidateNested()
  @Type(() => SESMail)
  mail: SESMail;
}

class SNSEventRecordDto {
  @IsString()
  eventVersion: string;
  @IsString()
  eventSource: string;
  @ValidateNested()
  @Type(() => SESEvent)
  ses: SESEvent;
}

export class SESEventDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SNSEventRecordDto)
  Records: SNSEventRecordDto[];
}
