package com.stella.stella.member.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Date;
import java.util.Collection;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "member", 
uniqueConstraints = @UniqueConstraint(name = "UniqueIdandPlatform", columnNames = { "member_id",
		"member_platform" }))

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

	@Column(name = "member_role", nullable = false)
	@ColumnDefault("'USER'")
	@Enumerated(EnumType.STRING)
	private MemberRole memberRole;

	@Column(name = "member_name")
	private String memberName;

	@Column(name = "member_birth")
	private Date memberBirth;

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
	private Date memberBanDate;

	@Column(name = "member_refresh_token")
	private String memberRefreshToken;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return memberPass;
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return memberId;
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}
}
