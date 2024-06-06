
/**
 * 继承数据
 * @param src 源对象
 * @param dst 目标对象
 * @param override true：强制src覆盖dst, false: dst不存在则赋值
 * @returns dst
 */
export function extendObject(src, dst, override = false) {
    const MAX_DEPTH = 10;
    let _extend = (src, dst, deep) => {
        if (deep > MAX_DEPTH) {
            console.warn(`Parameter depth exceeds ${MAX_DEPTH} layers`)
            return dst
        }
        for (let key in src) {
            let s = src[key], d = dst[key];
            if (typeof s == 'object' && typeof d == 'object' && !(s instanceof Array) && !(d instanceof Array)) {
                _extend(s, d, deep + 1);
            } else if (override || d === undefined) {
                dst[key] = s;
            }
        }
        return dst
    }
    return _extend(src, dst, 0)
};
