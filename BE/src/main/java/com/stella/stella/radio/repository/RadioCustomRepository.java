package com.stella.stella.radio.repository;

import com.stella.stella.radio.entity.Radio;

public interface RadioCustomRepository {
    Radio findRadio(Long memberIndex);
}
