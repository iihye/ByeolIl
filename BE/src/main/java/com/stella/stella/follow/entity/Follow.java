package com.stella.stella.follow.entity;

import com.stella.stella.member.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "follow")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Follow {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long followIndex;

    @Id
    @Column(name = "to_member_index")
    private Long toMemberIndex;

    @Id
    @Column(name = "from_member_index")
    private Long fromMemberIndex;
}
