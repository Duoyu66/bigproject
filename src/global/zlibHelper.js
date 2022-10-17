import {
	sataic_variable
} from '../global/sataic_variable.vue'
// const pako = require('pako');
// const base64js = require('base64-js')
const ROWSPLIT_vob = sataic_variable.ROWSPLIT_vob
const UNITSPLIT_vob = sataic_variable.UNITSPLIT_vob
const SECUNITSPLIT_vob = sataic_variable.SECUNITSPLIT_vob
const TableType = sataic_variable.TableType
const AffectRows = sataic_variable.AffectRows
const AffectDatas = sataic_variable.AffectDatas
//var fs = require('fs');
//var Zlib = require('zlib')
export function getZlib() {
	return new Promise((resolve, reject) => {
		try {
			let index = setInterval(() => {
				if (Zlib) {
					clearInterval(index)
					resolve(Zlib)
				}
			})
		} catch (e) {
			console.log(e)
			reject(false)
		}
	})
}

export var base64_arraybuffer_fob = {
	base64_encode: function(arraybuffer) {
		var chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
		var bytes = new Uint8Array(arraybuffer),
			i,
			len_vob = bytes.length,
			base64 = ''

		for (i = 0; i < len_vob; i += 3) {
			base64 += chars[bytes[i] >> 2]
			base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)]
			base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)]
			base64 += chars[bytes[i + 2] & 63]
		}

		if (len_vob % 3 === 2) {
			base64 = base64.substring(0, base64.length - 1) + '='
		} else if (len_vob % 3 === 1) {
			base64 = base64.substring(0, base64.length - 2) + '=='
		}
		return base64
	},

	base64_decode: function(base64) {
		var chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
		var lookup = new Uint8Array(256)
		for (var i = 0; i < chars.length; i++) {
			lookup[chars.charCodeAt(i)] = i
		}
		var bufferLength = base64.length * 0.75,
			len_vob = base64.length,
			i,
			p = 0,
			encoded1,
			encoded2,
			encoded3,
			encoded4

		if (base64[base64.length - 1] === '=') {
			bufferLength--
			if (base64[base64.length - 2] === '=') {
				bufferLength--
			}
		}
		// var arraybuffer = new ArrayBuffer(bufferLength),
		var bytes = new Uint8Array(bufferLength)

		for (i = 0; i < len_vob; i += 4) {
			encoded1 = lookup[base64.charCodeAt(i)]
			encoded2 = lookup[base64.charCodeAt(i + 1)]
			encoded3 = lookup[base64.charCodeAt(i + 2)]
			encoded4 = lookup[base64.charCodeAt(i + 3)]

			bytes[p++] = (encoded1 << 2) | (encoded2 >> 4)
			bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
			bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
		}
		return bytes
	},
}
export var ZlibHelper = {
	Encrbytes2StringExAsync_fob: async function(arr_vob) {
		let Zlib_inside = await getZlib()
		var Inflate_vob = new Zlib_inside.Inflate(arr_vob)
		var plain_vob = Inflate_vob.decompress()
		//数组转string
		var res_vob = UTF8UnsignedBytesToString_fob(plain_vob)
		return res_vob
	},
	Encrbytes2StringEx_fob: function(arr_vob) {
		var Inflate_vob = new Zlib.Inflate(arr_vob)
		var plain_vob = Inflate_vob.decompress()
		//数组转string
		var res_vob = UTF8UnsignedBytesToString_fob(plain_vob)
		return res_vob
	},
	String2EncrbytesBase64Async_fob: async function(str_vob) {
		let Zlib_inside = await getZlib()
		var utf8arr = ZlibHelper.Utf8StringToByte_fob(str_vob)
		var deflate_vob = new Zlib_inside.Deflate(utf8arr)
		var compressed_vob = deflate_vob.compress()
		return base64_arraybuffer_fob.base64_encode(compressed_vob)
	},
	String2EncrbytesBase64_fob: function(str_vob) {
		var utf8arr = ZlibHelper.Utf8StringToByte_fob(str_vob)
		var deflate_vob = new Zlib.Deflate(utf8arr)
		var compressed_vob = deflate_vob.compress()
		return base64_arraybuffer_fob.base64_encode(compressed_vob)
	},
	UTF8UnsignedBytesToString_fob: function(ubArr) {
		var index_vob,
			temp_vob = 0,
			unicode_vob = 0
		var matchs_vob = [0x00, 0xc0, 0xe0]
		var sTarget_vob = '',
			sResult_vob
		//0x7f	0x1f  0xf
		for (index_vob = 0; index_vob < ubArr.length;) {
			temp_vob = ubArr[index_vob]
			temp_vob = temp_vob & 0xff
			if (temp_vob - (temp_vob & 0x7f) === matchs_vob[0]) {
				unicode_vob = temp_vob
				index_vob++
			} else if (temp_vob - (temp_vob & 0x1f) === matchs_vob[1]) {
				unicode_vob =
					((ubArr[index_vob] & 0x1f) << 6) | (ubArr[index_vob + 1] & 0x3f)
				index_vob += 2
			} else if (temp_vob - (temp_vob & 0x0f) === matchs_vob[2]) {
				unicode_vob =
					((ubArr[index_vob] & 0x0f) << 12) |
					((ubArr[index_vob + 1] & 0x3f) << 6) |
					(ubArr[index_vob + 2] & 0x3f)
				index_vob += 3
			}
			sTarget_vob += String.fromCharCode(unicode_vob)
		}
		sResult_vob = sTarget_vob
		return sResult_vob
	},
	stringToBytes_fob: function(str_vob) {
		var ch,
			st,
			re = []
		for (var i = 0; i < str_vob.length; i++) {
			ch = str_vob.charCodeAt(i) // get char
			st = [] // set up "stack"
			do {
				st.push(ch & 0xff) // push byte to stack
				ch = ch >> 8 // shift value down by 1 byte
			} while (ch)
			// add stack contents to result
			// done because chars have "wrong" endianness
			re = re.concat(st.reverse())
		}
		// return an array of bytes
		return re
	},
	Utf8StringToByte_fob: function(str) {
		var bytes = new Array()
		var len, c
		len = str.length
		for (var i = 0; i < len; i++) {
			c = str.charCodeAt(i)
			if (c >= 0x010000 && c <= 0x10ffff) {
				bytes.push(((c >> 18) & 0x07) | 0xf0)
				bytes.push(((c >> 12) & 0x3f) | 0x80)
				bytes.push(((c >> 6) & 0x3f) | 0x80)
				bytes.push((c & 0x3f) | 0x80)
			} else if (c >= 0x000800 && c <= 0x00ffff) {
				bytes.push(((c >> 12) & 0x0f) | 0xe0)
				bytes.push(((c >> 6) & 0x3f) | 0x80)
				bytes.push((c & 0x3f) | 0x80)
			} else if (c >= 0x000080 && c <= 0x0007ff) {
				bytes.push(((c >> 6) & 0x1f) | 0xc0)
				bytes.push((c & 0x3f) | 0x80)
			} else {
				bytes.push(c & 0xff)
			}
		}
		return bytes
	},
	byteToUtf8String_fob: function(arr) {
		if (typeof arr === 'string') {
			return arr
		}
		var str = '',
			_arr = arr
		for (var i = 0; i < _arr.length; i++) {
			var one = _arr[i].toString(2),
				v = one.match(/^1+?(?=0)/)
			if (v && one.length == 8) {
				var bytesLength = v[0].length
				var store = _arr[i].toString(2).slice(7 - bytesLength)
				for (var st = 1; st < bytesLength; st++) {
					store += _arr[st + i].toString(2).slice(2)
				}
				str += String.fromCharCode(parseInt(store, 2))
				i += bytesLength - 1
			} else {
				str += String.fromCharCode(_arr[i])
			}
		}
		return str
	},
	CombineTableJsonAysnc_fob: async function(res_vob) {
		if (res_vob == '') {
			return {}
		}
		let Zlib_inside = await getZlib()

		var decoder = base64_arraybuffer_fob.base64_decode(res_vob)
		var Inflate_vob = new Zlib_inside.Inflate(decoder)
		var plain_vob = Inflate_vob.decompress()
		// let decoder = base64js.toByteArray(res_vob);

		// let plain_vob = '';
		// if (decoder.length > 8000) {
		// 	let splitNum = 200;
		// 	for (let i = 0;
		// 		(i + 1) * 200 < decoder.length; i++) {
		// 		var inflate = new pako.Inflate();
		// 		if ((i + 1) * 200 < decoder.length) {
		// 			inflate.push(decoder.subarray(i * 200, (i + 1) * 200), false);
		// 		} else {
		// 			inflate.push(decoder.subarray(i * 200), true);
		// 		}

		// 	}
		// 	if (inflate.err) {
		// 		console.log(inflate.err);
		// 	}
		// 	plain_vob = inflate.result
		// 	console.log(plain_vob)
		// } else {
		// 	plain_vob = pako.inflate(decoder);
		// }
		//console.log('CombineTableJsonAysnc_fob', decoder)
		//数组转string
		res_vob = ZlibHelper.UTF8UnsignedBytesToString_fob(plain_vob)
		var arrRows_vob = res_vob.split(ROWSPLIT_vob)
		var obj = {}
		obj.code = 200;
		(obj.msg = 'success'), (obj.total = 0)
		obj.totalCount = 0
		obj.data = new Array()
		var arrFields_vob = arrRows_vob[0].split(UNITSPLIT_vob)
		var b = false
		for (var i_vob = 1; i_vob < arrRows_vob.length; i_vob++) {
			if (arrRows_vob[i_vob] == '') {
				continue
			}
			var arrUnits_vob = arrRows_vob[i_vob].split(UNITSPLIT_vob)
			var o = {}
			for (var j_vob = 0; j_vob < arrFields_vob.length; j_vob++) {
				o[arrFields_vob[j_vob]] = arrUnits_vob[j_vob]
			}
			b = true
			obj.totalCount = Number(arrUnits_vob[0]) //ToTal
			obj.data.push(o)
			obj.total = obj.totalCount
		}
		if (!b) {
			obj.code = -1
			obj.msg = '数据为空'
		}
		//console.log(obj);
		return obj
	},
	CombineTableJson_fob: function(res_vob) {
		if (res_vob == '') {
			return {}
		}
		var decoder = base64_arraybuffer_fob.base64_decode(res_vob)
		var Inflate_vob = new Zlib.Inflate(decoder)
		var plain_vob = Inflate_vob.decompress()
		//数组转string
		res_vob = ZlibHelper.UTF8UnsignedBytesToString_fob(plain_vob)
		var arrRows_vob = res_vob.split(ROWSPLIT_vob)
		var obj = {}
		obj.code = 200;
		(obj.msg = 'success'), (obj.total = 0)
		obj.totalCount = 0
		obj.data = new Array()
		var arrFields_vob = arrRows_vob[0].split(UNITSPLIT_vob)
		var b = false
		for (var i_vob = 1; i_vob < arrRows_vob.length; i_vob++) {
			if (arrRows_vob[i_vob] == '') {
				continue
			}
			var arrUnits_vob = arrRows_vob[i_vob].split(UNITSPLIT_vob)
			var o = {}
			for (var j_vob = 0; j_vob < arrFields_vob.length; j_vob++) {
				o[arrFields_vob[j_vob]] = arrUnits_vob[j_vob]
			}
			b = true
			obj.totalCount = Number(arrUnits_vob[0]) //ToTal
			obj.data.push(o)
			obj.total = obj.totalCount
		}
		if (!b) {
			obj.code = -1
			obj.msg = '数据为空'
		}
		//console.log(obj);
		return obj
	},
	DeCompressInterDataAsync_fob: async function(res_vob) {
		if (res_vob == '') {
			return {}
		}
		let Zlib_inside = await getZlib()
		var decoder = base64_arraybuffer_fob.base64_decode(res_vob)
		var Inflate_vob = new Zlib_inside.Inflate(decoder)
		var plain_vob = Inflate_vob.decompress()
		//数组转string
		res_vob = ZlibHelper.UTF8UnsignedBytesToString_fob(plain_vob)
		return res_vob
	},
	DeCompressInterData_fob: function(res_vob) {
		if (res_vob == '') {
			return {}
		}
		var decoder = base64_arraybuffer_fob.base64_decode(res_vob)
		var Inflate_vob = new Zlib.Inflate(decoder)
		var plain_vob = Inflate_vob.decompress()
		//数组转string
		res_vob = ZlibHelper.UTF8UnsignedBytesToString_fob(plain_vob)
		return res_vob
	},
}

export default {
	ZlibHelper,
	base64_arraybuffer_fob,
}
