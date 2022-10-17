export async function drawByText(text, fontOptoin, sizeOption) {

	let OptoinDefault = {
		fontOptoin: {
			font: '微软雅黑',
			fontCor: '#000000',
			fontSize: '35',
			fillStyle: '#00BFFF',
		},
		sizeOption: {
			width: 80,
			isEnlarge: true
		}
	}
	let defalutSizeOption = JSON.parse(JSON.stringify(OptoinDefault))
	if (fontOptoin) {
		if (!fontOptoin.font) {
			fontOptoin.font = OptoinDefault.fontOptoin.font
		}
		if (!fontOptoin.fontCor) {
			fontOptoin.fontCor = OptoinDefault.fontOptoin.fontCor
		}
		if (!fontOptoin.fontSize) {
			fontOptoin.fontSize = OptoinDefault.fontOptoin.fontSize
		}
		if (!fontOptoin.fillStyle) {
			fontOptoin.fillStyle = OptoinDefault.fontOptoin.fillStyle
		}
	} else {
		fontOptoin = {}
		fontOptoin.font = OptoinDefault.fontOptoin.font
		fontOptoin.fontCor = OptoinDefault.fontOptoin.fontCor
		fontOptoin.fontSize = OptoinDefault.fontOptoin.fontSize
		fontOptoin.fillStyle = OptoinDefault.fontOptoin.fillStyle
	}
	if (sizeOption) {
		if (!sizeOption.width) {
			sizeOption.width = OptoinDefault.sizeOption.width
		}
		if (typeof sizeOption.isEnlarge == 'undefined') {
			sizeOption.isEnlarge = OptoinDefault.sizeOption.isEnlarge
		}
	} else {
		sizeOption = {}
		sizeOption.width = OptoinDefault.sizeOption.width
		sizeOption.isEnlarge = OptoinDefault.sizeOption.isEnlarge
	}
	// 创建画布
	let canvas = document.createElement('canvas');
	// 绘制文字环境
	let context = canvas.getContext('2d');
	// 设置字体
	context.font = fontOptoin.font;
	// 获取字体宽度
	let width = context.measureText(text).width;
	if (width < sizeOption.width && sizeOption.isEnlarge) {
		width = sizeOption.width;
	}
	// else {
	// 	width = width + 30;
	// }
	// 画布宽度
	canvas.width = width;
	// 画布高度
	canvas.height = width;
	// 填充白色
	context.fillStyle = fontOptoin.fillStyle;
	// 绘制文字之前填充白色
	context.fillRect(0, 0, canvas.width, canvas.height);
	// 设置字体
	context.font = fontOptoin.fontSize + "px " + fontOptoin.font;
	// 设置水平对齐方式
	context.textAlign = 'center';
	// 设置垂直对齐方式
	context.textBaseline = 'middle';
	// 设置字体颜色
	context.fillStyle = fontOptoin.fontCor;

	// 绘制文字(参数：要写的字，x坐标，y坐标)
	context.fillText(text, canvas.width / 2, canvas.height / 2);
	// 生成图片信息
	let dataUrl = canvasToDataURL(canvas, 'image/png')
	return dataUrl;
}

/*-----------------------------------------------------------------------*/
// canvas转dataURL：canvas对象、转换格式、图像品质
export function canvasToDataURL(canvas, format, quality) {
	return canvas.toDataURL(format || 'image/jpeg', quality || 1.0);
}
// DataURL转canvas
export function dataURLToCanvas(dataurl) {
	return new Promise((resolve, reject) => {
		let canvas = document.createElement('CANVAS');
		let ctx = canvas.getContext('2d');
		let img = new Image();
		img.onload = function() {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			resolve(canvas)
		};
		img.src = dataurl;
		img.onerror = () => reject("加载失败")
	})

}
/*-----------------------------------------------------------------------*/
// image转canvas：图片地址
export function imageToCanvas(src) {
	return new Promise((resolve, reject) => {
		let canvas = document.createElement('CANVAS');
		let ctx = canvas.getContext('2d');
		let img = new Image();
		img.src = src;
		img.onload = function() {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			resolve(canvas)
		};
		img.onerror = () => reject("加载失败")
	})
}
// canvas转image
export function canvasToImage(canvas) {
	let img = new Image();
	img.src = canvas.toDataURL('image/jpeg', 1.0);
	return img;
}
/*-----------------------------------------------------------------------*/
// File/Blob对象转DataURL
export function fileOrBlobToDataURL(obj) {
	return new Promise((resolve, reject) => {
		let a = new FileReader();
		a.readAsDataURL(obj);
		a.onload = function(e) {
			resolve(e.target.result)
		};
		img.onerror = () => reject("加载失败")
	})

}
// DataURL转Blob对象
export function dataURLToBlob(dataurl) {
	let arr = dataurl.split(',');
	let mime = arr[0].match(/:(.*?);/)[1];
	let bstr = atob(arr[1]);
	let n = bstr.length;
	let u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {
		type: mime
	});
}
/*-----------------------------------------------------------------------*/
// Blob转image
export async function blobToImage(blob) {
	let dataurl = await fileOrBlobToDataURL(blob);
	let img = new Image();
	img.src = dataurl;
	return img;
}
// image转Blob
export async function imageToBlob(src, cb) {
	let canvas = await imageToCanvas(src);
	return await dataURLToBlob(canvasToDataURL(canvas))
}
/*-----------------------------------------------------------------------*/
// Blob转canvas
export async function BlobToCanvas(blob, cb) {
	let dataurl = await fileOrBlobToDataURL(blob);
	return await dataURLToCanvas(dataurl)
}
// canvas转Blob
export async function canvasToBlob(canvas, cb) {
	return await dataURLToBlob(canvasToDataURL(canvas))
}
/*-----------------------------------------------------------------------*/
// image转dataURL
export async function imageToDataURL(src, cb) {
	let canvas = await imageToCanvas(src);
	return canvasToDataURL(canvas)
}
// dataURL转image，这个不需要转，直接给了src就能用
export function dataURLToImage(dataurl) {
	var img = new Image();
	img.src = d;
	return img;
}
/*-----------------------------------------------------------------------*/

export default {

}
