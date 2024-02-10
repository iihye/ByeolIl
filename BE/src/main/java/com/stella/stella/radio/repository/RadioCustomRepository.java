package com.stella.stella.radio.repository;

import com.stella.stella.radio.entity.Radio;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RadioCustomRepository {
    Optional<Radio> findRadio(Long memberIndex);
}
