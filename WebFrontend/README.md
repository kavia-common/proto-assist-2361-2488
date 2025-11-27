# Proto Assistant WebFrontend

Proto Assistant is a chat application designed to connect users with an intelligent Agent capable of generating UI wireframes based on user prompts. This WebFrontend provides a dynamic, responsive interface for real-time communication with the AI Agent and visualization of generated wireframes.

## Features

- **Dynamic Chat Interface**: Real-time communication with the AI Agent
- **Wireframe Visualization**: Interactive display and editing of generated wireframes
- **Session Management**: Secure user authentication and session handling
- **Export Functionality**: Export wireframes as images or code
- **History Tracking**: View past conversations and wireframes
- **Health Monitoring**: Built-in health check and configuration viewer
- **Responsive Design**: Clean, modern UI that works across devices
- **Accessibility**: WCAG-compliant interface with keyboard navigation support

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Backend API server running (see backend container documentation)

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
```

Builds the app for production to the `build` folder with optimized performance.

### Running Tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the root of the WebFrontend directory with the following variables:

### Required Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `REACT_APP_API_BASE` | Base URL for backend API requests | `https://api.example.com/v1` | `/api` |
| `REACT_APP_BACKEND_URL` | Alternative to API_BASE (lower priority) | `https://api.example.com` | - |
| `REACT_APP_WS_URL` | WebSocket URL for real-time features | `wss://api.example.com/ws` | `ws://localhost:3000/ws` |

### Optional Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `REACT_APP_FRONTEND_URL` | Frontend application URL | `https://app.example.com` | `http://localhost:3000` |
| `REACT_APP_LOG_LEVEL` | Logging verbosity | `debug`, `info`, `warn`, `error` | `info` |
| `REACT_APP_HEALTHCHECK_PATH` | Backend health endpoint path | `/api/health` | `/health` |
| `REACT_APP_FEATURE_FLAGS` | Comma-separated feature flags | `showHealthcheck:true,darkMode:true` | - |
| `REACT_APP_EXPERIMENTS_ENABLED` | Enable experimental features | `true` or `false` | `false` |
| `REACT_APP_NODE_ENV` | Node environment override | `production`, `development` | `development` |
| `REACT_APP_PORT` | Application port | `3000` | `3000` |
| `REACT_APP_ENABLE_SOURCE_MAPS` | Enable source maps in production | `true` or `false` | `false` |
| `REACT_APP_NEXT_TELEMETRY_DISABLED` | Disable telemetry | `1` | - |
| `REACT_APP_TRUST_PROXY` | Trust proxy headers | `true` or `false` | `false` |

### Example .env File

```bash
# Backend Configuration
REACT_APP_API_BASE=https://api.protoassistant.com/v1
REACT_APP_WS_URL=wss://api.protoassistant.com/ws

# Frontend Configuration
REACT_APP_FRONTEND_URL=https://protoassistant.com
REACT_APP_PORT=3000

# Logging and Debugging
REACT_APP_LOG_LEVEL=info
REACT_APP_HEALTHCHECK_PATH=/health

# Feature Flags
REACT_APP_FEATURE_FLAGS=showHealthcheck:true,showAdvancedFeatures:false

# Development Settings
REACT_APP_NODE_ENV=production
REACT_APP_ENABLE_SOURCE_MAPS=false
REACT_APP_EXPERIMENTS_ENABLED=false
```

### Feature Flags Format

Feature flags are specified as comma-separated key:value pairs:
```
REACT_APP_FEATURE_FLAGS=flag1:true,flag2:false,flag3:true
```

Available feature flags:
- `showHealthcheck`: Display health check link in navigation
- `showAdvancedFeatures`: Enable advanced features menu
- Custom flags can be added and checked using `isFeatureEnabled('flagName')` in components

## Verifying Configuration

### Using the Health Check Page

The application includes a built-in health check page at `/health` that displays:
- All environment variable values
- Backend connectivity status
- Configuration debugging tips

**Access the health check:**
1. Navigate to `http://localhost:3000/health` in your browser
2. Review all environment variables
3. Click "Ping Backend" to test backend connectivity

