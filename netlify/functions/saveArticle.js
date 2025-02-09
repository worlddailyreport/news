exports.handler = async (event) => {
    try {
        const { path: articlePath, title, image } = JSON.parse(event.body);

        // Generate the correct preview link
        const previewUrl = `https://worlddailyreport.com/preview.html?headline=${encodeURIComponent(title)}&image=${encodeURIComponent(image)}`;

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: true, url: previewUrl })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: error.message })
        };
    }
};
