import { set, get } from "@netlify/functions/storage";

export const handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
        }

        // ✅ Parse user input
        const { headline, imageUrl } = JSON.parse(event.body);

        if (!headline || !imageUrl) {
            console.error("❌ Missing required fields.");
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid input. Headline and Image URL are required." }) };
        }

        // ✅ Generate a URL-friendly slug
        const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const shortUrl = `https://worlddailyreport.com/article/${slug}`;

        // ✅ Store article in Netlify's Persistent Storage
        await set(`article_${slug}`, JSON.stringify({ headline, imageUrl }));

        console.log(`✅ Article saved: ${headline} (${shortUrl})`);

        return {
            statusCode: 200,
            body: JSON.stringify({ shortUrl }),
        };
    } catch (err) {
        console.error("❌ Error in create.js:", err);
        return { statusCode: 500, body: JSON.stringify({ error: "Server error while generating link." }) };
    }
};
