import('./localforage.js');

const openLogCache = async () => {
    const logCache = await caches.open('logs');
    logCache.match('logs').then((x) => {
        const content = x.json();

        logCache.put('logs', {});
    });
};

const getLogs = async () => {
    const logs = await localforage.getItem('logs');
    if (logs) {
        return logs;
    } else {
        return [];
    }
};

const log = async (text) => {
    const logs = await getLogs();
    logs.push({
        time: new Date().toLocaleTimeString(),
        text,
    });
    await localforage.setItem('logs', logs);
};

const diplayLogs = async () => {
    const element = document.getElementById('logs');
    const logs = await getLogs();
    console.log(logs);
    logs.forEach((value, index) => {
        const logElement = document.createElement('p');
        logElement.textContent = `${value.time} - ${value.text}`;
        element.appendChild(logElement);
    });
};

const main = async () => {
    await diplayLogs();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js');
        await log('service worker registered');
    }

    const registration = await navigator.serviceWorker.ready;
    // Check if periodicSync is supported
    if ('periodicSync' in registration) {
        // Request permission
        const status = await navigator.permissions.query({
            name: 'periodic-background-sync',
        });

        if (status.state === 'granted') {
            await log('granted');
            try {
                // Register new sync every 24 hours
                await registration.periodicSync.register('news', {
                    minInterval: 24 * 60 * 60 * 1000, // 1 day
                });
                console.log('Periodic background sync registered!');
                await log('Periodic background sync registered!');
            } catch (e) {
                console.error(`Periodic background sync failed:\nx${e}`);
                await log(`Periodic background sync failed:\nx${e}`);
            }
        } else {
            console.info('Periodic background sync is not granted.');
            await log('Periodic background sync is not granted.');
        }
    } else {
        console.log('Periodic background sync is not supported.');
        await log('Periodic background sync is not supported.');
    }
};

main();
