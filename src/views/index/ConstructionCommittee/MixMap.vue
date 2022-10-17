<template>

	<el-row style="height: 100%;">
		<el-col :span="span" style="height: 100%;">
			<div class="addHospital">
				<div class="map" >
					<el-input placeholder="请输入搜索地址" v-model="mapName" class="input-with-select" v-if="false">
						<el-button slot="append" icon="el-icon-search" @click="mapNameChange"></el-button>
					</el-input>
					<div style="padding:10px 0;" v-if="false">当前选中：{{mapPointName}}</div>
					<div :id="mapId" class="MixBaiduMap" ref="allmap" v-loading="loading">
					</div>
					<!-- 	<div :id="mapId" class="MixBaiduMap" :style="{width:'100%',height:mapStyle.height}" ref="allmap">
					</div> -->
					<div class="map-btn" v-show="false">
						<el-button type="primary" ref="button" @click="buttontest">确认</el-button>
					</div>
					<div v-show="false">
						<div ref="control">
							<el-collapse v-model="activeNames" @change="handleChange">
								<el-collapse-item title="搜索" name="search">
									<template slot="title">
										<span v-show="activeNames=='search'">搜索</span><i
											class="header-icon el-icon-search"></i>
									</template>
									<el-tabs v-model="tabsActiveName" @tab-click="handleClick">
										<el-tab-pane label="按日期范围" name="dateRange">
											<el-form ref="formDate" :model="dateRange" :rules="rulesDateRange">
												<el-form-item label="开始日期" :label-width="formLabelWidth"
													prop="startTime">
													<el-date-picker v-model="dateRange.startTime" align="right"
														type="date" placeholder="选择结束日期" :picker-options="pickerOptions"
														style="width: 100%" :format='dateFormat'
														:value-format="dateFormat">
													</el-date-picker>
												</el-form-item>
												<el-form-item label="结束日期" :label-width="formLabelWidth" prop="endTime">
													<el-date-picker v-model="dateRange.endTime" align="right"
														type="date" placeholder="选择结束日期" :picker-options="pickerOptions"
														style="width: 100%" :format='dateFormat'
														:value-format="dateFormat" clearable>
													</el-date-picker>
												</el-form-item>
											</el-form>
										</el-tab-pane>
										<el-tab-pane label="按月" name="month">
											<el-form ref="formMonth" :model="month" :rules="rulesMonth">
												<el-form-item label="开始月" :label-width="formLabelWidth"
													prop="startMonth">
													<el-date-picker v-model="month.startMonth" align="right"
														type="month" placeholder="选择开始月" style="width: 100%"
														:format='monthFormat' :value-format="monthFormat">
													</el-date-picker>
												</el-form-item>
												<el-form-item label="结束月" :label-width="formLabelWidth" prop="endMonth">
													<el-date-picker v-model="month.endMonth" align="right" type="month"
														placeholder="选择结束月" style="width: 100%" :format='monthFormat'
														:value-format="monthFormat" clearable>
													</el-date-picker>
												</el-form-item>

												<!-- <el-form-item label="月份范围" :label-width="formLabelWidth"
													prop="startTime">
													<el-date-picker v-model="month.range" type="monthrange"
														range-separator="至" start-placeholder="开始月份"
														end-placeholder="结束月份">
													</el-date-picker>
												</el-form-item> -->
											</el-form>
										</el-tab-pane>
										<el-tab-pane label="按季度" name="quarter">
											<el-form ref="formQuarter" :model="quarter" :rules="rulesQuarter">
												<el-form-item label="季度" :label-width="formLabelWidth" prop="range">
													<ElQuarterPicker ref="ElQuarterPicker" v-model="quarter.range"
														placeholder="选择季度">
													</ElQuarterPicker>
												</el-form-item>
											</el-form>

										</el-tab-pane>
									</el-tabs>
									<el-button type="primary" ref="button" @click="search">搜索</el-button>
								</el-collapse-item>
							</el-collapse>
						</div>

					</div>
					<div v-show="false">
						<riskTable ref="riskTable" :primary_key="primary_key" :type='20'></riskTable>
					</div>
				</div>
			</div>
		</el-col>
	</el-row>

</template>

