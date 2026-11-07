package com.dropletai.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
public class GeminiAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiProvider.class);

    private final GeminiConfig geminiConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiAiProvider(GeminiConfig geminiConfig) {
        this.geminiConfig = geminiConfig;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String generateContent(String systemInstruction, String prompt) {
        String apiKey = geminiConfig.getApiKey();
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("${GEMINI_API_KEY}")) {
            log.warn("Gemini API key is not configured. Falling back to rule-based analysis.");
            return null;
        }

        String model = geminiConfig.getModel();
        if (model == null || model.trim().isEmpty()) {
            model = "gemini-1.5-flash";
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent";

        try {
            Map<String, Object> requestBody = new HashMap<>();

            // System instruction
            if (systemInstruction != null && !systemInstruction.isEmpty()) {
                Map<String, Object> sysPart = new HashMap<>();
                sysPart.put("text", systemInstruction);
                Map<String, Object> sysContent = new HashMap<>();
                sysContent.put("parts", Collections.singletonList(sysPart));
                requestBody.put("systemInstruction", sysContent);
            }

            // User prompt
            Map<String, Object> userPart = new HashMap<>();
            userPart.put("text", prompt);
            Map<String, Object> userContent = new HashMap<>();
            userContent.put("role", "user");
            userContent.put("parts", Collections.singletonList(userPart));

            requestBody.put("contents", Collections.singletonList(userContent));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String body = response.getBody();
                JsonNode root = objectMapper.readTree(body);
                JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
                if (!textNode.isMissingNode()) {
                    return textNode.asText();
                }
                return body;
            } else {
                log.error("Gemini API returned non-success status: {}", response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error communicating with Gemini API: {}", e.getMessage(), e);
        }

        return null;
    }
}
