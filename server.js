const express = require('express');
const cors = require('cors');
const instagramGetUrl = require('instagram-url-direct');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON and allow cross-origin requests
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send('Instagram API is active.');
});

// Download endpoint
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, message: 'URL is required' });
    }

    try {
        const results = await instagramGetUrl(url);
        
        if (results && results.url_list && results.url_list.length > 0) {
            res.json({
                success: true,
                video_url: results.url_list[0]
            });
        } else {
            res.status(404).json({ success: false, message: 'Video not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
