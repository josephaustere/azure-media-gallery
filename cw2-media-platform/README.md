# Azure Media Gallery

A cloud-native multimedia sharing platform built for COM682 Coursework 2.

## Features
- Upload images, videos, and audio files
- View uploaded media in a gallery
- Edit media title and description
- Delete uploaded media
- Store media files in Azure Blob Storage
- Store metadata in Azure Cosmos DB
- Serverless REST API using Azure Functions
- Frontend deployed using Azure App Service

## Azure Services Used
- Azure App Service
- Azure Functions
- Azure Blob Storage
- Azure Cosmos DB
- Application Insights
- GitHub

## Live URLs
Frontend:
https://mediafrontendjoseph-argvc5eveyepceek.spaincentral-01.azurewebsites.net

Backend API:
https://cw2-media-api-g6e6gcgxakfkgbgp.spaincentral-01.azurewebsites.net/api

## API Endpoints
- POST /uploadmedia
- GET /getmedia
- PUT /updatemedia/{id}
- DELETE /deletemedia/{id}

## Architecture
Frontend App Service → Azure Functions API → Blob Storage + Cosmos DB

## Coursework Focus
This project demonstrates scalable cloud-native development using Azure services, REST APIs, serverless backend logic, cloud storage, NoSQL metadata storage, and deployed web application functionality.