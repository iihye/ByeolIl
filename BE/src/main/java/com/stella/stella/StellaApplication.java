package com.stella.stella;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.bind.annotation.RequestMapping;

@EnableJpaAuditing
@SpringBootApplication
@RequestMapping("/")
public class StellaApplication {
	public static void main(String[] args) {
		SpringApplication.run(StellaApplication.class, args);
	}
}
