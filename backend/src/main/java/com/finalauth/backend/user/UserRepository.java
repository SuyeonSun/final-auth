package com.finalauth.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

	Optional<User> findByUseremail(String useremail);

	boolean existsByUseremail(String useremail);
}
