export function xlog(level, title, msg) {
	setTimeout(console[level].bind(console,
		'%cGlInjector %c<' + title + '> %c' + msg,
		'color:grey;font-weight:bold',
		'font-weight:bold',
		'color:darkblue'
	));
};
