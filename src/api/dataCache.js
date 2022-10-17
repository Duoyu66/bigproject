import request from '@/utils/request'
import {
	ZlibHelper
} from '@/global/zlibHelper'

export async function getTestCacheData(data) {
	const getData = await request({
		url: '/api/Dictionary/DictionaryDownload',
		method: 'get',
		params: {
			sData: data
		}
	})
	// const res = ZlibHelper.CombineTableJson_fob(getData)
	return getData
}

export async function getTestTemplateData(data) {
	const getData = await request({
		url: '/api/Dictionary/DataTemplateDownload',
		method: 'get',
		params: {
			sData: data
		}
	})
	// const res = ZlibHelper.CombineTableJson_fob(getData)
	return getData
}



export async function ExecTestCacheData(data) {
	const getData = await request({
		url: '/api/Dictionary/DictionaryUpload',
		method: 'post',
		data: {
			sData: data
		}
	})
	// const res = ZlibHelper.CombineTableJson_fob(getData)
	return getData
}

export async function ExecImportUpload(data) {
	const getData = await request({
		url: '/api/Dictionary/DataImportUpload',
		method: 'post',
		data: {
			sData: data
		}
	})
	// const res = ZlibHelper.CombineTableJson_fob(getData)
	return getData
}
