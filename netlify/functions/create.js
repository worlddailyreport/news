import { set } from "@netlify/functions/storage";

export const handler = async (event) => {
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
        const shortUrl = `/article/${slug}`;

        // ✅ Store article in Netlify KV Storage
        await set(`article_${slug}`, JSON.stringify({ headline, imageUrl }));

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
