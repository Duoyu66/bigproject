/* global document */
/* global window */
(function (window, $) {
	"use strict";
	let UI = GrapeCity.UI;
	
	let Element = function(tag, className = '') {
		
		if (typeof tag === 'string') {
			this.el = document.createElement(tag);
			this.el.className = className;
		} else {
			this.el = tag;
		}
		this.data = {};
	}

	Element.prototype.data = function(key, value) {
		if (value !== undefined) {
			this.data[key] = value;
			return this;
		}
		return this.data[key];
	}

	Element.prototype.on = function(eventNames, handler) {
		const [fen, ...oen] = eventNames.split('.');
		let eventName = fen;
		if (eventName === 'mousewheel' && /Firefox/i.test(window.navigator.userAgent)) {
			eventName = 'DOMMouseScroll';
		}
		this.el.addEventListener(eventName, (evt) => {
			handler(evt);
			for (let i = 0; i < oen.length; i += 1) {
				const k = oen[i];
				if (k === 'left' && evt.button !== 0) {
					return;
				}
				if (k === 'right' && evt.button !== 2) {
					return;
				}
				if (k === 'stop') {
					evt.stopPropagation();
				}
			}
		});
		return this;
	}

	Element.prototype.offset = function(value) {
		if (value !== undefined) {
			Object.keys(value).forEach((k) => {
				this.css(k, `${value[k]}px`);
			});
			return this;
		}
		const {
			offsetTop, offsetLeft, offsetHeight, offsetWidth,
		} = this.el;
		return {
			top: offsetTop,
			left: offsetLeft,
			height: offsetHeight,
			width: offsetWidth,
		};
	}

	Element.prototype.scroll = function(v) {
		const { el } = this;
		if (v !== undefined) {
			if (v.left !== undefined) {
				el.scrollLeft = v.left;
			}
			if (v.top !== undefined) {
				el.scrollTop = v.top;
			}
		}
		return { left: el.scrollLeft, top: el.scrollTop };
	}

	Element.prototype.box = function() {
		return this.el.getBoundingClientRect();
	}

	Element.prototype.parent = function() {
		return new Element(this.el.parentNode);
	}

	Element.prototype.children = function(...eles) {
		if (arguments.length === 0) {
			return this.el.childNodes;
		}
		eles.forEach(ele => this.child(ele));
		return this;
	}

	Element.prototype.removeChild = function(el) {
		this.el.removeChild(el);
	}

	Element.prototype.child = function(arg) {
		let ele = arg;
		if (typeof arg === 'string') {
			ele = document.createTextNode(arg);
		} else if (arg instanceof Element) {
			ele = arg.el;
		}
		this.el.appendChild(ele);
		return this;
	}

	Element.prototype.contains = function(ele) {
		return this.el.contains(ele);
	}

	Element.prototype.className = function(v) {
		if (v !== undefined) {
			this.el.className = v;
			return this;
		}
		return this.el.className;
	}

	Element.prototype.addClass = function(name) {
		this.el.classList.add(name);
		return this;
	}

	Element.prototype.hasClass = function(name) {
		return this.el.classList.contains(name);
	}

	Element.prototype.removeClass = function(name) {
		this.el.classList.remove(name);
		return this;
	}

	Element.prototype.toggle = function(cls = 'active') {
		return this.toggleClass(cls);
	}

	Element.prototype.toggleClass = function(name) {
		return this.el.classList.toggle(name);
	}

	Element.prototype.active = function(flag = true, cls = 'active') {
		if (flag) this.addClass(cls);
		else this.removeClass(cls);
		return this;
	}

	Element.prototype.checked = function(flag = true) {
		this.active(flag, 'checked');
		return this;
	}

	Element.prototype.disabled = function(flag = true) {
		if (flag) this.addClass('disabled');
		else this.removeClass('disabled');
		return this;
	}

	// key, value
	// key
	// {k, v}...
	Element.prototype.attr = function(key, value) {
		if (value !== undefined) {
			this.el.setAttribute(key, value);
		} else {
			if (typeof key === 'string') {
				return this.el.getAttribute(key);
			}
			Object.keys(key).forEach((k) => {
				this.el.setAttribute(k, key[k]);
			});
		}
		return this;
	}

	Element.prototype.removeAttr = function(key) {
		this.el.removeAttribute(key);
		return this;
	}

	Element.prototype.html = function(content) {
		if (content !== undefined) {
			this.el.innerHTML = content;
			return this;
		}
		return this.el.innerHTML;
	}
	
	Element.prototype.val = function(v) {
		if (v !== undefined) {
			this.el.value = v;
			return this;
		}
		return this.el.value;
	}
	
	Element.prototype.focus = function() {
		this.el.focus();
	}
	
	Element.prototype.cssRemoveKeys = function(...keys) {
		keys.forEach(k => this.el.style.removeProperty(k));
		return this;
	}
	
	// css( propertyName )
	// css( propertyName, value )
	// css( properties )
	Element.prototype.css = function(name, value) {
		if (value === undefined && typeof name !== 'string') {
			Object.keys(name).forEach((k) => {
				this.el.style[k] = name[k];
			});
			return this;
		}
		if (value !== undefined) {
			this.el.style[name] = value;
			return this;
		}
		return this.el.style[name];
	}
	
	Element.prototype.computedStyle = function() {
		return window.getComputedStyle(this.el, null);
	}
	
	Element.prototype.show = function() {
		this.css('display', 'block');
		return this;
	}
	
	Element.prototype.hide = function() {
		this.css('display', 'none');
		return this;
	}
	const h = (tag, className = '') => new Element(tag, className);
	
	window.h = h
})(window, jQuery);


// export {
//   Element,
//   h,
// };
