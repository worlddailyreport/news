module.exports.handler = async (event) => {
    try {
        const slug = event.path.split("/").pop();

        // ✅ Check if the article exists in memory
        if (!articles[slug]) {
            console.error(`❌ No article found for slug: ${slug}`);
            return { statusCode: 404, body: "Error: Article not found." };
        }

        const { headline, imageUrl } = articles[slug];

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

                    <meta name="twitter:card" content="summary_large_image">
                    <meta name="twitter:title" content="${headline}">
                    <meta name="twitter:description" content="Click to read more!">
                    <meta name="twitter:image" content="${imageUrl}">

                    <meta http-equiv="refresh" content="3;url=https://i.imghippo.com/files/JfSn7929Qs.jpg">

                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { font-size: 2em; }
                        img { max-width: 80%; margin-top: 20px; }
                        p { font-size: 1.2em; color: gray; }
                    </style>
                </head>
                <body>
                    <h1>${headline}</h1>
                    <img src="${imageUrl}">
                    <p>Loading article...</p>
                </body>
                </html>
            `,
        };
    } catch (err) {
        console.error("❌ Error retrieving article:", err);
        return { statusCode: 500, body: "Server error." };
    }
};
