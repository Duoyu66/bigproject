import {
	transformWGS84,
	transformBD09,
	transformGCJ02,
	UCSType,
	navigatorGetCurrentPosition
} from '@/utils/MapUtils'
export const baiduApiEdition = '1.0';
//返回不同版本的BaiduMap
export function GetBaiduMap() {
	switch (baiduApiEdition) {
		case '1.0':
			return BMapGL;
		case '2.0':
			return BMap;
		case '3.0':
			return BMap;
	}
}
//获取可视范围范围
export function GetVisualBound(map) {
	try {
		if (!map) {
			return [];
		}
		return map.getBounds();
	} catch (e) {
		console.log(e);
	}
}
//BD09坐标点是否在可视范围内
export function UCSIsInVisual(map, lng, lat) {
	try {
		let bound = GetVisualBound(map);
		return UCSIsInBound(bound, point);
	} catch (e) {
		console.log(e);
		return false;
	}
}
//百度point是否在可视范围内
export function PointIsInVisual(map, point) {
	try {
		let bound = GetVisualBound(map);
		return PointIsInBound(bound, point);
	} catch (e) {
		console.log(e);
		return false;
	}
}
//BD09坐标点是否在指定范围内
export function UCSIsInBound(bound, lng, lat) {
	try {
		let pt = UCSconvertToPoint(lng, lat);
	} catch (e) {
		console.log(e);
	}
}
//百度point是否在指定范围内
export function PointIsInBound(bound, point) {
	try {
		return bound.containsPoint(point);
	} catch (e) {
		console.log(e);
	}
}
//清楚覆盖物
export function clearOverlays(map) {
	try {
		map.clearOverlays();
	} catch (e) {
		console.log(e);
	}
}
//通过BD09坐标点添加覆盖物
export function addOverlayUCS(map, lng, lat) {
	try {
		let pt = UCSconvertToPoint(lng, lat);
		addOverlayPoint(map, pt);
	} catch (e) {
		console.log(e);
	}
}
export function Marker(point) {
	try {
		let baiduMap = GetBaiduMap();
		return new baiduMap.Marker(point); // 创建标注
	} catch (e) {
		console.log(e);
	}
}
//通过百度point添加覆盖物
export function addOverlayPoint(map, point) {
	try {
		if (!map) {
			return;
		}
		let marker = Marker(point); // 创建标注
		map.addOverlay(marker);
	} catch (e) {
		console.log(e);
	}
}
//将BD09坐标点转换为百度Point
export function UCSconvertToPoint(lng, lat) {
	try {
		let baiduMap = GetBaiduMap();
		return new baiduMap.Point(lng, lat);
	} catch (e) {
		console.log(e);
	}
}
export function BaiduSize(a, b) {
	try {
		let baiduMap = GetBaiduMap();
		return new baiduMap.Size(a, b);
	} catch (e) {
		console.log(e);
	}
}
export function BaiduLabel(a, b) {
	try {
		let baiduMap = GetBaiduMap();
		return new baiduMap.Label(a, b);
	} catch (e) {
		console.log(e);
	}
}
export function BaiduIcon(a, b) {
	try {
		let baiduMap = GetBaiduMap();
		return new baiduMap.Icon(a, b);
	} catch (e) {
		console.log(e);
	}
}


export function GetGeoc() {
	try {
		let baiduMap = GetBaiduMap();
		return new baiduMap.Geocoder();
	} catch (e) {
		console.log(e);
	}
}
//通过百度Point获取位置名称
export function getLocationByPiont(geoc, point) {
	try {
		if (!geoc || !point) {
			return;
		}
		return new Promise((resolve, reject) => {
			geoc.getLocation(point, function(rs) {
				resolve(rs);
			});
		})
	} catch (e) {
		console.log(e);
	}
}
//通过BD09坐标点获取位置名称
export async function getLocationByUCS(geoc, lng, lat) {
	try {
		const point = UCSconvertToPoint(lng, lat);
		return getLocationByPiont(geoc, point);
	} catch (e) {
		console.log(e);
	}
}
//通过BD09坐标点设置中心点
export function centerAndZoomByUCS(map, lng, lat, level) {
	try {
		const point = UCSconvertToPoint(lng, lat);
		centerAndZoomByPoint(map, point, level);
	} catch (e) {
		console.log(e);
	}
}
export function UCSIsInVisualcenterAndZoom(map, lng, lat, level) {
	try {
		const point = UCSconvertToPoint(lng, lat);
		PointIsInVisualcenterAndZoom(map, point, level);
	} catch (e) {
		console.log(e);
	}
}
export function PointIsInVisualcenterAndZoom(map, point, level) {
	try {
		if (!PointIsInVisual(map, point)) {
			centerAndZoomByPoint(map, point, level);
		}
	} catch (e) {
		console.log(e);
	}
}


