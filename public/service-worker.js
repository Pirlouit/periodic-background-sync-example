importScripts('./localforage.js');

const getFormattedTime = (date) => {
    const formatTwoDigits = (number) => `0${number}`.slice(-2);
    const hours = formatTwoDigits(date.getHours());
    const minutes = formatTwoDigits(date.getMinutes());
    const seconds = formatTwoDigits(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
};

const getLogs = async () => {
    const logs = await localforage.getItem('logs');
    if (logs) {
        return logs;
    } else {
        return [];
    }
};

async function log(text) {
    const logs = await getLogs();
    logs.push({
        time: new Date().toLocaleTimeString(),
        text,
    });
    await localforage.setItem('logs', logs);
}

const fetchAndCacheNews = async () => {
    console.log('Fetching news in the background!');
    await log('❤️❤️❤️ It Workks ❤️❤️❤️');
    // const url = `https://newsapi.org/v2/everything?q=bitcoin&sortBy=publishedAt&apiKey=${apiKeyNews}`;
    // const response = await fetch(url);
    // const responseWithTime = await getResponseWithFormattedTime(response);

    // const cache = await caches.open('cache-news');
    // await cache.put(url, responseWithTime);
};

const clearCache = async () => {
    await log('Cache was cleared');
    setTimeout(clearCache, 10000);
};

self.addEventListener('install', (event) => {
    const preCache = async () => {
        const cache = await caches.open('cache-v1');
        await cache.addAll(['/', '/index.js', '/index.html']);
    };

    event.waitUntil(preCache());
});

self.addEventListener('periodicsync', function (event) {
    log('Event periodicsync: ' + event.tag);
    if (event.tag === 'news') {
        event.waitUntil(fetchAndCacheNews());
    }
});
