package com.blogg.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.blogg.domain.Repo;

import com.blogg.repository.RepoRepository;
import com.blogg.web.rest.errors.BadRequestAlertException;
import com.blogg.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Repo.
 */
@RestController
@RequestMapping("/api")
public class RepoResource {

    private final Logger log = LoggerFactory.getLogger(RepoResource.class);

    private static final String ENTITY_NAME = "repo";

    private final RepoRepository repoRepository;

    public RepoResource(RepoRepository repoRepository) {
        this.repoRepository = repoRepository;
    }

    /**
     * POST  /repos : Create a new repo.
     *
     * @param repo the repo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new repo, or with status 400 (Bad Request) if the repo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/repos")
    @Timed
    public ResponseEntity<Repo> createRepo(@RequestBody Repo repo) throws URISyntaxException {

        FileRepositoryBuilder repositoryBuilder = new FileRepositoryBuilder();
        try {
            Repository repository = repositoryBuilder.setGitDir(new File("/D:/repoTEST/.git"))
                .readEnvironment() // scan environment GIT_* variables
                .findGitDir() // scan up the file system tree
                .setMustExist(true)
                .build();
        } catch (IOException e) {
            e.printStackTrace();
        }
        log.debug("REST request to save Repo : {}", repo);
        if (repo.getId() != null) {
            throw new BadRequestAlertException("A new repo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Repo result = repoRepository.save(repo);
        return ResponseEntity.created(new URI("/api/repos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /repos : Updates an existing repo.
     *
     * @param repo the repo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated repo,
     * or with status 400 (Bad Request) if the repo is not valid,
     * or with status 500 (Internal Server Error) if the repo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/repos")
    @Timed
    public ResponseEntity<Repo> updateRepo(@RequestBody Repo repo) throws URISyntaxException {
        log.debug("REST request to update Repo : {}", repo);
        if (repo.getId() == null) {
            return createRepo(repo);
        }
        Repo result = repoRepository.save(repo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, repo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /repos : get all the repos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of repos in body
     */
    @GetMapping("/repos")
    @Timed
    public List<Repo> getAllRepos() {
        log.debug("REST request to get all Repos");
        return repoRepository.findAll();
        }

    /**
     * GET  /repos/:id : get the "id" repo.
     *
     * @param id the id of the repo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the repo, or with status 404 (Not Found)
     */
    @GetMapping("/repos/{id}")
    @Timed
    public ResponseEntity<Repo> getRepo(@PathVariable Long id) {
        log.debug("REST request to get Repo : {}", id);
        Repo repo = repoRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(repo));
    }

    /**
     * DELETE  /repos/:id : delete the "id" repo.
     *
     * @param id the id of the repo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/repos/{id}")
    @Timed
    public ResponseEntity<Void> deleteRepo(@PathVariable Long id) {
        log.debug("REST request to delete Repo : {}", id);
        repoRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
