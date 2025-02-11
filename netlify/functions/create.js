const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "data.json");  // Store articles persistently

// ✅ Load stored articles
function loadArticles() {
    if (fs.existsSync(dataFilePath)) {
        return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    }
    return {};
}

// ✅ Save articles
function saveArticles(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

module.exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const { headline, imageUrl } = JSON.parse(event.body);

        if (!headline || !imageUrl) {
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid input. Headline and Image URL are required." }) };
        }

        // ✅ Generate a URL-friendly slug
        const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const shortUrl = `/article/${slug}`;

        // ✅ Load and update stored articles
        let articles = loadArticles();
        articles[slug] = { headline, imageUrl };

        // ✅ Save back to `data.json`
        saveArticles(articles);

        console.log(`✅ Article saved: ${headline} (https://worlddailyreport.com${shortUrl})`);

        return {
            statusCode: 200,
            body: JSON.stringify({ shortUrl: `https://worlddailyreport.com${shortUrl}` }),
        };
    } catch (err) {
        console.error("❌ Error saving article:", err);
        return { statusCode: 500, body: JSON.stringify({ error: "Server error while generating article page." }) };
    }
};