//通过百度Point设置中心点,level范围3-19，默认10
export function centerAndZoomByPoint(map, point, level) {
	try {
		if (!level) {
			level = 10;
		} else if (level < 3) {
			level = 3;
		} else if (level > 19) {
			level = 19;
		}
		map.centerAndZoom(point, level);
	} catch (e) {
		console.log(e);
	}
}
export function sleep(millisecond) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, millisecond)
	})
}

export function Geolocation() {
	try {
		let baiduMap = GetBaiduMap();
		return new BMapGL.Geolocation();
	} catch (e) {
		console.log(e);
	}
}

export function getLocation(point, geoc) {
	try {
		if (!geoc) {
			geoc = GetGeoc();
		}

		return new Promise(async (resolve, reject) => {
			if (!point) {
				const r = await getCurrentPosition();
				point = r.point;
			}
			geoc.getLocation(point, function(rs) {
				resolve(rs);
			});
		})
	} catch (e) {
		console.log(e);
	}
}
export function GetCityByIp() {
	try {
		let baiduMap = GetBaiduMap();
		let myCity = new baiduMap.LocalCity();
		return new Promise(async (resolve, reject) => {
			function callBack(result) {
				resolve(result);
			}
			myCity.get(callBack);
		})
	} catch (e) {
		console.log()
	}
}

export async function ByIpSetZoom(map) {
	try {
		const result = await GetCityByIp();
		if (result && map) {
			let cityName = result.name;
			console.log(result)
			map.setCenter(cityName); //关于setCenter()可参考API文档---”传送门“
			return {
				isSuccess: true,
				result: result
			}
		}
		return {
			isSuccess: false,
			result: result
		}
	} catch (e) {
		console.log()
	}
}

export async function getCurrentPositionAndMark(map) {
	try {
		let r = await getCurrentPosition();
		let type = '';
		if (r && r.isSuccess) {
			let mk = Marker(r.position.point);
			map.addOverlay(mk);
			map.panTo(r.point);
			type = 'geolocation';
			r = r.position;
		} else {
			r = ByIpSetZoom(map);
			type = 'ip';
		}
		return {
			type: type,
			position: r
		}
	} catch (e) {
		console.log(e);
	}
}

export function getCurrentPosition(geolocation) {
	try {
		if (!geolocation) {
			geolocation = Geolocation();
		}
		return new Promise(async (resolve, reject) => {
			//定位
			const rs = await navigatorGetCurrentPosition();
			console.log('navigatorGetCurrentPosition', rs);
			if (rs.isSuccess) {
				setTimeout(() => {
					geolocation.getCurrentPosition(
						r => {
							console.log('geolocation.getStatus()', geolocation.getStatus())
							resolve({
								isSuccess: true,
								position: r,
							});
						}, {
							enableHighAccuracy: true
						}
					);
				}, 200)

			} else {
				resolve({
					isSuccess: false,
					position: rs,
				});
			}

		})

	} catch (e) {
		console.log(e);
	}
}

export function addControl(map, control) {
	try {
		// 将控件添加到地图上
		map.addControl(control);
	} catch (e) {
		console.log(e);
	}
}
export async function mapSingleInit(container) {
	try {
		await sleep(500);
		let baiduMap = GetBaiduMap();
		return new baiduMap.Map(container);
	} catch (e) {
		console.log(e);
	}
}

