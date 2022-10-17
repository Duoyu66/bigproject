import {
	ViewfileUrl,
	UploadFileNameUrl,
	ViewfileUrlEx,
	UploadfileUrl,
	GetSuffix
} from '@/utils/servicefile'
import {
	openDownloadProxy,
	GetHost
} from '@/utils/downLoad'
export function fileDetail(fileType, src, fileName) {
	let prefix = ''
	if (!src.startsWith('http') && fileType) {
		prefix = ViewfileUrlEx(fileType)
	}
	src = prefix + src
	const suffix = GetSuffix(prefix + src)
	if (fileName) {
		fileName = fileName.replace(suffix, '') + '.' + suffix
	}
	let file = {
		src: src,
		name: fileName
	}
	return file
}
export function FileDownLoad(fileType, src, fileName) {
	let prefix = ''
	if (!src.startsWith('http') && fileType) {
		prefix = ViewfileUrlEx(fileType)
	}
	let fileRsc = prefix + src
	const suffix = GetSuffix(fileRsc)
	if (fileName) {
		fileName = fileName.replace(suffix, '') + '.' + suffix
	}
	openDownloadProxy(
		fileRsc, //.replace(baseURL, GetHost() + '/webapi'),
		fileName
	)
}
export default {

}
