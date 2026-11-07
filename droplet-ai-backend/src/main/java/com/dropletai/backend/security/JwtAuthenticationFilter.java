
package com.dropletai.backend.security;

import com.dropletai.backend.entity.User;
import com.dropletai.backend.repository.UserRepository;
import com.dropletai.backend.repository.MembershipRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository,
            MembershipRepository membershipRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();
        if (token.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String rawEmail = jwtService.extractEmail(token);

            if (rawEmail != null
                    && SecurityContextHolder.getContext().getAuthentication() == null
                    && jwtService.isTokenValid(token, rawEmail)) {

                String normalizedEmail = rawEmail.trim().toLowerCase(Locale.ROOT);
                User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                        .orElse(null);

                if (user != null) {
                    List<SimpleGrantedAuthority> authorities =
                            membershipRepository.findByUser_Id(user.getId())
                                    .stream()
                                    .filter(membership -> membership.getRole() != null)
                                    .map(membership ->
                                            new SimpleGrantedAuthority(
                                                    "ROLE_" + membership.getRole().name()
                                            )
                                    )
                                    .toList();

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    normalizedEmail,
                                    null,
                                    authorities
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                } else {
                    log.warn("User with email '{}' extracted from valid JWT was not found in database", normalizedEmail);
                }
            }

        } catch (Exception exception) {
            log.debug("JWT authentication filter exception: {}", exception.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
