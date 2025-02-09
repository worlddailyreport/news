const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Store links in memory (or replace with a database later)
const links = {};

app.use(express.json());
app.use(express.static("public"));

// Function to generate a URL-friendly slug
function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Handle troll submission
app.post("/create", (req, res) => {
    const { headline, imageUrl } = req.body;
    if (!headline || !imageUrl) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const slug = slugify(headline);
    const shortUrl = `/article/${slug}`;
    links[slug] = { headline, imageUrl };

    res.json({ shortUrl: `https://worlddailyreport.com${shortUrl}` });
});

// Fake article page
app.get("/article/:slug", (req, res) => {
    const data = links[req.params.slug];
    if (!data) {
        return res.status(404).send("Article not found");
    }

    res.send(`
        <html>
            <head>
                <meta property="og:title" content="${data.headline}">
                <meta property="og:image" content="${data.imageUrl}">
                <meta property="og:description" content="Click to read more!">
                <meta name="twitter:card" content="summary_large_image">
                <meta http-equiv="refresh" content="3;url=https://i.imghippo.com/files/JfSn7929Qs.jpg">
            </head>
            <body style="text-align: center; font-family: Arial;">
                <h1>${data.headline}</h1>
                <img src="${data.imageUrl}" style="max-width: 100%;">
                <p>Loading article...</p>
            </body>
        </html>
    `);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
