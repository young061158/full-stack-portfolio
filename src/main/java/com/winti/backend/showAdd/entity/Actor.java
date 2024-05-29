package com.winti.backend.showAdd.entity;

import com.winti.backend.showAdd.dto.ActorDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "actor")
public class Actor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "actor_id")
    private Long actorId;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "show_id", nullable = false)
    private ShowAdd showAdd;

    @Column(nullable = false)
    private String actorName;

    @Column(nullable = false)
    private String characterName;

    @Column(nullable = false)
    private String actorPath;

    public ActorDto toDto() {
        return ActorDto.builder()
                .actorId(this.actorId)
                .actorName(this.actorName)
                .characterName(this.characterName)
                .actorPath(this.actorPath)
                .showId(this.showAdd.getShowId())
                .build();
    }
}
