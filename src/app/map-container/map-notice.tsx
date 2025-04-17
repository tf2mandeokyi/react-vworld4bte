
import { JSX } from "react";

function NoticeImage(props: { src: string, alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt} />
}

export default function MapNotice(): JSX.Element {
    return <div className="h-[35px] px-[16px] left-0 right-0 absolute flex items-center overflow-hidden bottom-[var(--vwmap-bottom-height)]">
        <NoticeImage src="https://map.vworld.kr/images/ol3/logo_openplatform.png" alt="" />
        <NoticeImage src="https://map.vworld.kr/images/maps/notice_aboutmap_r.png" alt="" />
    </div>
}