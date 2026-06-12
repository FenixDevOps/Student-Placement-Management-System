package com.placement.system.repository;

import com.placement.system.model.ForumPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {

    @Query("SELECT p FROM ForumPost p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ForumPost> searchPosts(String category, String search, Pageable pageable);
}
