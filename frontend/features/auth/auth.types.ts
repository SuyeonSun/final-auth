export type UserDto = {
  id: string;
  username: string;
  useremail: string;
  roles: string[];
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
};

export type BackendLoginData = {
  tokens: TokenPair;
  user: UserDto;
};

export type LoginData = {
  user: UserDto;
};
