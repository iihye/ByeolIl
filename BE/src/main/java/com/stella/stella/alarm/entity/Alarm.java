package com.stella.stella.alarm.entity;

import com.stella.stella.member.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "alarm")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Alarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_index")
    private Long alarmIndex;

    @JoinColumn(name = "to_member_index")
    @ManyToOne(fetch = FetchType.LAZY)
    private Member toMember;

    @JoinColumn(name = "from_member_index")
    @ManyToOne(fetch = FetchType.LAZY)
    private Member fromMember;

    @CreatedDate
    @Column(name = "alarm_date")
    private LocalDateTime alarmDate;

    @Column(name = "alarm_type")
    private AlarmType alarmType;

    @OneToMany(mappedBy = "alarm")
    private List<Alarmcheck> alarmList;

    @OneToMany(mappedBy = "alarm")
    private List<Alarmboard> alarmboardList;
}
