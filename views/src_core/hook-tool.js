import { xlog } from './xlog';

const _defineProperty = Object.defineProperty,
    _pushState = history.pushState,
    _replaceState = history.replaceState,
    _forEach = Array.prototype.forEach,
    _isArray = Array.isArray,
    _objectKeys = Object.keys;

export const defineProp = _defineProperty
export const objectKeys = _objectKeys

export function hookObject() {
    const process = (obj, from) => {
        if (!obj.___) {
            try {
                for (let hook of hooks) {
                    if ((!('enable' in hook) || hook.enable) && hook.from == from && (!hook.complete || !hook.complete(obj)) && hook.condition(obj)) {
                        obj.___ = 1
                        hook.name && xlog('debug', 'Hook', hook.name)
                        hook.process(obj)
                        break
                    }
                }
            } catch (e) {
                xlog('info', 'Error', e)
            }
        }
    }

    // 拦截Vue对象
    Object.defineProperty = (a, b, c) => {
        a._isVue && process(a, 'vue')
        return _defineProperty(a, b, c)
    }

    Array.prototype.forEach = function (a, b) {
        this.length && process(this, 'array')
        _forEach.call(this, a, b)
    }

    Array.isArray = o => {
        o && process(o, 'object')
        return _isArray(o)
    }

    Object.keys = o => {
        o && process(o, 'object')
        return _objectKeys(o)
    }
}

export function watchState(processors) {
    const runProcessor = processor => {
        if (processor.condition()) {
            if (!processor.time) {
                processor.time = Date.now()
            }
            if ((processor.complete && processor.complete()) || Date.now() - processor.time > 10000) return
            if (!processor.delayCondition || processor.delayCondition()) {
                let param = {}
                if (processor.requires) {
                    for (let key in processor.requires) {
                        if (!(param[key] = processor.requires[key]())) {
                            setTimeout(() => runProcessor(processor), 32)
                            return
                        }
                    }
                }
                try {
                    processor.name && xlog('debug', 'Normal', processor.name)
                    processor.process(param)
                } catch (e) {
                    xlog('info', 'Error', e)
                }
            } else {
                setTimeout(() => runProcessor(processor), 32)
            }
        }
    }

    const processor = () => {
        for (let processor of processors) {
            processor.time = null
            runProcessor(processor)
        }
    }

    history.pushState = (a, b, c) => {
        _pushState.call(history, a, b, c)
        processor()
    }

    history.replaceState = (a, b, c) => {
        _replaceState.call(history, a, b, c)
        processor()
    }

    addEventListener('load', processor)

    processor()
}