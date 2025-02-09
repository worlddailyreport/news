async function generateFakeNews() {
    const headline = document.getElementById("headline").value;
    const imageUrl = document.getElementById("imageUrl").value;

    if (!headline || !imageUrl) {
        alert("Please enter both a headline and an image URL!");
        return;
    }

    const response = await fetch("/.netlify/functions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, imageUrl }),
    });

    const data = await response.json();
    if (data.shortUrl) {
        const newsList = document.getElementById("news-list");
        const newItem = document.createElement("li");
        newItem.innerHTML = `<a href="${data.shortUrl}" target="_blank">${headline}</a>`;
        newsList.prepend(newItem);
    } else {
        alert("Error generating link");
    }
}
