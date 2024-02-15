package com.stella.stella.opinion.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpinionRequestDto {
    Long memberIndex;
    String opinionText;
}
