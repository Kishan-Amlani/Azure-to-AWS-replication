import AWS from "aws-sdk"
import { config } from "../config.js"

export class AWSS3Service {
    bucket = config.AWS_S3_BUCKET
    s3

    constructor() {
        AWS.config.update({
            accessKeyId: config.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
            sessionToken: config.AWS_TOKEN,
            region: config.AWS_REGION
        })
        this.s3 = new AWS.S3()
    }

    /**
     * It will first list all the files with path as prefix and then it will delete them all.
     * @param {string} path All the files at this path will be deleted.
     */
    async deleteFilesFromAWS(path) {
        const files = await this.s3.listObjects({
            Bucket: this.bucket,
            Prefix: `${path}`
        }).promise()

        if (files.Contents.length > 0) {
            Promise.all(
                files.Contents.map((image) => {
                    this.s3.deleteObject({
                        Bucket: this.bucket,
                        Key: image.Key
                    }).promise()
                })
            )
        }
    }

    /**
     * It will upload the files with filename as key and filestream as body.
     * @param {object} files An object containing filename and filestream to upload.
     */
    async uploadFilesToAWS(files) {
        let imageCount = 0
        Promise.all(
            files.map((file) => {
                imageCount++
                this.s3.upload({
                    Bucket: this.bucket,
                    Key: `${file.fileName}`,
                    Body: file.fileStream.blobDownloadStream
                }).promise()
            })
        )
    }
}