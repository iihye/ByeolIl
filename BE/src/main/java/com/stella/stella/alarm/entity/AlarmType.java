package com.stella.stella.alarm.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AlarmType {
    FOLLOW("팔로우"),
    CMT("댓글"),
    MULTCMT("답댓글");

    private final String type;
}
