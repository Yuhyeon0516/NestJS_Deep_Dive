import { ValidationArguments } from 'class-validator';

export function stringValidationMessage(args: ValidationArguments) {
  return `${args.property}에 String을 입력해주세요.`;
}
