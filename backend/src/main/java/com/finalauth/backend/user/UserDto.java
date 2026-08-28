package com.finalauth.backend.user;

import java.util.List;

public record UserDto(String id, String username, String useremail, List<String> roles) {

	public static UserDto from(User user) {
		return new UserDto(user.getId(), user.getUsername(), user.getUseremail(), user.getRoles());
	}
}
