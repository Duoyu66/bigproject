<template>
	<el-form ref="mapform" :model="form" :rules="rules" style="padding-right: 0px;">
		<el-row>
			<el-col :span="span">
				<el-form-item label="坐标类型" :label-width="formLabelWidth" prop="gps_type">
					<el-select v-model="form.gps_type" style="width: 100%" :disabled="readonly"
						:placeholder="isReadOnly('请选择坐标类型')" clearable>
						<el-option v-for="data in selectData.gps_type" :key="data.key" :label="data.label"
							:value="data.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="form.gps_type=='WGS84'">
				<el-form-item label="WGS84经度" :label-width="formLabelWidth" prop="WGS84longitude">
					<el-input v-model="form.WGS84longitude" :placeholder="isReadOnly('请输入WGS84经度')" style="width:100%"
						:readonly="readonly" maxlength="14">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span15" v-show="form.gps_type=='WGS84'">
				<el-form-item label="WGS84纬度" :label-width="formLabelWidth" prop="WGS84latitude">
					<el-input v-model="form.WGS84latitude" :placeholder="isReadOnly('请输入WGS84纬度')" style="width:100%"
						:readonly="readonly" maxlength="14">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="form.gps_type=='GCJ02'">
				<el-form-item label="GCJ02经度" :label-width="formLabelWidth" prop="GCJ02longitude">
					<el-input v-model="form.GCJ02longitude" :placeholder="isReadOnly('请输入GCJ02经度')" style="width:100%"
						:readonly="readonly" maxlength="14">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span15" v-show="form.gps_type=='GCJ02'">
				<el-form-item label="GCJ02纬度" :label-width="formLabelWidth" prop="GCJ02latitude">
					<el-input v-model="form.GCJ02latitude" :placeholder="isReadOnly('请输入GCJ02纬度')" style="width:100%"
						:readonly="readonly" maxlength="14">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span" v-show="form.gps_type=='BD09'">
				<el-form-item label="BD09经度" :label-width="formLabelWidth" prop="BD09longitude">
					<el-input v-model="form.BD09longitude" :placeholder="isReadOnly('请输入BD09经度')" style="width:100%"
						:readonly="readonly" maxlength="14">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span15" v-show="form.gps_type=='BD09'">
				<el-form-item label="BD09纬度" :label-width="formLabelWidth" prop="BD09latitude">
					<el-input v-model="form.BD09latitude" :placeholder="isReadOnly('请输入BD09纬度')" style="width:100%"
						:readonly="readonly" maxlength="14">
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span4" v-show="form.gps_type">
				<el-button type="primary" @click="showInMap">
					在地图中显示
				</el-button>

			</el-col>
			<el-col :span="span2" v-show="form.gps_type">
				<el-button type="primary" @click="GetMapMark">
					获取地图标注位置
				</el-button>
			</el-col>
			<el-col :span="span" v-show="form.gps_type">
				<div class="addHospital">
					<div class="map" v-loading="loading">
						<el-input placeholder="请输入搜索地址" v-model="mapName" class="input-with-select">
							<el-button slot="append" icon="el-icon-search" @click="mapNameChange"></el-button>
						</el-input>
						<div style="padding:10px 0;" v-if="mapPointName">当前选中：{{mapPointName}}</div>
						<div :id="mapId" class="BaiduMap" style="height: 400px; width: 100%" ref="allmap"></div>
						<div class="map-btn" v-if="false">
							<el-button type="primary" @click="dialogMap = false">确认</el-button>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
	</el-form>
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
		UCSconvertToPoint
	} from '@/utils/BaiduMapUtils'
	import {
		isNumEx,
		isTel,
		isPhone
	} from '@/utils/validate'
	let map = null,
		geoc = null;
	export default {
		name: "coordinateShowAndGet",
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
		},
		watch: {
			value(newVal, oldVal) {
				if (newVal) {

					this.updataByValue();
					this.mapBuild()

				}
			},
		},
		data() {
			let that = this;
			return {
				map: '',
				mapId: 'container',
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
					WGS84longitude: [{
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (that.GetGpsType() == UCSType.WGS84) {
								if (!value) {
									callback(new Error('请填写WGS84经度'));
								} else if (!isNumEx(value)) {
									callback(new Error('请填写数字'));
								} else {
									callback();
								}
								return;
							}
							callback();
							return
						}
					}],
					WGS84latitude: [{
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (that.GetGpsType() == UCSType.WGS84) {
								if (!value) {
									callback(new Error('请填写WGS84纬度'));
								} else if (!isNumEx(value)) {
									callback(new Error('请填写数字'));
								} else {
									callback();
								}
								return;
							}
							callback()
							return
						}
					}],
					GCJ02longitude: [{
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (that.GetGpsType() == UCSType.GCJ02) {
								if (!value) {
									callback(new Error('请填写GCJ02经度'));
								} else if (!isNumEx(value)) {
									callback(new Error('请填写数字'));
								} else {
									callback();
								}
								return;
							}
							callback()
							return
						}
					}],
					GCJ02latitude: [{
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (that.GetGpsType() == UCSType.GCJ02) {
								if (!value) {
									callback(new Error('请填写GCJ02纬度'));
								} else if (!isNumEx(value)) {
									callback(new Error('请填写数字'));
								} else {
									callback();
								}
								return;
							}
							callback()
							return
						}
					}],
					BD09longitude: [{
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (that.GetGpsType() == UCSType.BD09) {
								if (!value) {
									callback(new Error('请填写BD09经度'));
								} else if (!isNumEx(value)) {
									callback(new Error('请填写数字'));
								} else {
									callback();
								}
								return;
							}
							callback()
							return
						}
					}],
					BD09latitude: [{
						trigger: ['blur', 'change'],
						validator: function(rule, value, callback) {
							if (that.GetGpsType() == UCSType.BD09) {
								if (!value) {
									callback(new Error('请填写BD09纬度'));
								} else if (!isNumEx(value)) {
									callback(new Error('请填写数字'));
								} else {
									callback();
								}
								return;
							}
							callback()
							return
						}
					}],
				},
				dialogMap: false,
				mapName: "",
				mapPointName: "",
				loading: true,
				mapGetshow: true,
				dialogName: ""
			};
		},
		created() {
			this.getMapId();

			this.updataByValue();
			this.mapBuild()
		},
		methods: {
			getMapId() {
				try {
					let htmlCollection = document.getElementsByClassName('BaiduMap');
					this.mapId = this.mapId + htmlCollection.length;
					console.log('htmlCollection', htmlCollection, htmlCollection.length)
					console.log('this.mapId', this.mapId)
				} catch (e) {
					console.log(e);
				}
			},
			updataByValue() {
				try {
					let value = this.value;

					if (!value || JSON.stringify(value) == '{}') {
						this.form = Object.assign(this.form, form);
						this.formOld = Object.assign(this.formOld, form);
						return;
					}
					let gps_type = '';
					if (value.gps_type) {
						gps_type = value.gps_type;
					}
					let longitude = value.longitude;
					let latitude = value.latitude;
					let form = {
						WGS84longitude: '',
						WGS84latitude: '',
						GCJ02longitude: '',
						GCJ02latitude: '',
						BD09longitude: '',
						BD09latitude: '',
						gps_type: gps_type
					}
					let keyList = ['WGS84longitude', 'WGS84latitude', 'GCJ02longitude', 'GCJ02latitude', 'BD09longitude',
						'BD09latitude'
					];
					for (let key in value) {
						if (keyList.indexOf(key) < 0) {
							continue;
						}
						form[key] = value[key];
					}
					switch (gps_type) {
						case UCSType.WGS84:
							if (value.WGS84longitude) {
								longitude = value.WGS84longitude;
							}
							if (value.WGS84latitude) {
								latitude = value.WGS84latitude;
							}
							form.WGS84longitude = longitude;
							form.WGS84latitude = latitude;
							break;
						case UCSType.BD09:
							if (value.BD09longitude) {
								longitude = value.BD09longitude;
							}
							if (value.BD09latitude) {
								latitude = value.BD09latitude;
							}
							form.BD09longitude = longitude;
							form.BD09latitude = latitude;
							break;
						case UCSType.GCJ02:
							if (value.GCJ02longitude) {
								longitude = value.GCJ02longitude;
							}
							if (value.GCJ02latitude) {
								latitude = value.GCJ02latitude;
							}
							form.GCJ02longitude = longitude;
							form.GCJ02latitude = latitude;
							break;
					}
					this.form = Object.assign(this.form, form);
					this.formOld = Object.assign(this.formOld, form);

				} catch (e) {
					console.log(e);
				}
			},
			GetGpsType() {
				return this.form.gps_type;
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
			GetMapMark() {
				console.log(this.map._overlays)
				let overlays = undefined;
				for (let key in this.map._overlays) {
					overlays = this.map._overlays[key];
				}
				if (!overlays) {
					this.$baseMessage('没有找到标注点', 'error');
					return;
				}
				let latLng = overlays.latLng;
				this.form.gps_type = UCSType.BD09;
				this.form.BD09longitude = latLng.lng;
				this.form.BD09latitude = latLng.lat;
			},
			showInMap() {
				this.$refs['mapform'].validate((valid) => {
					console.log('valid', valid);
					if (valid) {
						let PointJson = this.ConvertUCS();
						console.log('PointJson', PointJson);
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
			ConvertUCS() {
				let PointJson = {
					GCJ02: [-1, -1],
					BD09: [-1, -1],
					WGS84: [-1, -1],
					fromType: this.form.gps_type
				}
				//console.log('ConvertUCS', !this.form.gps_type, this.form.gps_type);
				if (!this.form.gps_type) {
					PointJson = {
						GCJ02: [-1, -1],
						BD09: [-1, -1],
						WGS84: [-1, -1],
						fromType: ''
					}
					return PointJson;
				}
				let keyList = ['WGS84longitude', 'WGS84latitude', 'GCJ02longitude', 'GCJ02latitude', 'BD09longitude',
					'BD09latitude'
				];
				let isChange = false;
				try {
					for (let key in this.formOld) {
						if (keyList.indexOf(key) < 0) {
							continue;
						}
						if (this.form[key] != this.formOld[key]) {
							isChange = true;
							break;
						}

					}
				} catch (e) {
					console.log(e);
					isChange = true;
				}

				//未发生变化
				if (!isChange) {
					PointJson = {
						GCJ02: [this.form.GCJ02longitude, this.form.GCJ02latitude],
						BD09: [this.form.BD09longitude, this.form.BD09latitude],
						WGS84: [this.form.WGS84longitude, this.form.WGS84latitude],
						fromType: this.form.gps_type
					}
					return PointJson;
				}
				switch (this.form.gps_type) {
					case UCSType.WGS84:
						if (this.form.WGS84longitude) {
							PointJson.WGS84[0] = this.form.WGS84longitude;
						}
						if (this.form.WGS84latitude) {
							PointJson.WGS84[1] = this.form.WGS84latitude;
						}
						if (!this.form.WGS84longitude || !this.form.WGS84latitude) {
							return PointJson;
						}
						PointJson = this.ConvertUCSEx(this.form.WGS84longitude, this.form.WGS84latitude);
						break;
					case UCSType.GCJ02:
						if (this.form.GCJ02longitude) {
							PointJson.GCJ02[0] = this.form.GCJ02longitude;
						}
						if (this.form.GCJ02latitude) {
							PointJson.GCJ02[1] = this.form.GCJ02latitude;
						}
						if (!this.form.GCJ02longitude || !this.form.GCJ02latitude) {
							return PointJson;
						}
						PointJson = this.ConvertUCSEx(this.form.GCJ02longitude, this.form.GCJ02latitude);
						break;
					case UCSType.BD09:
						if (this.form.BD09longitude) {
							PointJson.BD09[0] = this.form.BD09longitude;
						}
						if (this.form.BD09latitude) {
							PointJson.BD09[1] = this.form.BD09latitude;
						}
						if (!this.form.BD09longitude || !this.form.BD09latitude) {
							return PointJson;
						}
						PointJson = this.ConvertUCSEx(this.form.BD09longitude, this.form.BD09latitude);
						break;
				}
				return PointJson;
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
				let re = await getLocationByUCS(this.GetGeoc(), lng, lat);
				if (re && re.addressComponents) {
					let addComp = re.addressComponents;
					this.mapPointName =
						addComp.province +
						addComp.city +
						addComp.district +
						addComp.street +
						addComp.streetNumber;
				}


			},
			//搜索地图
			async mapNameChange() {
				let that = this,
					point,
					marker = null;
				let r = await LocalSearch(this.map, this.mapName);
				if (r) {
					let local = r.instance;
					let res = r.res;
					if (local.getResults() != undefined) {
						//map.clearOverlays(); //清除地图上所有覆盖物
						if (local.getResults().getPoi(0)) {
							// console.log(local.getResults())
							// console.log(local.getResults())
							// point = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
							// map.centerAndZoom(point, 10);
							// marker = new BMapGL.Marker(point); // 创建标注
							// map.addOverlay(marker); // 将标注添加到地图中
							// marker.enableDragging(); // 可拖拽
							// const rs = await getLocation(point);
							// const addComp = rs.addressComponents;
							// console.log(addComp);
							// that.mapPointName =
							// 	addComp.province +
							// 	", " +
							// 	addComp.city +
							// 	", " +
							// 	addComp.district +
							// 	", " +
							// 	addComp.street +
							// 	", " +
							// 	addComp.streetNumber;
						} else {
							this.$baseMessage('未匹配到地点!可拖动地图上的红色图标到精确位置', 'error');
						}
					} else {
						this.$baseMessage('未找到搜索结果', 'error');
					}
				}

			},
			locationControlSuccess(e) {

			},
			locationControlError(e) {
				console.log('locationControlError', e);
			},
			//地图显示
			async mapBuild() {
				let that = this;
				this.dialogMap = !this.dialogMap;
				let config = {
					clickEventListener: function(e) {
						console.log(e);
						that.addOverlay(e.latlng.lng, e.latlng.lat);
					},
					locationControl: {
						enable: false,
						addEventListener: {
							success: function(e) {
								console.log('locationControlSuccess', e);
							},
							error: that.locationControlError
						}
					}
				}
				console.log('map', this.map);
				if (that.mapGetshow) {
					//if (!map) {
					this.map = await mapBuild(this.mapId, config);
					console.log('map', this.map);
					that.mapGetshow = false;
				}



				let point = '';
				let level = 10;
				let rs = '';
				let r = '';
				console.log('this.form.BD09longitude, this.form.BD09latitude', this.form.BD09longitude, this.form
					.BD09latitude);
				if (this.form.BD09longitude && this.form.BD09latitude && parseFloat(this.form.BD09longitude) > 0 &&
					parseFloat(this.form.BD09latitude) > 0) {
					//this.showDataBaseMark(this.form.BD09longitude, this.form.BD09latitude);
					this.showDataBaseMark(this.form.BD09longitude, this.form.BD09latitude);
					rs = await getLocationByUCS(undefined, this.form.BD09longitude, this.form.BD09latitude);
				} else {
					r = await getCurrentPositionAndMark(this.map);
					// console.log('getCurrentPositionAndMark', r);
					if (r) {

						if (r.type = 'geolocation' && r.position && r.position.point) {
							rs = await getLocation(r.position.point);
							point = r.position.point;
						} else if (r.type = 'ip' && r.center) {
							rs = await getLocationByUCS(undefined, r.center.lng, r.center.lat);
							level = r.level;
							point = UCSconvertToPoint(r.center.lng, r.center.lat);
						}
						if (point) {
							setTimeout(() => {
								this.map.centerAndZoom(point, level);
								//centerAndZoomByPoint(map, r.position.point, 10);
							}, 500)
						}
					}
				}
				if (rs && rs.addressComponents) {
					const addComp = rs.addressComponents;
					console.log(addComp);
					that.mapPointName =
						addComp.province +
						addComp.city +
						addComp.district +
						addComp.street +
						addComp.streetNumber;
				}


				that.loading = false;

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

			.input-with-select {}

			.map-btn {
				padding: 10px 20px;
				margin: auto;
				text-align: right;

				button {
					padding: 12px 30px;
				}
			}
		}
	}
</style>
