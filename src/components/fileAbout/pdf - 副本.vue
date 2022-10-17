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
		<div class="tools">
			<el-row>
				<el-col :span="4">
					<button :theme="'default'" type="submit" :title="'基础按钮'" @click.stop="prePage" class="mr10">
						上一页
					</button>
				</el-col>
				<el-col :span="4">
					<button :theme="'default'" type="submit" :title="'基础按钮'" @click.stop="nextPage" class="mr10">
						下一页
					</button>
				</el-col>
				<el-col :span="3">
					<div class="page">{{ pageNum }}/{{ pageTotalNum }}</div>
				</el-col>
				<el-col :span="4">
					<el-input v-model="jupeNum" placeholder="请输入页数" @input="pageChange"></el-input>
				</el-col>
				<el-col :span="4">
					<button :theme="'default'" type="submit" :title="'基础按钮'" @click.stop="clock" class="mr10">
						顺时针
					</button>

				</el-col>
				<el-col :span="4">
					<button :theme="'default'" type="submit" :title="'基础按钮'" @click.stop="counterClock" class="mr10">
						逆时针
					</button>
				</el-col>
			</el-row>





		</div>
		<pdf ref="pdf" :src="src" :page="pageNum" :rotate="pageRotate" @progress="loadedRatio = $event"
			@page-loaded="pageLoaded($event)" @num-pages="pageTotalNum = $event" @error="pdfError($event)"
			@link-clicked="page = $event"></pdf>
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
		},
		components: {
			pdf,
		},
		data() {
			return {
				jupeNum: 0,
				pdfsrc: '', // 文件地址
				numPages: 1,
				loadedRatio: 0,
				pageRotate: 0,
				pageNum: 1,
				pageTotalNum: 1,
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
			prePage() {
				let page = this.pageNum
				page = page > 1 ? page - 1 : this.pageTotalNum
				this.pageNum = page
			},
			// 下一页函数
			nextPage() {
				let page = this.pageNum
				page = page < this.pageTotalNum ? page + 1 : 1
				this.pageNum = page
			},
			// 页面顺时针翻转90度。
			clock() {
				this.pageRotate += 90
			},
			// 页面逆时针翻转90度。
			counterClock() {
				this.pageRotate -= 90
			},
			// 页面加载回调函数，其中e为当前页数
			pageLoaded(e) {
				this.curPageNum = e
			},
			// 其他的一些回调函数。
			pdfError(error) {
				console.error(error)
			},
			pageChange() {
				if (
					Number(this.pageNum) > 0 &&
					Number(this.pageNum) <= this.pageTotalNum
				) {
					this.jupeNum = Number(this.pageNum);
				} else {
					this.jupeNum = 1;
					this.pageNum = 1;
				}
			}
		},
	}
</script>
