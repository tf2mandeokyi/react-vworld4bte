import React from 'react'

import './index.css'


const MapLoadingFailPage : React.FC = () => {
    return (
        <div className='loading-fail-page'>
            <div className='loading-fail-message'>
                브이월드 지도를 불러오는 데에 실패했습니다.<br/>
                VPN으로 국가를 바꾼 뒤 다시 시도해주세요!<br/>
                <br/>
                확인된 지원 가능한 국가:<br/>
                <ul>
                    <li>대한민국</li>
                    <li>미국 일부 지역</li>
                </ul>
                <hr/>
                Failed to load the VWorld map.<br/>
                Please change the country using a VPN and try again!<br/>
                <br/>
                Known supporting countries:<br/>
                <ul>
                    <li>South Korea</li>
                    <li>United States</li>
                </ul>
            </div>
        </div>
    )
}

export default MapLoadingFailPage