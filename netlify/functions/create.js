import fs from "fs";
import path from "path";

const dataFilePath = path.resolve("/tmp", "data.json"); // ✅ Netlify allows writing to `/tmp`

// ✅ Load stored articles from `data.json`
function loadArticles() {
    if (fs.existsSync(dataFilePath)) {
        return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    }
    return {};
}

// ✅ Save articles to `data.json`
function saveArticles(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const { headline, imageUrl } = JSON.parse(event.body);

        if (!headline || !imageUrl) {
            console.error("❌ Missing headline or imageUrl.");
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid input. Headline and Image URL are required." }) };
        }

        // ✅ Generate a URL-friendly slug
        const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const shortUrl = `https://worlddailyreport.com/article/${slug}`;

        // ✅ Load existing articles from `data.json`
        let articles = loadArticles();
        articles[slug] = { headline, imageUrl };

        // ✅ Save back to `data.json`
        saveArticles(articles);

        console.log(`✅ Article saved: ${headline} (${shortUrl})`);

        return {
            statusCode: 200,
            body: JSON.stringify({ shortUrl }),
        };
    } catch (err) {
        console.error("❌ Error saving article:", err);
        return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
    }
};
