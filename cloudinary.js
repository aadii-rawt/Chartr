
import axios from 'axios';

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'buspass_upload'); 
  formData.append('cloud_name', 'de7vaylb1');       

  const res = await axios.post('https://api.cloudinary.com/v1_1/de7vaylb1/image/upload', formData);
  return res.data.secure_url;
};
