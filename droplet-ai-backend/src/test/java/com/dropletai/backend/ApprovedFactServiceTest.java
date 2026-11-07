package com.dropletai.backend;

import com.dropletai.backend.dto.ApprovedFactRequest;
import com.dropletai.backend.entity.*;
import com.dropletai.backend.repository.*;
import com.dropletai.backend.service.ApprovedFactService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ApprovedFactServiceTest {

    @Autowired
    private ApprovedFactService approvedFactService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganisationRepository organisationRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ApprovedFactRepository approvedFactRepository;

    @Autowired
    private GuidelineRepository guidelineRepository;

    private User testUser;
    private Organisation testOrg;
    private Brand testBrand;

    @BeforeEach
    void setUp() {
        guidelineRepository.deleteAll();
        membershipRepository.deleteAll();
        approvedFactRepository.deleteAll();
        brandRepository.deleteAll();
        organisationRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User();
        testUser.setFullName("Test User");
        testUser.setEmail("test@dropletai.com");
        testUser.setPasswordHash("hash");
        testUser = userRepository.save(testUser);

        testOrg = new Organisation();
        testOrg.setName("Test Org");
        testOrg = organisationRepository.save(testOrg);

        Membership membership = new Membership();
        membership.setUser(testUser);
        membership.setOrganisation(testOrg);
        membership.setRole(Role.ADMIN);
        membershipRepository.save(membership);

        testBrand = new Brand();
        testBrand.setName("Test Brand");
        testBrand.setOrganisation(testOrg);
        testBrand = brandRepository.save(testBrand);
    }

    @Test
    void testCreateFactSuccess() {
        ApprovedFactRequest request = new ApprovedFactRequest();
        request.setTitle("Product formulation");
        request.setContent("Our skincare products are formulated with dermatologist-reviewed ingredients.");
        request.setSource("Official product documentation");
        request.setBrandId(testBrand.getId());

        var response = approvedFactService.createFact(testOrg.getId(), testUser.getEmail(), request);

        assertNotNull(response);
        assertEquals("Product formulation", response.getTitle());
        assertEquals(VerificationStatus.PENDING, response.getVerificationStatus());
        assertEquals(testBrand.getId(), response.getBrandId());
    }

    @Test
    void testCreateFactAccessDeniedNotMember() {
        Organisation savedOtherOrg = new Organisation();
        savedOtherOrg.setName("Other Org");
        savedOtherOrg = organisationRepository.save(savedOtherOrg);
        UUID otherOrgId = savedOtherOrg.getId();

        ApprovedFactRequest request = new ApprovedFactRequest();
        request.setTitle("Product formulation");
        request.setContent("Our skincare products are formulated with dermatologist-reviewed ingredients.");

        assertThrows(AccessDeniedException.class, () ->
                approvedFactService.createFact(otherOrgId, testUser.getEmail(), request)
        );
    }
}
