import basehelper from '@/global/base.helper'
import {
	storage,
	tokenTableName
} from '@/config'
import { getItem, setItem } from '@/utils/storage'
import cryptoJs from 'crypto-js'

export const DESHelper = {
	//DES ECB模式加密
	EncryptByDESModeEBC_fob: function(message) {
		let access_token = getItem(tokenTableName)
		var key = access_token.substring(access_token.length - 32)
		var keyHex = cryptoJs.enc.Utf8.parse(key)
		var encrypted = cryptoJs.DES.encrypt(message, keyHex, {
			mode: cryptoJs.mode.ECB,
			padding: cryptoJs.pad.Pkcs7,
		})
		return encrypted.ciphertext.toString()
	},
	//DES ECB模式解密
	DecryptByDESModeEBC_fob: function(ciphertext) {
		let access_token = getItem(tokenTableName)
		var key = access_token.substring(access_token.length - 32)
		var keyHex = cryptoJs.enc.Utf8.parse(key)
		var decrypted = cryptoJs.DES.decrypt({
				ciphertext: cryptoJs.enc.Hex.parse(ciphertext),
			},
			keyHex, {
				mode: cryptoJs.mode.ECB,
				padding: cryptoJs.pad.Pkcs7,
			}
		)
		var result_value = decrypted.toString(cryptoJs.enc.Utf8)
		return result_value
	}
}
export default {
	DESHelper,
}
