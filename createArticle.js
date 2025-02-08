exports.handler = async (event) => {
    try {
        const queryParams = new URL(event.rawUrl).searchParams;
        
        const headline = queryParams.get('headline') || "Breaking News";
        const image = queryParams.get('image') || "https://i.imghippo.com/files/ec2052kqs.jpg"; // User-uploaded image preview

        const articlePage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${headline}</title>
            <meta property="og:type" content="article">
            <meta property="og:title" content="${headline}">
            <meta property="og:image" content="${image}">
            <meta property="og:description" content="Click to read more!">
            <meta property="og:url" content="${event.rawUrl}">

            <script>
                setTimeout(() => {
                    window.location.href = 'https://res.cloudinary.com/dgeragc2e/image/upload/v1739033290/jl7jlcjnn4hrzykcjhvf.jpg';
                }, 2000);
            </script>
        </head>
        <body>
            <div class="body-container">
                <h1>${headline}</h1>
                <div class="content-container">
                    <img class="troll_img" src="https://res.cloudinary.com/dgeragc2e/image/upload/v1739033290/jl7jlcjnn4hrzykcjhvf.jpg" />
                </div>
            </div>
        </body>
        </html>`;

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/html" },
            body: articlePage
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate article page' })
        };
    }
};
