package com.stella.stella.comment.repository;

import com.stella.stella.comment.entity.MultiComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MulticommentRepository extends JpaRepository<MultiComment, Long> {
}
