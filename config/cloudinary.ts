import _cloudinary from 'cloudinary'
import Env from '@ioc:Adonis/Core/Env'

const cloudinary = _cloudinary.v2;

cloudinary.config({
  cloud_name: Env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: Env.get('CLOUDINARY_API_KEY'),
  api_secret: Env.get('CLOUDINARY_API_SECRET')
});

class CloudUploader {
  public async uploadImage (file) {
    try {
      const response = await cloudinary.uploader.upload(file, {
        resource_type: 'image',
        folder: 'just-original/images'
      });
    
      return { cResponse: response, success: true };
    } catch (error) {
      // throw new Error(`From Cloudinary: ${error}`);
      return { cResponse: error, success: false }
    }
    
  }
}

export default new CloudUploader()
