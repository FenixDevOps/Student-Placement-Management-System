package com.placement.system.service;

import com.placement.system.config.JwtTokenProvider;
import com.placement.system.dto.*;
import com.placement.system.exception.BadRequestException;
import com.placement.system.model.Admin;
import com.placement.system.model.Student;
import com.placement.system.repository.AdminRepository;
import com.placement.system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public StudentDto registerStudent(RegisterRequest request) {
        if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email is already registered");
        }
        if (adminRepository.findByUsername(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email username is reserved by an administrator");
        }

        Student student = Student.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .cgpa(request.getCgpa())
                .branch(request.getBranch())
                .graduationYear(request.getGraduationYear())
                .skills(request.getSkills())
                .build();

        Student savedStudent = studentRepository.save(student);
        return mapToStudentDto(savedStudent);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String role = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_STUDENT")
                    .replace("ROLE_", "");

            String token = tokenProvider.generateToken(userDetails.getUsername(), role);

            Long id = null;
            String name = "";
            if ("ADMIN".equals(role)) {
                Optional<Admin> adminOpt = adminRepository.findByUsername(userDetails.getUsername());
                if (adminOpt.isPresent()) {
                    id = adminOpt.get().getAdminId();
                    name = "Administrator";
                }
            } else {
                Optional<Student> studentOpt = studentRepository.findByEmail(userDetails.getUsername());
                if (studentOpt.isPresent()) {
                    id = studentOpt.get().getStudentId();
                    name = studentOpt.get().getName();
                }
            }

            return AuthResponse.builder()
                    .token(token)
                    .id(id)
                    .username(userDetails.getUsername())
                    .name(name)
                    .role(role)
                    .build();

        } catch (BadCredentialsException ex) {
            throw new BadRequestException("Invalid username/email or password");
        } catch (DisabledException ex) {
            throw new BadRequestException("Account is disabled");
        } catch (LockedException ex) {
            throw new BadRequestException("Account is locked");
        }
    }

    private StudentDto mapToStudentDto(Student s) {
        return StudentDto.builder()
                .studentId(s.getStudentId())
                .name(s.getName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .cgpa(s.getCgpa())
                .branch(s.getBranch())
                .graduationYear(s.getGraduationYear())
                .skills(s.getSkills())
                .resumeUrl(s.getResumeUrl())
                .build();
    }
}
