import gcoord from 'gcoord';
export const UCS = {
	WGS84: gcoord.WGS84,
	BD09: gcoord.BD09,
	Baidu: gcoord.Baidu,
	BMap: gcoord.BMap,
	GCJ02: gcoord.GCJ02,
	AMap: gcoord.AMap,
	BD09MC: gcoord.BD09MC,
	WebMercator: gcoord.WebMercator
}
export const UCSType = {
	WGS84: 'WGS84',
	BD09: 'BD09',
	Baidu: 'BD09',
	BMap: 'BD09',
	GCJ02: 'GCJ02',
	AMap: 'GCJ02',
	BD09MC: 'BD09MC',
	WebMercator: 'WebMercator'
}
//将currentUCS坐标系的坐标转换为toUCS的坐标
export function transform(longitude, latitude, currentUCS, toUCS) {
	try {

		if (!currentUCS) {
			currentUCS = UCS.WGS84;
		}
		if (!toUCS) {
			toUCS = UCS.BD09;
		}
		if (currentUCS == toUCS) {
			return [longitude, latitude];
		}
		let longitudeType = (typeof longitude).toLowerCase();
		if (longitudeType == 'string') {
			longitudeType = parseFloat(longitudeType);
		} else if (longitudeType == 'undefined') {
			return [longitude, latitude];
		}
		let latitudeType = (typeof latitude).toLowerCase();
		if (latitudeType == 'string') {
			latitude = parseFloat(latitude);
		} else if (latitudeType == 'undefined') {
			return [longitude, latitude];
		}
		const result = gcoord.transform(
			[longitude, latitude], // 经 纬度坐标  [116.403988, 39.914266],  
			currentUCS, // 当前坐标系
			toUCS // 目标坐标系
		);
		return result;
	} catch (e) {
		console.log(e);
	}
}
//将currentUCS坐标系的坐标转化为WGS84
export function transformToWGS84(longitude, latitude, currentUCS) {
	try {
		if (!currentUCS) {
			currentUCS = UCS.BD09;
		}
		return transform(longitude, latitude, currentUCS, UCS.WGS84);
	} catch (e) {
		console.log(e);
	}
}
//将currentUCS坐标系的坐标转化为BD09
export function transformToBD09(longitude, latitude, currentUCS) {
	try {
		if (!currentUCS) {
			currentUCS = UCS.WGS84;
		}
		return transform(longitude, latitude, currentUCS, UCS.BD09);
	} catch (e) {
		console.log(e);
	}
}
//将currentUCS坐标系的坐标转化为GCJ02
export function transformToGCJ02(longitude, latitude, currentUCS) {
	try {
		if (!currentUCS) {
			currentUCS = UCS.WGS84;
		}
		return transform(longitude, latitude, currentUCS, UCS.GCJ02);
	} catch (e) {
		console.log(e);
	}
}
//将WGS84坐标系的坐标转化为BD09
export function transformWGS84ToBD09(longitude, latitude) {
	try {
		return transform(longitude, latitude, UCS.WGS84, UCS.BD09);
	} catch (e) {
		console.log(e);
	}
}
//将WGS84坐标系的坐标转化为GCJ02
export function transformWGS84ToGCJ02(longitude, latitude) {
	try {
		return transform(longitude, latitude, UCS.WGS84, UCS.GCJ02);
	} catch (e) {
		console.log(e);
	}
}
//将BD09坐标系的坐标转化为WGS84
export function transformBD09ToWGS84(longitude, latitude) {
	try {
		return transform(longitude, latitude, UCS.BD09, UCS.WGS84);
	} catch (e) {
		console.log(e);
	}
}
//将BD09坐标系的坐标转化为GCJ02
export function transformBD09ToGCJ02(longitude, latitude) {
	try {
		return transform(longitude, latitude, UCS.BD09, UCS.GCJ02);
	} catch (e) {
		console.log(e);
	}
}

//将GCJ02坐标系的坐标转化为WGS84
export function transformGCJ02ToWGS84(longitude, latitude) {
	try {
		return transform(longitude, latitude, UCS.GCJ02, UCS.WGS84);
	} catch (e) {
		console.log(e);
	}
}
//将GCJ02坐标系的坐标转化为BD09
export function transformGCJ02ToBD09(longitude, latitude) {
	try {
		return transform(longitude, latitude, UCS.GCJ02, UCS.BD09);
	} catch (e) {
		console.log(e);
	}
}

//将WGS84坐标系的坐标转化为GCJ02和BD09
export function transformWGS84(longitude, latitude) {
	try {
		let GCJ02 = transformWGS84ToGCJ02(longitude, latitude);
		let BD09 = transformWGS84ToBD09(longitude, latitude);
		return {
			GCJ02: GCJ02,
			BD09: BD09,
			WGS84: [longitude, latitude],
			fromType: UCSType.WGS84
		}
	} catch (e) {
		console.log(e);
	}
}

//将BD09坐标系的坐标转化为GCJ02和WGS84
export function transformBD09(longitude, latitude) {
	try {
		let GCJ02 = transformBD09ToGCJ02(longitude, latitude);
		let WGS84 = transformBD09ToWGS84(longitude, latitude);
		return {
			GCJ02: GCJ02,
			BD09: [longitude, latitude],
			WGS84: WGS84,
			fromType: UCSType.BD09
		}
	} catch (e) {
		console.log(e);
	}
}

//将GCJ02坐标系的坐标转化为BD09和WGS84
export function transformGCJ02(longitude, latitude) {
	try {
		let BD09 = transformGCJ02ToBD09(longitude, latitude);
		let WGS84 = transformGCJ02ToWGS84(longitude, latitude);
		return {
			GCJ02: [longitude, latitude],
			BD09: BD09,
			WGS84: WGS84,
			fromType: UCSType.GCJ02
		}
	} catch (e) {
		console.log(e);
	}
}
export function navigatorGetCurrentPosition() {
	try {
		return new Promise((resolve, reject) => {
			if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
				navigator.geolocation.getCurrentPosition(showPosition, showError);
			} else {
				resolve({
					isSuccess: false,
					pos: {},
					msg: 'geolocation不支持',
				});
			}

			function showPosition(position) {
				console.log('showPosition', position);
				resolve({
					isSuccess: true,
					msg: '',
					pos: position,
				});
			}

			function showError(error) {
				let innerHTML = '';
				switch (error.code) {
					case error.PERMISSION_DENIED:
						innerHTML = "User denied the request for Geolocation." //code == 1 用户拒绝
						break;
					case error.POSITION_UNAVAILABLE:
						innerHTML = "Location information is unavailable." //code == 2 无法获取
						break;
					case error.TIMEOUT:
						innerHTML = "The request to get user location timed out." //code == 3 请求超时
						break;
					case error.UNKNOWN_ERROR:
						innerHTML = "An unknown error occurred." //一个未知的错误
						break;
				}
				console.log('showError', innerHTML);
				resolve({
					isSuccess: false,
					pos: {},
					msg: innerHTML,
				});
			}
		})

	} catch (e) {
		console.log(e);
	}
}
export default {
	UCS,
	transform,
	transformToWGS84,
	transformToBD09,
	transformToGCJ02,
	transformWGS84ToBD09,
	transformWGS84ToGCJ02,
	transformBD09ToWGS84,
	transformBD09ToGCJ02,
	transformGCJ02ToWGS84,
	transformGCJ02ToBD09,
	transformWGS84,
	transformBD09,
	transformGCJ02,
	navigatorGetCurrentPosition
}
