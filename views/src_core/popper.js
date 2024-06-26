export class Popper {
	constructor(vm, template) {
		let rawPopperElm = vm.popperElm, rawReferenceElm = vm.referenceElm;

		this.bind = (elm, content) => {
			let tooltipElm = template.cloneNode();

			tooltipElm.style.display = '';
			tooltipElm.style.pointerEvents = 'none';
			tooltipElm.classList.add('el-fade-in-leave-active');
			tooltipElm.innerHTML = content;
			document.body.append(tooltipElm);

			vm.popperElm = tooltipElm;
			vm.referenceElm = elm;
			vm.createPopper();
			let pjs = vm.popperJS;
			vm.popperElm = rawPopperElm;
			vm.referenceElm = rawReferenceElm;
			vm.popperJS = null;

			elm.onmouseenter = _ => {
				pjs.update();
				tooltipElm.classList.remove('el-fade-in-leave-active');
				tooltipElm.classList.add('el-fade-in-enter-active');
			};

			elm.onmouseleave = _ => {
				tooltipElm.classList.remove('el-fade-in-enter-active');
				tooltipElm.classList.add('el-fade-in-leave-active');
			};
		};
	}
}
