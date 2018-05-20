package com.blogg.repository;

import com.blogg.domain.Repo;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Repo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RepoRepository extends JpaRepository<Repo, Long> {

}
