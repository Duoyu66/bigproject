<template>
  <!-- 检测室监控记录 -->
	<div class="baseBox" style="">
		<vab-query-form >
			<div style="float: right;" class="videosearch">
				<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent size="mini">
					<el-form-item>
						<el-switch v-model="video.autoplay" active-text="自动播放" inactive-text="">
						</el-switch>
					</el-form-item>
					<el-form-item>
						<el-select v-model="queryForm.pageSize" placeholder="请选择显示数量" style="width: 100px;">
							<!-- <div v-for="item in chemical_list" :key="item.store_id"> -->
							<el-option v-for="item in selectData.pageSize" :key="item.label" :label="item.label"
								:value="item.value">
							</el-option>
							<!-- </div> -->
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="video.load_type" placeholder="播放渠道" >
							<!-- <div v-for="item in chemical_list" :key="item.store_id"> -->
							<el-option v-for="item in selectData.load_type" :key="item.label" :label="item.label"
								:value="item.value">
							</el-option>
							<!-- </div> -->
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-input style="border-radius: 30px" v-model="queryForm.video_name" placeholder="检测室名称" />
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-search" type="primary" @click="search">

						</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-refresh" type="warning" @click="refresh">
						</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="danger" @click="videoFullScreen">
							全屏
						</el-button>
					</el-form-item>
					<el-form-item>
						<el-popover placement="top-start" title="提示" width="200" trigger="hover">
							<p>1、部分摄像头不显示:</p>
							<p>①请检查摄像头状态。</p>
							<p>2、所有摄像头都离线:</p>
							<p>①浏览器是否拦截非安全的端口,{{GetBrowerInfo}}。</p>
							<p>②本地推流服务器是否工作正常。</p>
							<p>③检查摄像头状态。</p>
							<el-button slot="reference" type="info">提示</el-button>
						</el-popover>
					</el-form-item>

				</el-form>
			</div>
		</vab-query-form>
		<el-container style="flex-wrap: wrap">
			<el-row style="width: 100%;margin-bottom:10px;" ref="videoRow" v-if="video.show" v-loading="listLoading"
				:element-loading-text="elementLoadingText">
				<el-col v-for="videoInfo in videoList" :key="video.uniqueId" :span="GetColSpan">
					<EasyPlayer v-if="videoInfo.uniqueId" :channel_id="videoInfo.channel_id" :org_id="videoInfo.org_id"
						:room_name="videoInfo.video_name" :uniqueId="videoInfo.uniqueId"
						:screen_type='queryForm.pageSize' :load_type="video.load_type" :auto_play='video.autoplay'
						:isRemoveTxt="video.isRemoveTxt" @loadComplete="loadComplete">
					</EasyPlayer>
				</el-col>
			</el-row>
			<el-pagination style="margin:0 auto;" :background="background" :current-page="queryForm.pageNo"
				:layout="layout" :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
				@size-change="handleSizeChange"></el-pagination>
		</el-container>
	</div>
</template>

