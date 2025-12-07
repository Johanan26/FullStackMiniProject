// pages/api/delete-post.js
async function handler(req, res) {
    const response = await fetch('http://localhost:8000/deletePost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(200).json(data);
}

export default handler;