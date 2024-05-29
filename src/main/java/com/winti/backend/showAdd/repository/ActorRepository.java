package com.winti.backend.showAdd.repository;


import com.winti.backend.showAdd.entity.Actor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActorRepository extends JpaRepository<Actor, Long> {
}
