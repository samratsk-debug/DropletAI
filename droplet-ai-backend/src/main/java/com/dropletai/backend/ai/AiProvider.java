package com.dropletai.backend.ai;

public interface AiProvider {
    String generateContent(String systemInstruction, String prompt);
}
