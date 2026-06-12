package com.placement.system.repository;

import com.placement.system.model.ForumComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumCommentRepository extends JpaRepository<ForumComment, Long> {

    List<ForumComment> findByPostPostIdOrderByCreatedAtAsc(Long postId);

    int countByPostPostId(Long postId);
}
