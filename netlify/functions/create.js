const dotenv = require("dotenv");

dotenv.config(); // ✅ Load environment variables

module.exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const { headline, imageUrl } = JSON.parse(event.body);

        if (!headline || !imageUrl) {
            console.error("❌ Missing required fields.");
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid input. Headline and Image URL are required." }) };
        }

        // ✅ Generate a URL-friendly slug
        const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const shortUrl = `https://worlddailyreport.com/article/${slug}`;

        // ✅ Load existing articles from Netlify Environment Variable
        let articles = JSON.parse(process.env.ARTICLES_DB || "{}");
        articles[slug] = { headline, imageUrl };

        // ✅ Save back to Environment Variables
        process.env.ARTICLES_DB = JSON.stringify(articles);

        console.log(`✅ Article saved: ${headline} (${shortUrl})`);

        return {
            statusCode: 200,
            body: JSON.stringify({ shortUrl }),
        };
    } catch (err) {
        console.error("❌ Error saving article:", err);
        return { statusCode: 500, body: JSON.stringify({ error: "Server error while generating link." }) };
    }
};
