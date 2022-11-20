import React from 'react'
import './index.css'


const MapNotice : React.FC = () => {
    return <div className="vwmap-notice">
        <img 
            className="vwmap-notice-image"
            src="http://map.vworld.kr/images/etrimap/logo_openplatform.png"
            alt=""
        />
        <img 
            className="vwmap-notice-image"
            src="http://map.vworld.kr/images/etrimap/notice_aboutmap_r.png"
            alt=""
        />
    </div>
}

export default MapNotice;