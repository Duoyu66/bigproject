<template>
	<div id='quillEditorQiniu'>
		<el-row v-loading="loadingImg">
			<quill-editor :style="{width: width ? width: '100%', background: '#fff'}" v-model="content"
				ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)" @focus="focusEvent()"
				@blur="blurEvent()">
			</quill-editor>
		</el-row>
<!-- 		<div v-if="special && showSelectList" class="otherInfoList" :style="{left: offsetLeft, top: offsetTop}">
			<slot name="changeList"></slot>
		</div> -->
		<!-- <Upload :class="classNm" :accept="'image/*'" :action="'https://upload.qiniup.com'" name='file'
			:data="updateParams" :show-upload-list="false" :on-success="uploadSuccess" :on-error="uploadError"
			:before-upload="beforeUpload" style="display: none;">
		</Upload> -->
	</div>
</template>

<script>
	import * as Quill from 'quill'
	import {
		quillEditor
	} from 'vue-quill-editor'
	import {
		ImageDrop
	} from 'quill-image-drop-module'
	import ImageResize from 'quill-image-resize-module'
	import {
		ImageExtend
	} from 'quill-image-paste-module'
	// let fontSizeStyle = Quill.import('attributors/style/size')
	// fontSizeStyle.whitelist = ['12px', '14px', '16px', '20px', '24px', '36px']
	// Quill.register(fontSizeStyle, true)
	Quill.register('modules/imageDrop', ImageDrop)
	Quill.register('modules/imageResize', ImageResize)
	Quill.register('modules/ImageExtend', ImageExtend)
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],
		[{
			'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff',
				'#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666',
				'#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00',
				'#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600',
				'#003700', '#002966', '#3d1466'
			]
		}, {
			//'size': fontSizeStyle.whitelist
		},
		],
		[{
			list: 'ordered'
		}, {
			list: 'bullet'
		}],
		[{
			indent: '-1'
		}, {
			indent: '+1'
		}],
		['link', 'image']
	]
	// 自定义编辑器的工作条
	export default {
		name: 'quill-editor-qiniu',
		components: {
			quillEditor,
			ImageResize
		},
		props: ['initValue', 'width', 'placeholder', 'special', 'replaceInfo'],
		created() {
			// 获取初始化回显内容
			this.content = this.initValue
			// 获取上传token
			//this.$store.dispatch('uploadToken')
		},
		mounted() {
			this.classNm = 'avatar-uploader' + new Date().getTime()
			// 工具栏中的图片图标被单击的时候调用这个方法
			let imgHandler = (state) => {
				if (state) {
					document.querySelector(`.${this.classNm} input`).click()
				}
			}
			// 当工具栏中的图片图标被单击的时候
			this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', imgHandler)
		},
		data() {
			return {
				classNm: '',
				content: '',
				once: true,
				showSelectList: false,
				// 编辑器配置选项
				editorOption: {
					placeholder: this.placeholder ? this.placeholder : '请输入',
					theme: 'snow',
					modules: {
						toolbar: {
							//container: toolbarOptions
						},
						clipboard: {
							// 粘贴过滤
							matchers: [
								[Node.ELEMENT_NODE, this.HandleCustomMatcher]
							]
						},
						// 拖拽上传和调整图片大小
						imageDrop: true,
						imageResize: {
							displayStyles: {
								backgroundColor: 'black',
								border: 'none',
								color: 'white'
							},
							modules: ['Resize', 'DisplaySize', 'Toolbar']
						},
						// 截屏上传
						ImageExtend: {
							loading: true,
							name: 'file',
							change: (xhr, FormData) => {
								FormData.append('token', this.$store.state.upload_token)
							},
							action: 'https://upload.qiniup.com',
							response: (res) => {
								console.log(res, 'response')
								return this.$store.getters.upload_url + res.key
							}
						}
					}
				},
				updateParams: {},
				loadingImg: false,
				offsetLeft: 0,
				offsetTop: 0
			}
		},
		watch: {
			initValue(newVal, oldVal) {
				this.content = newVal
			},
			replaceInfo(newVal, oldVal) {
				if (this.special) {
					this.content = this._.replace(this.content, '@', newVal)
				}
			}
		},
		methods: {
			onEditorChange(event) {
				this.once = false
				console.log(event, 'change', this.content)
				// 如果为true标识开启@功能
				if (this.special) {
					// 计算输入特殊字符显示浮动框的位置
					// 获取光标index
					let pindex = event.quill.selection.savedRange.index
					console.log(pindex)
					let arr = event.text.split('\n')
					let str = ''
					let haveMark = false
					for (let index = 0; index < arr.length; index++) {
						let value = ' ' + arr[index]
						str += value
						if (pindex <= str.length) {
							console.log(pindex, '循环index的值')
							this.offsetTop = (index + 1) * 20 + 'px'
							this.offsetLeft = arr[index].lastIndexOf('@') * 14 + 'px'
							let newArr = arr[index].split('@')
							if (arr[index].lastIndexOf('@') !== -1 && newArr[newArr.length - 1] === '') {
								haveMark = true
							}
							break
						} else {
							this.offsetTop = 0
							this.offsetLeft = 0
						}
					}
					console.log(str.length, '长度', pindex)
					console.log(this.offsetTop, this.offsetLeft)
					if (pindex && haveMark) {
						this.showSelectList = true
					} else {
						this.showSelectList = false
					}
				}
				this.$emit('getEditorInfo', event)
			},
			// 选择@的信息
			selectItemInfo() {
				this.content = 'gaibaile'
			},
			beforeUpload(request, file) {
				// 设置上传参数
				this.updateParams.token = this.$store.state.upload_token
				this.updateParams.key = request.name
				this.loadingImg = true
			},
			// 上传图片成功
			uploadSuccess(res, file) {
				// file 返回的文件信息，也可以在这里调用七牛上传。
				console.log(res, file, this.$store.getters.upload_url + res.key, 'success')
				// 上传完成以后修改图片地址，回显到quill编辑器中
				let quill = this.$refs.myQuillEditor.quill
				let length = quill.getSelection() ? quill.getSelection().index : 0
				// 插入图片  res.info为服务器返回的图片地址
				console.log(this.$store.getters.upload_url + file.name)
				// quill.insertEmbed(length, 'image', this.$store.getters.upload_url + file.name)
				quill.insertEmbed(length, 'image', this.$store.getters.upload_url + res.key)
				// 调整光标到最后
				quill.setSelection(length + 1)
				this.loadingImg = false
			},
			// 上传图片失败
			uploadError(error, file, list) {
				console.log(error, file, list, 'error')
				this.loadingImg = false
				if (file.error === 'file exists') {
					this.$message({
						type: 'error',
						message: list.name + ' 已存在，请重新选择！'
					})
				} else {
					this.$message({
						type: 'error',
						message: list.name + ' 上传出错，请重新上传！'
					})
				}
			},
			focusEvent() {
				this.$emit('on-focus')
			},
			blurEvent() {
				this.$emit('on-blur')
			},
			HandleCustomMatcher(node, Delta) {
				if (this.once === false) {
					// 文字、图片等，从别处复制而来，清除自带样式，转为纯文本
					let ops = []
					Delta.ops.forEach(op => {
						console.log(node, op, '富文本编辑器中的内容')
						if (op.insert && (typeof op.insert === 'string' || op.insert.image)) {
							ops.push({
								insert: op.insert
							})
						}
					})
					Delta.ops = ops
					return Delta
				} else {
					return Delta
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	// #quillEditorQiniu {
	// 	position: relative;

	// 	.otherInfoList {
	// 		position: absolute;
	// 		top: 0px;
	// 		left: 0px;
	// 		background: #fff;
	// 		border: 1px solid #eee;
	// 		padding: 10px;
	// 		border-radius: 5px;
	// 	}
	// }
</style>
