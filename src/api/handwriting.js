import request from '@/utils/request'
import {
	QueryExec_fob
} from '@/global/form.helper'
import {
	ZlibHelper
} from '@/global/zlibHelper'
export async function getHandwritingByPersonelId(person_id, isDecompression) {
	const list = [{
		field: 'person_id',
		type: 3,
		level: 1,
	}]
	const form = {
		person_id: person_id
	}
	const {
		data
	} = await QueryExec_fob(703, list, form);
	if (!data) {
		data = [{
			handwriting: ''
		}];
	}
	if (typeof data[0] == 'undefined') {
		data.push({
			handwriting: ''
		});
	}
	console.log(data)
	if (typeof data[0].handwriting == 'undefined') {
		data[0].handwriting = '';
	}
	if (isDecompression && data && data.length > 0) {
		let item = '';
		for (let i = 0; i < data.length; i++) {
			item = data[0];
			if (item.handwriting) {
				item.handwriting = await ZlibHelper.DeCompressInterDataAsync_fob(item.handwriting.replace(/\s/g,
					'+'));
			}

		}
	}

	console.log('getHandwritingByPersonelId', data);
	return {
		data
	}
}
