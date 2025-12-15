// Quick debug test - run this in browser console
const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:5107/api/usertasks');
    const data = await response.json();
    console.log('✅ Backend connection successful:', data);
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
  }
};

// Run the test
testConnection();