<script>
	import {
		GetOrgId,
		GetPersonRoleMax,
		uuid,
	} from '../commonjs/common.testingRoom'
	import {
		BrowserMatch
	} from '@/utils/browser'
	import EasyPlayer from '../player/easyPlayer.vue'
	export default {
		name: 'real-timeMonitoring',
		components: {
			EasyPlayer
		},
		data() {
			return {
				//screen_type: 9,
				//加载类型（0：自动，1：内网，2：外网）
				//load_type: 0,
				//autoplay: true,
				browserMath: BrowserMatch.init(),
				loadStatus: {

				},
				elementLoadingText: '加载数据中',
				listLoading: true,
				tablelist: [],
				videoList: [],
				total: 0,
				video: {
					show: true,
					load_type: 0,
					autoplay: true,
					isRemoveTxt: false,
				},
				queryForm: {
					pageNo: 1,
					pageSize: 9,
					video_name: '',
				},
				background: true,
				layout: 'total, prev, pager, next, jumper',
				selectData: {
					pageSize: [{
						label: '1*1',
						value: 1
					}, {
						label: '2*2',
						value: 4
					}, {
						label: '3*3',
						value: 9
					}, {
						label: '4*4',
						value: 16
					}],
					load_type: [{
						label: '优先通过内网播放',
						value: 0
					}, {
						label: '内网',
						value: 1
					}, {
						label: '外网',
						value: 2
					}]
				}
			}
		},
		computed: {
			GetColSpan() {
				let col_num = Math.sqrt(this.queryForm.pageSize)
				col_num = 24 / col_num
				return col_num
			},
			height() {
				return this.$baseTableHeight()
			},
			GetBrowerInfo() {
				let browserMath = ''
				if (!this.browserMath) {
					browserMath = BrowserMatch.init();
				}
				console.log(BrowserMatch)
				let browserName = BrowserMatch.browser
				let version = BrowserMatch.version
				return ',当前内核:' + browserName + ' 版本:' + version
			}
		},
		watch: {
			'queryForm.pageSize'() {
				this.queryForm.pageNo = 1
				this.refresh()
			}
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted() {},
		methods: {
			async init() {
				await this.GetVideoData();
				await this.initPlayId();
			},
			async GetVideoData() {
				let alist = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'room_no',
						type: 3,
						level: 2,
					},
					{
						field: 'video_name',
						type: 2,
						level: 3,
					},
					{
						field: 'pageNo',
						type: 3,
						level: 4,
					},
					{
						field: 'pageSize',
						type: 3,
						level: 5,
					},
				]
				this.queryForm.org_id = await this.getOrgId();
				// let {
				// 	data,
				// 	code
				// } = await this.QueryExec_fob(636, list, this.queryForm)
				let key_json = {
					loading: 'listLoading', //加载效果属性名
					data: 'tablelist', //数据属性名
					total: 'total', //总数属性名
					queryForm: 'queryForm', //查询条件属性名
				}
				await this.search_fob(alist, this, 636, key_json);
				return this.tablelist;
			},
			loadComplete(uniqueId) {
				if (this.loadStatus[uniqueId]) {
					this.loadStatus[uniqueId].status = true
				} else {
					this.loadStatus[uniqueId] = {
						status: true
					}
				}
				let array = Object.keys(this.loadStatus)
				console.log(uniqueId, array.length, this.videoList.length)
				if (array.length == this.videoList.length) {
					this.video.isRemoveTxt = true
				}
			},
			initPlayId(tablelist) {
				this.video.isRemoveTxt = false
				this.loadStatus = {}
				if (!tablelist) {
					tablelist = this.tablelist
				}
				let length = tablelist.length
				let item = ''
				let array = []
				for (let i = 0; i < length; i++) {
					item = tablelist[i]
					item.uniqueId = item.video_id + '_' + item.org_id + '_' + item.room_no + '_' + item.channel_id
					array.push(item)
				}
				if (array.length < this.queryForm.pageSize) {
					let reduce = this.queryForm.pageSize - array.length
					for (let i = 0; i < reduce; i++) {
						array.push({
							uniqueId: uuid(),
							video_id: undefined,
						})
					}
				}
				this.videoList = array
				this.video.show = false
				this.$nextTick(() => {
					this.video.show = true
				})
				//this.video.show = true
			},
			async getOrgId() {
				return await GetOrgId()
			},
			handleCurrentChange(val) {
				this.queryForm.pageNo = val
				this.refresh()
			},
			handleSizeChange(val) {
				this.queryForm.pageSize = val
				this.refresh()
			},
			search() {
				this.queryForm.pageNo = 1
				this.refresh()
			},
			videoFullScreen() {
				let ele = this.$refs['videoRow'].$el,
					reqFullScreen = ele.requestFullScreen || ele.webkitRequestFullScreen ||
					ele.mozRequestFullScreen || ele.msRequestFullscreen;
				if (typeof reqFullScreen !== 'undefined' && reqFullScreen) {
					reqFullScreen.call(ele);
				};
			},
			refresh() {
				this.init()
				// this.video.show = false
				// this.init()
				// this.$nextTick(() => {
				// 	this.video.show = true
				// 	this.$nextTick(() => {

				// 	})
				// })

			},
		},
	}
</script>
<style>
	.videosearch .el-form-item {
		margin-bottom: 3px !important;
	}
</style>
