package com.placement.system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public void sendEmail(String to, String subject, String body) {
        System.out.println("========== OUTGOING EMAIL ==========");
        System.out.println("To:      " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Content: \n" + body);
        System.out.println("====================================");

        if (mailSender != null && mailUsername != null && !mailUsername.trim().isEmpty()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(mailUsername);
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                System.out.println("Email sent successfully using SMTP.");
            } catch (Exception ex) {
                System.err.println("Failed to send email using SMTP: " + ex.getMessage());
            }
        } else {
            System.out.println("SMTP details are not configured. Email logged to console.");
        }
    }

    public void sendEmailWithAttachment(String to, String subject, String body, String attachmentFilename, String attachmentContent) {
        System.out.println("========== OUTGOING EMAIL WITH ATTACHMENT ==========");
        System.out.println("To:         " + to);
        System.out.println("Subject:    " + subject);
        System.out.println("Attachment: " + attachmentFilename);
        System.out.println("Content: \n" + body);
        System.out.println("====================================================");

        if (mailSender != null && mailUsername != null && !mailUsername.trim().isEmpty()) {
            try {
                jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
                org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
                
                helper.setFrom(mailUsername);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(body);
                
                org.springframework.core.io.ByteArrayResource byteArrayResource = new org.springframework.core.io.ByteArrayResource(attachmentContent.getBytes("UTF-8"));
                helper.addAttachment(attachmentFilename, byteArrayResource, "text/calendar");
                
                mailSender.send(mimeMessage);
                System.out.println("Email with attachment sent successfully using SMTP.");
            } catch (Exception ex) {
                System.err.println("Failed to send email with attachment using SMTP: " + ex.getMessage());
            }
        } else {
            System.out.println("SMTP details are not configured. Email logged to console.");
        }
    }

    public void sendApplicationStatusUpdate(String studentName, String studentEmail, String companyName, String role, String newStatus) {
        String subject = "Placement Drive: Application Status Updated - " + companyName;
        String body = String.format(
                "Dear %s,\n\n" +
                "This is to inform you that your application status for the position of '%s' at '%s' has been updated to: %s.\n\n" +
                "Please log in to the Student Placement Management System dashboard to check further details.\n\n" +
                "Best regards,\n" +
                "Placement Coordination Office",
                studentName, role, companyName, newStatus
        );
        sendEmail(studentEmail, subject, body);
    }
}
