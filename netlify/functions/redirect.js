exports.handler = async (event) => {
    const slug = event.path.split("/").pop();

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html",
        },
        body: `
            <html>
                <head>
                    <meta property="og:title" content="Breaking: ${slug.replace(/-/g, ' ')}">
                    <meta property="og:image" content="https://i.imghippo.com/files/JfSn7929Qs.jpg">
                    <meta property="og:description" content="Click to read more!">
                    <meta http-equiv="refresh" content="3;url=https://i.imghippo.com/files/JfSn7929Qs.jpg">
                </head>
                <body style="text-align: center; font-family: Arial;">
                    <h1>${slug.replace(/-/g, ' ')}</h1>
                    <p>Loading article...</p>
                </body>
            </html>
        `,
    };
};
