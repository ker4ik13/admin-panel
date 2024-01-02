import { Token } from 'src/token/token.schema';

export interface Tokens {
  accessToken: string;
  refreshToken: Token;
}
