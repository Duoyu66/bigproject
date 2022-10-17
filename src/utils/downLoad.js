import axios from 'axios'
import {
	baseURL
} from '@/config'

export function GetHost() {
	let host = window.location.host;
	if (host.indexOf('http') < 0) {
		host = window.location.protocol + '//' + host
	}
	return host
}
export function GetShowFileType(file) {
	let file_name_array = []
	if (file.name) {
		file_name_array = file.name.split('.')
	} else {
		file_name_array = file.src.split('.')
	}
	const suffix = file_name_array[file_name_array.length - 1]
		.trim()
		.toLocaleLowerCase();
	let fileType = '';
	switch (suffix) {
		case 'jpeg':
		case 'jpg':
		case 'png':
		case 'webp':
		case 'gif':
		case 'bmp':
			fileType = 'pic';
			break
		case 'pdf':
			fileType = 'pdf';
			break
		default:
			//fileType = 'error'
			fileType = '';
			break
	}
	return fileType;
}
export function GetSuffix(src) {
	try {
		const list = src.split('.')
		if (list.length > 0) {
			return list[list.length - 1]
		}
		return ''
	} catch (e) {
		console.log(e)
		return ''
	}
}
export function UpdateSaveNameSuffix(src, saveName) {
	try {
		const list = saveName.split('.');
		const sSuffix = GetSuffix(src);
		let fileName = '';
		if (list.length > 0) {
			if (list.length == 1) {
				fileName = list[0];
			} else {
				for (let i = 0; i <= list.length - 2; i++) {
					fileName = fileName + list[i];
				}
			}

		}
		return fileName + '.' + sSuffix;
	} catch (e) {
		console.log(e)
		return saveName
	}
}
export function openDownloadProxy(url, saveName) {
	let host = GetHost();
	saveName = UpdateSaveNameSuffix(url, saveName);
	if (url.indexOf(host) < 0 && url.indexOf('http') >= 0) {
		url = url.replace(baseURL, host + '/webapi')
	}
	openDownload(url, saveName);
}
//跨域将发生页面跳转,将获取blob然后下载
export function openDownload(url, saveName) {
	console.log(url, saveName);
	let host = GetHost()
	let nType = 0;
	if (url.indexOf('blob:') >= 0) {
		nType = 0;
	} else if (url.indexOf(host) < 0 && url.indexOf('http') >= 0) {
		nType = 1;
	} else if (url.indexOf(host) >= 0 || url.indexOf('http') < 0) {
		nType = 0;
	}
	switch (nType) {
		case 1:
			console.log('blob')
			axios({
				url: url,
				method: 'get',
				responseType: 'blob',
			}).then((res) => {
				const blob = new Blob([res.data])
				const link = document.createElement('a')
				link.download = saveName || '';
				link.style.display = 'none'
				link.href = URL.createObjectURL(blob)
				document.body.appendChild(link)
				link.click()
				URL.revokeObjectURL(link.href)
				document.body.removeChild(link)
			})
			break;
		case 0:
		default:
			console.log('http')
			if (typeof url == 'object' && url instanceof Blob) {
				url = URL.createObjectURL(url); // 创建blob地址
			}
			var aLink = document.createElement('a');
			aLink.href = url;
			aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
			var event;
			if (window.MouseEvent) event = new MouseEvent('click');
			else {
				event = document.createEvent('MouseEvents');
				event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			}
			aLink.dispatchEvent(event);
			break;
	}


}
export function base64Download(content, fileName) { //下载base64图片
	var base64ToBlob = function(code) {
		let parts = code.split(';base64,');
		let contentType = parts[0].split(':')[1];
		let raw = window.atob(parts[1]);
		let rawLength = raw.length;
		let uInt8Array = new Uint8Array(rawLength);
		for (let i = 0; i < rawLength; ++i) {
			uInt8Array[i] = raw.charCodeAt(i);
		}
		return new Blob([uInt8Array], {
			type: contentType
		});
	};
	let aLink = document.createElement('a');
	let blob = base64ToBlob(content); //new Blob([content]);
	let evt = document.createEvent("HTMLEvents");
	evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
	aLink.download = fileName;
	aLink.href = URL.createObjectURL(blob);
	aLink.click();
};
export default {

}
