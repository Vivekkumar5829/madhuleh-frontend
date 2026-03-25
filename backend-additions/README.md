# Backend Additions Required for Frontend to Work

## Files to Add

### 1. AddressController.java
Drop into: `src/main/java/com/madhuleh/controller/AddressController.java`

This controller is REQUIRED for checkout. The frontend's Checkout page:
1. POSTs to `/api/v1/addresses` to save the user's delivery address
2. Gets back an `addressId` (UUID)
3. Sends that `addressId` to `POST /api/v1/orders` in `CreateOrderRequest`

Without this controller, checkout will fail with 404.

### 2. AddressResponse.java
Drop into: `src/main/java/com/madhuleh/dto/response/AddressResponse.java`

### 3. AddressRepository — Already Exists ✅
Your `AddressRepository` already exists at:
`src/main/java/com/madhuleh/repository/AddressRepository.java`

Just verify it has these methods (or add them):
```java
List<Address> findByUserIdAndDeletedFalse(UUID userId);
Optional<Address> findByIdAndUserIdAndDeletedFalse(UUID id, UUID userId);
```

## That's It!
After adding these 2 files and verifying the repository methods,
your full checkout flow will work end-to-end.
