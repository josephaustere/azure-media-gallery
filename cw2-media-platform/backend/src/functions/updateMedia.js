const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('updateMedia', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'updateMedia/{id}',
  handler: async (request, context) => {
    try {
      const id = request.params.id;
      const body = await request.json();

      const client = new CosmosClient({
        endpoint: process.env.COSMOS_ENDPOINT,
        key: process.env.COSMOS_KEY
      });

      const container = client
        .database(process.env.COSMOS_DATABASE)
        .container(process.env.COSMOS_CONTAINER);

      const { resource } = await container.item(id, id).read();

      if (!resource) {
        return { status: 404, jsonBody: { error: 'Media not found' } };
      }

      resource.title = body.title || resource.title;
      resource.description = body.description || resource.description;
      resource.updatedDate = new Date().toISOString();

      await container.item(id, id).replace(resource);

      return {
        status: 200,
        jsonBody: {
          message: 'Media updated successfully',
          media: resource
        }
      };

    } catch (error) {
      context.error(error);
      return {
        status: 500,
        jsonBody: { error: error.message }
      };
    }
  }
});