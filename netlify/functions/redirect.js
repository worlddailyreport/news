exports.handler = async (event) => {
    const slug = event.path.split("/").pop();
    const headline = slug.replace(/-/g, ' '); // Convert slug back to readable format

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html",
        },
        body: `
            <html>
                <head>
                    <meta property="og:title" content="${headline}">
                    <meta property="og:image" content="https://i.imghippo.com/files/JfSn7929Qs.jpg">
                    <meta property="og:description" content="Click to read more!">
                    <meta name="twitter:card" content="summary_large_image">
                    <meta http-equiv="refresh" content="3;url=https://i.imghippo.com/files/JfSn7929Qs.jpg">
                    <title>${headline} - World Daily Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { font-size: 2em; }
                        img { max-width: 80%; margin-top: 20px; }
                        p { font-size: 1.2em; color: gray; }
                    </style>
                </head>
                <body>
                    <h1>${headline}</h1>
                    <img src="https://i.imghippo.com/files/JfSn7929Qs.jpg">
                    <p>Loading article...</p>
                </body>
            </html>
        `,
    };
};
