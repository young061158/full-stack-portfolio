package com.winti.backend.member.repository;

import com.winti.backend.member.entity.SnsIdEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SnsIdRepository extends JpaRepository<SnsIdEntity, Long> {

    boolean existsByUserId(String userId);


}
