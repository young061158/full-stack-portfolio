package com.winti.backend.showAdd.repository;

import com.winti.backend.showAdd.dto.RoundDto;
import com.winti.backend.showAdd.entity.Round;
import com.winti.backend.showAdd.entity.ShowAdd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RoundRepository extends JpaRepository<Round, Long> {

}
