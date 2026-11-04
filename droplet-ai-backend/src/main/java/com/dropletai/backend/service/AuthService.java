
package com.dropletai.backend.service;

import com.dropletai.backend.dto.AuthResponse;
import com.dropletai.backend.dto.SignupRequest;
import com.dropletai.backend.dto.LoginRequest;

import com.dropletai.backend.entity.Membership;
import com.dropletai.backend.entity.Organisation;
import com.dropletai.backend.entity.Role;
import com.dropletai.backend.entity.User;

import com.dropletai.backend.repository.MembershipRepository;
import com.dropletai.backend.repository.OrganisationRepository;
import com.dropletai.backend.repository.UserRepository;

import com.dropletai.backend.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final MembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            OrganisationRepository organisationRepository,
            MembershipRepository membershipRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.organisationRepository = organisationRepository;
        this.membershipRepository = membershipRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // USER SIGNUP
    @Transactional
    public AuthResponse signup(SignupRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        User user = new User();

        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        user = userRepository.save(user);

        Organisation organisation = new Organisation();

        organisation.setName(
                request.getOrganisationName().trim()
        );

        organisation = organisationRepository.save(organisation);

        Membership membership = new Membership();

        membership.setUser(user);
        membership.setOrganisation(organisation);
        membership.setRole(Role.OWNER);

        membershipRepository.save(membership);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                organisation.getId(),
                organisation.getName(),
                Role.OWNER.name()
        );
    }

    // USER LOGIN
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        Membership membership = membershipRepository
                .findByUser_Id(user.getId())
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User has no organisation membership"
                        )
                );

        Organisation organisation = membership.getOrganisation();

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                organisation.getId(),
                organisation.getName(),
                membership.getRole().name()
        );
    }
}
