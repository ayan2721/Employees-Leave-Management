const { BlobServiceClient } = require("@azure/storage-blob");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

let blobServiceClient = null;

if (connectionString && containerName) {
    try {
        blobServiceClient =
            BlobServiceClient.fromConnectionString(connectionString);

        console.log("✅ Azure initialized");
    } catch (err) {
        console.error("❌ Azure init failed:", err.message);
    }
} else {
    console.log("⚠️ Azure not configured");
}

module.exports = {
    blobServiceClient,
    containerName,
};