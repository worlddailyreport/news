import { get } from "@netlify/edge-functions";

export const handler = async (event) => {
    try {
        const slug = event.path.split("/").pop();
        const storageKey = `article_${slug}`;

        // ✅ Prevent recursion - Ensure the function doesn't re-call itself
        if (!slug || slug.includes("article")) {
            console.error("❌ Recursive call detected. Stopping execution.");
            return { statusCode: 400, body: "Invalid request" };
        }

        // ✅ Retrieve article from Netlify's Edge Config storage
        const articleData = await get(storageKey);

        if (!articleData) {
            console.error(`❌ No article found for slug: ${slug}`);
            return { statusCode: 404, body: "Article not found" };
        }

        const { headline, imageUrl } = JSON.parse(articleData);

        console.log(`✅ Showing article: ${headline}`);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html",
            },
            body: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${headline} - World Daily Report</title>

                    <meta property="og:title" content="${headline}">
                    <meta property="og:image" content="${imageUrl}">
                    <meta property="og:description" content="Breaking: ${headline}">
                    <meta property="og:type" content="website">
                    <meta property="og:url" content="${event.rawUrl}">

                    <meta name="twitter:card" content="summary_large_image
