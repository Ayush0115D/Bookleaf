const cloudinary = require('cloudinary').v2;

let configured = false;

function initCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary not configured. File uploads will be disabled.');
    return false;
  }

  try {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    configured = true;
    return true;
  } catch (error) {
    console.warn('Failed to configure Cloudinary:', error.message);
    return false;
  }
}

const cloudinaryAvailable = initCloudinary();

async function uploadFile(buffer, filename) {
  if (!cloudinaryAvailable) {
    throw new Error('Cloudinary not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'bookleaf/tickets',
        resource_type: 'auto',
        public_id: `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          filename: filename,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

module.exports = { uploadFile, cloudinaryAvailable };
