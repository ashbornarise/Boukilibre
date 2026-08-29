const { put } = require('@vercel/blob');

async function uploadFile(file, folder) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('BLOB_READ_WRITE_TOKEN non configure. Ajoutez un Blob store sur Vercel.');
    }

    const blob = await put(`${folder}/${Date.now()}-${file.originalname}`, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return blob.url;
}

module.exports = { uploadFile };
