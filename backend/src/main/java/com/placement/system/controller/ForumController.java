package com.placement.system.controller;

import com.placement.system.dto.ForumCommentDto;
import com.placement.system.dto.ForumPostDto;
import com.placement.system.service.ForumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forum")
@Tag(name = "Forum Module", description = "Endpoints for discussion board, Q&A, and interview experiences.")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
public class ForumController {

    @Autowired
    private ForumService forumService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @Operation(summary = "Get all forum posts with optional category/search filters")
    public ResponseEntity<Page<ForumPostDto>> getPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ForumPostDto> posts = forumService.getPosts(category, search, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{postId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @Operation(summary = "Get a forum post by ID with all comments")
    public ResponseEntity<ForumPostDto> getPostById(@PathVariable Long postId) {
        ForumPostDto post = forumService.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @Operation(summary = "Create a new forum post")
    public ResponseEntity<ForumPostDto> createPost(@Valid @RequestBody ForumPostDto dto) {
        ForumPostDto created = forumService.createPost(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/{postId}/comments")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @Operation(summary = "Add a comment/reply to a forum post")
    public ResponseEntity<ForumCommentDto> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody ForumCommentDto dto
    ) {
        ForumCommentDto created = forumService.addComment(postId, dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{postId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a forum post (Admin only)")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        forumService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }
}
