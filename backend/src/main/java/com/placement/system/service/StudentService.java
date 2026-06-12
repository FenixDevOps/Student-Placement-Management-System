package com.placement.system.service;

import com.placement.system.dto.StudentDto;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.model.Student;
import com.placement.system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private ResumeParserService resumeParserService;

    public Page<StudentDto> getAllStudents(String branch, BigDecimal minCgpa, String search, Pageable pageable) {
        return studentRepository.searchStudents(branch, minCgpa, search, pageable)
                .map(this::mapToDto);
    }

    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID " + id));
        return mapToDto(student);
    }

    public StudentDto updateStudentProfile(Long id, StudentDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID " + id));

        student.setName(dto.getName());
        student.setPhone(dto.getPhone());
        student.setCgpa(dto.getCgpa());
        student.setBranch(dto.getBranch());
        student.setGraduationYear(dto.getGraduationYear());
        student.setSkills(dto.getSkills());

        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    public StudentDto uploadStudentResume(Long id, MultipartFile file) throws IOException {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID " + id));

        // Upload the file
        String fileUrl = s3Service.uploadResume(file, student.getEmail());
        student.setResumeUrl(fileUrl);

        // AI Resume Parsing: extract text, skills, and phone number
        try {
            String resumeText = resumeParserService.extractTextFromPdf(file);
            java.util.Set<String> extractedSkills = resumeParserService.extractSkills(resumeText);
            if (!extractedSkills.isEmpty()) {
                student.setExtractedSkills(String.join(", ", extractedSkills));
                // Auto-merge extracted skills into student's skills if they are empty
                if (student.getSkills() == null || student.getSkills().trim().isEmpty()) {
                    student.setSkills(String.join(", ", extractedSkills));
                }
            }

            // Auto-fill phone if not already set
            if (student.getPhone() == null || student.getPhone().trim().isEmpty()) {
                String phone = resumeParserService.extractPhone(resumeText);
                if (phone != null) {
                    student.setPhone(phone);
                }
            }
        } catch (Exception e) {
            // Log but don't fail the upload if parsing fails
            System.err.println("Resume parsing failed for student " + student.getEmail() + ": " + e.getMessage());
        }

        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    public StudentDto mapToDto(Student student) {
        return StudentDto.builder()
                .studentId(student.getStudentId())
                .name(student.getName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .cgpa(student.getCgpa())
                .branch(student.getBranch())
                .graduationYear(student.getGraduationYear())
                .skills(student.getSkills())
                .extractedSkills(student.getExtractedSkills())
                .resumeUrl(student.getResumeUrl())
                .build();
    }
}
