package com.winti.backend.mainPage.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.winti.backend.member.entity.UserEntity;
import com.winti.backend.showAdd.entity.ShowAdd;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name ="showbanner")
public class MainBanner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "banner_path")
    private String bannerPath;

    @Column(name = "title")
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "show_id", nullable = false)
    private ShowAdd showAdd;

    @Override
    public String toString() {
        return "MainPageDTO{" +
                "id=" + id +
                ", userEntity='" + userEntity.getUserId() + '\'' +
                ", title='" + title + '\'' +
                ", path='" + bannerPath + '\'' +
                '}';
    }


}
