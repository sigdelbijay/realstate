import React from 'react';
import Resizer from "react-image-file-resizer";
import axios from 'axios';
import {Avatar} from 'antd'
import {useAuth} from '../../context/auth'

export default function ProfileUpload({photo, setPhoto, uploadingPhoto, setUploadingPhoto}) {

  const [auth, setAuth] = useAuth()
  const handleUpload = async(e) => {
    try {
      let file = e.target.files[0];
      if(file) {
      setUploadingPhoto(true)
        new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            300,
            300,
            "JPEG",
            100,
            0,
            async (uri) => {
              try {
                console.log("uri", uri);
                const {data} = await axios.post('/upload-image', {
                  image: uri,
                })
                console.log("data photo uploaded", data)
                setPhoto(data);
              } catch(err) {
                console.log(err);
                setUploadingPhoto(false)
              }
              resolve(uri);
            },
            "base64"
          );
        });
      } else {
        setUploadingPhoto(false)
      }
    } catch(err) {
      console.log(err);
      setUploadingPhoto(false)
    }
  }

  const handleDelete = async(file) => {
    const answer = window.confirm('Delete image');
    if(!answer) return;
    setUploadingPhoto(true)
    try {
      const {data} = await axios.post('/remove-image', file)
      if(data?.ok) {
        setPhoto(null)
        setUploadingPhoto(false)
      }
    } catch(err) {
      console.log(err);
      setUploadingPhoto(false)
    }
  }

  return (
    <>
      <label className='btn btn-secondary my-4'>
        {uploadingPhoto ? 'Processing...' : 'Update photo'}
        <input onChange={handleUpload} type="file" accept="image/*" hidden />
      </label>
      
      {photo?.Location && <Avatar src={photo?.Location} shape="square" size="46" className="ml-2 my-4" onClick={() => handleDelete(photo)}/>}
    </>
  )
}