package com.stella.stella.member.repository;

import com.stella.stella.member.entity.Member;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class MemberCustomRepositoryImpl implements MemberCustomRepository{
    private final EntityManager entityManager;

    @Override
    public Member findByRandMember() {
        return entityManager.
                createQuery("select m from Member m ORDER BY RAND() limit 1", Member.class)
                .getSingleResult();
    }
}
