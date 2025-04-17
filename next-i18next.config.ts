import { I18NConfig } from "next/dist/server/config-shared";

export const i18n: I18NConfig = {
    locales: ['default', 'en', 'ko'],
    defaultLocale: 'default',
    localeDetection: false,
}