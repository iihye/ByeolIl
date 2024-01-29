package com.stella.stella.comment.repository;

import com.stella.stella.comment.entity.MultiComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MulticommentRepository extends JpaRepository<MultiComment, Long> {
Optional<MultiComment> findByMultiCommentIndex(Long MultiCommentIndex);
}
