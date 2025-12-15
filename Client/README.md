
src/
├── components/
│   ├── forms/
│   │   └── TaskForm.js          # Task creation/editing form
│   ├── layout/
│   │   ├── Header.js            # Application header
│   │   └── Layout.js            # Main layout wrapper
│   ├── ui/
│   │   ├── Badge.js             # Status/priority badges
│   │   ├── Button.js            # Reusable button component
│   │   ├── Input.js             # Form input component
│   │   ├── LoadingSpinner.js    # Loading indicator
│   │   ├── Modal.js             # Modal dialog component
│   │   ├── Select.js            # Select dropdown component
│   │   └── Toast.js             # Notification component
│   ├── Dashboard.js             # Dashboard with statistics
│   ├── TaskCard.js              # Individual task display
│   └── TaskList.js              # Task list with filtering
├── hooks/
│   └── useNotification.js       # Custom notification hook
├── services/
│   ├── apiClient.js             # Axios HTTP client
│   ├── taskService.js           # Task API operations
│   └── tagService.js            # Tag API operations
├── stores/
│   ├── TaskStore.js             # MobX task state management
│   └── TagStore.js              # MobX tag state management
├── types/
│   └── index.js                 # Type definitions and utilities
├── utils/
│   └── validation.js            # Validation schemas
└── App.js                       # Main application component
```

## API Integration

The application integrates with a .NET Core backend API:

### Task Endpoints
- `GET /api/usertasks` - Get all tasks
- `GET /api/usertasks/{id}` - Get task by ID
- `POST /api/usertasks` - Create new task
- `PUT /api/usertasks/{id}` - Update task
- `DELETE /api/usertasks/{id}` - Delete task
- `GET /api/usertasks/with-multiple-tags` - Get tasks with multiple tags

### Tag Endpoints
- `GET /api/tags` - Get all tags
- `GET /api/tags/{id}` - Get tag by ID
- `POST /api/tags` - Create new tag
- `PUT /api/tags/{id}` - Update tag
- `DELETE /api/tags/{id}` - Delete tag

## Data Models

### Task Model
```javascript
{
  id: number,
  title: string,
  description: string,
  dueDate: string (ISO date),
  priority: 'Low' | 'Medium' | 'High' | 'Critical',
  userFullName: string,
  userTelephone: string,
  userEmail: string,
  tagIds: number[],
  tags: Tag[]
}
```

### Tag Model
```javascript
{
  id: number,
  name: string
}


### TaskStore
- Manages task collection and CRUD operations
- Provides computed values for filtering and statistics
- Handles loading states and error management
- Implements search and filter functionality

### TagStore
- Manages tag collection and operations
- Provides tag options for form components
- Handles tag CRUD operations

## Installation and Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Endpoint**
   Update the base URL in `src/services/apiClient.js`:
   ```javascript
   baseURL: 'https://localhost:7001/api'
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Environment Configuration

The application expects the backend API to be running on `https://localhost:7001`. Update the API base URL in `apiClient.js` if your backend runs on a different port.
