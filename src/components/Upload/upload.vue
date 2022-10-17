<template>
	<div>
		<el-upload ref="upload" class="upload-demo" :action="action" :on-preview="handlePreview"
			:on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :headers="headers"
			:limit="number_limit" :multiple="number_multiple" :on-change="onChange" :on-error="onError"
			:on-success="onSuccess" :list-type="only_show ? 'text' : listtype" :disabled="only_show">
			<el-button v-if="!only_show && listtype != 'picture-card'" slot="trigger" size="small" type="primary"
				:disabled="disabled_upload">
				选择
				<i class="el-icon-tickets"></i>
			</el-button>
			<i v-else-if="!only_show" class="el-icon-plus"></i>

			<el-tooltip class="item" effect="dark" content="预览上传文件" placement="top-start">
				<el-button v-show="service_retain.length > 0" style="margin-left: 10px" size="small" type="success"
					@click="preview_upload">
					<i class="el-icon-view"></i>
				</el-button>
			</el-tooltip>
			<el-tooltip class="item" effect="dark" content="下载文件" placement="top-start">
				<el-button v-show="service_retain.length > 0" type="info" @click="downFile">
					<i class="el-icon-download"></i>
				</el-button>
			</el-tooltip>
			<el-tooltip class="item" effect="dark" content="无文件查看" placement="top-start">
				<el-button v-show="only_show && service_retain.length <= 0" style="margin-left: 10px" size="small"
					type="success" :disabled="true">
					无文件查看
				</el-button>
			</el-tooltip>
			<div v-if="tip_show" slot="tip" class="el-upload__tip">
				只能上传{{ this.type_str }}文件，且不超过{{this.file_size + this.size_unit}}
			</div>
		</el-upload>
		<preview ref="preview"></preview>
	</div>
</template>

