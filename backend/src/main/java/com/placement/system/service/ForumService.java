package com.placement.system.service;

import com.placement.system.dto.ForumCommentDto;
import com.placement.system.dto.ForumPostDto;
import com.placement.system.exception.ResourceNotFoundException;
import com.placement.system.model.ForumComment;
import com.placement.system.model.ForumPost;
import com.placement.system.model.Student;
import com.placement.system.repository.ForumCommentRepository;
import com.placement.system.repository.ForumPostRepository;
import com.placement.system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ForumService {

    @Autowired
    private ForumPostRepository postRepository;

    @Autowired
    private ForumCommentRepository commentRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Page<ForumPostDto> getPosts(String category, String search, Pageable pageable) {
        return postRepository.searchPosts(category, search, pageable)
                .map(this::mapPostToDto);
    }

    public ForumPostDto getPostById(Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Forum post not found with ID " + postId));

        ForumPostDto dto = mapPostToDto(post);
        // Load full comments for detail view
        List<ForumCommentDto> comments = commentRepository.findByPostPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::mapCommentToDto)
                .collect(Collectors.toList());
        dto.setComments(comments);
        return dto;
    }

    @Transactional
    public ForumPostDto createPost(ForumPostDto dto) {
        ForumPost post = ForumPost.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .category(dto.getCategory() != null ? dto.getCategory() : "General")
                .isAnonymous(dto.getIsAnonymous() != null ? dto.getIsAnonymous() : false)
                .build();

        // Set student if not anonymous and studentId is provided
        if (dto.getStudentId() != null && (dto.getIsAnonymous() == null || !dto.getIsAnonymous())) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID " + dto.getStudentId()));
            post.setStudent(student);
        }

        ForumPost saved = postRepository.save(post);
        return mapPostToDto(saved);
    }

    @Transactional
    public ForumCommentDto addComment(Long postId, ForumCommentDto dto) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Forum post not found with ID " + postId));

        ForumComment comment = ForumComment.builder()
                .post(post)
                .content(dto.getContent())
                .isAnonymous(dto.getIsAnonymous() != null ? dto.getIsAnonymous() : false)
                .build();

        if (dto.getStudentId() != null && (dto.getIsAnonymous() == null || !dto.getIsAnonymous())) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID " + dto.getStudentId()));
            comment.setStudent(student);
        }

        ForumComment saved = commentRepository.save(comment);
        return mapCommentToDto(saved);
    }

    @Transactional
    public void deletePost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Forum post not found with ID " + postId);
        }
        postRepository.deleteById(postId);
    }

    private ForumPostDto mapPostToDto(ForumPost post) {
        String authorName = "Anonymous";
        Long studentId = null;
        if (post.getStudent() != null && (post.getIsAnonymous() == null || !post.getIsAnonymous())) {
            authorName = post.getStudent().getName();
            studentId = post.getStudent().getStudentId();
        }

        int commentCount = commentRepository.countByPostPostId(post.getPostId());

        return ForumPostDto.builder()
                .postId(post.getPostId())
                .studentId(studentId)
                .authorName(authorName)
                .title(post.getTitle())
                .content(post.getContent())
                .category(post.getCategory())
                .isAnonymous(post.getIsAnonymous())
                .commentCount(commentCount)
                .createdAt(post.getCreatedAt())
                .build();
    }

    private ForumCommentDto mapCommentToDto(ForumComment comment) {
        String authorName = "Anonymous";
        Long studentId = null;
        if (comment.getStudent() != null && (comment.getIsAnonymous() == null || !comment.getIsAnonymous())) {
            authorName = comment.getStudent().getName();
            studentId = comment.getStudent().getStudentId();
        }

        return ForumCommentDto.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPost().getPostId())
                .studentId(studentId)
                .authorName(authorName)
                .content(comment.getContent())
                .isAnonymous(comment.getIsAnonymous())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
