package com.stella.stella.radio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RadioResponseDto {

    private Long boardIndex;
    private String boardContent;
    private String boardInputDate;
    private Long fromMemberIndex;
}