<script>
	/*
	暂时只支持上传一个文件
	*/
	import {
		baseURL
	} from '@/config'
	import {
		sataic_variable
	} from '@/global/sataic_variable.vue'
	import {
		getAccessToken
	} from '@/utils/accessToken'
	import {
		readSize,
		readSizeEx
	} from '@/utils/image'
	import {
		doDelete
	} from '@/api/file'
	import preview from '@/components/fileAbout/preview'
	import {
		ViewfileUrl,
		ViewfileUrlEx,
		UploadfileUrl,
		fileType
	} from '@/utils/servicefile'
	import {
		openDownloadProxy,
		GetHost,
		GetShowFileType
	} from '@/utils/downLoad'
	export default {
		name: 'Update',
		components: {
			preview,
		},
		model: {
			prop: 'value',
			event: 'on-change',
		},
		props: {
			//.sync同步
			value: {
				type: String,
				default: '',
				//required: true,
			},
			old_delete: {
				type: Boolean,
				default: false,
			},
			only_show: {
				type: Boolean,
				default: false,
			},
			disabled_upload: {
				type: Boolean,
				default: false,
			},
			//上传文件类型
			upload_type: {
				type: Number,
				default: -1,
			},
			//文件原始名称
			original_name: {
				type: Object,
				default: function() {
					return {}
				},
			},
			//文件类型提示字符串
			type_str: {
				type: String,
				default: 'jpeg',
			},
			//文件类型数字
			type_array: {
				type: Array,
				default: function() {
					return ['image/jpeg']
				},
			},
			//文件大小
			file_size: {
				type: Number,
				default: 256,
			},
			//文件大小单位
			size_unit: {
				type: String,
				default: 'MB',
			},
			//上传文件限制
			number_limit: {
				type: Number,
				default: 1,
			},
			//是否上传多个文件
			number_multiple: {
				type: Boolean,
				default: false,
			},
			//['目录/文件名','目录/文件名']
			// serve_url_str_list: {
			// 	type: Array,
			// 	default: function() {
			// 		return []
			// 	}
			// },
			//{'目录/文件名':{	relativeUrl: newkey,absoluteUrl: prefix + newkey,file_name: response.files[key]}}
			serve_url_list: {
				type: Object,
				default: function() {
					return {}
				},
			},
			//错误信息
			err_tips: {
				type: String,
				default: '',
			},
			//是否成功
			success_status: {
				type: Boolean,
				default: false,
			},
			//文件列表类型
			listtype: {
				type: String,
				default: 'text',
			},
			//是否显示tips
			tip_show: {
				type: Boolean,
				default: true,
			},
			delte_service: {
				type: Boolean,
				default: false,
			},
			img_max_height: {
				type: Number,
				default: -1,
			},
			img_max_width: {
				type: Number,
				default: -1,
			},
			img_height: {
				type: Number,
				default: 128,
			},
			img_width: {
				type: Number,
				default: 128,
			},
			fileName: {
				type: Array,
				default: function() {
					return []
				},
			},
			downLoad_Fn: {
				require: false,
				type: Function,
				default: function(fileName, src, type) {
					console.log(fileName, src);
				},
			},
		},
		data() {
			let temp = ''
			if (this.value) {
				temp = this.value.split(',')
			} else {
				temp = []
			}
			return {
				show: true,
				value_update: false,
				headers: {
					Authorization: this.getAccess(),
				},
				//编辑时保留的地址
				service_retain: temp,
				fileList: [],
				gtConfig_fob: this.static_var.gtConfig_fob,
				action: this.static_var.gtConfig_fob.UploadFileUrl +
					'?fileType=' +
					this.upload_type,
				max_size: -1,
				success: false,
				serve_url: this.serve_url_list,
				serve_url_str: [], //this.serve_url_str_list,
				err: '', //错误信息
				file: {
					original_name: this.original_name,
				},
			}
		},
		computed: {},
		watch: {
			success(newVal, oldVal) {
				this.$emit('update:success_status', newVal)
			},
			err(newVal, oldVal) {
				this.$emit('update:err_tips', newVal)
			},
			serve_url(newVal, oldVal) {
				this.$emit('update:serve_url_list', newVal)
			},
			serve_url_str(newVal, oldVal) {
				this.value_update = true
				this.$emit('update:value', newVal.join(','))
				this.$emit('on-change', newVal.join(','))
				console.log('serve_url_str', newVal)
			},
			original_name_json(newVal, oldVal) {
				this.file.original_name = newVal
			},
			original_name(newVal, oldVal) {
				this.file.original_name = newVal
				//this.$emit('update:original_name_list', newVal);
			},
			value(newVal, oldVal) {
				if (this.value_update) {
					this.value_update = false
					return
				}
				let temp = ''
				if (newVal) {
					temp = newVal.split(',')
				} else {
					temp = []
				}
				this.service_retain = temp
			},
			upload_type(newVal, oldVal) {
				this.action =
					this.static_var.gtConfig_fob.UploadFileUrl + '?fileType=' + newVal
			},
			file_size(newVal, oldVal) {
				this.max_size = -1
				this.GetMaxSize()
			},
			size_unit(newVal, oldVal) {
				this.max_size = -1
				this.GetMaxSize()
			},
			delte_service(newVal, oldVal) {
				this.old_delete_fob()
			},
		},
		methods: {
			clear() {
				//this.show = false
				this.value_update = false
				this.fileList = []
				this.action =
					this.static_var.gtConfig_fob.UploadFileUrl +
					'?fileType=' +
					this.upload_type
				this.success = false
				this.serve_url = {}
				this.service_retain = []
				this.file.original_name = {}
				//this.show = true
				// this.$nextTick(() => {

				// })

			},
			getAccess() {
				return getAccessToken()
			},
			GetfileType(type) {
				return UploadfileUrl(type)
			},
			init() {},
			//async submitUpload() {
			submitUpload() {
				console.log('submitUpload', this.fileList)
				if (this.fileList.length == 0) {
					return 0
				}
				//await this.$refs.upload.submit()
				this.$refs.upload.submit()
				return 1
			},
			handleRemove(file, fileList) {},
			//本地预览
			async handlePreview(file) {
				const dialogImageUrl = window.URL ?
					window.URL.createObjectURL(file.raw) :
					window.webkitURL.createObjectURL(file.raw)
				this.$refs['preview'].handleEdit({
						src: dialogImageUrl,
						name: file.name,
					},
					1
				)
			},
			beforeAvatarUpload(file) {},
			async old_delete_fob() {
				console.log('delte_service', this.service_retain)
				if (this.service_retain && this.service_retain.length > 0) {
					const temp = this.service_retain
					if (temp.length > 0) {
						await this.doDelete(temp)
					}
				}
				this.$emit('update:old_delete', true)
			},
			async doDelete(list) {
				try {
					let that = this
					if (!that.success) {
						return true
					}
					console.log(list[0])
					let list2 = []
					for (let i = 0; i < list.length; i++) {
						const temp = list[i].split('/')
						let str = ''
						for (let j = 0; j < temp.length; j++) {
							if (temp[j]) {
								if (str) {
									str = str + '/' + temp[j]
								} else {
									str = temp[j]
								}
							}
						}
						list2.push(str)
					}
					//const ket_list = Object.keys(json)
					const res = await doDelete(that.upload_type, list2.join(';'))
					console.log(res)
				} catch (e) {
					console.log(e)
				}
			},
			//上传成功
			onSuccess(response, file, fileList) {
				//debugger
				console.log('onSuccess', response, file, fileList)
				let that = this
				if (file.response.count < 1) {
					this.$message.error('文件上传失败')
					that.success = false
					that.err = '文件上传失败'
					return false
				}

				that.err = ''
				const dir = response.dir
				let list = []
				that.serve_url = {}
				that.file.original_name = []
				const prefix = ViewfileUrl(that.upload_type)
				for (let key in response.files) {
					const newkey = '/' + dir + '/' + key
					const json = {
						relativeUrl: newkey,
						absoluteUrl: prefix + newkey,
						file_name: response.files[key],
					}
					that.serve_url[newkey] = json
					list.push(newkey)
					that.file.original_name[newkey] = response.files[key]
				}
				// if (that.serve_url_str.length > 0) {
				// 	that.doDelete(that.serve_url_str)
				// }
				that.success = true
				that.serve_url_str.push(list[0])
				console.log('that.serve_url_str', that.serve_url_str)
			},
			onError(err, file, fileList) {
				console.log(err, file, fileList)
				this.$message.error(err)
				let that = this
				that.success = false
				that.err = err
			},
			GetMaxSize() {
				if (this.max_size > 0) {
					return this.max_size
				}
				let that = this
				let max_size = 0
				switch (that.size_unit.toUpperCase()) {
					case 'MB':
						max_size = Number(that.file_size) * 1024 * 1024
						break
					case 'KB':
						max_size = Number(that.file_size) * 1024
						break
					case 'B':
						max_size = Number(that.file_size)
						break
					case 'GB':
						max_size = Number(that.file_size)
						break
					default:
						max_size = Number(that.file_size) * 1024 * 1024
						break
				}
				this.max_size = max_size
				return max_size
			},
			GetFileIndex(file, fileList) {
				try {
					let length = fileList.length
					let item = ''
					while (--length > -1) {
						item = fileList[length]
						if (
							item.name == file.name &&
							item.raw.type == file.raw.type &&
							item.size == file.size
						) {
							return length
						}
					}
					return -1
				} catch (e) {
					console.log(e)
					return -1
				}
			},
			GetFileType(file) {
				let type = '';
				try {
					type = file.raw.type;
					if (type) {
						return type;
					}
					let split = file.name.split('.');
					type = split[split.length - 1].toLocaleLowerCase();
					if (fileType[type]) {
						return fileType[type].rawType;
					}
				} catch (e) {
					console.log(e);
				}
				return '';
			},
			async onChange(file, fileList) {
				console.log('onChange', file, fileList)
				let that = this
				let tips = false;
				that.fileList = fileList
				console.log(that.type_array);
				let fileType = this.GetFileType(file);
				if (!fileType) {
					tips = true;
					this.$message.error('未知文件类型' + file.name);
				}
				const type = that.type_array.indexOf(fileType) >= 0 ? true : false
				const size = file.size < that.GetMaxSize()
				if (!type && !tips) {
					tips = true
					this.$message.error('上传格式只能是' + that.type_str);
				}
				if (!size && !tips) {
					this.$message.error(
						'上传文件不能超过' + that.file_size + that.size_unit
					)
				}

				let hwFlag = true
				if (type) {
					let hw = await readSizeEx(file.raw)
					if (hw[0] > 0 && hw[1] > 0) {
						console.log('hw', hw);
						console.log('that.img_max_height ', that.img_max_height);
						console.log('that.img_max_width ', that.img_max_width)
						if (hw[0] < that.img_height || hw[1] < that.img_width) {
							hwFlag = false
							if (!tips) {
								this.$message.error(
									'图片分辨率需大于' + that.img_width + '*' + that.img_height
								)
							}

						} else if ((that.img_max_height > 0 && hw[0] > that.img_max_height) || (that.img_max_width >
								0 && hw[1] > that.img_max_width)) {
							hwFlag = false;
							if (!tips) {
								let tip_str = '图片分辨率需小于';
								if (that.img_max_height > 0) {
									tip_str = tip_str + that.img_max_height;
								}
								tip_str = tip_str + '*';
								if (that.img_max_width > 0) {
									tip_str = tip_str + that.img_max_width;
								}
								this.$message.error(
									tip_str
								)
							}
						}
					}


				}
				console.log(type, size)

				if (type && size && hwFlag) {} else {
					const index = that.GetFileIndex(file, fileList)
					if (index >= 0 && index < fileList.length) {
						fileList.splice(index, 1)
					}
				}
				let fileNameList = [];
				for (let i = 0; i < fileList.length; i++) {
					fileNameList.push(fileList[i].raw.name)
				}
				this.$emit('update:fileName', fileNameList);
				if (fileNameList.length > 0) {
					this.$emit('updateFileName', fileNameList[0]);
				} else {
					this.$emit('updateFileName', '');
				}

				console.log(fileNameList)
				return type && size && hwFlag
			},
			GetCatalog(relativeUrl) {
				try {
					let list = relativeUrl.spilt('/')
					if (list.length > 0) {
						let str = list[0]
						for (let i = 2; i < list.length - 1; i++) {
							str = str + '/' + list[i]
						}
						return str
					}
					return relativeUrl
				} catch (e) {
					console.log(e)
					return relativeUrl
				}
			},
			SplitFileName(relativeUrl) {
				try {
					let list = relativeUrl.spilt('/')
					if (list.length > 0) {
						let str = list[list.length - 1]
						return str
					}
					return relativeUrl
				} catch (e) {
					console.log(e)
					return relativeUrl
				}
			},
			GetOriginalNameEx(absoluteUrl) {
				try {
					const prefix = ViewfileUrlEx(this.upload_type)
					absoluteUrl = absoluteUrl.replace(prefix, '')
					return this.GetOriginalName(absoluteUrl)
				} catch (e) {
					console.log(e)
					return absoluteUrl
				}
			},
			GetOriginalName(relativeUrl) {
				let that = this
				try {
					console.log(that.file.original_name, relativeUrl)
					if (that.file.original_name.hasOwnProperty(relativeUrl)) {
						return that.file.original_name[relativeUrl]
					}
					let list = relativeUrl.split('/')
					if (list.length > 1) {
						return list[list.length - 1]
					}
					return relativeUrl
				} catch (e) {
					console.log(e)
					return relativeUrl
				}
			},
			GetFileUrl() {
				let that = this
				let list = []
				let temp = ''
				if (this.value) {
					that.service_retain = this.value.split(',')
				} else {
					that.service_retain = []
				}
				let length = that.service_retain.length
				let prefix = ViewfileUrlEx(that.upload_type)

				for (let i = 0; i < length; i++) {
					list.push({
						name: that.service_retain[i],
						// src: prefix + '/' + that.GetCatalog(that.serve_url_str[i]) + '/' + that.GetOriginalName(
						// 	that
						// 	.serve_url_str[i])
						src: prefix + that.service_retain[i],
					})
				}
				return list
			},
			//服务器文件预览
			preview_upload() {
				let that = this
				let list = that.GetFileUrl()
				if (list.length > 0) {
					this.$refs['preview'].handleEdit(list[0])
					const fileName = that.GetOriginalNameEx(list[0].name)
					that.downLoad_Fn(fileName, list[0], 'show')
				} else {
					this.$message.error('服务器无可预览文件')
				}
				//let url = that.serve_url_str.
			},
			GetSuffix(src) {
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
			},
			downFile() {
				let that = this
				let list = that.GetFileUrl()
				let length = list.length
				for (let i = 0; i < length; i++) {
					const src = list[i].src
					const suffix = that.GetSuffix(src)
					const fileName = that.GetOriginalNameEx(src)
					//openDownloadProxy(src, fileName.replace(suffix, '') + '.' + suffix)
					openDownloadProxy(
						src, //.replace(baseURL, GetHost() + '/webapi'),
						fileName.replace(suffix, '') + '.' + suffix
					)
					if (that.downLoad_Fn) {
						try {

							that.downLoad_Fn(fileName.replace(suffix, '') + '.' + suffix, src, 'downLoad')
						} catch (e) {
							console.log(e)
						}
					}
					// const link = document.createElement('a')
					//       link.download = fileName.replace(suffix, '') + '.' + suffix
					//       link.style.display = 'none'
					//       link.href = src.replace(baseURL, '/webapi')
					//       document.body.appendChild(link)
					//       console.log(link)
					//       link.click()
					//       document.body.removeChild(link)
				}
			},
		},
	}
</script>

<style></style>
