package com.stella.stella.radio.repository;

import com.stella.stella.member.repository.MemberCustomRepository;
import com.stella.stella.radio.entity.Radio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RadioRepository extends JpaRepository<Radio, Long> {
}