package com.stella.stella.comment.repository;

import com.stella.stella.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<Comment> findByCommentIndex(Long CommentIndex);
}
