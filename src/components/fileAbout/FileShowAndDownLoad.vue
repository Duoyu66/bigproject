<template>
	<div v-show="src">
		<div :style="AStyle">
			<el-tooltip class="item" effect="dark" :content="fileName ? fileName : src" placement="top-start">
				<a class="file_down" href="javascript:void(0)" @click="downLoad">{{ShowChar}}</a>
			</el-tooltip>
			<!-- <a class="file_down" href="javascript:void(0)" @click="downLoad">{{ShowChar}}</a> -->
		</div>


		<el-tooltip class="item" v-show="isCanPreview" effect="dark" content="预览文件" placement="top-start">
			<el-button size="mini" type="primary" circle @click="showFile" style="margin-left: 2px;float: right;">
				<i class="el-icon-view"></i>
			</el-button>
		</el-tooltip>
		<preview ref="preview" v-show="isCanPreview"></preview>
	</div>
</template>

<script>
	import preview from '@/components/fileAbout/preview'
	import {
		openDownloadProxy,
		GetHost,
		GetShowFileType
	} from '@/utils/downLoad'
	import {
		ViewfileUrl,
		ViewfileUrlEx,
		UploadfileUrl
	} from '@/utils/servicefile'
	import {
		judgeVariableIsEmptyOrNull,
		getByteLen,
		Substring
	} from '@/utils/base.helper.js'
	export default {
		props: {
			src: {
				type: String,
				default: '',
			},
			fileName: {
				type: String,
				default: '',
			},
			fileTypeUrl: {
				type: Number,
				default: 0,
			},
			//最多显示的字符数，0为显示所有
			maxShowChar: {
				type: Number,
				default: 0
			}
		},
		components: {
			preview,
		},

		computed: {
			AStyle() {
				let style = {
					'white-space': 'nowrap',
					'overflow': 'hidden',
					'text-overflow': 'ellipsis',
					//'display': 'block',
					'float': 'left'
				}
				let width = this.element.width;
				let height = this.element.height;
				if (width == 0) {
					return '';
				}
				//style['line-height'] = (height / 2 + 6) + 'px';
				style['line-height'] = height + 'px';
				if (this.isCanPreview) {
					style.width = width * 0.785 + 'px';
				} else {
					style.width = width + 'px';
				}

				return style;
			},
			ShowChar() {
				let showStr = this.fileName ? this.fileName : this.src;
				let maxShowChar = this.maxShowChar;
				if (maxShowChar == 0) {
					return showStr;
				}
				if (!this.isCanPreview) {
					maxShowChar = maxShowChar + 2;
				}
				let length = this.getByteLen(showStr);
				if (length <= maxShowChar) {
					return showStr;
				}
				return Substring(showStr, 0, maxShowChar) + '...';
				//return showStr.substring(0, this.maxShowChar) + '...';
			}
		},
		data() {
			return {
				isCanPreview: false,
				src_temp: '',
				element: {
					width: 0,
					height: 0,
				}
			}
		},
		mounted() {
			let that = this;
			console.log(window.onresize);
			window.onresize = function() {
				that.UpdataElement();
			};
		},
		created() {
			this.init();
		},
		methods: {
			GetElemetAttribute(attribute) {
				let that = this;
				return new Promise((resolve, reject) => {
					let index = setInterval(() => {
						if (that.$el) {
							clearInterval(index);
							resolve(that.$el[attribute]);
						}
					})
				})
			},
			async GetElemetWidth() {
				return await this.GetElemetAttribute('clientWidth')
			},
			async GetElemetHeight() {
				return await this.GetElemetAttribute('clientHeight')
			},
			async UpdataElement() {
				let width = await this.GetElemetWidth();
				let height = await this.GetElemetHeight();
				this.element.width = width;
				this.element.height = height;
				// if (this.element.width > 0) {
				// 	console.log('UpdataElement', this.element, new Date())
				// }

			},
			async init() {
				this.src_temp = ViewfileUrlEx(this.fileTypeUrl) + this.src;
				let fileType = GetShowFileType({
					src: this.src_temp,
					name: this.fileName
				});
				this.isCanPreview = fileType ? true : false;
				this.UpdataElement();
			},
			getByteLen(val) {
				return getByteLen(val);
			},
			showFile() {
				this.$refs['preview'].handleEdit({
					src: this.src_temp,
					name: this.fileName
				})
			},
			downLoad() {
				openDownloadProxy(this.src_temp, this.fileName);
			}
		},
	}
</script>

<style type="text/css">
	.file_down:link {
		text-decoration: none;
		color: blue
	}

	.file_down:active {
		text-decoration: blink
	}

	.file_down:hover {
		text-decoration: underline;
		color: red
	}

	.file_down:visited {
		text-decoration: none;
		color: green
	}

	.file_down_div.ellipsis {
		padding-left: 5px;
		text-align: left;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>
