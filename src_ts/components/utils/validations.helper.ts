export enum Validations {
  MAX_LENGTH = 'max_length',
  REGEX = 'regex',
  LOWER_THAN = 'lt',
  GREATER_THAN = 'gt'
}

export type MaxLengthValidation = {
  name: Validations.MAX_LENGTH;
  [Validations.MAX_LENGTH]: string;
};

export type RegexValidation = {
  name: Validations.REGEX;
  [Validations.REGEX]: string;
};

export type GreaterValidation = {
  name: Validations.GREATER_THAN;
  [Validations.GREATER_THAN]: string;
  allow_equality: boolean;
};

export type LowerValidation = {
  name: Validations.LOWER_THAN;
  [Validations.LOWER_THAN]: string;
  allow_equality: boolean;
};

export type FieldValidator = MaxLengthValidation | RegexValidation | GreaterValidation | LowerValidation;

export function validate(validators: FieldValidator[], value: any): string | null {
  let message: string | null = null;
  for (const validator of validators) {
    message = checkValidation(validator, value);
    if (message) {
      break;
    }
  }
  return message;
}

function checkValidation(validation: FieldValidator, value: number | string | null): string | null {
  switch (validation.name) {
    case Validations.MAX_LENGTH:
      const maxLength: number = Number(validation[Validations.MAX_LENGTH]);
      return String(value).length < maxLength ? null : `Text must be less than ${maxLength} character`;
    case Validations.REGEX:
      return null;
    case Validations.GREATER_THAN:
      const greaterThan: number = Number(validation[Validations.GREATER_THAN]) - Number(validation.allow_equality);
      return Number(value) > greaterThan ? null : `Number must be greater than ${greaterThan} character`;
    case Validations.LOWER_THAN:
      const lowerThan: number = Number(validation[Validations.LOWER_THAN]) + Number(validation.allow_equality);
      return Number(value) < lowerThan ? null : `Number must be lower than ${lowerThan} character`;
    default:
      return null;
  }
}
