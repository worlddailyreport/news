import { set } from "@netlify/functions/storage";

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const { headline, imageUrl } = JSON.parse(event.body);
        if (!headline || !imageUrl) {
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid input" }) };
        }

        // ✅ Generate a URL-friendly slug
        const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const shortUrl = `https://worlddailyreport.com/article/${slug}`;

        // ✅ Load existing articles from Netlify Environment Variables
        let articles = JSON.parse(process.env.ARTICLES_DB || "{}");

        // ✅ Store article in Netlify Environment Variable
        articles[slug] = { headline, imageUrl };

        // ✅ Save back to Environment Variables
        await set("ARTICLES_DB", JSON.stringify(articles));

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
