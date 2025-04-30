import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Assuming you have basic CSS

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Workflow App</h1>
        <p>This is the main page.</p>
        <Link to="/design">
          <button>Go to Design Workflows</button>
        </Link>
      </header>
    </div>
  );
}

export default App;
