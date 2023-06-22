package com.demo.login.studylogin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class StudyLoginApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudyLoginApplication.class, args);
	}

}
