package com.winti.backend.show.showdetails.dto;

import com.winti.backend.mainPage.dto.MainPageDTO;
import com.winti.backend.showAdd.dto.ActorDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PerformanceWithActorDTO {
    private MainPageDTO performance;
    private List<ActorDto> actor;
}