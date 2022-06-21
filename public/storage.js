const localForage = require('localForage');

localForage.config({
    driver: localForage.WEBSQL, // Force WebSQL; same as using setDriver()
    name: 'records',
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
    description: 'Client record storage',
});
