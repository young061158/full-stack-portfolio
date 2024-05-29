package com.winti.backend.member.repository;


import com.winti.backend.member.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {

    boolean existsByUserId(String userId);

    UserEntity findByUserId(String userId);

    Optional<UserEntity> findByUsername(String username);

    List<UserEntity> findByUsernameAndEmail(String username, String email);

    UserEntity findByUserIdAndEmail(String userId, String email);

    void deleteByUserId(String userId);


}
