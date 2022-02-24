import * as azureBlob from "@azure/storage-blob"
import { config } from "../config.js"

export class AzureBlobService {
    connectionString = config.AZURE_BLOB_CONNECTIONSTRING
    containerName = config.AZURE_CONTAINERNAME

    blobServiceClient = azureBlob.BlobServiceClient.fromConnectionString(this.connectionString)
    containerClient = this.blobServiceClient.getContainerClient(this.containerName)

    /**
     * It will first list all the files with path as prefix and then it will download each of them in in readableStreamBody.
     * @param {string} path All the files at this path will be downloaded.
     * @returns An array of object. 
     */
    async getAllBlob(path) {
        const blobs = this.containerClient.listBlobsFlat({ prefix: `${path}` })
        let files = []
        for await (const item of blobs) {
            const fileName = item.name
            
            const blobClient = new azureBlob.BlobClient(this.connectionString, this.containerName, item.name)
            const fileStream = await blobClient.download()
            files.push({ fileName, fileStream })
        }
        return files
    }
}