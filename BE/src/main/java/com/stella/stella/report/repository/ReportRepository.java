package com.stella.stella.report.repository;

import com.stella.stella.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
    int countByBoardBoardIndexAndMemberMemberIndex(Long BoardIndex, Long MemberIndex);
}
