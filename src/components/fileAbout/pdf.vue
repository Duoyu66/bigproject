<!--
 * @Author: Mortar
 * @Date: 2021-03-29 15:26:41
 * @LastEditors: Mortar
 * @LastEditTime: 2021-03-29 16:39:52
 * @Description: 
 * @FilePath: \src\components\fileAbout\pdf.vue
-->
<template>
	<div>
		<div class="pdf-preview-arrow fx-row">
			<div class="icon-scale">
				<span @click="scaleD"><i class="el-icon-zoom-in"></i></span>
				<span @click="scaleX"><i class="el-icon-zoom-out"></i></span>
			</div>
			<div class="fx-row ml10">
				<el-row>
					<el-col :span="3">
						<span @click="changePdfPage(0)" class="turn" :class="{ grey: currentPage === 1 }">
							<i class="el-icon-arrow-left"></i>
						</span>
					</el-col>
					<el-col :span="13">
						<div>
							第
							<el-input v-model="pageNumber" class="page-number" @input="pageChange"></el-input>
							页
						</div>
					</el-col>
					<el-col :span="3">
						<span @click="changePdfPage(1)" class="turn" :class="{ grey: currentPage === pageCount }"><i
								class="el-icon-arrow-right"></i></span>
					</el-col>
					<el-col :span="5">
						<span> {{ currentPage }} / {{ pageCount }} </span>
					</el-col>
				</el-row>




			</div>
		</div>
		<div class="pdf-content">
			<pdf :src="src" :page="currentPage" @num-pages="pageCount = $event" @page-loaded="currentPage = $event"
				@loaded="loadPdfHandler" ref="pdfWrapper">
			</pdf>
		</div>
	</div>
</template>
<script>
	// 引入刚才下载的 pdf
	import pdf from 'vue-pdf'

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
		},
		components: {
			pdf,
		},
		data() {
			return {
				//PDF预览
				currentPage: 0,
				pageCount: 0,
				pageNumber: 1,
				scale: 1, //放大系数
			}
		},
		created() {
			// 有时PDF文件地址会出现跨域的情况,最好先处理一下
		},
		methods: {
			init() {
				let that = this
				that.destroyonclose = true
				that.viewVisible = false // 弹框隐藏
				that.fileType = 'pdf' // 文件类型
				that.pdfsrc = '' // 文件地址
				that.photo = []
			},
			loadPdfHandler() {
				// 加载的时候先加载第一页
				this.currentPage = 1;
				this.pageNumber = 1;
			},
			changePdfPage(val) {
				if (val === 0 && this.currentPage > 1) {
					this.currentPage--;
					this.pageNumber = this.currentPage;
				}
				if (val === 1 && this.currentPage < this.pageCount) {
					this.currentPage++;
					this.pageNumber = this.currentPage;
				}
			},
			//跳转页面
			pageChange() {
				console.log(this.pageNumber)
				if (
					Number(this.pageNumber) > 0 &&
					Number(this.pageNumber) <= this.pageCount
				) {
					this.currentPage = Number(this.pageNumber);
				} else {
					this.currentPage = 1;
					this.pageNumber = 1;
				}
			},
			//放大
			scaleD() {
				this.scale += 0.1;
				this.$refs.pdfWrapper.$el.style.transform = "scale(" + this.scale + ")";
				this.$refs.pdfWrapper.$el.style.transformOrigin = "top center";
			},

			//缩小
			scaleX() {
				if (this.scale === 1) {
					return;
				}
				this.scale += -0.1;
				this.$refs.pdfWrapper.$el.style.transform = "scale(" + this.scale + ")";
			}
		},
	}
</script>

<style scoped lang="scss">
	.pdf-dialog-view {
		.el-dialog__headerbtn {
			z-index: 3;
			top: 10px;

			.el-dialog__close {
				color: #4a9ce4;
				font-size: 22px;
			}
		}

		.el-dialog {
			margin: auto;
			bottom: 5vh;
		}

		::v-deep .el-dialog__header {
			padding: 0;
		}

		::v-deep .el-dialog__body {
			padding: 0 !important;
			background-color: #004594;
			color: white;
		}
	}

	.pdf-preview-arrow {
		-moz-user-select: none;
		user-select: none;
		position: absolute;
		right: 60px;
		top: 8px;
		z-index: 3;
		line-height: 30px;

		.icon-scale,
		.turn {
			line-height: 38px;

			i {
				font-size: 22px;
				font-weight: bold;
				color: #62a6ed;
				margin: 0 8px;
				cursor: pointer;
			}
		}

		.page-number {
			display: inline-block;
			width: 40px;
			margin: 0 5px;

			::v-deep .el-input__inner {
				width: 40px;
				height: 30px;
				line-height: 30px;
				background: rgba(74, 141, 240, 0.14);
				color: rgba(198, 226, 255, 0.8);
				border: 1px solid rgba(0, 126, 255, 0.6);
				padding: 0;
				text-align: center;
			}
		}
	}

	.pdf-content {
		overflow: auto;
		margin-top: 30px;
	}
</style>
