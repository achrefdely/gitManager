package com.blogg.repository;

import com.blogg.domain.Commit;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Commit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommitRepository extends JpaRepository<Commit, Long> {

}
