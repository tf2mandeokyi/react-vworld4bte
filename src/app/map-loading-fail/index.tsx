import { JSX } from "react";

export default function MapLoadingFailPage(): JSX.Element {
    return (
        <div className='absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center bg-black/60'>
            <div className='w-fit h-fit p-[40px] bg-white rounded-[40px] shadow-[7px_7px_0px_rgba(0,0,0,0.3)]'>
                브이월드 지도를 불러오는 데에 실패했습니다.<br/>
                VPN으로 국가를 바꾼 뒤 다시 시도해주세요!<br/>
                <br/>
                확인된 지원 가능한 국가:<br/>
                <ul className='pl-[40px]'>
                    <li>대한민국</li>
                    <li>미국 일부 지역</li>
                </ul>
                <hr className='my-[20px]' />
                Failed to load the VWorld map.<br/>
                Please change the country using a VPN and try again!<br/>
                <br/>
                Known supporting countries:<br/>
                <ul className='pl-[40px]'>
                    <li>South Korea</li>
                    <li>United States</li>
                </ul>
            </div>
        </div>
    )
}