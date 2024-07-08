import fs from 'fs';
import bucketModel from "../database/schema/bucketSchema.js";

const bucketController = {
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
      }

      // Read the file as base64
      const imageData = fs.readFileSync(req.file.path, 'base64');
      const mimeType = req.file.mimetype; // Get MIME type of the file

      // Create a new bucket document
      const newBucket = new bucketModel({
        imageName: req.file.originalname,
        imageData: `data:${mimeType};base64,${imageData}` // Save image data with MIME type prefix
      });

      // Save to MongoDB
      await newBucket.save();

      res.status(201).json({ status: 'Success',message: 'File uploaded successfully', data: newBucket });
    } catch (error) {
      res.status(500).json({ status: 'Error', message: 'Failed to upload file', error: error.message });
    }
  },

  async getImageById(req, res) {
    try {
      const { id } = req.params;

      const bucket = await bucketModel.findById(id);

      if (!bucket) {
        return res.status(404).json({  status: 'Error', message: 'Image not found' });
      }

      // Assuming the image data is stored in 'imageData' field in base64 format
      res.status(200).json({  
        status: 'Success',
        message: 'Get image detail successfully',
        data: bucket.imageData });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch image', error: error.message });
    }
  }
}

export default bucketController;
