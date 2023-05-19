import { GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from 'fs'

const client = new S3Client({

    region: "us-east-2" 

})

export async function uploadFile(file) {

    const stream = fs.createReadStream(file.tempFilePath)

    const uploadParams = {

        Bucket: "baltazarsegura",
        Key: file.name,
        Body: stream

    }


    const command = new PutObjectCommand(uploadParams)

    return await client.send(command)

}

export async function getFiles(){

    const command = new ListObjectsCommand({

        Bucket: "baltazarsegura"

    })

    return await client.send(command)

}

export async function getFile(fileName){

    const command = new GetObjectCommand({

        Bucket: "baltazarsegura",
        Key: fileName

    })

    return await client.send(command)

}

export async function downloadFile(fileName){

    const command = new GetObjectCommand({

        Bucket: "baltazarsegura",
        Key: fileName

    })

    const result = await client.send(command)

    console.log(result)

    result.Body.pipe(fs.createWriteStream(`./images/${fileName}`))

}