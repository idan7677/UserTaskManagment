import { render, screen } from '@testing-library/react';
import App from './App';

// Mock MobX stores
jest.mock('./stores/TaskStore', () => ({
  __esModule: true,
  default: {
    loadTasks: jest.fn(),
    tasks: [],
    filteredTasks: [],
    loading: false,
    error: null,
    overdueTasks: [],
    tasksByPriority: { Critical: [], High: [], Medium: [], Low: [] },
    getTaskStatus: jest.fn(() => 'Pending')
  }
}));

jest.mock('./stores/TagStore', () => ({
  __esModule: true,
  default: {
    loadTags: jest.fn(),
    tags: [],
    tagOptions: [],
    loading: false,
    error: null
  }
}));

test('renders task management application', () => {
  render(<App />);
  const headerElement = screen.getByText('TaskManager');
  expect(headerElement).toBeInTheDocument();
});

test('renders dashboard by default', () => {
  render(<App />);
  const dashboardTitle = screen.getByRole('heading', { name: /dashboard/i, level: 1 });
  expect(dashboardTitle).toBeInTheDocument();
});