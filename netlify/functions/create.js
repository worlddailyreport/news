exports.handler = async (event) => {
    try {
        const { headline, imageUrl } = JSON.parse(event.body);

        if (!headline || !imageUrl) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid input" }),
            };
        }

        // Create a URL-friendly slug
        const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const shortUrl = `https://worlddailyreport.com/article/${slug}`;

        return {
            statusCode: 200,
            body: JSON.stringify({ shortUrl }),
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
    }
};
