package com.stella.stella.member.repository;

import com.stella.stella.member.entity.Member;

public interface MemberCustomRepository {

    Member findByRandMember();
}
