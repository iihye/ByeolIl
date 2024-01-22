package com.stella.stella.common.dto;

import lombok.*;

@Builder
@Getter
@Setter
@ToString
@AllArgsConstructor
public class StatusResponseDto {

    private Integer code;
    private String message;
}