exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        const { headline, imageUrl } = JSON.parse(event.body);
        if (!headline || !imageUrl) {
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid input" }) };
        }

        // Generate a URL-friendly slug
        const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const shortUrl = `https://worlddailyreport.com/article/${slug}`;

        // Load existing data from Netlify Environment Variables
        let storedArticles = {};
        if (process.env.ARTICLES_DB) {
            storedArticles = JSON.parse(process.env.ARTICLES_DB);
        }

        // Add new article
        storedArticles[slug] = { headline, imageUrl };

        console.log(`✅ New fake article created: ${shortUrl}`);

        return {
            statusCode: 200,
            body: JSON.stringify({ shortUrl }),
        };
    } catch (err) {
        console.error("❌ Server error:", err);
        return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
    }
};
