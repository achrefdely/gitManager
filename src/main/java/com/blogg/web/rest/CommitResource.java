package com.blogg.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.blogg.domain.Commit;

import com.blogg.repository.CommitRepository;
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
 * REST controller for managing Commit.
 */
@RestController
@RequestMapping("/api")
public class CommitResource {

    private final Logger log = LoggerFactory.getLogger(CommitResource.class);

    private static final String ENTITY_NAME = "commit";

    private final CommitRepository commitRepository;

    public CommitResource(CommitRepository commitRepository) {
        this.commitRepository = commitRepository;
    }

    /**
     * POST  /commits : Create a new commit.
     *
     * @param commit the commit to create
     * @return the ResponseEntity with status 201 (Created) and with body the new commit, or with status 400 (Bad Request) if the commit has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/commits")
    @Timed
    public ResponseEntity<Commit> createCommit(@RequestBody Commit commit) throws URISyntaxException {
        log.debug("REST request to save Commit : {}", commit);
        if (commit.getId() != null) {
            throw new BadRequestAlertException("A new commit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Commit result = commitRepository.save(commit);
        return ResponseEntity.created(new URI("/api/commits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /commits : Updates an existing commit.
     *
     * @param commit the commit to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated commit,
     * or with status 400 (Bad Request) if the commit is not valid,
     * or with status 500 (Internal Server Error) if the commit couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/commits")
    @Timed
    public ResponseEntity<Commit> updateCommit(@RequestBody Commit commit) throws URISyntaxException {
        log.debug("REST request to update Commit : {}", commit);
        if (commit.getId() == null) {
            return createCommit(commit);
        }
        Commit result = commitRepository.save(commit);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, commit.getId().toString()))
            .body(result);
    }

    /**
     * GET  /commits : get all the commits.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of commits in body
     */
    @GetMapping("/commits")
    @Timed
    public List<Commit> getAllCommits() {
        log.debug("REST request to get all Commits");
        return commitRepository.findAll();
        }

    /**
     * GET  /commits/:id : get the "id" commit.
     *
     * @param id the id of the commit to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the commit, or with status 404 (Not Found)
     */
    @GetMapping("/commits/{id}")
    @Timed
    public ResponseEntity<Commit> getCommit(@PathVariable Long id) {
        log.debug("REST request to get Commit : {}", id);
        Commit commit = commitRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(commit));
    }

    /**
     * DELETE  /commits/:id : delete the "id" commit.
     *
     * @param id the id of the commit to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/commits/{id}")
    @Timed
    public ResponseEntity<Void> deleteCommit(@PathVariable Long id) {
        log.debug("REST request to delete Commit : {}", id);
        commitRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