<script>
	import {
		transformWGS84,
		transformBD09,
		transformGCJ02,
		UCSType,

	} from '@/utils/MapUtils'
	import {
		UCSIsInVisualcenterAndZoom,
		PointIsInVisual,
		clearOverlays,
		addOverlayUCS,
		GetGeoc,
		getLocationByUCS,
		mapBuild,
		getCurrentPositionAndMark,
		getCurrentPosition,
		getLocation,
		centerAndZoomByPoint,
		LocalSearch,
		UCSconvertToPoint,
		BaiduSize,
		BaiduLabel
	} from '@/utils/BaiduMapUtils'
	import {
		isNumEx,
		isTel,
		isPhone
	} from '@/utils/validate'
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
		getdayEx,
		mGetDate
	} from '@/utils/dateHelp';
	import ElQuarterPicker from '@/components/ElQuarterPicker/ElQuarterPicker'
	import {
		mapGetters
	} from 'vuex'
	import greenMarker from '@/assets/map/marker/greenMarker.png'
	import orangeMarker from '@/assets/map/marker/orangeMarker.png'
	import redMarker from '@/assets/map/marker/redMarker.png'
	import yellowMarker from '@/assets/map/marker/yellowMarker.png'
	import riskTable from '../../MixingPlant/MixProduction/table/riskTable'
	let map = null,
		geoc = null;
	export default {
		name: "MixMap",
		components: {
			ElQuarterPicker,
			riskTable
		},
		props: {
			readonly: {
				type: Boolean,
				default: false
			},
			formLabelWidth: {
				type: String,
				default: '120px'
			},
			value: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		computed: {
			getMapIdomputed() {
				try {
					let htmlCollection = document.getElementsByClassName('BaiduMap');
					return this.mapId + htmlCollection;
				} catch (e) {
					console.log(e);
				}
			},
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				current_and_chrilren_org: 'org/current_and_chrilren_org',
				person_id: 'user/person_id',
			}),
		},
		watch: {
			org_id(newVal, oldVal) {
				// if (newVal && newVal > 0) {
				// 	this.search();

				// }
			},
			current_org_id(newVal, oldVal) {
				if (newVal && newVal > 0 && this.map) {
					this.search();

				}
			},
			value(newVal, oldVal) {
				if (newVal) {
					this.mapBuild()

				}
			},
		},
		beforeDestroy() {
			try {
				this.clearOverlays();
				let map = this.$refs['allmap']
				if (this.isShowlog) {
					console.log('beforeDestroy', map);
				}
				/**
				 * 销毁百度地图
				 */
				try {

					// 注销地图（换成你初始化时定义的地图变量）
					this.map = null

					// 获取interval的最高ID然后遍历清除
					const HIGHEST_INTERVAL_ID = setInterval(';')
					for (let i = 0; i < HIGHEST_INTERVAL_ID; i++) {
						clearInterval(i)
					}

					// 获取百度地图创建的DOM并销毁
					const BAIDU_MAPS = map // document.querySelectorAll('.tangram-suggestion-main')
					BAIDU_MAPS.forEach((item) => {
						document.body.removeChild(item)
					})
				} catch (e) {
					console.log(e);
				}
			} catch (e) {
				console.log(e);
			}
		},
		destroyed() {

		},
		data() {
			let that = this;
			return {
				isShowlog: false,
				primary_key: 0,
				point: [],
				riskTableEl: '',
				overlays: [],
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(4),
				monthFormat: dateFormat(5),
				activeNames: '',
				tabsActiveName: 'dateRange',
				mapStyle: {
					width: 0,
					height: 'calc( 100vh - 50px - 48px - 10px - 10px )',
				},
				rulesDateRange: {
					startTime: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择开始时间'
					}]
				},
				rulesMonth: {
					startMonth: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择开始月份'
					}]
				},
				rulesQuarter: {
					range: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择季度'
					}]
				},
				map: '',
				mapId: 'MiaxMapcontainer',
				span: 24,
				span22: 22,
				span20: 20,
				span19: 19,
				span17: 17,
				span15: 15,
				span4: 4,
				span3: 3,
				span2: 2,
				selectData: {
					gps_type: [{
						key: 1,
						value: UCSType.WGS84,
						label: 'WGS84(GPS设备得到,例如安卓手机的cellular-z等)',
					}, {
						key: 2,
						value: UCSType.GCJ02,
						label: 'GCJ02(高德地图、搜狗地图、SOSO地图、谷歌地图、必应地图和雅虎地图等)',
					}, {
						key: 3,
						value: UCSType.BD09,
						label: 'BD09(百度地图)',
					}]
				},
				formOld: {

				},
				dateRange: {
					startTime: getdayEx(undefined, undefined, dateFormat(4)),
					endTime: getdayEx(undefined, undefined, dateFormat(4)),

				},
				month: {
					range: '',
					startMonth: '',
					endMonth: ''
				},
				quarter: {
					range: '',
				},
				form: {
					gps_type: '',
					WGS84longitude: '',
					WGS84latitude: '',
					GCJ02longitude: '',
					GCJ02latitude: '',
					BD09longitude: '',
					BD09latitude: '',
				},
				rules: {

				},
				dialogMap: false,
				mapName: "",
				mapPointName: "",
				loading: true,
				mapGetshow: true,
				dialogName: "",
				roleMax: '',
				org_type: '',
			};
		},
		created() {

			this.getMapId();
			this.setHeight();
			this.init();

		},
		methods: {
			async init() {
				if (this.org_id && this.org_id > 0) {
					let org_type = await this.$store.dispatch('org/GetOrgType', this.org_id);
					this.org_type = org_type;
					let roleMax = await this.$store.dispatch('user/getRoleMax');
					this.roleMax = roleMax;
					this.mapBuild();
				}
			},
			GetTabsActiveName() {
				return this.tabsActiveName;
			},
			async GetOrgId() {
				// if (this.org_type.replace(' ', '') == '市建委' || this.roleMax == 'super_admin') {
				// 	//return "all";
				// 	this.current_org_id;
				// }
				//this.$store.getters['org/']
				let org_id = this.current_org_id;
				if (org_id < 0) {
					org_id = this.org_id;
				}
				let org_type = await this.$store.dispatch('org/GetOrgType', org_id);
				if (this.isShowlog) {
					console.log('this.org_type', org_type)
				}
				if (org_type.indexOf('建委') > 0) {
					return org_id;
				}
				if (this.isShowlog) {
					console.log(this.current_and_chrilren_org);
				}
				return this.current_and_chrilren_org.replace(/'/g, '');
			},
			async GetMixInfo() {
				let mixInfo = [];
				try {
					let sqlcode = 1018;
					let list = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}]
					mixInfo = await this.QueryExec_fob(sqlcode, list, {
						org_id: await this.GetOrgId()
					});
					mixInfo = mixInfo.data;
				} catch (e) {
					console.log(e);
				}
				return mixInfo;
			},
			async GetMixRisksTotal(startTime, endTime) {
				let data = [];
				try {

					let sqlcode = 1019;
					let list = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'startTime',
						type: 3,
						level: 2,
					}, {
						field: 'endTime',
						type: 3,
						level: 3,
					}];
					let filed = {
						org_id: await this.GetOrgId(),
						startTime: startTime,
						endTime: endTime
					};
					data = await this.QueryExec_fob(sqlcode, list, filed);
					data = data.data;
				} catch (e) {
					console.log(e);
				}
				return data;
			},
			async GetMixRisksMaxLevel(startTime, endTime) {
				let data = [];
				try {
					let sqlcode = 1020;
					let list = [{
						field: 'org_id',
						type: 3,
						level: 1,
					}, {
						field: 'startTime',
						type: 3,
						level: 2,
					}, {
						field: 'endTime',
						type: 3,
						level: 3,
					}];
					let filed = {
						org_id: await this.GetOrgId(),
						startTime: startTime,
						endTime: endTime
					};
					data = await this.QueryExec_fob(sqlcode, list, filed);
					data = data.data;
				} catch (e) {
					console.log(e);
				}
				return data;
			},

			mergeData(mixData, MixRisksTotal, MixRisksMaxLevel) {
				let aResult = [];
				try {
					if (!MixRisksTotal) {
						MixRisksTotal = [];
					}
					if (!MixRisksMaxLevel) {
						MixRisksMaxLevel = [];
					}
					let length = mixData.length;

					for (let i = 0; i < length; i++) {
						try {
							let item, riskTotal, riskMaxLevel, org_id, aTemp;
							item = mixData[i];
							if (!item.org_id) {
								continue;
							}
							org_id = item.org_id;
							aTemp = MixRisksTotal.filter((e) => {
								if (e.org_id == org_id) {
									return e;
								}
							})
							if (aTemp && aTemp.length > 0) {
								riskTotal = aTemp[0];
								item.total = riskTotal.total;
							}
							aTemp = MixRisksMaxLevel.filter((e) => {
								if (e.org_id == org_id) {
									return e;
								}
							})
							if (aTemp && aTemp.length > 0) {
								riskMaxLevel = aTemp[0];
								item.maxLevel = riskMaxLevel.maxLevel;
							}
							if (typeof item.total == 'undefined') {
								item.total = 0;
							} else {
								item.total = parseFloat(item.total);
							}
							if (typeof item.maxLevel == 'undefined') {
								item.maxLevel = 0;
							} else {
								item.maxLevel = parseFloat(item.maxLevel);
							}
							// switch (parseInt(item.org_id)) {
							// 	case 20101:
							// 	case 20201:
							// 	case 20301:
							// 	case 20401:
							// 	case 20601:
							// 	case 20602:
							// 	case 20701:
							// 		console.log('MixRisksMaxLevel aTemp', riskMaxLevel);
							// 		console.log('MixRisksTotal aTemp', riskTotal);
							// 		console.log('item ', item);
							// 		break;
							// }
							aResult.push(item);
						} catch (e) {
							console.log(e);
						}
					}
				} catch (e) {
					console.log(e);
				}
				return aResult;
			},
			dateRangeData() {
				let data = this.dateRange;
				let startTime = data.startTime;
				let endTime = data.endTime;
				if (startTime) {
					startTime = startTime + ' 00:00:00';
				}
				if (endTime) {
					endTime = endTime + ' 23:59:59';
				}
				//console.log('dateRangeData',data)
				return {
					startTime: startTime,
					endTime: endTime,
				}
			},
			monthRangeData() {
				let data = this.month;
				let startMonth = data.startMonth;
				let endMonth = data.endMonth;
				//console.log('month', this.month)
				let startTime = '';
				let endTime = '';
				if (startMonth) {
					startTime = startMonth + '-01 00:00:00';
				}
				if (endMonth) {
					try {
						let endMonthSplit = endMonth.split('-');
						let day = mGetDate(endMonthSplit[0], endMonthSplit[1]);
						endTime = endMonth + '-' + day + ' 23:59:59';
					} catch (e) {
						console.log(e);
						endTime = endMonth + '-30 23:59:59';
					}

				}
				//console.log('dateRangeData',data)
				return {
					startTime: startTime,
					endTime: endTime,
				}
			},
			quarterRangeData() {
				let data = this.quarter;
				let startMonth = data.startMonth;
				let endMonth = data.endMonth;
				return this.$refs['ElQuarterPicker'].changeToDateTime();

			},
			clearOverlays() {
				this.point = [];
				clearOverlays(this.map);
				for (let i = 0; i < this.overlays; i++) {
					try {
						let item = this.overlays[i];
						let marker = item.marker;
						marker.removeEventListener('click', item.fn);
					} catch (e) {
						console.log(e);
					}
				}
				this.overlays = [];
			},
			isRepeat(lng, lat) {
				try {
					lat = parseFloat(lat);
					lng = parseFloat(lng);
					let points = this.point;
					for (let i = 0; i < points.length; i++) {
						let point = points[i];
						if (this.isShowlog) {
							console.log(point)
							console.log(point.lat, lat, point.lng, lng, point.lat == lat, point.lng == lng);
						}

						if (point.lat == lat && point.lng == lng) {
							return true;
						}
					}
				} catch (e) {
					console.log(e);
					return false;
				}

			},
			async search(event) {
				this.loading = true;
				try {
					if (!this.riskTableEl) {
						this.riskTableEl = await this.getRefAttributeEl('riskTable');
					}
					let that = this;
					let filed = {};
					let valid = false;
					switch (this.GetTabsActiveName()) {
						case 'dateRange':
							valid = await this.validateForm('formDate');
							break;
						case 'month':
							valid = await this.validateForm('formMonth');
							break;
						case 'quarter':
							valid = await this.validateForm('formQuarter');
							break;
					}
					if (this.isShowlog) {
						console.log(this.GetTabsActiveName(), valid);
					}
					if (!valid) {
						this.$baseMessage('搜索内容输入错误', 'error');
						return;
					}
					switch (this.GetTabsActiveName()) {
						case 'dateRange':
							filed = this.dateRangeData();
							break;
						case 'month':
							filed = this.monthRangeData();
							break;
						case 'quarter':
							filed = this.quarterRangeData();
							break;
					}
					if (this.isShowlog) {
						console.log('search filed', filed)
					}

					let mixData = await this.GetMixInfo();
					if (this.isShowlog) {
						console.log('GetMixInfo', mixData);
					}
					let MixRisksTotal = await this.GetMixRisksTotal(filed.startTime, filed.endTime);
					if (this.isShowlog) {
						console.log('GetMixRisksTotal', MixRisksTotal);
					}
					let MixRisksMaxLevel = await this.GetMixRisksMaxLevel(filed.startTime, filed.endTime);
					if (this.isShowlog) {
						console.log('MixRisksMaxLevel', MixRisksMaxLevel);
					}
					let data = this.mergeData(mixData, MixRisksTotal, MixRisksMaxLevel);
					if (this.isShowlog) {
						console.log('mergeData', data);
					}
					let length = data.length;
					let points = [];
					this.clearOverlays(this.map);

					let jump = false;
					for (let i = 0; i < length; i++) {
						let item = data[i];
						// switch (parseInt(item.org_id)) {
						// 	case 20101:
						// 	case 20201:
						// 	case 20301:
						// 	case 20401:
						// 	case 20601:
						// 	case 20602:
						// 	case 20701:
						// 		console.log('item ', item);
						// 		//console.log(this.isRepeat(item.longitude, item.latitude, true));
						// 		break;
						// }
						if (this.isRepeat(item.longitude, item.latitude)) {
							jump = true;
							if (this.isShowlog) {
								console.log('跳过', item.longitude, item.latitude);
							}
							continue;
						}
						let marker = this.initMarker(item); //创建标注点
						this.point.push(marker.latLng);
						let label = this.initLabel(item); //创建文字标签

						if (item.total > 0) {
							marker.setLabel(label);
						}
						try {
							this.map.addOverlay(marker);
						} catch (e) {
							console.log(e);
						}
						//this.map.addOverlay(label);
						let overlay = {
							marker: marker,
							label: label,
							fn: function(event) {
								if (this.isShowlog) {
									console.log('addEventListener', event);
									console.log('addEventListener item', item);
									console.log('addEventListener overlay', overlay);
								}

								//that.primary_key = item.org_id;
								let opts = {
									width: 400,
									height: 500,
									title: item.full_org_name
								};
								let infoWindow = new BMapGL.InfoWindow(that.riskTableEl, opts);
								that.map.openInfoWindow(infoWindow, marker.latLng); // 开启信息窗口
								that.$refs['riskTable'].search({
									startTime: filed.startTime,
									endTime: filed.endTime,
									org_id: item.org_id
								});
								// this_.map.openInfoWindow(infoWindow, opt.point); //开启信息窗口
								// this_.map.removeOverlay(marker);
								// opt.data.type = "blue";
								// this_.setInfoWindow();
								// $(".BMap_pop>img").hide();
							}
						}
						this.overlays.push(overlay);
						// 监听打开信息窗口
						let this_ = item;
						marker.addEventListener("click", overlay.fn);
					}
					try {
						//this.point = points;
						if (this.isShowlog) {
							console.log('points', this.point);
							console.log('setViewport', this.map.setViewport);
						}
						this.map.setViewport(this.point);
					} catch (e) {
						console.log(e);
					}
					if (jump) {
						this.$baseMessage('存在重复位置，显示位置将比实际少', 'error')
					}
				} catch (e) {
					console.log(e);
				}
				this.loading = false;

			},
			// 初始化标注
			initMarker(data) {
				let myIcon = null;
				let pt = UCSconvertToPoint(data.longitude, data.latitude);
				let size = [21, 26];
				if (data.total < 10) {
					size = [21, 26]
				} else if (data.total >= 10 && data.total < 100) {
					size = [31, 36]
				} else if (data.total >= 100 && data.total < 1000) {
					size = [31, 36]
					// size = [47, 52]/
				}
				if (data.maxLevel == 3) {
					myIcon = new BMapGL.Icon(redMarker, BaiduSize(size[0], size[1]));
				} else if (data.maxLevel == 1) {
					myIcon = new BMapGL.Icon(
						yellowMarker,
						BaiduSize(size[0], size[1])
					);
				} else if (data.maxLevel == 2) {
					myIcon = new BMapGL.Icon(
						orangeMarker,
						BaiduSize(size[0], size[1])
					);
				} else {
					myIcon = new BMapGL.Icon(greenMarker, BaiduSize(size[0], size[1]));
				}
				return new BMapGL.Marker(pt, {
					icon: myIcon
				});
				//  return new BMap.Marker(pt);
			},
			// 初始化文字标签
			initLabel(data) {
				let opts = {
					position: UCSconvertToPoint(data.longitude, data.latitude), // 指定文本标注所在的地理位置
					offset: BaiduSize(-8, -25) //设置文本偏移量
				};
				if (data.total < 10) {
					opts.offset = BaiduSize(-4, -18);
				} else if (data.total >= 10 && data.total < 100) {
					opts.offset = BaiduSize(-8, -18);
				} else if (data.total >= 100 && data.total < 1000) {
					opts.offset = BaiduSize(-12, -18);
				}
				let color = '#fff';
				if (data.maxLevel == 3) {
					color = '#fff';
				} else if (data.maxLevel == 1) {
					color = '#0000ff';
				} else if (data.maxLevel == 2) {
					color = '#fff';
				} else {
					color = '#fff';
				}
				let label = BaiduLabel(data.total, opts); // 创建文本标注对象
				label.setStyle({
					color: color,
					border: "none",
					fontSize: "12px",
					height: "20px",
					lineHeight: "20px",
					fontFamily: "微软雅黑",
					background: "rgba(0,0,0,0)"
				});
				return label;
			},
			handleChange() {

			},
			handleClick() {

			},
			getAttribute() {
				let that = this;
				return new Promise(async (resolve, reject) => {
					let index = setInterval(() => {
						if (that.$el) {
							clearInterval(index);
							resolve(that.$el);
						}
					})
				})
			},
			getRefAttributeEl(ref) {
				let that = this;
				return new Promise(async (resolve, reject) => {
					let index = setInterval(() => {
						try {
							//console.log(ref, that.$refs[ref])
							//console.log(ref, that.$refs[ref].$el)
							if (that.$refs[ref] && that.$refs[ref].$el) {
								clearInterval(index);
								resolve(that.$refs[ref].$el);
							}
							setTimeout(() => {
								clearInterval(index);
							}, 30000)
						} catch (e) {
							clearInterval(index);
							console.log(e);

						}

					})
				}, 1000)
			},
			getRefAttribute(ref) {
				let that = this;
				return new Promise(async (resolve, reject) => {
					let index = setInterval(() => {
						try {
							//console.log(ref, that.$refs[ref])
							if (that.$refs[ref]) {
								clearInterval(index);
								resolve(that.$refs[ref]);
							}
							setTimeout(() => {
								clearInterval(index);
							}, 30000)
						} catch (e) {
							clearInterval(index);
							console.log(e);
						}

					})
				}, 1000)
			},
			async setHeight() {
				// this.mapStyle.width = document.getElementById(this.mapId).clientWidth + 'px';
				// this.mapStyle.height = document.getElementById(this.mapId).clientHeight + 'px';
				console.log(await this.getAttribute());
			},
			getMapId() {
				try {
					let htmlCollection = document.getElementsByClassName('MixBaiduMap');
					this.mapId = this.mapId + htmlCollection.length;
					if (this.isShowlog) {
						console.log('htmlCollection', htmlCollection, htmlCollection.length)
						console.log('this.mapId', this.mapId)
					}
				} catch (e) {
					console.log(e);
				}
			},
			buttontest(e) {
				console.log('buttontest', e);
			},
			validateFormRef(ref) {
				return new Promise((resolve, reject) => {
					ref.validate((valid) => {

						resolve(valid);
					})
				})

			},
			async validateForm(refName) {
				return await this.validateFormRef(this.$refs[refName]);
			},
			async myZoomCtrl() {
				let control = await this.getRefAttribute('control');
				//定义一个控件类
				function ZoomControl() {
					this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
					this.defaultOffset = new BMapGL.Size(20, 20)
				}
				//通过JavaScript的prototype属性继承于BMap.Control
				ZoomControl.prototype = new BMapGL.Control();

				//自定义控件必须实现自己的initialize方法，并且将控件的DOM元素返回
				//在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
				ZoomControl.prototype.initialize = function(map) {
					//创建一个dom元素
					var div = document.createElement('div');
					//添加文字说明
					//div.appendChild(document.createTextNode('放大2级'));

					div.appendChild(control);
					// 设置样式
					div.style.cursor = "pointer";
					div.style.padding = "7px 10px";
					div.style.boxShadow = "0 2px 6px 0 rgba(27, 142, 236, 0.5)";
					div.style.borderRadius = "5px";
					div.style.backgroundColor = "white";
					// 绑定事件,点击一次放大两级
					// div.onclick = function(e) {
					// 	map.setZoom(map.getZoom() + 2);
					// }
					// 添加DOM元素到地图中
					map.getContainer().appendChild(div);
					// 将DOM元素返回
					return div;
				}
				//创建控件元素
				var myZoomCtrl = new ZoomControl();
				this.map.addControl(myZoomCtrl);
			},

			showDataBaseMark(lng, lat) {
				let that = this;
				let index = setInterval(() => {
					try {
						if (!that.loading && this.map) {
							clearInterval(index);
							setTimeout(() => {
								that.addOverlay(lng, lat);
								//centerAndZoomByPoint(map, r.position.point, 10);
							}, 1000)

						}
					} catch (e) {
						clearInterval(index);
					}

				})
			},

			showInMap() {
				this.$refs['mapform'].validate((valid) => {
					if (this.isShowlog) {
						console.log('valid', valid);
					}
					if (valid) {
						let PointJson = this.ConvertUCS();
						if (this.isShowlog) {
							console.log('PointJson', PointJson);
						}
						if (PointJson && PointJson.BD09) {
							this.addOverlay(PointJson.BD09[0], PointJson.BD09[1]);
						} else {
							this.$baseMessage('坐标转换失败', 'error')
						}

					} else {
						return false
					}
				})


			},

			ConvertUCSEx(longitude, latitude, gps_type) {
				let PointJson = {};
				if (!gps_type) {
					gps_type = this.form.gps_type;
				}
				switch (gps_type) {
					case UCSType.WGS84:
						PointJson = transformWGS84(longitude, latitude);
						break;
					case UCSType.BD09:
						PointJson = transformBD09(longitude, latitude);
						break;
					case UCSType.GCJ02:
						PointJson = transformGCJ02(longitude, latitude);
						break;
				}
				return PointJson;
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			GetGeoc() {
				if (geoc) {
					return geoc;
				}
				geoc = GetGeoc();
			},
			async addOverlay(lng, lat) {
				clearOverlays(this.map);
				addOverlayUCS(this.map, lng, lat);
				UCSIsInVisualcenterAndZoom(this.map, lng, lat, 17);
			},

			//地图显示
			async mapBuild() {
				let that = this;
				this.dialogMap = !this.dialogMap;
				let config = {
					clickEventListener: function(e) {
						//console.log(e);

					},
					locationControl: {
						enable: false,
					}
				}
				if (this.isShowlog) {
					console.log('map', this.map);
				}
				if (this.mapGetshow) {
					//if (!map) {
					this.map = await mapBuild(this.mapId, config);
					if (this.isShowlog) {
						console.log('map end', this.map);
					}
					this.mapGetshow = false;
					this.myZoomCtrl();
				}

				this.loading = false;
				setTimeout(() => {
					if (this.org_id && this.org_id > 0) {
						this.search();

					}
				}, 500)

			}
		}
	};
</script>
<style scoped lang="scss">
	//@import "../../filters/css/all.css";
	.addHospital {
		width: 100%;
		height: 100%;


		.map {
			// padding: 10px;
			width: 100%;
			height: 100%;
			//position: relative;

			.input-with-select {}

			.map-btn {
				padding: 10px 20px;
				margin: auto;
				text-align: right;

				button {
					padding: 12px 30px;
				}
			}

			.MixBaiduMap {
				width: 100%;
				height: $base-app-main-height;
				overflow: hidden;
				position: absolute;
				margin: 0;
			}
		}
	}
</style>
