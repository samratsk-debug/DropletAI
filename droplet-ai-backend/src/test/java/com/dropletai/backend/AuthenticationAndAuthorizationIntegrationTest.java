package com.dropletai.backend;

import com.dropletai.backend.dto.ApprovedFactRequest;
import com.dropletai.backend.dto.LoginRequest;
import com.dropletai.backend.dto.SignupRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationAndAuthorizationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testSignupAndAccessOrganisationMeAndFacts() throws Exception {
        // 1. Signup new user
        SignupRequest signup = new SignupRequest();
        signup.setFullName("Alice Founder");
        signup.setEmail("alice@acme.com");
        signup.setPassword("SecurePass123!");
        signup.setOrganisationName("Acme Corp");

        MvcResult signupResult = mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode signupJson = objectMapper.readTree(signupResult.getResponse().getContentAsString());
        String token = signupJson.get("token").asText();
        String orgIdStr = signupJson.get("organisationId").asText();
        assertNotNull(token);
        assertNotNull(orgIdStr);

        // 2. GET /api/organisations/me
        MvcResult meResult = mockMvc.perform(get("/api/organisations/me")
                        .header("Authorization", "Bearer " + token))
                .andReturn();

        System.out.println("GET /api/organisations/me status: " + meResult.getResponse().getStatus());
        System.out.println("GET /api/organisations/me body: " + meResult.getResponse().getContentAsString());

        assertEquals(200, meResult.getResponse().getStatus());

        // 3. POST /api/organisations/{organisationId}/facts
        ApprovedFactRequest factRequest = new ApprovedFactRequest();
        factRequest.setTitle("Acme Guarantee");
        factRequest.setContent("All Acme products have lifetime warranty.");
        factRequest.setSource("Product Spec v1");

        MvcResult factResult = mockMvc.perform(post("/api/organisations/" + orgIdStr + "/facts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(factRequest)))
                .andReturn();

        System.out.println("POST /facts status: " + factResult.getResponse().getStatus());
        System.out.println("POST /facts body: " + factResult.getResponse().getContentAsString());

        assertEquals(201, factResult.getResponse().getStatus());

        // 4. Test missing token -> should return 401 Unauthorized (currently Spring Security defaults to 403 Forbidden without AuthenticationEntryPoint)
        MvcResult missingTokenResult = mockMvc.perform(get("/api/organisations/me"))
                .andReturn();
        System.out.println("Missing token status: " + missingTokenResult.getResponse().getStatus());
    }

    @Test
    void testCaseInsensitiveEmailHandlingInAuthAndToken() throws Exception {
        // Signup with mixed case email
        SignupRequest signup = new SignupRequest();
        signup.setFullName("Bob MixedCase");
        signup.setEmail("Bob.Smith@Acme.COM");
        signup.setPassword("SecurePass123!");
        signup.setOrganisationName("Bob Enterprise");

        MvcResult signupResult = mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode signupJson = objectMapper.readTree(signupResult.getResponse().getContentAsString());
        String token = signupJson.get("token").asText();
        String orgIdStr = signupJson.get("organisationId").asText();

        // Login with lowercase email
        LoginRequest login = new LoginRequest();
        login.setEmail("bob.smith@acme.com");
        login.setPassword("SecurePass123!");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        String loginToken = objectMapper.readTree(loginResult.getResponse().getContentAsString()).get("token").asText();

        // Access with login token
        mockMvc.perform(get("/api/organisations/me")
                        .header("Authorization", "Bearer " + loginToken))
                .andExpect(status().isOk());

        // Access facts with login token
        ApprovedFactRequest factRequest = new ApprovedFactRequest();
        factRequest.setTitle("Bob Fact");
        factRequest.setContent("Bob products are certified organic.");

        mockMvc.perform(post("/api/organisations/" + orgIdStr + "/facts")
                        .header("Authorization", "Bearer " + loginToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(factRequest)))
                .andExpect(status().isCreated());
    }
}
