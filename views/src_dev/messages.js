export default {
    'en': {
        ...await import('../i18n/en.json'),
        ...await import('./i18n/gl-sdk4-ui-core.en.json'),
    },
    'ja': {
        ...await import('../i18n/ja.json'),
        ...await import('./i18n/gl-sdk4-ui-core.ja.json'),
    },
    'zh-cn': {
        ...await import('../i18n/zh-cn.json'),
        ...await import('./i18n/gl-sdk4-ui-core.zh-cn.json'),
    },
    'zh-tw': {
        ...await import('../i18n/zh-tw.json'),
        ...await import('./i18n/gl-sdk4-ui-core.zh-tw.json'),
    },
}