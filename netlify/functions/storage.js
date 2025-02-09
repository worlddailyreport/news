// ✅ Global variable to store articles across function calls
let articles = {};

// ✅ Function to retrieve stored articles
function getArticles() {
    return articles;
}

// ✅ Function to store articles
function saveArticle(slug, data) {
    articles[slug] = data;
}

module.exports = { getArticles, saveArticle };
