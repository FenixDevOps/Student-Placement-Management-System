package com.placement.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumPostDto {
    private Long postId;
    private Long studentId;
    private String authorName;
    private String title;
    private String content;
    private String category;
    private Boolean isAnonymous;
    private Integer commentCount;
    private List<ForumCommentDto> comments;
    private LocalDateTime createdAt;
}
