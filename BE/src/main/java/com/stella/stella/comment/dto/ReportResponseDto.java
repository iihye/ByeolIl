package com.stella.stella.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponseDto {
    private Long reportIndex;
    private Long boardIndex;
    private Long memberIndex;
    private String memberNickname;
    private Long banMemberIndex;
    private String banMemberNickName;
    private String reportContent;
    private String reportRegdate;
}
