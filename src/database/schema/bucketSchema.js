import { Schema, model } from 'mongoose';

const bucketSchema = new Schema({
  imageName: {
    type: String,
    required: true
  },
  imageData: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const bucketModel = model('buckets', bucketSchema);

export default bucketModel;
