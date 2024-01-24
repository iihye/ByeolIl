package com.stella.stella.common.Jwt;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;

	public UserDetails loadUserByUsername(String memberIndex) throws UsernameNotFoundException {
		return memberRepository.findByMemberIndex((Long.parseLong(memberIndex))).map(this::createUserDetails)
				.orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));
	}

	// 해당하는 User 의 데이터가 존재한다면 UserDetails 객체로 만들어서 리턴
	private UserDetails createUserDetails(Member member) {
		return User.builder()
				.username(Long.toString(member.getMemberIndex()))
				.password(passwordEncoder.encode(member.getMemberPass()))
				.roles(member.getMemberRole().toString())
				.build();
	}
}