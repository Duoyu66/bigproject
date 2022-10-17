<!--
 * @Author: Mortar
 * @Date: 2021-03-29 12:11:29
 * @LastEditors: Mortar
 * @LastEditTime: 2021-03-29 15:34:20
 * @Description: 
 * @FilePath: \src\components\fileAbout\preview.vue
-->
<template>
	<el-dialog title="预览" :visible.sync="viewVisible" :modal="modal" :show-close="true" :before-close="closeDialog"
		:destroy-on-close="destroyonclose" @close="close" append-to-body top="5vh">
		<div style="max-height: calc(80vh); overflow-y: auto">
			<div class="pdf" v-show="fileType === 'pdf'">
				<pdf :src="pdf.pdfsrc"></pdf>
			</div>
			<div class="picture" v-show="fileType === 'pic'">
				<viewer :images="photo">
					<!-- photo 一定要一个数组，否则报错 -->
					<img v-for="(src, index) in photo" :src="src" width="100%" height="100%" :key="index"
						:onerror="errorImg" />
				</viewer>
			</div>
		</div>

	</el-dialog>
</template>

<script>
	import pdf from '@/components/fileAbout/pdf'
	import {
		openDownloadProxy,
		GetHost,
		GetShowFileType
	} from '@/utils/downLoad'
	export default {
		components: {
			pdf,
		},
		data() {
			return {
				showclose: true,
				modal: false,
				destroyonclose: true,
				viewVisible: false, // 弹框隐藏
				fileType: 'pdf', // 文件类型

				photo: [],
				pdf: {
					pdfsrc: '', // 文件地址
					pdfName: '',
				},
			}
		},
		created() {
			// 有时PDF文件地址会出现跨域的情况,最好先处理一下
		},
		methods: {
			reinit_fob() {
				let that = this
				that.destroyonclose = true
				that.viewVisible = false // 弹框隐藏
				that.fileType = 'pdf' // 文件类型
				that.pdf.pdfsrc = '' // 文件地址
				that.photo = []
			},
			getNumPages(url) {
				let that = this
				let loadingTask = pdf.createLoadingTask(url)
				loadingTask
					.then((pdf) => {
						that.pdfsrc = loadingTask
						that.pdf.numPages = pdf.numPages
					})
					.catch((err) => {
						that.$message.error('pdf加载失败')
					})
			},
			sizeSet() {

			},
			GetFileType(file, type) {
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
			},
			//预览
			handleEdit(file, type) {
				console.log(file, type)
				let that = this
				that.reinit_fob()
				that.fileType = GetShowFileType(file);
				console.log(that.fileType)
				if (!type || type == 0) {
					//服务器预览

					switch (that.fileType) {
						case 'pic':
							that.photo.push(file.src)
							that.viewVisible = true
							break
						case 'pdf':
							//that.pdfsrc = pdf.createLoadingTask(file.pdfsrc)
							that.pdf.pdfsrc = file.src
							that.viewVisible = true
							break
						default:
							this.$message.error('该格式暂时无法预览')
							break
					}
				} else if (type == 1) {
					//本地预览
					switch (that.fileType) {
						case 'pic':
							that.photo.push(file.src)
							that.viewVisible = true
							break
						case 'pdf':
							//that.pdfsrc = pdf.createLoadingTask(file.pdfsrc)
							that.pdf.pdfsrc = file.src
							that.viewVisible = true
							break
						default:
							this.$message.error('该格式暂时无法本地预览')
							break
					}
				}
			},
			closeDialog(done) {
				done()
			},
			errorImg() {},
			close() {},
		},
	}
</script>
