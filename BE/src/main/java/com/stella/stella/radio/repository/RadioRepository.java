package com.stella.stella.radio.repository;

import com.stella.stella.radio.entity.Radio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RadioRepository extends JpaRepository<Radio, Long>, RadioCustomRepository {
    void deleteByRadioIndex(Long RadioIndex);
}
