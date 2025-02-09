async function generateFakeNews() {
    const headline = document.getElementById("headline").value;
    const imageUrl = document.getElementById("imageUrl").value;

    if (!headline || !imageUrl) {
        alert("Please enter both a headline and an image URL!");
        return;
    }

    const response = await fetch("/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, imageUrl }),
    });

    const data = await response.json();
    if (data.shortUrl) {
        document.getElementById("result").innerHTML = `Troll your friends: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
    } else {
        alert("Error generating link");
    }
}
