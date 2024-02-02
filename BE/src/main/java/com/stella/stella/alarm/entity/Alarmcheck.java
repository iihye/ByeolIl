package com.stella.stella.alarm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity(name = "alarm_check")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Alarmcheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alarmCheckIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alarm_index")
    private Alarm alarm;
}
