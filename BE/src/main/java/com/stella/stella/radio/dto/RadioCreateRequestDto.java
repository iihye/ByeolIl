package com.stella.stella.radio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RadioCreateRequestDto {
    private Long memberIndex;
    private Long boardIndex;
}
