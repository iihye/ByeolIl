package com.stella.stella.radio.repository;

import com.stella.stella.radio.entity.Radio;

import java.util.Optional;

public interface RadioCustomRepository {
    Optional<Radio> findRadio(Long memberIndex);
}
