package com.stella.stella.alarm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "alarm_board")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Alarmboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_board_index")
    private Long alarmBoardIndex;

    @Column(name = "board_index")
    private Long boardIndex;

    @ManyToOne
    @JoinColumn(name = "alarm_index", referencedColumnName = "alarm_index")
    private Alarm alarm;
}
