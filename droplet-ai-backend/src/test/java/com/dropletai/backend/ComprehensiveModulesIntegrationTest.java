package com.dropletai.backend;

import com.dropletai.backend.dto.*;
import com.dropletai.backend.entity.Role;
import com.dropletai.backend.entity.VerificationStatus;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ComprehensiveModulesIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Helper: Signup a user and return the AuthResponse JSON
    private JsonNode signupUser(String name, String email, String password, String orgName) throws Exception {
        SignupRequest signup = new SignupRequest();
        signup.setFullName(name);
        signup.setEmail(email);
        signup.setPassword(password);
        signup.setOrganisationName(orgName);

        MvcResult result = mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    // Helper: Login a user and return the AuthResponse JSON
    private JsonNode loginUser(String email, String password) throws Exception {
        LoginRequest login = new LoginRequest();
        login.setEmail(email);
        login.setPassword(password);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    @Test
    @Order(1)
    void testModule1_And_2_Auth_Jwt_And_SecurityHeaders() throws Exception {
        // 1. Signup
        JsonNode authNode = signupUser("Test Admin", "admin@dropletai.io", "Pass1234!", "Droplet Global");
        String token = authNode.get("token").asText();
        assertNotNull(token);
        assertEquals("Droplet Global", authNode.get("organisationName").asText());
        assertEquals("OWNER", authNode.get("role").asText());

        // 2. Login
        JsonNode loginNode = loginUser("admin@dropletai.io", "Pass1234!");
        assertEquals(token.length(), loginNode.get("token").asText().length());

        // 3. User profile endpoint
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("admin@dropletai.io"))
                .andExpect(jsonPath("$.fullName").value("Test Admin"));

        // 4. Missing JWT returns 401
        mockMvc.perform(get("/api/organisations/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"));

        // 5. Malformed JWT returns 401
        mockMvc.perform(get("/api/organisations/me")
                        .header("Authorization", "Bearer invalid-token-xyz"))
                .andExpect(status().isUnauthorized());

        // 6. Preflight CORS OPTIONS request succeeds
        mockMvc.perform(options("/api/organisations/me")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk());
    }

    @Test
    @Order(2)
    void testModule3_Organisation_Management() throws Exception {
        JsonNode auth = signupUser("Org Boss", "boss@corp.com", "BossPass123!", "Primary Org");
        String token = auth.get("token").asText();
        String primaryOrgId = auth.get("organisationId").asText();

        // GET /api/organisations/me
        mockMvc.perform(get("/api/organisations/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.organisationName").value("Primary Org"))
                .andExpect(jsonPath("$.role").value("OWNER"));

        // Create a secondary organisation
        MvcResult createOrgResult = mockMvc.perform(post("/api/organisations")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "Secondary Enterprise"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.organisationName").value("Secondary Enterprise"))
                .andExpect(jsonPath("$.role").value("OWNER"))
                .andReturn();

        String secondaryOrgId = objectMapper.readTree(createOrgResult.getResponse().getContentAsString()).get("organisationId").asText();

        // GET /api/organisations (lists all user's organisations)
        mockMvc.perform(get("/api/organisations")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        // GET /api/organisations/{id}
        mockMvc.perform(get("/api/organisations/" + primaryOrgId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.organisationName").value("Primary Org"));

        // PUT /api/organisations/{id}
        mockMvc.perform(put("/api/organisations/" + secondaryOrgId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "Renamed Enterprise"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.organisationName").value("Renamed Enterprise"));
    }

    @Test
    @Order(3)
    void testModule4_Membership_And_RolePermissions() throws Exception {
        // Owner
        JsonNode ownerAuth = signupUser("Team Lead", "lead@company.com", "LeadPass123!", "Team Co");
        String ownerToken = ownerAuth.get("token").asText();
        String orgId = ownerAuth.get("organisationId").asText();

        // Register two other users
        JsonNode member1 = signupUser("Charlie Writer", "charlie@writer.com", "WriterPass123!", "Charlie Solo Org");
        String charlieToken = member1.get("token").asText();
        JsonNode member2 = signupUser("Dana Reviewer", "dana@reviewer.com", "ReviewPass123!", "Dana Solo Org");
        String danaToken = member2.get("token").asText();

        // Owner adds Charlie as CONTENT_CREATOR
        AddMemberRequest addReq = new AddMemberRequest();
        addReq.setEmail("charlie@writer.com");
        addReq.setRole(Role.CONTENT_CREATOR);

        MvcResult addResult = mockMvc.perform(post("/api/organisations/" + orgId + "/members")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role").value("CONTENT_CREATOR"))
                .andReturn();

        String membershipId = objectMapper.readTree(addResult.getResponse().getContentAsString()).get("membershipId").asText();

        // Owner adds Dana as REVIEWER
        AddMemberRequest addDanaReq = new AddMemberRequest();
        addDanaReq.setEmail("dana@reviewer.com");
        addDanaReq.setRole(Role.REVIEWER);

        mockMvc.perform(post("/api/organisations/" + orgId + "/members")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addDanaReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role").value("REVIEWER"));

        // List members
        mockMvc.perform(get("/api/organisations/" + orgId + "/members")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3)); // Owner, Charlie, Dana

        // Update Charlie role to MARKETING_MANAGER
        UpdateMemberRoleRequest updateRoleReq = new UpdateMemberRoleRequest();
        updateRoleReq.setRole(Role.MARKETING_MANAGER);

        mockMvc.perform(put("/api/organisations/" + orgId + "/members/" + membershipId + "/role")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRoleReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("MARKETING_MANAGER"));

        // Charlie (non-owner) tries to add a member -> Forbidden (403)
        AddMemberRequest unauthorizedAdd = new AddMemberRequest();
        unauthorizedAdd.setEmail("dana@reviewer.com");
        unauthorizedAdd.setRole(Role.ADMIN);

        mockMvc.perform(post("/api/organisations/" + orgId + "/members")
                        .header("Authorization", "Bearer " + charlieToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(unauthorizedAdd)))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(4)
    void testModule5_Brand_CRUD() throws Exception {
        JsonNode ownerAuth = signupUser("Brand Owner", "brandmgr@brands.com", "BrandPass123!", "Brand Org");
        String token = ownerAuth.get("token").asText();
        String orgId = ownerAuth.get("organisationId").asText();

        // 1. Create Brand
        BrandRequest req = new BrandRequest();
        req.setName("Droplet Skincare");
        req.setDescription("Premium hydrating skincare brand");

        MvcResult createResult = mockMvc.perform(post("/api/organisations/" + orgId + "/brands")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Droplet Skincare"))
                .andReturn();

        String brandId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asText();

        // 2. Get Brands
        mockMvc.perform(get("/api/organisations/" + orgId + "/brands")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Droplet Skincare"));

        // 3. Update Brand
        req.setName("Droplet Skincare Pro");
        req.setDescription("Updated description");
        mockMvc.perform(put("/api/organisations/" + orgId + "/brands/" + brandId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Droplet Skincare Pro"));

        // 4. Delete Brand
        mockMvc.perform(delete("/api/organisations/" + orgId + "/brands/" + brandId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Brand deleted successfully"));
    }

    @Test
    @Order(5)
    void testModule6_Guidelines_CRUD() throws Exception {
        JsonNode ownerAuth = signupUser("Guideline Boss", "guideline@rules.com", "GuidePass123!", "Rules Corp");
        String token = ownerAuth.get("token").asText();
        String orgId = ownerAuth.get("organisationId").asText();

        // Create Guideline
        GuidelineRequest guideReq = new GuidelineRequest();
        guideReq.setTitle("No Absolute Guarantees");
        guideReq.setContent("Marketing copy must never state that our product is guaranteed 100% effective or cure any disease.");

        MvcResult createResult = mockMvc.perform(post("/api/organisations/" + orgId + "/guidelines")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(guideReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("No Absolute Guarantees"))
                .andReturn();

        String guideId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asText();

        // Get Guidelines
        mockMvc.perform(get("/api/organisations/" + orgId + "/guidelines")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("No Absolute Guarantees"));

        // Update Guideline
        guideReq.setTitle("Strict Claim Standards");
        guideReq.setContent("Never guarantee results without lab study citation.");
        mockMvc.perform(put("/api/organisations/" + orgId + "/guidelines/" + guideId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(guideReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Strict Claim Standards"));

        // Delete Guideline
        mockMvc.perform(delete("/api/organisations/" + orgId + "/guidelines/" + guideId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guideline deleted successfully"));
    }

    @Test
    @Order(6)
    void testModule7_ApprovedFacts_CRUD_And_Verification() throws Exception {
        JsonNode ownerAuth = signupUser("Fact Admin", "factadmin@facts.com", "FactPass123!", "Facts Org");
        String ownerToken = ownerAuth.get("token").asText();
        String orgId = ownerAuth.get("organisationId").asText();

        // 1. Create Fact
        ApprovedFactRequest factReq = new ApprovedFactRequest();
        factReq.setTitle("Battery Endurance");
        factReq.setContent("Device battery lasts up to 24 hours under continuous operational usage.");
        factReq.setSource("Lab Benchmark Report Q3 2026");

        MvcResult createResult = mockMvc.perform(post("/api/organisations/" + orgId + "/facts")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(factReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.verificationStatus").value("PENDING"))
                .andReturn();

        String factId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asText();

        // 2. Get Facts
        mockMvc.perform(get("/api/organisations/" + orgId + "/facts")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Battery Endurance"));

        // 3. Update Verification Status -> APPROVED
        mockMvc.perform(patch("/api/organisations/" + orgId + "/facts/" + factId + "/status")
                        .param("status", "APPROVED")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verificationStatus").value("APPROVED"))
                .andExpect(jsonPath("$.approvedByEmail").value("factadmin@facts.com"));

        // 4. Delete Fact
        mockMvc.perform(delete("/api/organisations/" + orgId + "/facts/" + factId)
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @Order(7)
    void testModule8_Document_Upload_Extraction_And_Download() throws Exception {
        JsonNode ownerAuth = signupUser("Doc Master", "docs@company.com", "DocPass123!", "Doc Company");
        String token = ownerAuth.get("token").asText();
        String orgId = ownerAuth.get("organisationId").asText();

        // Prepare multipart file
        MockMultipartFile textFile = new MockMultipartFile(
                "file",
                "brand_compliance_spec.txt",
                "text/plain",
                "Droplet AI guarantees 99.99% brand compliance for enterprise marketing campaigns.".getBytes(StandardCharsets.UTF_8)
        );

        // Upload document
        MvcResult uploadResult = mockMvc.perform(multipart("/api/organisations/" + orgId + "/documents")
                        .file(textFile)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.originalFilename").value("brand_compliance_spec.txt"))
                .andExpect(jsonPath("$.fileType").value("TXT"))
                .andExpect(jsonPath("$.processingStatus").value("PROCESSED"))
                .andReturn();

        String docId = objectMapper.readTree(uploadResult.getResponse().getContentAsString()).get("id").asText();

        // List documents
        mockMvc.perform(get("/api/organisations/" + orgId + "/documents")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].originalFilename").value("brand_compliance_spec.txt"));

        // Download document
        mockMvc.perform(get("/api/organisations/" + orgId + "/documents/" + docId + "/download")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"brand_compliance_spec.txt\""));

        // Delete document
        mockMvc.perform(delete("/api/organisations/" + orgId + "/documents/" + docId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    @Test
    @Order(8)
    void testModule9_Brand_Knowledge_Retrieval() throws Exception {
        JsonNode ownerAuth = signupUser("Knowledge Boss", "kb@company.com", "KbPass123!", "Knowledge Org");
        String token = ownerAuth.get("token").asText();
        String orgId = ownerAuth.get("organisationId").asText();

        // 1. Create a guideline
        GuidelineRequest guideReq = new GuidelineRequest();
        guideReq.setTitle("Organic Claim Rule");
        guideReq.setContent("Must specify EcoCert certification on organic claims.");
        mockMvc.perform(post("/api/organisations/" + orgId + "/guidelines")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(guideReq)))
                .andExpect(status().isCreated());

        // 2. Create an approved fact
        ApprovedFactRequest factReq = new ApprovedFactRequest();
        factReq.setTitle("EcoCert Certified");
        factReq.setContent("All 2026 batches are EcoCert Cosmos Certified.");
        factReq.setSource("EcoCert Certificate 2026");

        MvcResult factRes = mockMvc.perform(post("/api/organisations/" + orgId + "/facts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(factReq)))
                .andExpect(status().isCreated())
                .andReturn();

        String factId = objectMapper.readTree(factRes.getResponse().getContentAsString()).get("id").asText();

        // Approve the fact (so it qualifies for brand knowledge)
        mockMvc.perform(patch("/api/organisations/" + orgId + "/facts/" + factId + "/status")
                        .param("status", "APPROVED")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // 3. Upload a document
        MockMultipartFile docFile = new MockMultipartFile(
                "file",
                "knowledge_base.txt",
                "text/plain",
                "Brand voice is authoritative and precise.".getBytes(StandardCharsets.UTF_8)
        );
        mockMvc.perform(multipart("/api/organisations/" + orgId + "/documents")
                        .file(docFile)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated());

        // 4. Fetch Brand Knowledge
        mockMvc.perform(get("/api/organisations/" + orgId + "/knowledge")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.guidelines.length()").value(1))
                .andExpect(jsonPath("$.approvedFacts.length()").value(1))
                .andExpect(jsonPath("$.approvedFacts[0].verificationStatus").value("APPROVED"))
                .andExpect(jsonPath("$.documents.length()").value(1))
                .andExpect(jsonPath("$.documentSnippets.length()").value(1));
    }

    @Test
    @Order(9)
    void testModules10_to_15_ContentWorkflow_Analysis_Review_And_AuditLogs() throws Exception {
        // 1. Setup Organisation and Brand
        JsonNode ownerAuth = signupUser("Content Director", "director@media.com", "DirPass123!", "Media Network");
        String token = ownerAuth.get("token").asText();
        String orgId = ownerAuth.get("organisationId").asText();

        BrandRequest brandReq = new BrandRequest();
        brandReq.setName("Droplet Health");
        brandReq.setDescription("Wellness & fitness product line");

        MvcResult brandResult = mockMvc.perform(post("/api/organisations/" + orgId + "/brands")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brandReq)))
                .andExpect(status().isCreated())
                .andReturn();

        String brandId = objectMapper.readTree(brandResult.getResponse().getContentAsString()).get("id").asText();

        // 2. Add Guideline against absolute guarantees
        GuidelineRequest guideReq = new GuidelineRequest();
        guideReq.setTitle("No Health Guarantees");
        guideReq.setContent("Prohibited: Content must never guarantee instant weight loss or disease cures.");
        mockMvc.perform(post("/api/organisations/" + orgId + "/guidelines")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(guideReq)))
                .andExpect(status().isCreated());

        // 3. Submit Content (Triggers AI analysis & Risk Scoring)
        ContentSubmissionRequest subReq = new ContentSubmissionRequest();
        subReq.setBrandId(UUID.fromString(brandId));
        subReq.setTitle("Summer Health Campaign Ad");
        subReq.setContentType("SOCIAL_MEDIA");
        subReq.setContent("Try our new smoothie! We guarantee that you will lose 10 pounds in 3 days with no effort!");

        MvcResult subResult = mockMvc.perform(post("/api/organisations/" + orgId + "/content")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING_REVIEW"))
                .andExpect(jsonPath("$.analysisReport.riskScore").exists())
                .andExpect(jsonPath("$.analysisReport.riskCategory").exists())
                .andReturn();

        JsonNode subNode = objectMapper.readTree(subResult.getResponse().getContentAsString());
        String submissionId = subNode.get("id").asText();
        int riskScore = subNode.get("analysisReport").get("riskScore").asInt();
        assertTrue(riskScore >= 45, "Risk score should reflect the guideline violation for 'guarantee'");

        // 4. List Submissions
        mockMvc.perform(get("/api/organisations/" + orgId + "/content")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(submissionId));

        // 5. Get Submission Detail
        mockMvc.perform(get("/api/organisations/" + orgId + "/content/" + submissionId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Summer Health Campaign Ad"));

        // 6. Review Action: REQUEST_REVISION
        ReviewActionRequest revisionReq = new ReviewActionRequest();
        revisionReq.setAction("REQUEST_REVISION");
        revisionReq.setComment("Please remove the word 'guarantee' and cite clinical trials.");

        mockMvc.perform(post("/api/organisations/" + orgId + "/content/" + submissionId + "/review")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(revisionReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REVISION_REQUESTED"));

        // 7. Review Action: REJECT
        ReviewActionRequest rejectReq = new ReviewActionRequest();
        rejectReq.setAction("REJECT");
        rejectReq.setComment("Claims violate FTC compliance standards.");

        mockMvc.perform(post("/api/organisations/" + orgId + "/content/" + submissionId + "/review")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rejectReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"));

        // 8. Review Action: APPROVE
        ReviewActionRequest approveReq = new ReviewActionRequest();
        approveReq.setAction("APPROVE");
        approveReq.setComment("Approved after exceptional risk waiver.");

        mockMvc.perform(post("/api/organisations/" + orgId + "/content/" + submissionId + "/review")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(approveReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));

        // 9. Inspect Review History & Audit Logs
        mockMvc.perform(get("/api/organisations/" + orgId + "/content/" + submissionId + "/logs")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4)) // SUBMITTED, REQUEST_REVISION, REJECTED, APPROVED
                .andExpect(jsonPath("$[0].action").value("SUBMITTED"))
                .andExpect(jsonPath("$[1].action").value("REQUEST_REVISION"))
                .andExpect(jsonPath("$[2].action").value("REJECTED"))
                .andExpect(jsonPath("$[3].action").value("APPROVED"));
    }

    @Test
    @Order(10)
    void testCrossOrganisationDataIsolation() throws Exception {
        // Org A
        JsonNode orgA = signupUser("User Org A", "user@orga.com", "PassA123!", "Company A");
        String tokenA = orgA.get("token").asText();
        String orgIdA = orgA.get("organisationId").asText();

        // Org B
        JsonNode orgB = signupUser("User Org B", "user@orgb.com", "PassB123!", "Company B");
        String tokenB = orgB.get("token").asText();
        String orgIdB = orgB.get("organisationId").asText();

        // User A tries to view Org B's members -> Forbidden (403)
        mockMvc.perform(get("/api/organisations/" + orgIdB + "/members")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isForbidden());

        // User A tries to view Org B's facts -> Forbidden (403)
        mockMvc.perform(get("/api/organisations/" + orgIdB + "/facts")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isForbidden());

        // User B tries to view Org A's guidelines -> Forbidden (403)
        mockMvc.perform(get("/api/organisations/" + orgIdA + "/guidelines")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());

        // User B tries to create a brand in Org A -> Forbidden (403)
        BrandRequest brandReq = new BrandRequest();
        brandReq.setName("Malicious Cross-Org Brand");
        mockMvc.perform(post("/api/organisations/" + orgIdA + "/brands")
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brandReq)))
                .andExpect(status().isForbidden());
    }
}
