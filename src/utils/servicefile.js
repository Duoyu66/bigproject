import {
	sataic_variable,
} from '@/global/sataic_variable.vue'
import {
	baseURL
} from '@/config'
const list = [
	'ReportImageUrl',
	'RoomImageUrl',
	'WitnessImageUrl',
	'CertImageUrl',
	'DeviceImageUrl',
	'DeviceCertImageUrl',
	'ReportExImagePath',
	'RisksFilesUrl',
	'TechManageFileUrl',
	'SiteTestFileUrl',
	'FirstCheckFileUrl',
	'AcceptFileUrl',
	'ContractFileUrl',
	'SiteTestWaveDataFileUrl',
	'AssignPicFileUrl',
	'EducationFileUrl',
	'TensionFileUrl',
	'HangingplateFilePath',
	'ReceiptImagePathUrl',
	'PurchaseContractFilePathUrl',
	'TestContractFilePathUrl',
	'TempFilePathUrl',
	'geophysicalProspectingPathUrl'
]
const list_view = [
	'ReportImage',
	'RoomImage',
	'WitnessImage',
	'CertImage',
	'DeviceImage',
	'DeviceCertImage',
	'ReportExImage',
	'RisksFiles',
	'TechManageFile',
	'SiteTestFile',
	'FirstCheckFile',
	'AcceptFile',
	'ContractFile',
	'SiteTestWaveDataFile',
	'AssignPicFile',
	'EducationFile',
	'TensionFile',
	'HangingplateFile',
	'ReceiptImagePath',
	'PurchaseContractFilePath',
	'TestContractFilePath',
	'TempFile',
	'geophysicalProspecting'
]
export const fileType = {
	zip: {
		name: 'zip',
		rawType: 'application/x-zip-compressed',
	},
	rar: {
		name: 'rar',
		rawType: 'application/x-rar-compressed'
	},
	jpeg: {
		name: 'jpeg',
		rawType: 'image/jpeg',
	},
	jpg: {
		name: 'jpg',
		rawType: 'image/jpeg',
	},
	png: {
		name: 'png',
		rawType: 'image/png',
	},
	pdf: {
		name: 'pdf',
		rawType: 'application/pdf',
	},
	docx: {
		name: 'docx',
		rawType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	},
	doc: {
		name: 'doc',
		rawType: 'application/msword',
	},
	xlsx: {
		name: 'xlsx',
		rawType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	},
	xls: {
		name: 'xls',
		rawType: 'application/vnd.ms-excel',
	},
	ppt: {
		name: 'ppt',
		rawType: 'application/vnd.ms-powerpoint',
	}
}
export function GetPdfSuffix() {
	let pdf = fileType.pdf.name;
	return pdf;
}
export function GetCompressSuffix() {
	let zip = fileType.zip.name;
	let rar = fileType.rar.name;
	let split = '/';
	let temp = zip + split + rar;
	return temp;
}
export function GetImgSuffix() {
	let jpg = fileType.jpg.name;
	let jpeg = fileType.jpeg.name;
	let png = fileType.png.name;
	let split = '/';
	let temp = jpg + split + jpeg + split + png;
	return temp;
}
export function GetWordSuffix() {
	let docx = fileType.docx.name;
	let doc = fileType.doc.name;
	let split = '/';
	let temp = docx + split + doc;
	return temp;
}
export function GetExcelSuffix() {
	let xlsx = fileType.xlsx.name;
	let xls = fileType.xls.name;
	let split = '/';
	let temp = xlsx + split + xls;
	return temp;
}
export function GetPptSuffix() {
	let ppt = fileType.ppt.name;
	let split = '/';
	let temp = ppt;
	return temp;
}
export function GetOfficeSuffix() {
	let word = GetWordSuffix();
	let excel = GetExcelSuffix();
	let ppt = GetPptSuffix();
	let split = '/';
	let temp = word + split + excel + split + ppt;
	return temp;
}
export function GetImgAndWordAndCompressSuffix() {
	let img = GetImgSuffix();
	let word = GetWordSuffix();
	let zip = GetCompressSuffix();
	let split = '/';
	let temp = img + split + zip + split + word;
	return temp;
}
export function GetImgAndWordAndCompressAndPdfSuffix() {
	let img = GetImgSuffix();
	let word = GetWordSuffix();
	let zip = GetCompressSuffix();
	let pdf = GetPdfSuffix();
	let split = '/';
	let temp = img + split + word + split + zip + split + pdf;
	return temp;
}
export function GetPdfType() {
	let arr = [fileType.pdf.rawType];
	return arr;
}
export function GetImgType() {
	let arr = [fileType.jpg.rawType, fileType.png.rawType];
	return arr;
}
export function GetWordType() {
	let arr = [fileType.doc.rawType, fileType.docx.rawType];
	return arr;
}
export function GetExcelType() {
	let arr = [fileType.xls.rawType, fileType.xlsx.rawType];
	return arr;
}
export function GetPptType() {
	let arr = [fileType.ppt.rawType];
	return arr;
}
export function GetOfficeType() {
	let arr = [...GetWordType(), ...GetExcelType(), ...GetPptType()];
	return arr;
}
export function GetCompressType() {
	let arr = [fileType.zip.rawType, fileType.rar.rawType];
	return arr;
}
export function GetImgAndWordAndCompressType() {
	let arr = [...GetImgType(), ...GetCompressType(), ...GetWordType()];
	return arr;
}
export function GetImgAndWordAndCompressAndPdfType() {
	let arr = [...GetImgType(), ...GetCompressType(), ...GetWordType(), ...GetPdfType()];
	return arr;
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
export function UploadfileUrl(type) {
	try {
		type = Number(type)
		if (type >= 0 && type < list.length) {
			return sataic_variable.gtConfig_fob[list[type]]
			//this.action = this.action + type
		} else {
			console.log('输入类型错误')
			return ''

		}
	} catch (e) {
		console.log(e)
		return ''
	}
}
//返回原始地址
export function ViewfileUrl(type) {
	try {
		type = Number(type)
		if (type >= 0 && type < list.length) {
			return sataic_variable.BaseUrl + '/' + list_view[type]
		}
		return ''
	} catch (e) {
		console.log(e)
		return ''
	}
}
//返回本地代理地址
//vue.config.js devServer proxy
export function ViewfileUrlEx(type) {
	try {
		type = Number(type)
		if (type >= 0 && type < list.length) {
			let temp = sataic_variable.BaseUrl + '/' + list_view[type];
			temp = temp.replace(baseURL, '/webapi')
			return temp;
		}
		return ''
	} catch (e) {
		console.log(e)
		return ''
	}
}
export default {

}
