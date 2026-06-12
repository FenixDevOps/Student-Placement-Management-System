package com.placement.system.controller;

import com.lowagie.text.DocumentException;
import com.placement.system.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports Management Module", description = "Endpoints for downloading campus placement reports as PDF.")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
public class ReportsController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/download")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Download placement reports as PDF (Admin only)", description = "Generates a dynamic PDF file compiling metrics table and hired candidates logs.")
    public ResponseEntity<byte[]> downloadPlacementReport() {
        try {
            byte[] pdfBytes = reportService.generatePlacementReport();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment()
                    .filename("placement_report.pdf")
                    .build());
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (DocumentException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
