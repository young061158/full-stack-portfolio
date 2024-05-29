package com.winti.backend.show.showdetails.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ShowDetailUserDto {

    private String buyDate;
    private Long showId;
    private String title;
    private String status;

}
