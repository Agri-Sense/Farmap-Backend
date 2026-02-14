import Parser from "rss-parser";
import asyncHandler from "../../utils/asyncHandler.js";

const parser = new Parser();

const getNews = asyncHandler(async (req, res) => {
    try {
        // Query for Indian Agricultural News
        const url = "https://news.google.com/rss/search?q=agriculture+india&hl=en-IN&gl=IN&ceid=IN:en";
        const feed = await parser.parseURL(url);

        const newsItems = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source: item.source || "Google News",
            snippet: item.contentSnippet || ""
        })).slice(0, 10); // Limit to top 10 articles

        res.json({
            success: true,
            data: newsItems,
            message: "Indian agricultural news fetched successfully."
        });
    } catch (error) {
        console.error("News Fetch Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch agricultural news."
        });
    }
});

export default getNews;
