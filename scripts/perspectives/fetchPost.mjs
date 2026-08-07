
import { fetchJsonWithTimeout } from '../network.mjs';

/**
 * Class to handle fetching and processing post data from Medium feeds.
 * RSStoJSON is the primary source, with AllOrigins as the fallback.
 */
class PostFetcher {
    constructor(feedUrl) {
        this.feedUrl = feedUrl;
        this.rsstojsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(this.feedUrl)}`;
        this.allOriginsBaseUrl = 'https://api.allorigins.win/get?url=';
        this.defaultData = {
            title: "No Title Available",
            pub: "No Published Date or Time Available",
            link: "No Post Link Available",
            image: "No Image Available",
            content: "No Content Available",
            sourceFlag: "Failed"
        };
    }

    /**
     * Utility to log messages with timestamps.
     * @param {string} type - The type of message (info, warn, error).
     * @param {string} message - The message to log.
     */
    log(type, message) {
        const timestamp = new Date().toISOString();
        const types = {
            info: `[INFO - ${timestamp}]`,
            warn: `[WARN - ${timestamp}]`,
            error: `[ERROR - ${timestamp}]`
        };
        console[type](types[type] || "[LOG]", message);
    }

    /**
     * Fetch data from RSStoJSON API.
     * @returns {Promise<Object>} The post data or default data on failure.
     */
    async fetchFromRSStoJSON() {
        try {
            this.log("info", `Fetching from RSStoJSON: ${this.rsstojsonUrl}`);
            const { data, response } = await fetchJsonWithTimeout(
                this.rsstojsonUrl,
                {},
                { timeoutMs: 6000 }
            );
            if (response.ok) {
                if (data.items && data.items.length > 0) {
                    const post = data.items[0];
                    const recentArticles = data.items.map(item => ({
                        title: item.title || '',
                        link: item.link || '',
                        pubDate: item.pubDate || ''
                    }));
                    const result = {
                        title: post.title || this.defaultData.title,
                        pub: post.pubDate || this.defaultData.pub,
                        link: post.link || this.defaultData.link,
                        image: post.content || this.defaultData.image,
                        content: post.content || this.defaultData.content,
                        recentArticles,
                        sourceFlag: "RSStoJSON"
                    };
                    this.log("info", "Successfully fetched data from RSStoJSON");
                    return result;
                }
            }
            this.log("warn", "RSStoJSON returned no usable data.");
        } catch (error) {
            this.log("error", `Error fetching from RSStoJSON: ${error.message}`);
        }
        return null; // Indicates failure
    }

    /**
     * Fetch data from AllOrigins proxy.
     * @returns {Promise<Object>} The post data or default data on failure.
     */
    async fetchFromAllOrigins() {
        try {
            this.log("info", "Fetching from AllOrigins...");
            const encodedUrl = encodeURIComponent(this.feedUrl);
            const fetchUrl = `${this.allOriginsBaseUrl}${encodedUrl}`;
            const { data, response } = await fetchJsonWithTimeout(
                fetchUrl,
                {},
                { timeoutMs: 6000 }
            );
            if (response.ok) {
                if (data && data.contents) {
                    const parser = new DOMParser();
                    const rssDoc = parser.parseFromString(data.contents, "text/xml");
                    const firstItem = rssDoc.querySelector("item");

                    if (firstItem) {
                        const recentArticles = Array.from(rssDoc.querySelectorAll("item")).map(item => ({
                            title: item.querySelector("title")?.textContent || '',
                            link: item.querySelector("link")?.textContent || '',
                            pubDate: item.querySelector("pubDate")?.textContent || ''
                        }));
                        const result = {
                            title: firstItem.querySelector("title")?.textContent || this.defaultData.title,
                            pub: firstItem.querySelector("pubDate")?.textContent || this.defaultData.pub,
                            link: firstItem.querySelector("link")?.textContent || this.defaultData.link,
                            image: firstItem.getElementsByTagName("content:encoded")[0]?.textContent || this.defaultData.image,
                            content: firstItem.getElementsByTagName("content:encoded")[0]?.textContent || this.defaultData.content,
                            recentArticles,
                            sourceFlag: "AllOrigins"
                        };
                        this.log("info", "Successfully fetched data from AllOrigins");
                        return result;
                    }
                }
            }
            this.log("warn", "AllOrigins returned no usable data.");
        } catch (error) {
            this.log("error", `Error fetching from AllOrigins: ${error.message}`);
        }
        return null; // Indicates failure
    }

    /**
     * Fetch post data using prioritized strategies.
     * RSStoJSON is the primary source, with AllOrigins as the fallback.
     * @returns {Promise<Object>} The most recent post data.
     */
    async fetchPostData() {
        this.log("info", "Starting post data fetch...");

        // Attempt RSStoJSON API first
        const rsstojsonData = await this.fetchFromRSStoJSON();
        if (rsstojsonData) {
            this.log("info", "Post data successfully fetched using RSStoJSON.");
            return rsstojsonData;
        }

        // Fallback to AllOrigins
        this.log("warn", "RSStoJSON failed. Falling back to AllOrigins...");
        const allOriginsData = await this.fetchFromAllOrigins();
        if (allOriginsData) {
            this.log("info", "Post data successfully fetched using AllOrigins.");
            return allOriginsData;
        }

        this.log("error", "Both RSStoJSON and AllOrigins failed.");
        return null;
    }
}

/**
 * Exported function to fetch post data.
 * @returns {Promise<Object>} The post data.
 */
export default async function fetchPost(feedUrl = 'https://medium.com/feed/@jmwii1981') {
    const fetcher = new PostFetcher(feedUrl);
    return await fetcher.fetchPostData();
}
