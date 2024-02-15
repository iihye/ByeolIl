package com.stella.stella.opinion.entity;

import com.stella.stella.member.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "opinion")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Opinion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long opinionIndex;

    private String opinionText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index")
    private Member member;
}
