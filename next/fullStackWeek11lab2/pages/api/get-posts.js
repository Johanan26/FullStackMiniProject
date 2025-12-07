// /api/new-Post

async function handler(req, res) { // can be called anything you like
  const response = await fetch('http://localhost:8000/readPost', {
    method: 'POST',
    body: JSON.stringify({ cmd: 'all' }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json();
  res.json(data)
}

export default handler;
