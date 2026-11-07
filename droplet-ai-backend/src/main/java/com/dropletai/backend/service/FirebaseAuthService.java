package com.dropletai.backend.service;

import com.dropletai.backend.dto.AuthResponse;
import com.dropletai.backend.dto.FirebaseTokenRequest;
import com.dropletai.backend.entity.Membership;
import com.dropletai.backend.entity.Organisation;
import com.dropletai.backend.entity.Role;
import com.dropletai.backend.entity.User;
import com.dropletai.backend.repository.MembershipRepository;
import com.dropletai.backend.repository.OrganisationRepository;
import com.dropletai.backend.repository.UserRepository;
import com.dropletai.backend.security.JwtService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class FirebaseAuthService {

    private final FirebaseAuth firebaseAuth;
    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final MembershipRepository membershipRepository;
    private final JwtService jwtService;

    public FirebaseAuthService(
            FirebaseAuth firebaseAuth,
            UserRepository userRepository,
            OrganisationRepository organisationRepository,
            MembershipRepository membershipRepository,
            JwtService jwtService
    ) {
        this.firebaseAuth = firebaseAuth;
        this.userRepository = userRepository;
        this.organisationRepository = organisationRepository;
        this.membershipRepository = membershipRepository;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse signIn(FirebaseTokenRequest request) {
        final FirebaseToken verified;
        try {
            verified = firebaseAuth.verifyIdToken(request.getIdToken(), true);
        } catch (FirebaseAuthException exception) {
            throw new IllegalArgumentException("Firebase sign-in token is invalid or expired");
        }

        String email = verified.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("A Firebase account with an email address is required");
        }
        final String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        final String firebaseUid = verified.getUid();
        final boolean emailVerified = Boolean.TRUE.equals(verified.getClaims().get("email_verified"));

        User user = userRepository.findByFirebaseUid(firebaseUid).orElseGet(() -> {
            User emailMatch = userRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);
            if (emailMatch != null) {
                if (!emailVerified) {
                    throw new IllegalArgumentException("Verify your email in Firebase before linking it to an existing Droplet AI account");
                }
                if (emailMatch.getFirebaseUid() != null && !emailMatch.getFirebaseUid().equals(firebaseUid)) {
                    throw new IllegalArgumentException("This Droplet AI account is linked to a different Firebase account");
                }
                emailMatch.setFirebaseUid(firebaseUid);
                return userRepository.save(emailMatch);
            }

            User newUser = new User();
            String displayName = request.getFullName() == null || request.getFullName().isBlank()
                    ? verified.getName()
                    : request.getFullName();
            newUser.setFullName(displayName == null || displayName.isBlank()
                    ? normalizedEmail.substring(0, normalizedEmail.indexOf('@'))
                    : displayName.trim());
            newUser.setEmail(normalizedEmail);
            newUser.setFirebaseUid(firebaseUid);
            // Firebase is the credential provider; this unusable random hash is never used to sign in.
            newUser.setPasswordHash("FIREBASE:" + verified.getUid());
            User savedUser = userRepository.save(newUser);

            Organisation organisation = new Organisation();
            String requestedOrganisationName = request.getOrganisationName();
            organisation.setName(requestedOrganisationName == null || requestedOrganisationName.isBlank()
                    ? newUser.getFullName() + "'s Workspace"
                    : requestedOrganisationName.trim());
            organisation = organisationRepository.save(organisation);

            Membership membership = new Membership();
            membership.setUser(savedUser);
            membership.setOrganisation(organisation);
            membership.setRole(Role.OWNER);
            membershipRepository.save(membership);
            return savedUser;
        });

        Membership membership = membershipRepository.findByUser_Id(user.getId()).stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("User has no organisation membership"));

        return new AuthResponse(
                jwtService.generateToken(user.getEmail()),
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                membership.getOrganisation().getId(),
                membership.getOrganisation().getName(),
                membership.getRole().name()
        );
    }
}