export async function mapBuild(container, config, point) {
	let map = undefined;
	let defaultConfig = {
		enableScrollWheelZoom: true,
		enableScaleControl: true,
		enableZoomControl: true,
		navi3DCtrl: true,
		clickEventListener: function(e) {
			console.log("clickEventListener：" + e);
		},
		locationControl: {
			enable: true,
			anchor: BMAP_ANCHOR_TOP_RIGHT, //1,
			offset: [20, 20],
			addEventListener: {
				success: function(e) {
					let address = '';
					address += e.addressComponent.province;
					address += e.addressComponent.city;
					address += e.addressComponent.district;
					address += e.addressComponent.street;
					address += e.addressComponent.streetNumber;
					console.log("当前定位地址为：" + address);
				},
				error: function(e) {
					console.log("定位错误：" + e);
				}
			}
		}
	}

	try {
		if (!config) {
			config = {};
		}
		config = Object.assign(JSON.parse(JSON.stringify(defaultConfig)), config);
		if (!config.locationControl) {
			config.locationControl = {};
		}
		if (!config.locationControl.addEventListener) {
			config.locationControl.addEventListener = {};
		}
		config.locationControl = Object.assign(JSON.parse(JSON.stringify(defaultConfig.locationControl)),
			config
			.locationControl);
		config.locationControl.addEventListener = Object.assign(JSON.parse(JSON.stringify(defaultConfig
				.locationControl.addEventListener)), config
			.locationControl.addEventListener);
		console.log(config);
		await sleep(500);
		let baiduMap = GetBaiduMap();
		map = await mapSingleInit(container);
		if (!point) {
			//116.404, 39.915
			//116.3964, 39.9093
			point = UCSconvertToPoint(116.403694, 39.913607);
		}
		map.centerAndZoom(point, 10);
		//centerAndZoomByPoint(map, point);
		if (config.enableScrollWheelZoom) {
			map.enableScrollWheelZoom(); //滚轮
		}
		if (config.enableScaleControl) {
			let scaleCtrl = new baiduMap.ScaleControl(); // 添加比例尺控件
			addControl(map, scaleCtrl);
		}
		if (config.enableZoomControl) {
			let zoomCtrl = new baiduMap.ZoomControl(); // 添加缩放控件
			addControl(map, zoomCtrl);
		}
		if (config.navi3DCtrl) {
			let navi3DCtrl = new BMapGL.NavigationControl3D(); // 添加3D控件
			addControl(map, navi3DCtrl);
		}
		if (config.locationControl && config.locationControl.enable) {
			try {
				let locationControl = new baiduMap.LocationControl({
					// 控件的停靠位置（可选，默认左上角）
					anchor: BMAP_ANCHOR_TOP_RIGHT,
					// 控件基于停靠位置的偏移量（可选）
					offset: new baiduMap.Size(20, 20)
				});
				addControl(map, locationControl);
				if (config.locationControl.addEventListener) {
					if ((typeof config.locationControl.addEventListener.success).toLowerCase() ==
						'function') {
						// 添加定位事件
						console.log('添加成功定位事件');
						console.log(locationControl.addEventListener);
						// locationControl.addEventListener("locationSuccess", config.locationControl.addEventListener
						// 	.success);
						locationControl.addEventListener("locationSuccess", function(e) {
							console.log('locationControlSuccess', e);
							config.locationControl.addEventListener.success(e);
							// 
						});
					}
					if ((typeof config.locationControl.addEventListener.error).toLowerCase() ==
						'function') {
						// 添加定位事件
						locationControl.addEventListener("locationError", config.locationControl
							.addEventListener
							.error);
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
		if (config.clickEventListener && (typeof config.clickEventListener).toLowerCase() == 'function') {
			//鼠标点击
			map.addEventListener("click", config.clickEventListener);
		}

	} catch (e) {
		console.log(e);
	}
	return map;
}

export function LocalSearch(map, search) {
	try {
		let baiduMap = GetBaiduMap();
		return new Promise((resolve, reject) => {
			let local = new baiduMap.LocalSearch(map, {
				renderOptions: {
					map: map
				},
				onSearchComplete: res => {
					resolve({
						instance: local,
						res: res
					})
				}
			});
			local.search(search);
		})

	} catch (e) {
		console.log(e);
	}
}
export default {

}
