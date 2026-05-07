const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');
const { v4: uuidv4 } = require('uuid');

app.http('uploadMedia', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const formData = await request.formData();

            const file = formData.get('file');
            const title = formData.get('title') || 'Untitled';
            const description = formData.get('description') || '';

            if (!file) {
                return {
                    status: 400,
                    jsonBody: { error: 'No file uploaded' }
                };
            }

            const id = uuidv4();
            const fileName = `${id}-${file.name}`;

            const storageConnectionString = process.env.STORAGE_CONNECTION_STRING;
            const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);
            const containerClient = blobServiceClient.getContainerClient('media');

            const blockBlobClient = containerClient.getBlockBlobClient(fileName);

            const buffer = Buffer.from(await file.arrayBuffer());

            await blockBlobClient.uploadData(buffer, {
                blobHTTPHeaders: {
                    blobContentType: file.type
                }
            });

            const cosmosClient = new CosmosClient({
                endpoint: process.env.COSMOS_ENDPOINT,
                key: process.env.COSMOS_KEY
            });

            const database = cosmosClient.database(process.env.COSMOS_DATABASE);
            const container = database.container(process.env.COSMOS_CONTAINER);

            const mediaItem = {
                id,
                title,
                description,
                fileName,
                fileUrl: blockBlobClient.url,
                contentType: file.type,
                uploadDate: new Date().toISOString()
            };

            await container.items.create(mediaItem);

            return {
                status: 201,
                jsonBody: {
                    message: 'Upload successful',
                    media: mediaItem
                }
            };

        } catch (error) {
            context.error(error);

            return {
                status: 500,
                jsonBody: {
                    error: 'Upload failed',
                    details: error.message
                }
            };
        }
    }
});