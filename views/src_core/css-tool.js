const webkitStyles = ['backdropFilter', 'filter']

export function injectCss(id, css, doc) {
	doc = doc || document;
	let style = doc.createElement('style');
	style.innerHTML = css;
	style.id = id;
	doc.head.append(style);
};

export function createCss(selector, style) {
	const convert = (key, value) => `${key.replace(/([A-Z])/g, '-$1').toLocaleLowerCase()}:${value} !important;`

	let body = ''
	for (const key in style) {
		body += convert(key, style[key])
		if (webkitStyles.includes(key)) {
			body += convert('-webkit-' + key, style[key])
		}
	}
	return `${selector}{${body}}`
}
