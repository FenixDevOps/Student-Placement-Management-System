package com.placement.system.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ResumeParserService {

    // Comprehensive skills dictionary covering tech industry
    private static final Set<String> SKILLS_DICTIONARY = new HashSet<>(Arrays.asList(
            "java", "python", "c++", "c", "javascript", "typescript", "go", "rust", "swift",
            "kotlin", "scala", "ruby", "php", "r", "matlab", "sql", "nosql", "html", "css",
            "react", "angular", "vue", "node.js", "express", "spring boot", "spring", "django",
            "flask", "fastapi", ".net", "asp.net", "rails", "laravel",
            "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins",
            "ci/cd", "git", "github", "gitlab", "bitbucket",
            "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb",
            "oracle", "sqlite", "kafka", "rabbitmq",
            "machine learning", "deep learning", "artificial intelligence", "nlp",
            "computer vision", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
            "data science", "data analysis", "data engineering", "big data",
            "spark", "hadoop", "hive", "airflow",
            "rest", "graphql", "grpc", "microservices", "api", "websocket",
            "linux", "unix", "bash", "shell scripting", "powershell",
            "agile", "scrum", "jira", "confluence",
            "tcp/ip", "networking", "dns", "http", "ssl/tls",
            "cybersecurity", "penetration testing", "encryption", "oauth",
            "blockchain", "smart contracts", "solidity", "web3",
            "ios", "android", "react native", "flutter",
            "figma", "sketch", "adobe xd", "ui/ux",
            "testing", "junit", "selenium", "cypress", "jest",
            "embedded systems", "iot", "rtos", "firmware",
            "system design", "distributed systems", "cloud computing",
            "devops", "sre", "monitoring", "observability",
            "solidworks", "autocad", "matlab", "simulink"
    ));

    // Phone number patterns (Indian and international)
    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "(?:\\+?\\d{1,3}[-.\\s]?)?(?:\\(?\\d{2,5}\\)?[-.\\s]?)?\\d{3,5}[-.\\s]?\\d{3,5}[-.\\s]?\\d{0,4}"
    );

    public String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getInputStream().readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    public Set<String> extractSkills(String resumeText) {
        if (resumeText == null || resumeText.isEmpty()) {
            return Collections.emptySet();
        }

        String lowerText = resumeText.toLowerCase();
        Set<String> foundSkills = new TreeSet<>();

        for (String skill : SKILLS_DICTIONARY) {
            // Use word boundary matching for short skill names to avoid false positives
            if (skill.length() <= 2) {
                Pattern p = Pattern.compile("\\b" + Pattern.quote(skill) + "\\b", Pattern.CASE_INSENSITIVE);
                if (p.matcher(lowerText).find()) {
                    foundSkills.add(capitalizeSkill(skill));
                }
            } else {
                if (lowerText.contains(skill.toLowerCase())) {
                    foundSkills.add(capitalizeSkill(skill));
                }
            }
        }

        return foundSkills;
    }

    public String extractPhone(String resumeText) {
        if (resumeText == null || resumeText.isEmpty()) {
            return null;
        }

        Matcher matcher = PHONE_PATTERN.matcher(resumeText);
        while (matcher.find()) {
            String phone = matcher.group().replaceAll("[\\s-]", "");
            // Only return phone numbers with 10+ digits (valid phone numbers)
            String digitsOnly = phone.replaceAll("\\D", "");
            if (digitsOnly.length() >= 10 && digitsOnly.length() <= 15) {
                return phone;
            }
        }
        return null;
    }

    /**
     * Calculate match score (0-100) between student skills and company job description.
     * Applies a CGPA penalty if student CGPA is below company's eligibility criteria.
     */
    public int calculateMatchScore(String studentSkills, String companyDescription,
                                   java.math.BigDecimal studentCgpa, java.math.BigDecimal eligibilityCriteria) {
        if (studentSkills == null || studentSkills.isEmpty() ||
            companyDescription == null || companyDescription.isEmpty()) {
            return 0;
        }

        // Parse student skills into a set
        Set<String> studentSkillSet = Arrays.stream(studentSkills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        // Extract skill keywords from company description
        String lowerDesc = companyDescription.toLowerCase();
        Set<String> requiredSkills = new HashSet<>();
        for (String skill : SKILLS_DICTIONARY) {
            if (lowerDesc.contains(skill.toLowerCase())) {
                requiredSkills.add(skill.toLowerCase());
            }
        }

        if (requiredSkills.isEmpty()) {
            // If no specific skills found in description, give a baseline score
            return 50;
        }

        // Calculate intersection
        Set<String> matchedSkills = new HashSet<>(studentSkillSet);
        matchedSkills.retainAll(requiredSkills);

        double rawScore = ((double) matchedSkills.size() / requiredSkills.size()) * 100.0;

        // Apply CGPA penalty: if student CGPA is below eligibility, reduce score by 30%
        if (studentCgpa != null && eligibilityCriteria != null &&
            studentCgpa.compareTo(eligibilityCriteria) < 0) {
            rawScore *= 0.7;
        }

        return Math.min(100, Math.max(0, (int) Math.round(rawScore)));
    }

    private String capitalizeSkill(String skill) {
        if (skill == null || skill.isEmpty()) return skill;
        // Keep acronyms uppercase
        if (skill.equals(skill.toUpperCase()) && skill.length() <= 4) return skill;
        return skill.substring(0, 1).toUpperCase() + skill.substring(1);
    }
}
