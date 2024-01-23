package com.stella.stella.common.dto;

import lombok.*;

import java.util.List;
@Builder
@Getter
@Setter
@ToString
@AllArgsConstructor
public class BasicResponseDto {
    private String message;
    private Integer count;
    private List<?> result;
}
