package com.stella.stella.opinion.repository;

import com.stella.stella.opinion.entity.Opinion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpinionRepository extends JpaRepository<Opinion, Long> {
}
