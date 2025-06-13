import { UnexpectedErrorCodeEnum } from './error.code';

type UnexpectedErrorMessageType = {
  readonly [K in UnexpectedErrorCodeEnum]: string;
};

export const UnexpectedErrorMessage: UnexpectedErrorMessageType = {
  [UnexpectedErrorCodeEnum.Unexpected]: 'Unexpected error',
};
