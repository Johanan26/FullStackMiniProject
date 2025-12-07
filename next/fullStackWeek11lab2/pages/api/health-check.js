async function handler(req, res) {
  try {
    // Try GET first (simpler), fallback to POST if needed
    const response = await fetch('http://localhost:8000/healthCheck', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Check if response is OK and is JSON
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Backend route not found (404). The /healthCheck endpoint may not be registered. Please restart the backend server.`);
      }
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Server returned non-JSON response. Server may not be running or route not found.`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    // Check if it's a network error (server not running)
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      res.json({ 
        connected: false, 
        status: 'error',
        message: 'Cannot reach backend server. Please ensure the Node.js backend server is running on localhost:8000'
      });
    } else {
      res.json({ 
        connected: false, 
        status: 'error',
        message: error.message || 'Failed to check MongoDB connection. Note: MongoDB runs on localhost:27017, but the backend server must be running on localhost:8000'
      });
    }
  }
}

export default handler;

