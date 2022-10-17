<template>
	<el-dialog top="10vh" :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close" :show-close="true">
		<el-upload ref="upload" class="upload-demo" :action="action" :on-preview="handlePreview"
			:on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :headers="headers"
			:limit="upload_attribute.limit" :multiple="upload_attribute.multiple" :on-change="onChange"
			:on-error="onError" :on-success="onSuccess">
			<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
			<!-- <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">
				上传到服务器
			</el-button> -->
			<el-button style="margin-left: 10px" size="small" type="success" v-show="serve_url_str.length > 0"
				@click="preview_upload">
				预览已上传文件
			</el-button>
			<div slot="tip" class="el-upload__tip">
				只能上传{{ this.upload_attribute.file_type_str }}文件，且不超过{{
          this.upload_attribute.file_size + this.upload_attribute.file_size_unit
        }}
			</div>
		</el-upload>
		<preview ref="preview"></preview>
	</el-dialog>
</template>

<script>
	//import { delete } from 'vue/types/umd'
	import {
		getAccessToken
	} from '@/utils/accessToken'
	import {
		doDelete
	} from '@/api/file'
	import preview from '@/components/fileAbout/preview'
	import ViewfileUrl from '@/utils/servicefile'
	export default {
		name: 'UpdateEdit',
		components: {
			preview,
		},
		data() {
			return {
				title: '',
				headers: {
					Authorization: this.getAccess(),
				},
				dialogFormVisible: false,
				fileList: [],
				gtConfig_fob: this.static_var.gtConfig_fob,
				pricure_view_prefix: '',
				action: this.static_var.gtConfig_fob.UploadFileUrl + '?fileType=1',
				max_size: -1,
				serve_url: [],
				serve_url_str: [],
				err: '', //错误信息
				success: false, //是否成功
				upload_attribute: {
					file_original_name: [],
					upload_type: 1,
					file_type_str: 'jpg/pdf', //提示文字
					file_type_array: ['image/jpeg', 'application/pdf'],
					file_size: 4,
					file_size_unit: 'MB',
					limit: 1,
					multiple: false,
				},
			}
		},

		methods: {
			getAccess() {
				return getAccessToken()
			},
			GetfileType(type) {
				type = Number(type)
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
				]
				if (type >= 0 && type < list.length) {
					pricure_view_prefix = this.gtConfig_fob[list[type]]
					this.action = this.action + type
				} else {
					pricure_view_prefix = ''
					console.log('输入类型错误')
				}
				return pricure_view_prefix
			},
		
			close() {
				// this.$refs['form'].resetFields()
				// this.form = this.$options.data().form
				this.dialogFormVisible = false
				this.$emit('fetch-data')
			},
			submitUpload() {
				this.$refs.upload.submit()
			},
			handleRemove(file, fileList) {
				console.log(file, fileList)
			},
			//本地预览
			handlePreview(file) {
				const dialogImageUrl = window.URL ?
					window.URL.createObjectURL(file.raw) :
					window.webkitURL.createObjectURL(file.raw)

				//console.log(dialogImageUrl)
				this.$refs['preview'].handleEdit({
						src: dialogImageUrl,
						name: file.name,
					},
					1
				)
			},
			beforeAvatarUpload(file) {
				//console.log(file)
			},
			async doDelete(list) {
				try {
					let that = this
					if (!that.success) {
						return true
					}
					console.log(list)
					//const ket_list = Object.keys(json)
					const res = await doDelete(
						that.upload_attribute.upload_type,
						list.join(';')
					)
					console.log(res)
				} catch (e) {
					console.log(e)
				}

			},
			//上传成功
			onSuccess(response, file, fileList) {
				//console.log(response, file, fileList)
				let that = this
				if (response.count < fileList.length) {
					this.$message.error('文件上传失败')
					that.success = false
					that.err = '文件上传失败'
					return false
				}
				that.success = true
				that.err = ''
				const dir = response.dir
				let list = [];
				that.serve_url = []
				for (let key in response.files) {
					const newkey = '/' + dir + '/' + key
					const json = {}
					json[newkey] = response.files[key]
					that.serve_url.push(json)
					list.push(newkey)
				}
				if (that.serve_url_str.length > 0) {
					that.doDelete(that.serve_url_str)
				}
				that.serve_url_str = list

			},
			onError(err, file, fileList) {
				console.log(err, file, fileList)
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
				switch (that.upload_attribute.file_size_unit.toUpperCase()) {
					case 'MB':
						max_size = Number(that.upload_attribute.file_size) * 1024 * 1024
						break
					case 'KB':
						max_size = Number(that.upload_attribute.file_size) * 1024
						break
					case 'B':
						max_size = Number(that.upload_attribute.file_size)
						break
					case 'GB':
						max_size = Number(that.upload_attribute.file_size)
						break
					default:
						max_size = Number(that.upload_attribute.file_size) * 1024 * 1024
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
			onChange(file, fileList) {
				//console.log(file, fileList)
				let that = this
				const type =
					that.upload_attribute.file_type_array.indexOf(file.raw.type) >= 0 ?
					true :
					false
				const size = file.size / 1024 / 1024 < that.GetMaxSize()
				if (!type) {
					this.$message.error(
						'上传格式只能是' + that.upload_attribute.file_type_str
					)
				}
				if (!size) {
					this.$message.error(
						'上传文件不能超过' +
						that.upload_attribute.file_size +
						that.upload_attribute.file_size_unit
					)
				}
				if (type && size) {} else {
					const index = that.GetFileIndex(file, fileList)
					if (index >= 0 && index < fileList.length) {
						fileList.splice(index, 1)
					}
				}
				return type && size
			},
			GetOriginalName(fileName) {
				let that = this
				try {
					if (that.serve_url_str.length == 1 && that.upload_attribute.file_original_name.length > 0) {
						return that.upload_attribute.file_original_name[0]
					}
					return fileName
				} catch (e) {
					console.log()
					return fileName;
				}

			},
			//服务器文件预览
			preview_upload() {
				let that = this
				let list = []
				let length = that.serve_url_str.length
				const prefix = ViewfileUrl(that.upload_attribute.upload_type)
				for (let i = 0; i < length; i++) {
					list.push({
						name: that.serve_url_str[i],
						src: prefix + that.GetOriginalName(that.serve_url_str[i])
					});
				}
				if (list.length > 0) {
					this.$refs['preview'].handleEdit(list[0])
				}
				//let url = that.serve_url_str.
			}
		},
	}
</script>

<style></style>
