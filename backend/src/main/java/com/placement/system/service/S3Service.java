package com.placement.system.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class S3Service {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.access-key}")
    private String accessKey;

    @Value("${aws.s3.secret-key}")
    private String secretKey;

    @Value("${upload.local-dir}")
    private String localUploadDir;

    private S3Client s3Client;
    private boolean useLocalFallback = true;

    @PostConstruct
    public void init() {
        if (bucketName != null && !bucketName.trim().isEmpty() &&
            accessKey != null && !accessKey.trim().isEmpty() &&
            secretKey != null && !secretKey.trim().isEmpty()) {
            try {
                this.s3Client = S3Client.builder()
                        .region(Region.of(region))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)))
                        .build();
                this.useLocalFallback = false;
                System.out.println("AWS S3 client initialized successfully.");
            } catch (Exception ex) {
                System.err.println("Failed to initialize S3 client. Falling back to local storage: " + ex.getMessage());
                this.useLocalFallback = true;
            }
        } else {
            System.out.println("AWS credentials missing. Using local storage fallback.");
            this.useLocalFallback = true;
        }

        if (useLocalFallback) {
            // Ensure local upload directory exists
            File dir = new File(localUploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
        }
    }

    public String uploadResume(MultipartFile file, String studentEmail) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        // Ensure only PDFs are uploaded
        if (!".pdf".equalsIgnoreCase(extension)) {
            throw new IllegalArgumentException("Only PDF resumes are supported");
        }

        String fileName = studentEmail.replace("@", "_").replace(".", "_") + "_resume_" + UUID.randomUUID().toString().substring(0, 8) + extension;

        if (useLocalFallback) {
            Path targetPath = Paths.get(localUploadDir).toAbsolutePath().normalize().resolve(fileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            // Return relative serving path
            return "/uploads/resumes/" + fileName;
        } else {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType("application/pdf")
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            
            // Standard S3 URL
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName);
        }
    }
}
