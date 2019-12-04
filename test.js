/*
(function () {
	
	const oldScripts = document.querySelectorAll('script');
	for (let script of oldScripts) {
		Object.defineProperty(script, 'src', {
			set(v) {
				console.log(v);
				return v;
			},
			get() {
				return this.src
			}
		})
	}
	const RealHTMLScriptElement = HTMLScriptElement
	
	Object.defineProperty(Document.prototype, 'realCreateElement', {
		value: Document.prototype.createElement
	})
	Object.defineProperty(Document.prototype, 'createElement', {
		value: function (tagName) {
			const realResult = this.realCreateElement(tagName);
			if(tagName === 'script') {
				realResult.addEventListener('load', function () {
					console.log('script load');
					console.dir(this);
					// console.log('script content', this.innerHTML)
				})
				const srcDesc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src')
				Object.defineProperty(realResult, 'realSrc', {
					get: srcDesc.get,
					set: srcDesc.set
				})
				Object.defineProperty(realResult, 'src', {
					set(v) {
						console.log(v);
						this.realSrc = v;
						return v;
					},
					get() {
						return this.realSrc
					}
				})
			}
			return realResult
		},
		configurable: true,
		enumerable: true,
		writable: true
	})
	
	const tt = document.createElement('script')
	tt.src = 'http://127.0.0.1:8080/test.js';
	document.body.appendChild(tt);
})()
*/
