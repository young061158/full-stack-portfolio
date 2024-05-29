package com.winti.backend.showAdd.dto;

import com.winti.backend.showAdd.entity.Actor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ActorDto {
    private Long actorId;
    private Long showId;
    private String actorName;
    private String characterName;
    private String actorPath;


    public Actor toEntity() {
        return Actor.builder()
                .actorId(this.actorId)
                .actorName(this.actorName)
                .characterName(this.characterName)
                .actorPath(this.actorPath)
                .build();
    }
}

