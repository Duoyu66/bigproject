function loadScript(url, callback) {
	try {
		let head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
		let xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
					const blob = new Blob([xhr.response]);
					const csvUrl = URL.createObjectURL(blob);
					let script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = csvUrl;
					//script.text = xhr.responseText;
					head.insertBefore(script, head.firstChild);
					if (callback) {
						xhr = null;
						callback(true);
					}
				} else if (callback) {
					xhr = null;
					callback(false);
				}
			}
		};
		xhr.send(null);
	} catch (e) {
		console.log('error=======', e)
	}
}
const js_requrie = {
	// "axios": {
	// 	"list": [
	// 		"https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js",
	// 		"./static/lib/axios/axios.min.js"
	// 	],
	// 	"status": false,
	// },
	"jquery": {
		"list": [
			"https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js",
			"./static/lib/jquery/jquery.min.js"
		],
		"status": false,
	},
	// "zlib": {
	// 	"list": [
	// 		"./static/lib/zlib/zlib.min.js"
	// 	],
	// 	"status": false,
	// },
	// "inflate": {
	// 	"list": [
	// 		"./static/lib/zlib/inflate.min.js"
	// 	],
	// 	"status": false,
	// },
	// "deflate": {
	// 	"list": [
	// 		"./static/lib/zlib/deflate.min.js"
	// 	],
	// 	"status": false,
	// },
	// "inflate_stream": {
	// 	"list": [
	// 		"./static/lib/zlib/inflate_stream.min.js"
	// 	],
	// 	"status": false,
	// },
	// "crypto": {
	// 	"list": [
	// 		"https://cdn.bootcss.com/crypto-js/3.1.9/crypto-js.min.js",
	// 		"./static/lib/crypto/crypto-js.js"
	// 	],
	// 	"status": false,
	// },
	// "luckysheet_plugins": {
	// 	"list": [
	// 		"./static/lib/luckysheet/plugins/js/plugin.js"
	// 	],
	// 	"status": false,
	// },
	// "luckysheet_umd": {
	// 	"list": [
	// 		"./static/lib/luckysheet/luckysheet.umd.js"
	// 	],
	// 	"status": false,
	// }
}

function onload_js() {
	let value = '';
	let list = '';
	let length = '';
	for (let key in js_requrie) {
		try {
			value = js_requrie[key];
			if (value && value.list) {
				try {
					list = value.list;
					length = value.list.length;
					if (length > 0 && list[0]) {
						function load(list, i, value) {
							try {
								loadScript(list[i], function(status) {
									if (status) {
										value.status = true;
										if (value.children && value.children.list) {
											if (value.children.list.length > 0 && value.children.list[0]) {
												load(value.children.list, 0, value.children);
											}
										}
									} else if (i < list.length - 1) {
										load(list, i + 1, value);
									} else {
										value.status = true;
									}
								})

							} catch (e) {
								console.log(e);
							}

						}
						load(list, 0, value);
					}
				} catch (e) {
					console.log(e)
				}
			}
		} catch (e) {
			console.log(e)
		}

	}
}
onload_js();


function onload_status() {
	let flag = true
	for (let key in js_requrie) {
		if (!js_requrie[key].status) {
			flag = false;
			break;
		}
	}
	return flag;
}
//参数n为休眠时间，单位为毫秒:
function sleep(n) {
	let start = new Date().getTime();
	console.log('休眠前：' + start);
	while (true) {
		if (new Date().getTime() - start > n) {
			break;
		}
	}
	// console.log('休眠后：' + new Date().getTime());
}

function finish() {
	let i = 0;
	while (true) {
		sleep(1000);
		let i = 0;
		while (i++ < 1000) {
			if (i % 100 == 0) {
				if (onload_status()) {
					break
				}
			}
		}

		console.log(onload_status());

	}

	const index = setInterval(function() {
		if (onload_status()) {
			clearInterval(index)
			return true;
		}
	})

}
