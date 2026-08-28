export type UserDto = {
  id: string;
  username: string;
  useremail: string;
  roles: string[];
};

export type AccessTokenData = {
  accessToken: string;
  accessTokenExpiresAt: string;
};

export type TokenPair = AccessTokenData & {
  refreshToken: string;
  refreshTokenExpiresAt: string;
};

export type BackendLoginData = {
  tokens: TokenPair;
  user: UserDto;
};

export type LoginData = {
  user: UserDto;
};

export type RegisterData = {
  user: UserDto;
};

export type BackendRefreshData = {
  token: AccessTokenData;
};
