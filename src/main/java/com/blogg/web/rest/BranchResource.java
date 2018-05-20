package com.blogg.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.blogg.domain.Branch;

import com.blogg.repository.BranchRepository;
import com.blogg.web.rest.errors.BadRequestAlertException;
import com.blogg.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Branch.
 */
@RestController
@RequestMapping("/api")
public class BranchResource {

    private final Logger log = LoggerFactory.getLogger(BranchResource.class);

    private static final String ENTITY_NAME = "branch";

    private final BranchRepository branchRepository;

    public BranchResource(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    /**
     * POST  /branches : Create a new branch.
     *
     * @param branch the branch to create
     * @return the ResponseEntity with status 201 (Created) and with body the new branch, or with status 400 (Bad Request) if the branch has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/branches")
    @Timed
    public ResponseEntity<Branch> createBranch(@RequestBody Branch branch) throws URISyntaxException {
        log.debug("REST request to save Branch : {}", branch);
        if (branch.getId() != null) {
            throw new BadRequestAlertException("A new branch cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Branch result = branchRepository.save(branch);
        return ResponseEntity.created(new URI("/api/branches/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /branches : Updates an existing branch.
     *
     * @param branch the branch to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated branch,
     * or with status 400 (Bad Request) if the branch is not valid,
     * or with status 500 (Internal Server Error) if the branch couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/branches")
    @Timed
    public ResponseEntity<Branch> updateBranch(@RequestBody Branch branch) throws URISyntaxException {
        log.debug("REST request to update Branch : {}", branch);
        if (branch.getId() == null) {
            return createBranch(branch);
        }
        Branch result = branchRepository.save(branch);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, branch.getId().toString()))
            .body(result);
    }

    /**
     * GET  /branches : get all the branches.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of branches in body
     */
    @GetMapping("/branches")
    @Timed
    public List<Branch> getAllBranches() {
        log.debug("REST request to get all Branches");
        return branchRepository.findAll();
        }

    /**
     * GET  /branches/:id : get the "id" branch.
     *
     * @param id the id of the branch to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the branch, or with status 404 (Not Found)
     */
    @GetMapping("/branches/{id}")
    @Timed
    public ResponseEntity<Branch> getBranch(@PathVariable Long id) {
        log.debug("REST request to get Branch : {}", id);
        Branch branch = branchRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(branch));
    }

    /**
     * DELETE  /branches/:id : delete the "id" branch.
     *
     * @param id the id of the branch to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/branches/{id}")
    @Timed
    public ResponseEntity<Void> deleteBranch(@PathVariable Long id) {
        log.debug("REST request to delete Branch : {}", id);
        branchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
