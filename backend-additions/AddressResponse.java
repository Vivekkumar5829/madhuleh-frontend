package com.madhuleh.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

/**
 * AddressResponse — add this file to:
 *   src/main/java/com/madhuleh/dto/response/AddressResponse.java
 */
@Getter
@Builder
public class AddressResponse {
    private final UUID    id;
    private final String  firstName;
    private final String  lastName;
    private final String  phone;
    private final String  addressLine1;
    private final String  addressLine2;
    private final String  city;
    private final String  state;
    private final String  pincode;
    private final String  country;
    private final String  label;
    private final boolean isDefault;
}
