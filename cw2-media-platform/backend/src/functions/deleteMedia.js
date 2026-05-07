const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');

app.http('deleteMedia', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'deleteMedia/{id}',

  handler: async (request, context) => {
    try {
      const id = request.params.id;

      const cosmosClient = new CosmosClient({
        endpoint: process.env.COSMOS_ENDPOINT,
        key: process.env.COSMOS_KEY
      });

      const container = cosmosClient
        .database(process.env.COSMOS_DATABASE)
        .container(process.env.COSMOS_CONTAINER);

      const { resource: mediaItem } = await container.item(id, id).read();

      if (!mediaItem) {
        return {
          status: 404,
          jsonBody: {
            error: 'Media not found'
          }
        };
      }

      if (mediaItem.fileName) {
        const blobServiceClient = BlobServiceClient.fromConnectionString(
          process.env.STORAGE_CONNECTION_STRING
        );

        const containerClient = blobServiceClient.getContainerClient('media');
        const blobClient = containerClient.getBlobClient(mediaItem.fileName);

        await blobClient.deleteIfExists();
      }

      await container.item(id, id).delete();

      return {
        status: 200,
        jsonBody: {
          message: 'Media deleted successfully',
          deletedId: id
        }
      };

    } catch (error) {
      context.error('Delete failed:', error);

      return {
        status: 500,
        jsonBody: {
          error: 'Delete failed',
          details: error.message
        }
      };
    }
  }
});