import {useParams} from 'react-router-dom'
import {useState, useCallback} from 'react'
import Gallery from "react-photo-gallery"
import Carousel, { Modal, ModalGateway } from 'react-images'

// default photos array for react-photo-gallery
// const photos = [
//   {
//     src: 'https://realstate-bucket.s3.amazonaws.com/FK4G0Gtm6R6lp25N28pDH.jpeg',
//     width: 4,
//     height: 3
//   },
//   {
//     src: 'https://realstate-bucket.s3.amazonaws.com/sWgU6GX2p8NQKbxxq4OWB.jpeg',
//     width: 1,
//     height: 1
//   }
// ];

export default function ImageGallery({photos}) {
  const [current, setCurrent] = useState(0); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams()

  const openLightBoxModal = useCallback((event, {photo, index}) =>{
    setCurrent(index)
    setIsModalOpen(true)
  }, [])

  const closeLightBoxModal = () => {
    setCurrent(0)
    setIsModalOpen(false)
  }

  return (
    <>
      <Gallery photos={photos} onClick={openLightBoxModal}/>
      <ModalGateway>
        {isModalOpen ? (
          <Modal onClose={closeLightBoxModal}>
            <Carousel currentIndex={current} views={photos.map(photo => ({
              ...photo,
              srcset: photo.srcSet,
              caption: photo.title,
}         ))} />
          </Modal>
        ) : null}
      </ModalGateway>
    </>
  )
}