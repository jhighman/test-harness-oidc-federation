# OIDC Test Harness

A development tool for simulating OpenID Connect (OIDC) flows and testing OIDC integrations.

## OIDC Registration Simulation

This tool simulates the OpenID Connect Dynamic Client Registration protocol, providing a sandbox environment for testing OIDC implementations.

### Features

#### 1. Standard OIDC Claims
- Implements full set of OpenID Connect Standard Claims
- Supports required and optional user information fields
- Validates E.164 phone numbers and email formats
- Handles verification status for email and phone numbers

#### 2. Registration Flow
The simulation demonstrates a complete OIDC client registration flow:

1. **Initial Registration Request**
   - Accepts standard OIDC claims
   - Generates JWT tokens for request authentication
   - Supports multiple endpoints (local, staging, production)

2. **Registration Response**
   - Returns OIDC-compliant client credentials
   - Generates unique client_id and client_secret
   - Provides registration access token for client management
   - Returns standard OIDC endpoints:
     - Token endpoint
     - Authorization endpoint
     - JWKS URI

3. **Supported Features**
   - Multiple response types (code, token, id_token)
   - Various grant types (authorization_code, refresh_token)
   - RS256 signing algorithm for ID tokens
   - Public subject type

### Testing Tools

#### JWT Token Generation
- Demonstrates JWT structure with header, payload, and signature
- Base64 encoded for educational purposes
- Shows proper token format for API requests

#### CURL Command Generation
- Generates ready-to-use CURL commands
- Includes proper headers and authentication
- Formats request body according to OIDC specs

### Implementation Notes

#### Security Considerations
- JWT signing is simulated (base64 encoded only)
- In production environments:
  - Use proper cryptographic signing
  - Implement secure key management
  - Handle token validation server-side

#### Standards Compliance
- Follows OAuth 2.0 Dynamic Client Registration Protocol
- Implements OIDC Connect Core 1.0 specifications
- Uses standard claim definitions and formats

### Usage

1. Select an endpoint (local/staging/production)
2. Fill in required OIDC claims
3. Submit registration request
4. Review:
   - Generated client credentials
   - Registration access token
   - Available OIDC endpoints
   - JWT token structure
   - CURL command for API testing

## Technical Details

### Tech Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

### OIDC Implementation

#### Registration Flow
1. Client submits registration request with OIDC claims
2. System generates:
   - Client credentials (client_id, client_secret)
   - Registration access token
   - OIDC endpoints
3. Response includes:
   - Token endpoint
   - Authorization endpoint
   - JWKS URI

#### Security Notes
- JWT signing is simulated (base64 encoded)
- For educational purposes only
- Production implementations should use proper cryptographic signing

### Standards Compliance
- OpenID Connect Core 1.0
- OAuth 2.0 Dynamic Client Registration Protocol
- JWT (JSON Web Tokens)

## Usage Guide

1. **Select Endpoint**
   - Choose between local, staging, or production

2. **Fill Required Claims**
   - Subject identifier
   - Given name
   - Family name
   - Email
   - Phone number (E.164 format)

3. **Submit Registration**
   - Review generated credentials
   - Inspect JWT structure
   - Test with generated CURL command

4. **Review Response**
   - Client credentials
   - Registration access token
   - Available endpoints
   - Supported features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file

## References

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [OAuth 2.0 Dynamic Client Registration](https://datatracker.ietf.org/doc/html/rfc7591)
- [JWT.io](https://jwt.io/)
