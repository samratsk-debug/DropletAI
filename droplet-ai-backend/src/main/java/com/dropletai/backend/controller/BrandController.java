
package com.dropletai.backend.controller;

import com.dropletai.backend.dto.BrandRequest;
import com.dropletai.backend.dto.BrandResponse;
import com.dropletai.backend.service.BrandService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organisations/{organisationId}/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    // Create a new brand
    @PostMapping
    public ResponseEntity<BrandResponse> createBrand(
            @PathVariable java.util.UUID organisationId,
            @Valid @RequestBody BrandRequest request,
            Authentication authentication
    ) {
        BrandResponse response = brandService.createBrand(
                organisationId,
                authentication.getName(),
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all brands of an organisation
    @GetMapping
    public ResponseEntity<List<BrandResponse>> getBrands(
            @PathVariable java.util.UUID organisationId,
            Authentication authentication
    ) {
        List<BrandResponse> brands = brandService.getBrands(
                organisationId,
                authentication.getName()
        );

        return ResponseEntity.ok(brands);
    }

    @PutMapping("/{brandId}")
    public ResponseEntity<BrandResponse> updateBrand(
            @PathVariable java.util.UUID organisationId,
            @PathVariable java.util.UUID brandId,
            @Valid @RequestBody BrandRequest request,
            Authentication authentication
    ) {
        BrandResponse response = brandService.updateBrand(
                organisationId,
                brandId,
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{brandId}")
    public ResponseEntity<java.util.Map<String, String>> deleteBrand(
            @PathVariable java.util.UUID organisationId,
            @PathVariable java.util.UUID brandId,
            Authentication authentication
    ) {
        brandService.deleteBrand(
                organisationId,
                brandId,
                authentication.getName()
        );

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "Brand deleted successfully"
                )
        );
    }

}
