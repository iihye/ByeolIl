package com.stella.stella.radio.repository;

import com.stella.stella.board.entity.BoardDeleteYN;
import com.stella.stella.radio.entity.Radio;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class RadioCustomRepositoryImpl implements RadioCustomRepository{
    private final EntityManager entityManager;

    public Optional<Radio> findRadio(Long memberIndex){
        try {
            Radio radio = entityManager
                    .createQuery("select r from Radio r WHERE r.toMember.memberIndex=:memberIndex and r.board.boardDeleteYN = :boardDeleteYN ORDER BY r.board.boardInputDate", Radio.class)
                    .setParameter("memberIndex", memberIndex)
                    .setParameter("boardDeleteYN", BoardDeleteYN.N)
                    .setMaxResults(1)
                    .getSingleResult();
            return Optional.ofNullable(radio);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

}
