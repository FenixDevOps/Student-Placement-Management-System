package com.placement.system.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.placement.system.dto.DashboardStatsDto;
import com.placement.system.model.Application;
import com.placement.system.model.ApplicationStatus;
import com.placement.system.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private StatsService statsService;

    @Autowired
    private ApplicationRepository applicationRepository;

    public byte[] generatePlacementReport() throws DocumentException, IOException {
        DashboardStatsDto stats = statsService.getDashboardStats();
        
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        
        document.open();
        
        // Define Fonts
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(33, 33, 33));
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(110, 110, 110));
        Font sectionHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(25, 118, 210));
        Font boldTextFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(50, 50, 50));
        Font normalTextFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(75, 75, 75));
        Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
        
        // Title
        Paragraph title = new Paragraph("Student Placement Management System", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        
        Paragraph subtitle = new Paragraph("Campus Placement Drive Analytics & Consolidated Report\nGenerated on: " 
                + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + "\n\n", subtitleFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        document.add(subtitle);
        
        // Add a line separator
        document.add(new Paragraph("-----------------------------------------------------------------------------------------------------------------------------------\n\n"));
        
        // Executive Summary Section
        document.add(new Paragraph("1. Executive Placement Summary", sectionHeaderFont));
        document.add(new Paragraph("\n"));
        
        // Create 2-column key statistics table
        PdfPTable statsTable = new PdfPTable(2);
        statsTable.setWidthPercentage(100);
        statsTable.setSpacingBefore(10f);
        statsTable.setSpacingAfter(20f);
        
        addTableCell(statsTable, "Metric Detail", tableHeaderFont, new Color(25, 118, 210), true);
        addTableCell(statsTable, "Report Value", tableHeaderFont, new Color(25, 118, 210), true);
        
        addTableCell(statsTable, "Total Enrolled Students", boldTextFont, false);
        addTableCell(statsTable, String.valueOf(stats.getTotalStudents()), normalTextFont, false);
        
        addTableCell(statsTable, "Participating Recruiter Companies", boldTextFont, false);
        addTableCell(statsTable, String.valueOf(stats.getTotalCompanies()), normalTextFont, false);
        
        addTableCell(statsTable, "Total Job Applications Filed", boldTextFont, false);
        addTableCell(statsTable, String.valueOf(stats.getTotalApplications()), normalTextFont, false);
        
        addTableCell(statsTable, "Successfully Selected Candidates", boldTextFont, false);
        addTableCell(statsTable, String.valueOf(stats.getTotalSelectedStudents()), normalTextFont, false);
        
        addTableCell(statsTable, "Aggregate Placement Percentage", boldTextFont, false);
        addTableCell(statsTable, stats.getPlacementPercentage() + " %", normalTextFont, false);
        
        addTableCell(statsTable, "Highest CTC Package Offered", boldTextFont, false);
        addTableCell(statsTable, stats.getHighestPackage() + " LPA", normalTextFont, false);
        
        addTableCell(statsTable, "Average CTC Package Offered", boldTextFont, false);
        addTableCell(statsTable, stats.getAveragePackage() + " LPA", normalTextFont, false);
        
        document.add(statsTable);
        
        // Candidate Placements List Section
        document.add(new Paragraph("2. Confirmed Placed Students Log", sectionHeaderFont));
        document.add(new Paragraph("\n"));
        
        // Fetch Selected applications
        List<Application> selectedApplications = applicationRepository.findAll().stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SELECTED)
                .toList();
                
        if (selectedApplications.isEmpty()) {
            document.add(new Paragraph("No students have been marked as 'SELECTED' for job roles yet.", normalTextFont));
        } else {
            PdfPTable candidatesTable = new PdfPTable(5);
            candidatesTable.setWidthPercentage(100);
            candidatesTable.setSpacingBefore(10f);
            
            // Widths ratio: Student, Branch, CGPA, Company, Package
            float[] columnWidths = {2.5f, 1.5f, 1.0f, 2.5f, 1.5f};
            candidatesTable.setWidths(columnWidths);
            
            addTableCell(candidatesTable, "Student Name", tableHeaderFont, new Color(55, 71, 79), true);
            addTableCell(candidatesTable, "Branch", tableHeaderFont, new Color(55, 71, 79), true);
            addTableCell(candidatesTable, "CGPA", tableHeaderFont, new Color(55, 71, 79), true);
            addTableCell(candidatesTable, "Recruiter", tableHeaderFont, new Color(55, 71, 79), true);
            addTableCell(candidatesTable, "Package Offered", tableHeaderFont, new Color(55, 71, 79), true);
            
            for (Application app : selectedApplications) {
                addTableCell(candidatesTable, app.getStudent().getName(), normalTextFont, false);
                addTableCell(candidatesTable, app.getStudent().getBranch(), normalTextFont, false);
                addTableCell(candidatesTable, String.valueOf(app.getStudent().getCgpa()), normalTextFont, false);
                addTableCell(candidatesTable, app.getCompany().getCompanyName() + " (" + app.getCompany().getRole() + ")", normalTextFont, false);
                addTableCell(candidatesTable, app.getCompany().getPackageAmount() + " LPA", normalTextFont, false);
            }
            
            document.add(candidatesTable);
        }
        
        document.close();
        return out.toByteArray();
    }
    
    private void addTableCell(PdfPTable table, String text, Font font, boolean isHeader) {
        addTableCell(table, text, font, null, isHeader);
    }
    
    private void addTableCell(PdfPTable table, String text, Font font, Color bgColor, boolean isHeader) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(8);
        if (bgColor != null) {
            cell.setBackgroundColor(bgColor);
        }
        if (isHeader) {
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        }
        table.addCell(cell);
    }
}
