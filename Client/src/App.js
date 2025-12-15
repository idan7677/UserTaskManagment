import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './App.css';

import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TagList from './components/TagList';
import taskStore from './stores/TaskStore';
import tagStore from './stores/TagStore';

const App = observer(() => {
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Initialize stores
    taskStore.loadTasks();
    tagStore.loadTags();
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskList />;
      case 'tags':
        return <TagList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
});

export default App;
