// const FileReaderPromise = require('file-reader-promise');
//图片尺寸
// export async function readSize(file) {

// 	const test = await FileReaderPromise.readAsText(file)
// 	return new Promise(resolve => {
// 		const img = new Image();
// 		img.src = test;
// 		img.onload = function() {
// 			resolve([this.height, this.width])
// 		};
// 	})
// }
export async function readSizeEx(file) {

	return new Promise(resolve => {
		if (file.type.indexOf('image') < 0) {
			resolve([-1, -1])
			return
		}
		const reader = new FileReader();

		// reader.onload = function() {
		// 	if (reader.readyState == 2) {
		// 		const img = new Image();
		// 		img.src = reader.result;
		// 		img.onload = function() {
		// 			resolve([this.height, this.width])
		// 		};
		// 	}
		// };
		console.log(reader)
		// reader.onabort = function() {
		// 	resolve([-1, -1])
		// }
		// reader.error = function() {
		// 	resolve([-1, -1])
		// }
		reader.onloadend = function() {
			try {
				//console.log("加载结束", reader.readyState, reader.result)
				if (reader.readyState == 2) {
					const img = new Image();
					img.src = reader.result;
					img.onload = function() {
						resolve([this.height, this.width])
					};
					img.onerror = function() {
						//console.log("加载失败")
						resolve([-1, -1])
					}
				}
			} catch (e) {
				resolve([-1, -1])
			}

		}
		reader.readAsDataURL(file);
	})
}
export default {

}
