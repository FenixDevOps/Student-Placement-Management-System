package com.placement.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumCommentDto {
    private Long commentId;
    private Long postId;
    private Long studentId;
    private String authorName;
    private String content;
    private Boolean isAnonymous;
    private LocalDateTime createdAt;
}
