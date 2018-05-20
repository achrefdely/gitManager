package com.blogg.web.rest;

import com.blogg.GitManagerApp;

import com.blogg.domain.Commit;
import com.blogg.repository.CommitRepository;
import com.blogg.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.blogg.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CommitResource REST controller.
 *
 * @see CommitResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = GitManagerApp.class)
public class CommitResourceIntTest {

    private static final String DEFAULT_USER = "AAAAAAAAAA";
    private static final String UPDATED_USER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private CommitRepository commitRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCommitMockMvc;

    private Commit commit;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CommitResource commitResource = new CommitResource(commitRepository);
        this.restCommitMockMvc = MockMvcBuilders.standaloneSetup(commitResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Commit createEntity(EntityManager em) {
        Commit commit = new Commit()
            .user(DEFAULT_USER)
            .date(DEFAULT_DATE);
        return commit;
    }

    @Before
    public void initTest() {
        commit = createEntity(em);
    }

    @Test
    @Transactional
    public void createCommit() throws Exception {
        int databaseSizeBeforeCreate = commitRepository.findAll().size();

        // Create the Commit
        restCommitMockMvc.perform(post("/api/commits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(commit)))
            .andExpect(status().isCreated());

        // Validate the Commit in the database
        List<Commit> commitList = commitRepository.findAll();
        assertThat(commitList).hasSize(databaseSizeBeforeCreate + 1);
        Commit testCommit = commitList.get(commitList.size() - 1);
        assertThat(testCommit.getUser()).isEqualTo(DEFAULT_USER);
        assertThat(testCommit.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createCommitWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = commitRepository.findAll().size();

        // Create the Commit with an existing ID
        commit.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommitMockMvc.perform(post("/api/commits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(commit)))
            .andExpect(status().isBadRequest());

        // Validate the Commit in the database
        List<Commit> commitList = commitRepository.findAll();
        assertThat(commitList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllCommits() throws Exception {
        // Initialize the database
        commitRepository.saveAndFlush(commit);

        // Get all the commitList
        restCommitMockMvc.perform(get("/api/commits?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(commit.getId().intValue())))
            .andExpect(jsonPath("$.[*].user").value(hasItem(DEFAULT_USER.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    public void getCommit() throws Exception {
        // Initialize the database
        commitRepository.saveAndFlush(commit);

        // Get the commit
        restCommitMockMvc.perform(get("/api/commits/{id}", commit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(commit.getId().intValue()))
            .andExpect(jsonPath("$.user").value(DEFAULT_USER.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCommit() throws Exception {
        // Get the commit
        restCommitMockMvc.perform(get("/api/commits/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCommit() throws Exception {
        // Initialize the database
        commitRepository.saveAndFlush(commit);
        int databaseSizeBeforeUpdate = commitRepository.findAll().size();

        // Update the commit
        Commit updatedCommit = commitRepository.findOne(commit.getId());
        // Disconnect from session so that the updates on updatedCommit are not directly saved in db
        em.detach(updatedCommit);
        updatedCommit
            .user(UPDATED_USER)
            .date(UPDATED_DATE);

        restCommitMockMvc.perform(put("/api/commits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCommit)))
            .andExpect(status().isOk());

        // Validate the Commit in the database
        List<Commit> commitList = commitRepository.findAll();
        assertThat(commitList).hasSize(databaseSizeBeforeUpdate);
        Commit testCommit = commitList.get(commitList.size() - 1);
        assertThat(testCommit.getUser()).isEqualTo(UPDATED_USER);
        assertThat(testCommit.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingCommit() throws Exception {
        int databaseSizeBeforeUpdate = commitRepository.findAll().size();

        // Create the Commit

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCommitMockMvc.perform(put("/api/commits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(commit)))
            .andExpect(status().isCreated());

        // Validate the Commit in the database
        List<Commit> commitList = commitRepository.findAll();
        assertThat(commitList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteCommit() throws Exception {
        // Initialize the database
        commitRepository.saveAndFlush(commit);
        int databaseSizeBeforeDelete = commitRepository.findAll().size();

        // Get the commit
        restCommitMockMvc.perform(delete("/api/commits/{id}", commit.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Commit> commitList = commitRepository.findAll();
        assertThat(commitList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Commit.class);
        Commit commit1 = new Commit();
        commit1.setId(1L);
        Commit commit2 = new Commit();
        commit2.setId(commit1.getId());
        assertThat(commit1).isEqualTo(commit2);
        commit2.setId(2L);
        assertThat(commit1).isNotEqualTo(commit2);
        commit1.setId(null);
        assertThat(commit1).isNotEqualTo(commit2);
    }
}
