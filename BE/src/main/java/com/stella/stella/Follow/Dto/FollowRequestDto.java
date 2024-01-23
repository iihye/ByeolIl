package com.stella.stella.follow.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowRequestDto {
    Long toMemberIndex;
    Long fromMemberIndex;
}
