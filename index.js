import { ReplicateFiles } from "./ReplicateFiles.js"

try {
    /**
     * In paths enter the path of the Azure container folder you want to replicate to AWS S3
     * In order to replicate the whole Azure container to AWS S3 enter an empty string.
     */
    const paths = ['']
    Promise.all(paths.map((path) => ReplicateFiles(path)))
} catch (error) {
    console.log(error)
}