package com.finalauth.backend.auth.dto;

import com.finalauth.backend.user.UserDto;

public record LoginResponseData(TokenPair tokens, UserDto user) {
}
