package com.placement.system.config;

import com.placement.system.model.Admin;
import com.placement.system.model.Student;
import com.placement.system.repository.AdminRepository;
import com.placement.system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // 1. Try to find the user in the Admins table
        Optional<Admin> adminOpt = adminRepository.findByUsername(usernameOrEmail);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return new User(
                    admin.getUsername(),
                    admin.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // 2. Try to find the user in the Students table (using email)
        Optional<Student> studentOpt = studentRepository.findByEmail(usernameOrEmail);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            return new User(
                    student.getEmail(),
                    student.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT"))
            );
        }

        throw new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail);
    }
}
