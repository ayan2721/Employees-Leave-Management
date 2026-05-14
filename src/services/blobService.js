const { blobServiceClient, containerName } = require("../config/azureBlob");
const { v4: uuidv4 } = require("uuid");

const uploadFileToBlob = async(fileBuffer, fileName, mimeType) => {
    try {
        if (!blobServiceClient) {
            console.warn('⚠️ Azure Blob Storage not configured - file upload skipped');
            return null;
        }

        if (!containerName) {
            throw new Error("Container name not configured");
        }

        const containerClient =
            blobServiceClient.getContainerClient(containerName);

        // Create container if not exists
        await containerClient.createIfNotExists({
            access: "blob",
        });

        const fileExtension = fileName.split(".").pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;

        const blockBlobClient =
            containerClient.getBlockBlobClient(uniqueFileName);

        await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: {
                blobContentType: mimeType,
            },
            metadata: {
                originalName: fileName,
                uploadedAt: new Date().toISOString(),
            },
        });

        return blockBlobClient.url;
    } catch (error) {
        console.error("❌ Azure Upload Error:", error);
        throw error;
    }
};

const deleteBlob = async(blobUrl) => {
    try {
        if (!blobServiceClient || !containerName) return;

        const containerClient =
            blobServiceClient.getContainerClient(containerName);

        const blobName = blobUrl.split("/").pop();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.deleteIfExists();
    } catch (error) {
        console.error("❌ Delete Blob Error:", error);
        throw error;
    }
};

module.exports = {
    uploadFileToBlob,
    deleteBlob,
};