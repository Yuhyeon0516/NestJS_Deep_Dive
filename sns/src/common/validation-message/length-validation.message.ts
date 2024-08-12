import { ValidationArguments } from 'class-validator';

export function lengthValidationMessage(args: ValidationArguments) {
  /**
   * ValidationArguments의 프로퍼티
   *
   * 1. value -> 입력된 값
   * 2. constraints -> 입력에 대한 제한 사항
   *    args.constraints[0] -> 1
   *    args.constraints[1] -> 20
   * 3. targetName -> 검증하고 있는 클래스의 이름
   * 4. object -> 검증하고 있는 객체
   * 5. property -> 검증되고 있는 객체의 이름
   * */

  if (args.constraints.length === 2) {
    return `${args.property}은 ${args.constraints[0]}~${args.constraints[1]}글자를 입력해주세요.`;
  } else {
    return `${args.property}은 최소 ${args.constraints[0]}글자 이상을 입력해주세요.`;
  }
}
