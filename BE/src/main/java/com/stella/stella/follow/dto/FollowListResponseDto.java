package com.stella.stella.follow.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowListResponseDto {
    Long memberIndex;
    String memberId;
    String memberName;
}
