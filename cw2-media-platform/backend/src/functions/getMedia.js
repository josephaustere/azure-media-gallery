const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('getMedia', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async () => {
        const client = new CosmosClient({
            endpoint: process.env.COSMOS_ENDPOINT,
            key: process.env.COSMOS_KEY
        });

        const container = client
            .database(process.env.COSMOS_DATABASE)
            .container(process.env.COSMOS_CONTAINER);

        const { resources } = await container.items
            .query('SELECT * FROM c ORDER BY c.uploadDate DESC')
            .fetchAll();

        return {
            status: 200,
            jsonBody: resources
        };
    }
});