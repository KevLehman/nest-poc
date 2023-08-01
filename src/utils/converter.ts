import { SESEventDto } from '../dtos/SESEvent.dto';
import { SESData } from '../types/SESData';

type ConvertRule = {
  dstKey: string;
  transform: (value: SESEventDto) => any;
};

// Using known types for simplicity
export function converter(src: SESEventDto, rules: ConvertRule[]): SESData {
  return rules.reduce<SESData>((acc, rule) => {
    const key = rule.dstKey as keyof SESData;
    (acc as any)[key] = rule.transform(src);

    return acc;
  }, {} as SESData);
}
