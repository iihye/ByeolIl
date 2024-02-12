package com.stella.stella.alarm.repository;

import com.stella.stella.alarm.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    @Query("select a, ac from alarm a left join alarm_check ac on a.alarmIndex = ac.alarm.alarmIndex where ac.alarm.alarmIndex IS NULL and a.toMember.memberIndex =:toMemberIndex")
    List<Alarm> findAllByToMemberIndex(Long toMemberIndex);
}
