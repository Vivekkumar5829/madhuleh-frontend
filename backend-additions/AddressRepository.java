// ─────────────────────────────────────────────────────────────────────────────
// YOUR EXISTING FILE IS AT:
//   src/main/java/com/madhuleh/repository/AddressRepository.java
//
// ADD these two method signatures to your existing AddressRepository interface.
// The findByIdAndUserIdAndDeletedFalse already exists (used by OrderService).
// You only need to ADD findByUserIdAndDeletedFalse.
// ─────────────────────────────────────────────────────────────────────────────

// Add inside your existing AddressRepository interface:

    List<Address> findByUserIdAndDeletedFalse(UUID userId);

// That's it. Spring Data JPA will implement it automatically.
