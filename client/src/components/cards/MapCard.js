import GoogleMapReact from 'google-map-react';
import {GOOGLE_PLACES_KEY} from '../../config'

export default function MapCard({ad}) {
  const defaultProps = {
    center: {
      lat: ad?.location?.coordinates[1],
      lng: ad?.location?.coordinates[0]
    },
    zoom: 11
  };

  return ad?.location?.coordinates?.length && 
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_PLACES_KEY}}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <div
          lat={ad?.location?.coordinates[1]}
          lng={ad?.location?.coordinates[0]}
        >
          <span className='lead'>📍</span>
        </div>
          
      </GoogleMapReact>
    </div>
}