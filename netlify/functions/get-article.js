import { get } from "@netlify/functions/storage";

export const handler = async (event) => {
    try {
        const slug = event.queryStringParameters.slug;
        if (!slug) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing slug" }) };
        }

        // ✅ Retrieve article from Netlify KV Storage
        const articleData = await get(`article_${slug}`);

        if (!articleData) {
            return { statusCode: 404, body: JSON.stringify({ error: "Article not found" }) };
        }

        return {
            statusCode: 200,
            body: articleData,
        };
    } catch (err) {
        console.error("❌ Error retrieving article:", err);
        return { statusCode: 500, body: JSON.stringify({ error: "Server error." }) };
    }
};
