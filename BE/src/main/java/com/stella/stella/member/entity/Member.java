package com.stella.stella.member.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "member", 
uniqueConstraints = @UniqueConstraint(name = "UniqueIdandPlatform", columnNames = { "member_id",
		"member_platform" }))
@DynamicInsert
@DynamicUpdate
public class Member implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name ="member_index" ,updatable = false)
	private long memberIndex;

	@Column(name = "member_id", nullable = false)
	private String memberId;

	@Column(name = "member_pass")
	private String memberPass;

	@Column(name = "member_platform", nullable = false)
	private String memberPlatform;

	@Column(name = "member_role")
	@ColumnDefault("'USER'")
	@Enumerated(EnumType.STRING)
	private MemberRole memberRole;

	@Column(name = "member_name")
	private String memberName;

	@Column(name = "member_birth")
	private LocalDate memberBirth;

	@Column(name = "member_nickname", unique = true)
	private String memberNickname;

	@Column(name = "member_email", unique = true)
	private String memberEmail;

	@Column(name = "member_alarm_status")
	@Enumerated(EnumType.STRING)
	@ColumnDefault("'ACCEPT'")
	private MemberAlarmStatus memberAlarmStatus;

	@Column(name = "member_radio_status")
	@Enumerated(EnumType.STRING)
	@ColumnDefault("'OLDEST'")
	private MemberRadioStatus memberRadioStatus;

	@Column(name = "member_ban_date")
	private LocalDate memberBanDate;

	@Column(name = "member_refresh_token")
	private String memberRefreshToken;

	@CreationTimestamp
	@Column(name="member_reg_date")
	private LocalDate memberRegDate; //처음 등록 시점

	@Column(name = "member_deleteYN")
	@Enumerated(EnumType.STRING)
	@ColumnDefault("'N'")
	private MemberDeleteYN memberDeleteYN;

	@Column(name = "member_delete_date")
	private LocalDate memberDeleteDate;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getPassword() {
		return memberPass;
	}

	@Override
	public String getUsername() {
		return memberId;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
