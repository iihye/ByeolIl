package com.stella.stella.radio.repository;

import com.stella.stella.radio.entity.Radio;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class RadioCustomRepositoryImpl implements RadioCustomRepository{
    private final EntityManager entityManager;

    public Radio findRadio(Long memberIndex){
       return entityManager
               .createQuery("select r from Radio r WHERE r.member.memberIndex=:memberIndex ORDER BY r.board.boardInputDate", Radio.class)
               .setParameter("memberIndex", memberIndex)
               .setMaxResults(1)
               .getSingleResult();
    }
}
