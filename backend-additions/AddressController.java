// ─────────────────────────────────────────────────────────────────────────────
// DROP THIS FILE INTO:
//   src/main/java/com/madhuleh/controller/AddressController.java
//
// This completes the missing address API.
// The Address entity + AddressRepository already exist in your backend.
// ─────────────────────────────────────────────────────────────────────────────
package com.madhuleh.controller;

import com.madhuleh.dto.request.AddressRequest;
import com.madhuleh.dto.response.ApiResponse;
import com.madhuleh.entity.Address;
import com.madhuleh.entity.User;
import com.madhuleh.repository.AddressRepository;
import com.madhuleh.repository.UserRepository;
import com.madhuleh.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository    userRepository;

    // GET /api/v1/addresses — list all addresses for current user
    @GetMapping
    public ResponseEntity<ApiResponse<List<Address>>> getMyAddresses(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        List<Address> addresses = addressRepository
                .findByUserIdAndDeletedFalse(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Addresses fetched", addresses));
    }

    // POST /api/v1/addresses — create a new address
    @PostMapping
    public ResponseEntity<ApiResponse<Address>> createAddress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody AddressRequest request) {

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If this is default, unset others
        if (request.isDefault()) {
            addressRepository.findByUserIdAndDeletedFalse(currentUser.getId())
                    .forEach(a -> { a.setDefault(false); addressRepository.save(a); });
        }

        Address address = Address.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .country("India")
                .label(request.getLabel() != null ? request.getLabel() : "Home")
                .isDefault(request.isDefault())
                .build();

        Address saved = addressRepository.save(address);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Address created", saved));
    }

    // PUT /api/v1/addresses/{id} — update an address
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Address>> updateAddress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID id,
            @Valid @RequestBody AddressRequest request) {

        Address address = addressRepository
                .findByIdAndUserIdAndDeletedFalse(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (request.isDefault()) {
            addressRepository.findByUserIdAndDeletedFalse(currentUser.getId())
                    .forEach(a -> { a.setDefault(false); addressRepository.save(a); });
        }

        address.setFirstName(request.getFirstName());
        address.setLastName(request.getLastName());
        address.setPhone(request.getPhone());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        if (request.getLabel() != null) address.setLabel(request.getLabel());
        address.setDefault(request.isDefault());

        return ResponseEntity.ok(ApiResponse.success("Address updated", addressRepository.save(address)));
    }

    // DELETE /api/v1/addresses/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID id) {

        Address address = addressRepository
                .findByIdAndUserIdAndDeletedFalse(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setDeleted(true);   // soft delete via BaseEntity
        addressRepository.save(address);
        return ResponseEntity.ok(ApiResponse.success("Address deleted"));
    }
}
