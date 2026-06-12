package com.placement.system.service;

import com.placement.system.dto.InterviewDto;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.model.Application;
import com.placement.system.model.Interview;
import com.placement.system.repository.ApplicationRepository;
import com.placement.system.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public InterviewDto scheduleInterview(InterviewDto dto) {
        Application application = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID " + dto.getApplicationId()));

        Interview interview = Interview.builder()
                .application(application)
                .scheduledTime(dto.getScheduledTime())
                .durationMinutes(dto.getDurationMinutes() != null ? dto.getDurationMinutes() : 60)
                .roundName(dto.getRoundName())
                .locationOrLink(dto.getLocationOrLink())
                .notes(dto.getNotes())
                .build();

        Interview saved = interviewRepository.save(interview);

        // Generate ICS and send email
        String icsContent = generateIcsContent(saved);
        String emailBody = String.format(
                "Dear %s,\n\nYour interview for %s at %s has been scheduled.\n\n" +
                "Round: %s\nDate & Time: %s\nDuration: %d minutes\nLocation/Link: %s\n\n" +
                "Notes: %s\n\nBest regards,\nPlacement Cell",
                application.getStudent().getName(),
                application.getCompany().getRole(),
                application.getCompany().getCompanyName(),
                saved.getRoundName(),
                saved.getScheduledTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")),
                saved.getDurationMinutes(),
                saved.getLocationOrLink() != null ? saved.getLocationOrLink() : "To be announced",
                saved.getNotes() != null ? saved.getNotes() : "None"
        );

        emailService.sendEmailWithAttachment(
                application.getStudent().getEmail(),
                "Interview Scheduled: " + saved.getRoundName() + " - " + application.getCompany().getCompanyName(),
                emailBody,
                "invite.ics",
                icsContent
        );

        // Log ICS content (in production, this would be attached to the email)
        System.out.println("[ICS Calendar Invite Generated]\n" + icsContent);

        return mapToDto(saved);
    }

    public List<InterviewDto> getStudentInterviews(Long studentId) {
        return interviewRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Page<InterviewDto> getAllInterviews(Pageable pageable) {
        return interviewRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional
    public InterviewDto updateInterview(Long interviewId, InterviewDto dto) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with ID " + interviewId));

        if (dto.getScheduledTime() != null) interview.setScheduledTime(dto.getScheduledTime());
        if (dto.getDurationMinutes() != null) interview.setDurationMinutes(dto.getDurationMinutes());
        if (dto.getRoundName() != null) interview.setRoundName(dto.getRoundName());
        if (dto.getLocationOrLink() != null) interview.setLocationOrLink(dto.getLocationOrLink());
        if (dto.getNotes() != null) interview.setNotes(dto.getNotes());

        Interview updated = interviewRepository.save(interview);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteInterview(Long interviewId) {
        if (!interviewRepository.existsById(interviewId)) {
            throw new ResourceNotFoundException("Interview not found with ID " + interviewId);
        }
        interviewRepository.deleteById(interviewId);
    }

    private String generateIcsContent(Interview interview) {
        DateTimeFormatter icsFormat = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");
        LocalDateTime start = interview.getScheduledTime();
        LocalDateTime end = start.plusMinutes(interview.getDurationMinutes());

        return "BEGIN:VCALENDAR\n" +
                "VERSION:2.0\n" +
                "PRODID:-//PlacementPortal//Interview//EN\n" +
                "BEGIN:VEVENT\n" +
                "DTSTART:" + start.format(icsFormat) + "\n" +
                "DTEND:" + end.format(icsFormat) + "\n" +
                "SUMMARY:" + interview.getRoundName() + " - " +
                interview.getApplication().getCompany().getCompanyName() + "\n" +
                "DESCRIPTION:" + (interview.getNotes() != null ? interview.getNotes() : "") + "\n" +
                "LOCATION:" + (interview.getLocationOrLink() != null ? interview.getLocationOrLink() : "") + "\n" +
                "STATUS:CONFIRMED\n" +
                "END:VEVENT\n" +
                "END:VCALENDAR";
    }

    private InterviewDto mapToDto(Interview interview) {
        return InterviewDto.builder()
                .interviewId(interview.getInterviewId())
                .applicationId(interview.getApplication().getApplicationId())
                .studentId(interview.getApplication().getStudent().getStudentId())
                .studentName(interview.getApplication().getStudent().getName())
                .studentEmail(interview.getApplication().getStudent().getEmail())
                .companyId(interview.getApplication().getCompany().getCompanyId())
                .companyName(interview.getApplication().getCompany().getCompanyName())
                .companyRole(interview.getApplication().getCompany().getRole())
                .scheduledTime(interview.getScheduledTime())
                .durationMinutes(interview.getDurationMinutes())
                .roundName(interview.getRoundName())
                .locationOrLink(interview.getLocationOrLink())
                .notes(interview.getNotes())
                .createdAt(interview.getCreatedAt())
                .build();
    }
}
