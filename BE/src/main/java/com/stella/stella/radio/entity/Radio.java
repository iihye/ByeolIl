package com.stella.stella.radio.entity;

import com.stella.stella.board.entity.Board;
import com.stella.stella.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Radio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "radio_index", updatable = false)
    private Long radioIndex;

    @ManyToOne
    @JoinColumn(name = "from_member_index", referencedColumnName = "member_index")
    private Member fromMember;

    @ManyToOne
    @JoinColumn(name = "board_index", referencedColumnName = "board_index")
    private Board board;

    @ManyToOne
    @JoinColumn(name = "to_member_index", referencedColumnName = "member_index")
    private Member toMember;


}