**Visibility:**
- Automatically visible in development mode (`NODE_ENV=development`)
- In production, enable via feature flag: `REACT_APP_FEATURE_FLAGS=showHealthcheck:true`

### Manual Verification

```bash
# Check if environment variables are loaded
npm start
# Open browser console and run:
# console.log(process.env)
```

## Debugging Common Issues

### Backend Connection Issues

**Symptom:** Health check fails with network errors

**Solutions:**
1. Verify `REACT_APP_API_BASE` points to correct backend URL
2. Check if backend server is running
3. Ensure CORS is configured on backend to allow frontend origin
4. Verify `REACT_APP_HEALTHCHECK_PATH` matches backend implementation

### WebSocket Connection Failures

**Symptom:** Real-time features not working

**Solutions:**
1. Verify `REACT_APP_WS_URL` is correctly configured
2. Check if WebSocket server is running
3. Ensure WebSocket protocol matches (ws:// for HTTP, wss:// for HTTPS)
4. Check browser console for WebSocket connection errors

### Authentication Issues

**Symptom:** Redirected to login repeatedly

**Solutions:**
1. Clear browser localStorage: `localStorage.clear()`
2. Check if backend session endpoints are working
3. Verify JWT token format and expiration
4. Check browser console for 401 errors

### Feature Flags Not Working

**Symptom:** Expected features not visible

**Solutions:**
1. Verify flag format in `.env`: `flag:true` not `flag=true`
2. Restart development server after changing `.env`
3. Check spelling of flag names (case-sensitive)
4. Use health check page to verify current flag values

### Environment Variables Not Loading

**Symptom:** Default values used instead of configured values

**Solutions:**
1. Ensure `.env` file is in the correct directory (WebFrontend root)
2. Restart development server after changing `.env`
3. Verify variable names start with `REACT_APP_`
4. Check for syntax errors in `.env` (no spaces around `=`)

### Logging and Debug Output

**Enable verbose logging:**
```bash
REACT_APP_LOG_LEVEL=debug npm start
```

**Check logs in browser console:**
- API requests and responses
- WebSocket connection events
- Authentication flows
- Error details with stack traces

## Project Structure

```
WebFrontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page-level components
│   ├── context/         # React context providers
│   ├── services/        # API service modules
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   ├── types/           # Type definitions and schemas
│   ├── App.js           # Main application component
│   ├── index.js         # Application entry point
│   └── routes.jsx       # Route configuration
├── public/              # Static assets
├── .env                 # Environment variables (create this)
├── .env.example         # Example environment file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Architecture

### Components
- **Navbar**: Navigation and session status display
- **ChatWindow**: Real-time chat interface
- **WireframeRenderer**: Visual wireframe display engine
- **ProtectedRoute**: Authentication guard for secure pages

### Context Providers
- **AppContext**: Global application state and theme
- **SessionContext**: User authentication and session management

### Services
- **httpClient**: Centralized HTTP client with auth handling
- **chatApi**: Chat message operations
- **wireframeApi**: Wireframe generation and retrieval
- **sessionApi**: Authentication and session management
- **exportApi**: Wireframe export functionality
- **historyApi**: Historical data retrieval

### Pages
- **Chat**: Main chat interface
- **Wireframe**: Wireframe visualization and editing
- **History**: Past conversations and wireframes
- **LoginPage**: User authentication
- **Healthcheck**: System health and configuration viewer

## API Integration

The frontend communicates with the backend via RESTful APIs. See the OpenAPI specification in the work item documentation for complete API details.

### Authentication
All protected endpoints require a JWT bearer token obtained from the `/session` login endpoint.

### Error Handling
The application includes comprehensive error handling:
- Network errors are caught and displayed to users
- 401 responses trigger automatic redirect to login
- All API errors are logged for debugging

## Customization

### Styling
Main brand colors are defined in `src/App.css`:
```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Register routes in `src/routes.jsx`
4. Add API services in `src/services/`
5. Update navigation in `src/components/Navbar.jsx`

## Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://create-react-app.dev/)
- [React Router Documentation](https://reactrouter.com/)

## License

See project root for license information.
