import {
    S3Client,
    PutObjectCommand,
    CreateBucketCommand,
    DeleteObjectCommand,
    DeleteBucketCommand,
    paginateListObjectsV2,
    GetObjectCommand,
    S3ServiceException,
    waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IMAGE_SPLITTER, stringifyError } from "../lib/helpers.ts";

const s3 = new S3Client({});

export async function upload(file: File) {
    const Body = Buffer.from(await file.arrayBuffer());
    const Key = `${Date.now()}${IMAGE_SPLITTER}${file.name}`;

    const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body,
        Key,
    });

    try {
        const putResult = await s3.send(putCommand);

        const objectUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;

        const signedUrl = await getSignedUrl(s3, putCommand, {
            expiresIn: 3600,
        });

        return {
            success: true,
            key: Key,
            bucket: process.env.AWS_BUCKET_NAME,
            objectUrl,
            signedUrl,
            etag: putResult.ETag,
            httpStatusCode: putResult.$metadata.httpStatusCode,
            $metadata: putResult.$metadata,
        };
    } catch (error) {
        console.error("Error uploading file:", error);
        return {
            success: false,
            error: stringifyError(error),
        };
    }
}

export async function retrieve(key: string) {
    const getCommand = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });

    try {
        const getResult = await s3.send(getCommand);

        return {
            success: true,
            data: getResult.Body,
            httpStatusCode: getResult.$metadata.httpStatusCode,
            contentType: getResult.ContentType,
            $metadata: getResult.$metadata,
        };
    } catch (error) {
        console.error("Error retrieving file:", error);
        return {
            success: false,
            error: stringifyError(error),
        };
    }
}

export async function list(pageSize = 10) {
    const objects: string[][] = [];

    try {
        const paginator = paginateListObjectsV2(
            { client: s3, pageSize },
            { Bucket: process.env.AWS_BUCKET_NAME },
        );

        for await (const page of paginator) {
            page.Contents?.forEach((o) => {
                objects.push([o.Key || "0", o.Size ? o.Size.toString() : "0"]);
            });
        }

        objects.forEach((objectList, pageNum) => {
            console.log(
                `Page ${pageNum + 1}\n------\n${objectList.map((o) => `• ${o}`).join("\n")}\n`,
            );
        });

        return {
            success: true,
            objects,
        };
    } catch (error) {
        if (
            error instanceof S3ServiceException &&
            error.name === "NoSuchBucket"
        ) {
            const message = `Error from S3 while listing objects. The bucket doesn't exist.`;
            console.error(message);
            return {
                success: false,
                error: message,
            };
        } else if (error instanceof S3ServiceException) {
            const message = `Error from S3 while listing objects".  ${error.name}: ${error.message}`;
            console.error(message);
            return {
                success: false,
                error: message,
            };
        } else {
            console.error(error);
            return {
                success: false,
                error: stringifyError(error),
            };
        }
    }
}

export async function deleteObject(key: string) {
    const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });

    try {
        const deleteResult = await s3.send(deleteCommand);
        await waitUntilObjectNotExists(
            { client: s3, maxWaitTime: 60 * 2 },
            { Bucket: process.env.AWS_BUCKET_NAME, Key: key },
        );

        return {
            success: true,
            httpStatusCode: deleteResult.$metadata.httpStatusCode,
        };
    } catch (error) {
        if (
            error instanceof S3ServiceException &&
            error.name === "NoSuchBucket"
        ) {
            const message = `Error from S3 while listing objects. The bucket doesn't exist.`;
            console.error(message);
            return {
                success: false,
                error: message,
            };
        } else if (error instanceof S3ServiceException) {
            const message = `Error from S3 while deleting object.  ${error.name}: ${error.message}`;
            console.error(message);
            return {
                success: false,
                error: message,
            };
        } else {
            console.error(error);
            return {
                success: false,
                error: stringifyError(error),
            };
        }
    }
}
