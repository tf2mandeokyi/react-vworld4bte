interface VWorldScriptProps {
    onLoad: () => void;
    onError: () => void;
}

export default function VWorldScript({ onLoad, onError }: VWorldScriptProps) {
    return (
        <script
            src={ `https://map.vworld.kr/js/webglMapInit.js.do?version=2.0&apiKey=${process.env.NEXT_PUBLIC_VWORLD_KEY}` }
            onLoad={ () => onLoad() }
            onError={ () => onError() }
        />
    );
}