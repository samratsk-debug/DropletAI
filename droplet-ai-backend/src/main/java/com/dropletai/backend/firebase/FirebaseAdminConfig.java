package com.dropletai.backend.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
public class FirebaseAdminConfig {

    @Bean
    public FirebaseAuth firebaseAuth(
            @Value("${firebase.project-id:codenexus-a76a4}") String projectId,
            @Value("${firebase.service-account:firebase-service-account.json}") String serviceAccountPath
    ) throws IOException {
        FirebaseOptions.Builder options = FirebaseOptions.builder().setProjectId(projectId);
        Path credentialPath = Path.of(serviceAccountPath);
        if (!credentialPath.isAbsolute() && !Files.isRegularFile(credentialPath)) {
            Path repositoryRelativePath = Path.of("droplet-ai-backend").resolve(credentialPath);
            if (Files.isRegularFile(repositoryRelativePath)) {
                credentialPath = repositoryRelativePath;
            }
        }

        if (Files.isRegularFile(credentialPath)) {
            try (FileInputStream credentials = new FileInputStream(credentialPath.toFile())) {
                options.setCredentials(GoogleCredentials.fromStream(credentials));
            }
        } else {
            // On deployed environments, prefer Application Default Credentials.
            options.setCredentials(GoogleCredentials.getApplicationDefault());
        }

        FirebaseApp app = FirebaseApp.getApps().stream()
                .filter(existing -> existing.getName().equals("droplet-ai"))
                .findFirst()
                .orElseGet(() -> FirebaseApp.initializeApp(options.build(), "droplet-ai"));
        return FirebaseAuth.getInstance(app);
    }
}
