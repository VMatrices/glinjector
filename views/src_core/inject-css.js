export function injectCss(id, css, doc) {
	doc = doc || document;
	let style = doc.createElement('style');
	style.innerText = css;
	style.id = id;
	doc.head.append(style);
};
