package com.stella.stella.board.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder

public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "media_index", updatable = false)
    private Long mediaIndex;

    @Column(name = "media_location", nullable = false, length = 100)
    private String mediaLocation;

    @ManyToOne
    @JoinColumn(name = "board_index", referencedColumnName = "board_index")
    private Board board;

}
