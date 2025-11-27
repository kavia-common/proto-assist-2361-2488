# Proto Assistant WebFrontend

Proto Assistant is a chat application designed to connect users with an intelligent Agent capable of generating UI wireframes based on user prompts. This WebFrontend provides a dynamic, responsive interface for real-time communication with the AI Agent and visualization of generated wireframes.

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Available Routes](#available-routes)
- [Authentication Flow](#authentication-flow)
- [Demo Login (Development Mode)](#demo-login-development-mode)
- [API Integration](#api-integration)
- [Logging and Debugging](#logging-and-debugging)
- [Testing](#testing)
- [Health Check and Configuration](#health-check-and-configuration)
- [Troubleshooting](#troubleshooting)
- [Customization](#customization)

## Features

- **Dynamic Chat Interface**: Real-time communication with the AI Agent for wireframe generation
- **Wireframe Visualization**: Interactive display and editing of generated wireframes
- **Session Management**: Secure user authentication with JWT-based session handling
- **Demo Login**: Optional development-only login bypass for local testing
- **Export Functionality**: Export wireframes as images or code snippets
- **History Tracking**: View and retrieve past conversations and wireframes
- **Health Monitoring**: Built-in health check page with configuration viewer
- **Responsive Design**: Clean, modern UI optimized for desktop and mobile devices
- **Accessibility**: WCAG-compliant interface with keyboard navigation support
- **Feature Flags**: Toggle features dynamically via environment configuration
- **Comprehensive Logging**: Configurable logging levels for debugging and monitoring
- **Error Boundary**: Global error handling with user-friendly error messages

## Architecture Overview

The WebFrontend follows a modern React architecture with clear separation of concerns:

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────┐
│                        Browser                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   React Application                   │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   Pages     │◄─┤   Context    │──►│ Components  │  │  │
│  │  │             │  │  Providers   │  │             │  │  │
│  │  │ - Chat      │  │              │  │ - Navbar    │  │  │
│  │  │ - Wireframe │  │ - AppContext │  │ - ChatWindow│  │  │
│  │  │ - History   │  │ - Session    │  │ - Wireframe │  │  │
│  │  │ - Login     │  │   Context    │  │   Renderer  │  │  │
│  │  └──────┬──────┘  └──────────────┘  └─────────────┘  │  │
│  │         │                                             │  │
│  │         └────────────┐                                │  │
│  │                ┌─────▼──────┐                         │  │
│  │                │  Services  │                         │  │
│  │                │            │                         │  │
│  │                │ httpClient │                         │  │
│  │                │ chatApi    │                         │  │
│  │                │ sessionApi │                         │  │
│  │                │ wireframeApi                         │  │
│  │                │ exportApi  │                         │  │
│  │                │ historyApi │                         │  │
│  │                └─────┬──────┘                         │  │
│  └──────────────────────┼─────────────────────────────────┘  │
└─────────────────────────┼─────────────────────────────────────┘
                          │ HTTP/HTTPS
                          │ REST API Calls
                          ▼
              ┌───────────────────────┐
              │   Backend API Server  │
              │                       │
              │  - /session (auth)    │
              │  - /chat              │
              │  - /wireframe         │
              │  - /history           │
              │  - /export            │
              │  - /health            │
              └───────────────────────┘
```

### Component Hierarchy

- **App.js**: Root component with routing and global providers
- **Context Providers**: Manage global state (SessionContext, AppContext)
- **Pages**: Full-page components mapped to routes
- **Components**: Reusable UI components
- **Services**: API communication layer with centralized HTTP client
- **Utils**: Helper functions (logger, download utilities)
- **Config**: Environment configuration management

### Data Flow

1. **User Interaction** → Component event handlers
2. **Component** → Service API call via httpClient
3. **Service** → Backend REST API endpoint
4. **Backend Response** → Service processes response
5. **Service** → Updates Context or Component state
6. **Context/State Change** → React re-renders affected components

## Getting Started

### Prerequisites

- **Node.js** 14.x or higher
- **npm** 6.x or higher
- **Backend API Server**: The backend container must be running and accessible (optional for demo mode)

### Installation

Clone the repository and install dependencies:

```bash
cd proto-assist-2361-2488/WebFrontend
npm install
```

### Environment Setup

Create a `.env` file in the WebFrontend root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables) section).

### Running the Application

#### Development Mode

```bash
npm start
```

This starts the development server at `http://localhost:3000` with hot-reloading enabled.

#### Production Build

```bash
npm run build
```

Builds the application for production in the `build/` folder with optimized performance and minified code.

#### Serving Production Build

```bash
npx serve -s build -l 3000
```

Serves the production build locally for testing.

### Running Tests

```bash
# Run tests in interactive watch mode
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in CI mode (non-interactive)
CI=true npm test

# Run tests with verbose output
npm test -- --verbose
```

## Environment Variables

The application uses environment variables prefixed with `REACT_APP_` for configuration. These variables are embedded at build time.

### Backend Configuration

| Variable | Description | Default | Priority |
|----------|-------------|---------|----------|
| **`REACT_APP_API_BASE`** | **Primary backend API base URL** | `/api` | **1 (Preferred)** |
| `REACT_APP_BACKEND_URL` | Alternative backend URL | - | 2 (Fallback) |
| `REACT_APP_WS_URL` | WebSocket URL for real-time features | `ws://localhost:3000/ws` | - |

**Important**: Always use `REACT_APP_API_BASE` for consistency. `REACT_APP_BACKEND_URL` is supported for backward compatibility but has lower priority.

### Frontend Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |
| `REACT_APP_PORT` | Application port | `3000` |
| `REACT_APP_NODE_ENV` | Node environment override | `development` |

### Development and Testing

| Variable | Description | Values | Default |
|----------|-------------|--------|---------|
| `REACT_APP_ENABLE_DEMO_LOGIN` | Enable demo login button for local testing | `true`, `false` | Auto (enabled in dev) |

**Demo Login Feature:**
- Provides a mock authentication path that bypasses backend API calls
- Automatically enabled in non-production environments (`NODE_ENV !== 'production'`)
- Sets a mock token (`demo-token`) and mock session data in localStorage
- Displays visible "DEMO MODE" banner when active
- Intended for local development and testing only
- **Security Note**: Always disable in production by setting `REACT_APP_ENABLE_DEMO_LOGIN=false` or ensuring `NODE_ENV=production`

### Logging and Debugging

| Variable | Description | Values | Default |
|----------|-------------|--------|---------|
| `REACT_APP_LOG_LEVEL` | Logging verbosity | `debug`, `info`, `warn`, `error` | `info` |
| `REACT_APP_ENABLE_SOURCE_MAPS` | Enable source maps in production | `true`, `false` | `false` |

**Log Levels Explained:**
- **`debug`**: Verbose output including all API requests, responses, and internal operations
- **`info`**: Standard informational messages about application flow
- **`warn`**: Warning messages for non-critical issues
- **`error`**: Only error messages and exceptions

### Health and Monitoring

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_HEALTHCHECK_PATH` | Backend health endpoint path | `/health` |

### Feature Flags

| Variable | Description | Format | Default |
|----------|-------------|--------|---------|
| `REACT_APP_FEATURE_FLAGS` | Comma-separated feature toggles | `flag:true,flag2:false` | - |
| `REACT_APP_EXPERIMENTS_ENABLED` | Enable experimental features | `true`, `false` | `false` |

**Feature Flags Format:**
```bash
REACT_APP_FEATURE_FLAGS=showHealthcheck:true,darkMode:false,advancedExport:true
```

**Common Feature Flags:**
- `showHealthcheck`: Display health check link in navigation (auto-enabled in development)
- `showAdvancedFeatures`: Enable advanced UI features
- Custom flags can be added and checked in components

### Other Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_NEXT_TELEMETRY_DISABLED` | Disable telemetry | - |
| `REACT_APP_TRUST_PROXY` | Trust proxy headers | `false` |

### Example .env File

```bash
# ─────────────────────────────────────────────────────────────
# Backend Configuration (REQUIRED)
# ─────────────────────────────────────────────────────────────
# Use REACT_APP_API_BASE (preferred) for backend API base URL
REACT_APP_API_BASE=https://api.protoassistant.com/v1
REACT_APP_WS_URL=wss://api.protoassistant.com/ws

# ─────────────────────────────────────────────────────────────
# Frontend Configuration
# ─────────────────────────────────────────────────────────────
REACT_APP_FRONTEND_URL=https://protoassistant.com
REACT_APP_PORT=3000

# ─────────────────────────────────────────────────────────────
# Logging and Debugging
# ─────────────────────────────────────────────────────────────
REACT_APP_LOG_LEVEL=info
REACT_APP_ENABLE_SOURCE_MAPS=false

# ─────────────────────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────────────────────
REACT_APP_HEALTHCHECK_PATH=/health

# ─────────────────────────────────────────────────────────────
# Feature Flags
# ─────────────────────────────────────────────────────────────
REACT_APP_FEATURE_FLAGS=showHealthcheck:true
REACT_APP_EXPERIMENTS_ENABLED=false

# ─────────────────────────────────────────────────────────────
# Demo Login (Development/Testing)
# ─────────────────────────────────────────────────────────────
# Automatically enabled in development (NODE_ENV !== 'production')
# Set to false to explicitly disable even in development
REACT_APP_ENABLE_DEMO_LOGIN=true

# ─────────────────────────────────────────────────────────────
# Environment
# ─────────────────────────────────────────────────────────────
REACT_APP_NODE_ENV=production
REACT_APP_NEXT_TELEMETRY_DISABLED=1
```

## Folder Structure

```
WebFrontend/
├── public/                      # Static assets served directly
│   ├── index.html              # HTML template
│   ├── favicon.ico             # Application icon
│   └── manifest.json           # PWA manifest
│
├── src/                        # Application source code
│   ├── components/             # Reusable UI components
│   │   ├── ChatWindow.jsx      # Chat interface container
│   │   ├── WireframeRenderer.jsx # Wireframe display engine
│   │   ├── Navbar.jsx          # Navigation bar with session status
│   │   ├── MessageList.jsx     # Chat message list display
│   │   ├── InputBar.jsx        # Message input component
│   │   ├── Toolbar.jsx         # Wireframe editing toolbar
│   │   ├── HistoryList.jsx     # History items list
│   │   ├── ExportModal.jsx     # Export options modal
│   │   ├── PromptModal.jsx     # Wireframe prompt modal
│   │   ├── SessionBadge.jsx    # Session status indicator
│   │   ├── ProtectedRoute.jsx  # Authentication guard component
│   │   ├── ErrorBoundary.jsx   # Global error handler
│   │   └── index.js            # Component exports
│   │
│   ├── pages/                  # Page-level components (routes)
│   │   ├── Chat.jsx            # Main chat page
│   │   ├── Wireframe.jsx       # Wireframe viewer/editor page
│   │   ├── History.jsx         # Conversation history page
│   │   ├── LoginPage.jsx       # User authentication page
│   │   ├── Healthcheck.jsx     # Health check and config viewer
│   │   └── index.js            # Page exports
│   │
│   ├── context/                # React Context providers
│   │   ├── AppContext.jsx      # Global app state (theme, settings)
│   │   └── SessionContext.jsx  # Authentication and session state
│   │
│   ├── services/               # API service layer
│   │   ├── httpClient.js       # Centralized HTTP client with auth
│   │   ├── chatApi.js          # Chat API endpoints
│   │   ├── wireframeApi.js     # Wireframe API endpoints
│   │   ├── sessionApi.js       # Authentication API endpoints
│   │   ├── exportApi.js        # Export API endpoints
│   │   ├── historyApi.js       # History API endpoints
│   │   └── index.js            # Service exports
│   │
│   ├── utils/                  # Utility functions
│   │   ├── logger.js           # Logging utility with levels
│   │   └── download.js         # File download helper
│   │
│   ├── config/                 # Configuration modules
│   │   └── env.js              # Environment variable management
│   │
│   ├── types/                  # Type definitions and schemas
│   │   └── schemas.js          # Data schemas and validators
│   │
│   ├── App.js                  # Root application component
│   ├── App.css                 # Global styles and theme
│   ├── App.test.js             # App component tests
│   ├── index.js                # Application entry point
│   ├── index.css               # Base CSS styles
│   ├── routes.jsx              # Route configuration
│   └── setupTests.js           # Test environment setup
│
├── .env                        # Environment variables (create this)
├── .env.example                # Example environment file
├── package.json                # Dependencies and scripts
├── eslint.config.mjs           # ESLint configuration
├── README.md                   # This documentation
├── IMPLEMENTATION_SUMMARY.md   # Implementation details
├── EXPORT_FEATURE.md           # Export feature documentation
└── LOGGING_AND_ERROR_HANDLING.md # Logging documentation
```

### Key Directories Explained

- **`components/`**: Reusable, self-contained UI components with isolated styling
- **`pages/`**: Top-level page components corresponding to routes
- **`context/`**: React Context providers for global state management
- **`services/`**: API communication layer abstracting backend calls
- **`utils/`**: Pure utility functions without React dependencies
- **`config/`**: Configuration and environment variable handling
- **`types/`**: Shared type definitions and data schemas

## Available Routes

The application provides the following routes:

| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/` | HomePage | No | Landing page with welcome message |
| `/login` | LoginPage | No | User authentication page |
| `/chat` | Chat | **Yes** | Main chat interface with AI Agent |
| `/wireframe/:id?` | Wireframe | **Yes** | Wireframe viewer/editor (optional ID parameter) |
| `/history` | History | **Yes** | Conversation and wireframe history |
| `/health` | Healthcheck | No* | Health check and configuration viewer |

**Note:** `/health` is publicly accessible but visibility in navigation is controlled by:
- Automatically shown in development mode (`NODE_ENV=development`)
- In production, requires feature flag: `REACT_APP_FEATURE_FLAGS=showHealthcheck:true`

### Route Parameters

- **`/wireframe/:id`**: The optional `id` parameter loads a specific wireframe
  - Example: `/wireframe/abc123` loads wireframe with ID "abc123"
  - Without ID: `/wireframe` shows empty state or latest wireframe

### Navigation

The Navbar component displays links based on authentication status:
- **Logged Out**: Home, Login
- **Logged In**: Home, Chat, Wireframe, History, Logout
- **Development Mode**: Health link always visible
- **Demo Mode**: Purple banner displays at top with "🚀 DEMO" badge in session

## Authentication Flow

The application implements JWT-based authentication with session persistence:

### Authentication Sequence

```
┌─────────┐                 ┌──────────────┐                 ┌─────────┐
│  User   │                 │  WebFrontend │                 │ Backend │
└────┬────┘                 └──────┬───────┘                 └────┬────┘
     │                             │                              │
     │ 1. Access protected route   │                              │
     ├────────────────────────────►│                              │
     │                             │                              │
     │                             │ 2. Check localStorage        │
     │                             │    for token                 │
     │                             │◄──┐                          │
     │                             │   │                          │
     │                             │───┘                          │
     │                             │                              │
     │ 3. No token found           │                              │
     │◄────────────────────────────┤                              │
     │ Redirect to /login          │                              │
     │                             │                              │
     │ 4. Enter credentials        │                              │
     ├────────────────────────────►│                              │
     │                             │                              │
     │                             │ 5. POST /session             │
     │                             ├─────────────────────────────►│
     │                             │    (user_id, password)       │
     │                             │                              │
     │                             │ 6. JWT token + session       │
     │                             │◄─────────────────────────────┤
     │                             │                              │
     │                             │ 7. Store token in            │
     │                             │    localStorage              │
     │                             │◄──┐                          │
     │                             │   │                          │
     │                             │───┘                          │
     │                             │                              │
     │ 8. Redirect to original     │                              │
     │    destination              │                              │
     │◄────────────────────────────┤                              │
     │                             │                              │
     │ 9. Access protected page    │                              │
     ├────────────────────────────►│                              │
     │                             │                              │
     │                             │ 10. Include token in         │
     │                             │     Authorization header     │
     │                             ├─────────────────────────────►│
     │                             │     Bearer <token>           │
     │                             │                              │
     │                             │ 11. Protected resource       │
     │                             │◄─────────────────────────────┤
     │                             │                              │
     │ 12. Render content          │                              │
     │◄────────────────────────────┤                              │
     │                             │                              │
```

### Session Management

1. **Login**: User submits credentials to `/session` endpoint
2. **Token Storage**: JWT token stored in `localStorage.getItem('auth_token')`
3. **Token Usage**: Automatically included in all API requests via httpClient
4. **Session Validation**: SessionContext checks token on app load
5. **Token Expiration**: 401 responses trigger automatic logout and redirect
6. **Logout**: Token removed from localStorage, user redirected to login

### Protected Routes

The `ProtectedRoute` component wraps authenticated pages:
- Checks if user is authenticated via SessionContext
- Shows loading state while session is being validated
- Redirects to `/login` if not authenticated
- Preserves intended destination for post-login redirect
- Treats demo mode sessions as authenticated (development only)

### Authentication States

| State | Description | User Experience |
|-------|-------------|-----------------|
| Loading | Initial session validation | "Loading session..." message |
| Authenticated | Valid token exists | Access to protected routes |
| Unauthenticated | No token or invalid token | Redirect to login page |
| Session Expired | Token expired (401 response) | Auto logout, redirect to login |
| Demo Mode | Development/testing session | Full access, no backend calls |

## Demo Login (Development Mode)

The application includes a demo login feature for local testing and development without requiring a running backend server.

### Enabling Demo Login

Demo login is **automatically enabled** in development mode:
- When `NODE_ENV !== 'production'`
- Or when `REACT_APP_NODE_ENV !== 'production'`

To **explicitly control** the feature:

```bash
# Enable demo login (even in production - not recommended)
REACT_APP_ENABLE_DEMO_LOGIN=true

# Disable demo login (even in development)
REACT_APP_ENABLE_DEMO_LOGIN=false
```

### Using Demo Login

1. Start the application: `npm start`
2. Navigate to the login page: `http://localhost:3000/login`
3. Click the **"🚀 Demo Login (Dev Mode)"** button
4. You will be automatically logged in with mock credentials:
   - **User ID**: `demo-user`
   - **Email**: `demo@protoassistant.local`
   - **Token**: `demo-token`
5. A purple **"DEMO MODE"** banner appears at the top of the page
6. The session badge shows a **"🚀 DEMO"** indicator

### Demo Mode Behavior

When in demo mode:
- ✅ **All protected routes are accessible** (Chat, Wireframe, History)
- ✅ **Session persists** across page refreshes (stored in localStorage)
- ✅ **No backend API calls** are made for authentication
- ✅ **Visible indicators** show that you're in demo mode:
  - Purple banner at the top: "DEMO MODE - Development testing session active"
  - Demo badge in session badge: "🚀 DEMO"
- ❌ **Backend-dependent features** may not work (actual chat, wireframe generation, history)
- ❌ **Not suitable for production** - purely for UI testing and development

### When to Use Demo Login

**Use demo login when:**
- Testing UI components without backend
- Developing frontend features in isolation
- Demonstrating the application interface
- Running frontend tests
- Backend is temporarily unavailable

**Do NOT use demo login for:**
- Production deployments
- Integration testing with real backend
- User acceptance testing
- Any scenario requiring real data or backend interaction

### Disabling Demo Login in Production

To ensure demo login is disabled in production:

**Option 1**: Set environment to production
```bash
NODE_ENV=production
REACT_APP_NODE_ENV=production
```

**Option 2**: Explicitly disable the feature
```bash
REACT_APP_ENABLE_DEMO_LOGIN=false
```

**Verification**: The demo login button will not appear on the login page when properly disabled.

### Security Considerations

- Demo sessions use a hardcoded token (`demo-token`) that does not authenticate with the backend
- The feature is designed for development environments only
- Backend API endpoints should still enforce proper authentication
- Demo mode is clearly indicated to prevent confusion with real authentication
- Always verify `REACT_APP_ENABLE_DEMO_LOGIN=false` in production deployments

## API Integration

The WebFrontend communicates with the backend via RESTful APIs defined in the OpenAPI 3.0 specification.

### Base URL Configuration

The API base URL is configured via environment variables with the following priority:

1. **`REACT_APP_API_BASE`** (preferred)
2. `REACT_APP_BACKEND_URL` (fallback)
3. `/api` (default)

Example configuration:
```bash
REACT_APP_API_BASE=https://api.protoassistant.com/v1
```

### API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/session` | POST | No | Login and create session |
| `/session` | GET | Yes | Get current session status |
| `/chat` | POST | Yes | Send message and receive AI response |
| `/wireframe` | POST | Yes | Generate wireframe from prompt |
| `/wireframe/:id` | GET | Yes | Retrieve specific wireframe |
| `/history` | GET | Yes | Get conversation and wireframe history |
| `/export` | POST | Yes | Export wireframe as image or code |

### Request Headers

All authenticated requests include:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Response Handling

- **Success (2xx)**: Response data processed and returned
- **Unauthorized (401)**: Automatic logout and redirect to login
- **Client Error (4xx)**: Error message displayed to user
- **Server Error (5xx)**: Generic error message with retry option

### Error Response Format

```json
{
  "error": "ErrorType",
  "message": "Human-readable error description",
  "code": 400
}
```

### HTTP Client

The centralized `httpClient` service handles:
- Automatic token injection from localStorage
- Request/response logging based on log level
- Error handling and transformation
- 401 response interception for auto-logout

### CORS Configuration

**IMPORTANT**: The backend server must be configured to allow CORS requests from the frontend origin.

**Required CORS Headers:**
```
Access-Control-Allow-Origin: https://protoassistant.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

**Development Setup:**
```
Access-Control-Allow-Origin: http://localhost:3000
```

**Common CORS Issues:**
- **Symptom**: Network errors, requests blocked by browser
- **Solution**: Verify backend CORS configuration allows frontend origin
- **Testing**: Check browser console for CORS error messages
- **Development**: Use backend proxy or configure CORS for `localhost:3000`

### WebSocket Integration

For real-time features (future enhancement):
```bash
REACT_APP_WS_URL=wss://api.protoassistant.com/ws
```

WebSocket connections also require authentication via token.

## Logging and Debugging

The application includes a comprehensive logging system with configurable verbosity.

### Log Levels

Configure logging via `REACT_APP_LOG_LEVEL`:

```bash
# Show everything (verbose)
REACT_APP_LOG_LEVEL=debug

# Standard informational messages
REACT_APP_LOG_LEVEL=info

# Warnings and errors only
REACT_APP_LOG_LEVEL=warn

# Errors only
REACT_APP_LOG_LEVEL=error
```

### What Gets Logged

| Level | Includes |
|-------|----------|
| **debug** | API requests, responses, state changes, component lifecycle events |
| **info** | User actions, navigation, successful operations |
| **warn** | Deprecated features, non-critical issues, fallback behaviors |
| **error** | Exceptions, API failures, authentication errors |

### Viewing Logs

**Browser Console:**
1. Open Developer Tools (F12 or Cmd+Option+I)
2. Navigate to Console tab
3. Filter by log level if needed

**Log Format:**
```
[INFO] 2025-01-15T10:30:00.000Z [ChatApi] Sending message to /chat
[DEBUG] 2025-01-15T10:30:00.100Z [HttpClient] Request: POST https://api.example.com/v1/chat
[ERROR] 2025-01-15T10:30:01.000Z [ChatApi] Failed to send message: Network error
```

### Debug Mode

Enable maximum verbosity for troubleshooting:

```bash
REACT_APP_LOG_LEVEL=debug npm start
```

This logs:
- All API requests with full payloads
- All API responses with data
- Component render cycles
- State updates
- Authentication flow details

### Production Logging

In production, use `info` or `warn` level to reduce console noise:

```bash
REACT_APP_LOG_LEVEL=warn
```

## Testing

The application includes comprehensive unit and integration tests.

### Test Scripts

```bash
# Run all tests in watch mode
npm test

# Run tests once (CI mode)
CI=true npm test

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- Chat.test.js

# Run tests with verbose output
npm test -- --verbose

# Update snapshots
npm test -- -u
```

### Test Structure

```
src/
├── App.test.js              # App component tests
├── components/
│   └── [Component].test.js  # Component unit tests
├── pages/
│   └── [Page].test.js       # Page integration tests
├── services/
│   └── [service].test.js    # Service API tests
└── setupTests.js            # Test environment configuration
```

### Testing Libraries

- **@testing-library/react**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM
- **@testing-library/user-event**: User interaction simulation

### Writing Tests

Example component test:

```javascript
import { render, screen } from '@testing-library/react';
import ChatWindow from './ChatWindow';

test('renders chat window', () => {
  render(<ChatWindow />);
  const element = screen.getByText(/chat/i);
  expect(element).toBeInTheDocument();
});
```

### Coverage Reports

View coverage after running tests with `--coverage`:

```
Coverage summary:
Statements   : 85.5% ( 300/351 )
Branches     : 78.2% ( 120/154 )
Functions    : 82.1% ( 110/134 )
Lines        : 86.0% ( 290/337 )
```

HTML coverage report: `coverage/lcov-report/index.html`

### CI/CD Integration

For non-interactive test execution in CI pipelines:

```bash
CI=true npm test -- --coverage --watchAll=false
```

## Health Check and Configuration

The application includes a built-in health check page for verifying configuration and backend connectivity.

### Accessing Health Check

Navigate to: `http://localhost:3000/health`

### Features

1. **Environment Variables Display**: View all current configuration values
2. **Backend Connectivity Test**: Ping the backend health endpoint
3. **Configuration Debugging**: Identify misconfigured values

### Using the Health Check Page

**Step 1**: Open `/health` in your browser

**Step 2**: Review displayed environment variables:
- `REACT_APP_API_BASE`: Should point to your backend
- `REACT_APP_LOG_LEVEL`: Verify logging level
- `REACT_APP_FEATURE_FLAGS`: Check enabled features

**Step 3**: Click "Ping Backend" button to test connectivity
- **Success**: Green message with backend response
- **Failure**: Red error message with details

**Step 4**: Verify CORS configuration if ping fails

### Visibility Control

The health check link in navigation is controlled by:

**Development Mode** (automatic):
```bash
NODE_ENV=development
# Health link automatically visible
```

**Production Mode** (manual):
```bash
REACT_APP_FEATURE_FLAGS=showHealthcheck:true
# Explicitly enable health link
```

### Security Note

In production environments, consider restricting access to `/health` or disabling the feature flag to prevent configuration exposure.

## Troubleshooting

### Backend Connection Issues

**Symptom:** API calls fail, network errors in console

**Solutions:**
1. Verify `REACT_APP_API_BASE` is correctly set in `.env`
2. Confirm backend server is running and accessible
3. Check CORS configuration on backend (see [API Integration](#api-integration))
4. Test backend health endpoint: `curl https://your-backend/health`
5. Use `/health` page to ping backend
6. Try demo login mode for frontend-only testing

**Check CORS:**
```bash
# Test CORS from command line
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type, Authorization" \
     -X OPTIONS \
     https://your-backend-url/api/chat -v
```

### Authentication Errors

**Symptom:** Constant redirect to login, "Unauthorized" errors

**Solutions:**
1. Clear browser localStorage: `localStorage.clear()` in console
2. Verify credentials are correct
3. Check token expiration on backend
4. Look for 401 errors in browser Network tab
5. Enable debug logging: `REACT_APP_LOG_LEVEL=debug`
6. Use demo login for testing without backend

### Environment Variables Not Loading

**Symptom:** Default values used instead of configured values

**Solutions:**
1. Verify `.env` file exists in `WebFrontend/` root (not project root)
2. Ensure variables start with `REACT_APP_`
3. Check for syntax errors in `.env` (no spaces around `=`)
4. Restart development server: `npm start` (required after `.env` changes)
5. Use health check page to verify current values

### Feature Flags Not Working

**Symptom:** Expected features not visible or enabled

**Solutions:**
1. Verify flag format: `flag:true` not `flag=true`
2. Ensure proper comma separation: `flag1:true,flag2:false`
3. Check spelling and case sensitivity
4. Restart server after `.env` changes
5. Use health check page to view parsed flags

### Build Failures

**Symptom:** `npm run build` fails with errors

**Solutions:**
1. Clear cache: `rm -rf node_modules package-lock.json && npm install`
2. Update dependencies: `npm update`
3. Check for ESLint errors: `npx eslint src/`
4. Verify all imports resolve correctly
5. Check for missing environment variables

### CORS Errors in Production

**Symptom:** API calls work in development but fail in production

**Solutions:**
1. Update backend CORS configuration to include production frontend URL
2. Verify `REACT_APP_API_BASE` points to correct production backend
3. Ensure HTTPS is used for both frontend and backend (mixed content issues)
4. Check that `Access-Control-Allow-Credentials: true` is set on backend
5. Verify no intermediate proxies are stripping CORS headers

### WebSocket Connection Issues

**Symptom:** Real-time features not working

**Solutions:**
1. Verify `REACT_APP_WS_URL` is correctly configured
2. Ensure WebSocket protocol matches: `ws://` for HTTP, `wss://` for HTTPS
3. Check backend WebSocket server is running
4. Look for WebSocket errors in browser console
5. Verify firewall/proxy allows WebSocket connections

## Customization

### Theming and Styling

The application uses CSS custom properties for theming. Modify `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;      /* Primary brand color */
  --kavia-dark: #1A1A1A;        /* Background color */
  --text-color: #ffffff;        /* Primary text */
  --text-secondary: rgba(255, 255, 255, 0.7);  /* Secondary text */
  --border-color: rgba(255, 255, 255, 0.1);    /* Borders */
  --error-color: #ff4444;       /* Error messages */
  --success-color: #44ff44;     /* Success messages */
}
```

### Adding New Features

1. **Create Component**: Add to `src/components/[ComponentName].jsx`
2. **Add Styles**: Create `[ComponentName].css` alongside component
3. **Create Page** (if needed): Add to `src/pages/[PageName].jsx`
4. **Register Route**: Update `src/routes.jsx`
5. **Add API Service** (if needed): Create in `src/services/[serviceName]Api.js`
6. **Update Navigation**: Modify `src/components/Navbar.jsx`
7. **Add Tests**: Create `[ComponentName].test.js`

### Adding Feature Flags

1. **Define Flag**: Add to `.env`
   ```bash
   REACT_APP_FEATURE_FLAGS=myNewFeature:true
   ```

2. **Use in Component**:
   ```javascript
   import env from '../config/env';
   
   if (env.featureFlags.myNewFeature) {
     // Render new feature
   }
   ```

### Custom API Integration

To add new API endpoints:

1. **Create API Service**: `src/services/myNewApi.js`
   ```javascript
   import httpClient from './httpClient';
   
   export const myNewEndpoint = async (data) => {
     return httpClient.post('/my-endpoint', data);
   };
   ```

2. **Export Service**: Update `src/services/index.js`
   ```javascript
   export * from './myNewApi';
   ```

3. **Use in Component**:
   ```javascript
   import { myNewEndpoint } from '../services';
   
   const result = await myNewEndpoint({ data });
   ```

## Additional Resources

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://create-react-app.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/)

## Support and Contributing

For questions, issues, or contributions, please refer to the project repository documentation.

## License

See project root for license information.
