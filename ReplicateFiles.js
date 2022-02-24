import { AWSS3Service } from "./Services/AWSS3Service.js";
import { AzureBlobService } from "./Services/AzureBlobService.js";

export const ReplicateFiles = async (path) => {    
    const awss3service = new AWSS3Service()
    const azureslobservice = new AzureBlobService()
    
    await awss3service.deleteFilesFromAWS(path)
    const files = await azureslobservice.getAllBlob(path)
    if (files.length > 0) await awss3service.uploadFilesToAWS(files)
}