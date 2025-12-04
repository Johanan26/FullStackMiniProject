// pages/api/update-post.js
async function handler(req, res) {
    const response = await fetch('http://localhost:8000/updatePost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    console.log(JSON.stringify(data))
    res.json(data);
}

export default handler;
