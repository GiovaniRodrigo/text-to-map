# Feature Specification: LLM Connection Settings

**Feature Branch**: `007-llm-connection-settings`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "integração com LLM deve pedir dados de ligação para usuário"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure API Key and Model (Priority: P1)

As a user, I want to configure my Gemini API Key and select an LLM model so that the application can use my own credentials to call the Gemini API for text segmentation and map generation.

**Why this priority**: P1 because without valid LLM credentials, users cannot access the AI-powered segmentation or map generation features if the default environment keys are missing or invalid.

**Independent Test**: Can be fully tested by opening the settings, entering a Gemini API Key, choosing a model, and saving. We can verify that subsequent AI calls use the new credentials and succeed.

**Acceptance Scenarios**:

1. **Given** the settings panel/modal is open, **When** the user enters a valid Gemini API Key and selects "gemini-1.5-flash" and saves, **Then** subsequent AI generation requests use these settings.
2. **Given** the user has configured connection settings, **When** they click the settings button, **Then** their settings are pre-filled and the API Key is masked.

---

### User Story 2 - Custom Endpoint Configuration (Priority: P2)

As a developer or enterprise user, I want to specify an optional custom API base URL/endpoint so that I can route my LLM requests through a local gateway or custom proxy.

**Why this priority**: P2 because it expands the utility of the LLM features for advanced, privacy-conscious, or enterprise users, but is not strictly necessary for standard users.

**Independent Test**: Can be tested by setting a custom proxy URL, attempting an AI action, and verifying that the network request is directed to the proxy URL instead of the default Google AI API host.

**Acceptance Scenarios**:

1. **Given** a custom Base URL is entered in the settings, **When** the user performs an AI action, **Then** the request is sent to the custom URL.
2. **Given** a custom Base URL is empty, **When** the user performs an AI action, **Then** the request defaults to the official Gemini API endpoint.

---

### User Story 3 - Connection Status & Validation (Priority: P1)

As a user, I want to test my configured credentials in real-time and see whether the connection succeeds, so I know my credentials are correct before saving.

**Why this priority**: P1 because it prevents frustration from typos or invalid keys that would otherwise result in failing map generations with generic errors.

**Independent Test**: Enter an invalid key, click "Test Connection", verify it shows a failure message. Enter a valid key, click "Test Connection", verify it shows success.

**Acceptance Scenarios**:

1. **Given** invalid connection details, **When** the user clicks "Test Connection", **Then** the system displays a clear error response from the API.
2. **Given** valid connection details, **When** the user clicks "Test Connection", **Then** the system displays a success indicator.

---

### Edge Cases

- **Invalid or Expired API Key**: If the saved credentials fail during actual map generation, the system should catch the authentication/API error, display an explicit message explaining that the API Key might be invalid, and offer a direct shortcut to open the LLM connection settings.
- **Precedence over Environment Variables**: If both a default environment key (`VITE_GEMINI_API_KEY`) and user-configured credentials exist, the user-configured credentials MUST take precedence.
- **Clearing Credentials**: Users must have a secure way to clear their credentials, which removes them completely from the browser storage and falls back to environment variables.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Settings Modal or Panel accessible via a gear/settings icon in the Control Panel next to the AI action buttons.
- **FR-002**: System MUST allow configuring:
  - Gemini API Key (masked password-type field)
  - Model Selection (dropdown with "gemini-1.5-flash", "gemini-1.5-pro", and "Custom model name" text field)
  - Base URL (optional text input for proxy/gateway)
- **FR-003**: System MUST persist the connection settings locally in the browser using `localStorage`.
- **FR-004**: System MUST provide a "Test Connection" action that performs a simple, low-cost API call to verify the configured credentials work.
- **FR-005**: System MUST allow clearing/resetting saved connection credentials.
- **FR-006**: System MUST standardize completely on direct `fetch` API calls using the Gemini REST API for all LLM communication, removing the dependency on the `@google/generative-ai` SDK.
- **FR-007**: System MUST obfuscate the API key using a client-side encoding (e.g., Base64) before saving to `localStorage` to prevent plain-text reading.
- **FR-008**: System MUST display a visual connection status badge (e.g., green/orange/red dot indicating connection health) in the Control Panel next to the settings gear button. Clicking it opens the settings modal.

### Key Entities *(include if feature involves data)*

- **LLMConnectionConfig**: Represents the user's connection settings.
  - Attributes:
    - `apiKey` (string, required if using custom credentials)
    - `model` (string, required)
    - `baseUrl` (string, optional)
    - `isActive` (boolean, indicates if custom settings should override environment defaults)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can open the LLM settings, enter credentials, and complete a successful "Test Connection" in under 15 seconds.
- **SC-002**: 100% of user-configured settings successfully override environment variables without requiring a page reload.
- **SC-003**: In the event of an API error, a direct link to the settings panel is displayed within 1 second of the error occurrence.

## Assumptions

- The user's browser supports `localStorage` for persisting settings.
- The user is responsible for obtaining their own API key from Google AI Studio.
- The standard browser network security policies (CORS) allow sending requests to the custom proxy if one is specified.
