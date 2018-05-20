package com.blogg.web.rest;

import com.blogg.GitManagerApp;

import com.blogg.domain.Repo;
import com.blogg.repository.RepoRepository;
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
import java.util.List;

import static com.blogg.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the RepoResource REST controller.
 *
 * @see RepoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = GitManagerApp.class)
public class RepoResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PATH = "AAAAAAAAAA";
    private static final String UPDATED_PATH = "BBBBBBBBBB";

    private static final String DEFAULT_LOGO_URL = "AAAAAAAAAA";
    private static final String UPDATED_LOGO_URL = "BBBBBBBBBB";

    @Autowired
    private RepoRepository repoRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restRepoMockMvc;

    private Repo repo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RepoResource repoResource = new RepoResource(repoRepository);
        this.restRepoMockMvc = MockMvcBuilders.standaloneSetup(repoResource)
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
    public static Repo createEntity(EntityManager em) {
        Repo repo = new Repo()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .path(DEFAULT_PATH)
            .logoUrl(DEFAULT_LOGO_URL);
        return repo;
    }

    @Before
    public void initTest() {
        repo = createEntity(em);
    }

    @Test
    @Transactional
    public void createRepo() throws Exception {
        int databaseSizeBeforeCreate = repoRepository.findAll().size();

        // Create the Repo
        restRepoMockMvc.perform(post("/api/repos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(repo)))
            .andExpect(status().isCreated());

        // Validate the Repo in the database
        List<Repo> repoList = repoRepository.findAll();
        assertThat(repoList).hasSize(databaseSizeBeforeCreate + 1);
        Repo testRepo = repoList.get(repoList.size() - 1);
        assertThat(testRepo.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRepo.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testRepo.getPath()).isEqualTo(DEFAULT_PATH);
        assertThat(testRepo.getLogoUrl()).isEqualTo(DEFAULT_LOGO_URL);
    }

    @Test
    @Transactional
    public void createRepoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = repoRepository.findAll().size();

        // Create the Repo with an existing ID
        repo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRepoMockMvc.perform(post("/api/repos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(repo)))
            .andExpect(status().isBadRequest());

        // Validate the Repo in the database
        List<Repo> repoList = repoRepository.findAll();
        assertThat(repoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllRepos() throws Exception {
        // Initialize the database
        repoRepository.saveAndFlush(repo);

        // Get all the repoList
        restRepoMockMvc.perform(get("/api/repos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(repo.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].path").value(hasItem(DEFAULT_PATH.toString())))
            .andExpect(jsonPath("$.[*].logoUrl").value(hasItem(DEFAULT_LOGO_URL.toString())));
    }

    @Test
    @Transactional
    public void getRepo() throws Exception {
        // Initialize the database
        repoRepository.saveAndFlush(repo);

        // Get the repo
        restRepoMockMvc.perform(get("/api/repos/{id}", repo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(repo.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.path").value(DEFAULT_PATH.toString()))
            .andExpect(jsonPath("$.logoUrl").value(DEFAULT_LOGO_URL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRepo() throws Exception {
        // Get the repo
        restRepoMockMvc.perform(get("/api/repos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRepo() throws Exception {
        // Initialize the database
        repoRepository.saveAndFlush(repo);
        int databaseSizeBeforeUpdate = repoRepository.findAll().size();

        // Update the repo
        Repo updatedRepo = repoRepository.findOne(repo.getId());
        // Disconnect from session so that the updates on updatedRepo are not directly saved in db
        em.detach(updatedRepo);
        updatedRepo
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .path(UPDATED_PATH)
            .logoUrl(UPDATED_LOGO_URL);

        restRepoMockMvc.perform(put("/api/repos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRepo)))
            .andExpect(status().isOk());

        // Validate the Repo in the database
        List<Repo> repoList = repoRepository.findAll();
        assertThat(repoList).hasSize(databaseSizeBeforeUpdate);
        Repo testRepo = repoList.get(repoList.size() - 1);
        assertThat(testRepo.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRepo.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRepo.getPath()).isEqualTo(UPDATED_PATH);
        assertThat(testRepo.getLogoUrl()).isEqualTo(UPDATED_LOGO_URL);
    }

    @Test
    @Transactional
    public void updateNonExistingRepo() throws Exception {
        int databaseSizeBeforeUpdate = repoRepository.findAll().size();

        // Create the Repo

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restRepoMockMvc.perform(put("/api/repos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(repo)))
            .andExpect(status().isCreated());

        // Validate the Repo in the database
        List<Repo> repoList = repoRepository.findAll();
        assertThat(repoList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteRepo() throws Exception {
        // Initialize the database
        repoRepository.saveAndFlush(repo);
        int databaseSizeBeforeDelete = repoRepository.findAll().size();

        // Get the repo
        restRepoMockMvc.perform(delete("/api/repos/{id}", repo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Repo> repoList = repoRepository.findAll();
        assertThat(repoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Repo.class);
        Repo repo1 = new Repo();
        repo1.setId(1L);
        Repo repo2 = new Repo();
        repo2.setId(repo1.getId());
        assertThat(repo1).isEqualTo(repo2);
        repo2.setId(2L);
        assertThat(repo1).isNotEqualTo(repo2);
        repo1.setId(null);
        assertThat(repo1).isNotEqualTo(repo2);
    }
}
