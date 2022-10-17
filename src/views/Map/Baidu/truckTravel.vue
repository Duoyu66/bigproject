<template>

	<el-row>
		<el-col :span="span">
			<div class="addHospital">
				<div class="map" v-loading="loading">
					<el-input placeholder="请输入搜索地址" v-model="mapName" class="input-with-select" v-if="false">
						<el-button slot="append" icon="el-icon-search" @click="mapNameChange"></el-button>
					</el-input>
					<div style="padding:10px 0;" v-if="false">当前选中：{{mapPointName}}</div>
					<div :id="mapId" class="BaiduMap" style="height: 400px; width: 100%" ref="allmap"></div>
					<div class="map-btn" v-if="false">
						<el-button type="primary" @click="dialogMap = false">确认</el-button>
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
		name: "truckTravel",
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
						console.log(e);

					},
					locationControl: {
						enable: false,
					}
				}
				console.log('map', this.map);
				if (that.mapGetshow) {
					//if (!map) {
					this.map = await mapBuild(this.mapId, config);
					console.log('map', this.map);
					that.mapGetshow = false;
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
