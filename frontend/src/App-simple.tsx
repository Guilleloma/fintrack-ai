function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>FinTrack AI</h1>
        <p style={{ color: '#666' }}>React está funcionando!</p>
        <p style={{ color: '#999', fontSize: '14px' }}>Sin TailwindCSS</p>
      </div>
    </div>
  );
}

export default App;
