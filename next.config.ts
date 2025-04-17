import type { NextConfig } from "next";
import { i18n } from "./next-i18next.config";

const nextConfig: NextConfig = {
    i18n,
    trailingSlash: true,
    images: {
        remotePatterns: [ new URL('http://map.vworld.kr/**/*') ]
    }
};

export default nextConfig;
