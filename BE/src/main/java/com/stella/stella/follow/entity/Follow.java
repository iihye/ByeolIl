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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follow_index",updatable = false)
    private Long followIndex;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "to_member_index", referencedColumnName = "member_index")
    private Member toMember;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "from_member_index", referencedColumnName = "member_index")
    private Member fromMember;
}
