package com.blogg.repository;

import com.blogg.domain.Branch;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Branch entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

}
