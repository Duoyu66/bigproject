import Vue from 'vue'
import request from '@/utils/CrossRequest'
import {
	pageDeal,
	search_fob,
	update_fob,
	insert_fob,
	delete_fob,
	delete_from_fob,
	QueryExec_fob,
	QueryExec_fobEx,
	ExecSql_fob,
	delete_from_fobEx,
} from '@/global/form.helper'
import $ from 'jquery'
import {
	video_prefix_config,
	video_servicer_ip
} from '@/config'
import {
	drawByText
} from '@/utils/convasHelper'
//推流服务器地址
let serve_ip = video_servicer_ip
//推流前缀
let video_prefix = video_prefix_config //'xctl-'//video_prefix_config
let txt_time_out = 5000
let idSet = ''
let loacl_snap_temp = undefined
// if (typeof $ == 'undefined') {
// 	$ = Vue.$
// }
//利用set去重和生成唯一id
async function drawByStr(txt, sizeOption) {
	if (typeof txt == 'undefined') {
		txt = ''
	}
	let fontOptoin = {
		fontCor: '#FFFFFF',
		fillStyle: '#000000',
		fontSize: '30'
	}
	if (!sizeOption) {
		sizeOption = {
			width: 500,
			isEnlarge: true,
		}
	}
	return await drawByText(txt, fontOptoin, sizeOption);
}
async function drawEmpty() {
	return await drawByStr('无摄像头连接')
}
async function drawOffLine() {
	return await drawByStr('摄像头离线')
}
async function drawError() {
	let sizeOption = {
		width: 700,
		isEnlarge: true,
	}
	return await drawByStr('连接失败\n请点击提示按钮查看可能原因', sizeOption)
}
export let idStorage = function() {
	this.play_id = new Set();
	this.current_id = 0;
}
idStorage.prototype.hasValue = function(value) {
	if (!this.play_id.has(value)) {
		this.play_id.add(value);
		return false;
	}
	return true;

}
idStorage.prototype.GetAvailable = function() {
	let that = this;
	while (that.current_id < Number.MAX_SAFE_INTEGER) {
		if (!that.hasValue(that.current_id)) {
			return that.current_id;
		}
		that.current_id++;
	};
	console.log('超出最大系统最大整数范围，请刷新页面')

	return -1;
}
//计算函数
export let Calculation = function(screen_type, load_type) {
	this.screen_type = screen_type;
	this.load_type = load_type;
	this.row_num = -1;
	this.col_num = -1;
}
Calculation.prototype.splitScreen = function(screen_type) {
	try {
		let that = this;
		if (that.screen_type == screen_type && that.row_num > 0) {
			return [that.row_num, that.col_num];
		}
		that.screen_type = screen_type;
		let num = Math.sqrt(that.screen_type);
		that.row_num = num;
		that.col_num = num;
		return [that.row_num, that.col_num];
	} catch (e) {
		console.log(e);
		return [-1, -1];
	}
}
export let videoPlayer = function() {

}
//设置播放地址
videoPlayer.prototype.setUrl = function(url) {
	this.url = url
}
//设置是否自动播放
videoPlayer.prototype.autoPlay = function(isAutoPlay) {
	this.isAutoPlay = isAutoPlay
}
//设置id
videoPlayer.prototype.setId = function(uniqueId) {
	this.uniqueId = uniqueId
}
//设置封面
videoPlayer.prototype.setSnap = function(snapUrl) {
	this.snapUrl = snapUrl
}
let calculation = ''

function GetCalculation(screen_type, load_type) {
	if (!calculation) {
		calculation = new Calculation(screen_type)
	}
	return calculation
}

export let Player = function(channel_id, org_id, room_name, id, screen_type, load_type, auto_play, url) {
	//通道号
	this.channel_id = channel_id;
	//解码类型(auto：默认，soft：强制H265解码
	this.decodeType = 'auto';
	//是否打开音频
	this.openAudio = false;
	//	是否开启大的播放按钮
	this.BigPlay = false;
	//播放器尺寸是否继承父盒子的
	this.Height = false;
	//摄像头名称
	this.room_name = room_name;
	//摄像头所属机构
	this.org_id = org_id;
	//元素选择器，最好为id
	this.elem = id;
	//播放的地址
	this.url = url;
	//播放器初始化状态
	this.initStatus = false;
	//分屏类型
	this.screen_type = screen_type;
	//自动播放
	this.auto_play = auto_play;
	//加载类型（0：自动，1：内网，2：外网）
	this.load_type = load_type;
	//一行多少个播放器
	this.row_num = -1;
	//一列多少个播放器
	this.col_num = -1;
	//设备前缀
	this.video_prefix = undefined
	//播放协议
	this.protocol = 'HLS';
	//加载成功类型
	this.load_success = undefined;
	this.sServeIp = undefined;

	this.playerList = [];
}
Player.prototype.mian = function() {
	try {
		let that = this;
		//设置dom
		//that.Autotemplate();
		that.initPlay();
		that.GetUrl();
		that.setSnap_fob();
		that.emptyOrErrorTips()
	} catch (e) {
		console.log(e)
	}
}
Player.prototype.GetUrl = function() {
	try {
		let that = this;

		//that.load_type = load_type;
		let load_fob = function() {

		}
		switch (that.load_type) {
			case 0:
				load_fob = that.GetUrlAuto(that.play);
				break;
			case 1:
				load_fob = that.GetUrlloacl(that.play);
				break;
			case 2:
				load_fob = that.GetUrlServe(that.play);
				break;
			default:
				load_fob = that.GetUrlAuto(that.play);
				break;
		}
		//load_fob(that.play);
	} catch (e) {
		console.log(e);
	}
}
Player.prototype.getprefix = function() {
	try {
		if (this.video_prefix) {
			return video_prefix;
		}
		this.video_prefix = video_prefix;
		return this.video_prefix;
	} catch (e) {
		console.log(e);
	}
}
Player.prototype.SETstatus = function(status, load_success, sServeIp) {
	try {
		this.status = status;
		//加载成功类型（1：内网，2：外网,0连接失败,-1无连接）
		this.load_success = load_success;
		let that = this;
		this.sServeIp = sServeIp;
		console.log('SETstatus', status, load_success, sServeIp)
	} catch (e) {
		console.log(e)
	}
}
Player.prototype.Online = function(isOnline) {
	try {
		let that = this;
		let txt = '';
		if (isOnline) {
			that.isOnline = true;
		} else {
			that.isOnline = false;
			txt = '离线';
		}
		if (that.status) {
			that.setTxt(that.isOnline, txt);
		}
		if ($('#' + that.txtelem + ' span').text() != '无摄像头连接') {
			that.setTxt(that.isOnline, txt);
		}


	} catch (e) {
		console.log(e);
	}
}
Player.prototype.setURl = function(url) {
	this.url = url
}
Player.prototype.setTxt = function(status, text) {
	try {
		let that = this;
		if (text) {
			$('#' + that.txtelem + ' span').text(that.room_name + '-[' + text + ']');
			return;
		}
		if (status) {
			$('#' + that.txtelem + ' span').text(that.room_name + '-[连接成功]');
		} else {
			$('#' + that.txtelem + ' span').text(that.room_name + '-[连接失败]');
		}
	} catch (e) {
		console.log(e);
	}
}
//优先从内网地址获取
Player.prototype.GetUrlAuto = function(callback) {
	try {
		let that = this;
		that.GetUrlloacl(callback, 'GetUrlServe', that.GetUrlServe);
	} catch (e) {
		console.log(e);
	}
}
//从内网黑盒子获取流地址
Player.prototype.GetUrlloacl = function(success, attribute, error) {
	try {
		let that = this;
		if (!that.org_id || !that.channel_id) {
			callback(false, '机构号或者通道号为空');
			return;
		}

		//返回函数
		function callback(flag, e, m, url, sServeIp) {
			try {
				if (e) {
					console.log(e, m)
				}
				if (flag) {
					setTimeout(function() {
						that.SETstatus(true, 1, sServeIp)
						success(url, that)
						setInterval(() => {
							that.GetUrlloacl()
						}, 3000);
					}, 5000)
				} else {
					if (attribute) {

						const type = (typeof that[attribute]).toLowerCase();
						switch (type) {
							case 'function':

								that[attribute](success);
								break;
							case 'string':
							case 'nubmer':
							case 'object':
								let xxx = 1;
								break;
						}
					} else if (error) {
						error(success);
					} else {
						if (e == '机构号或者通道号为空') {
							that.SETstatus(false, 0)
						} else {
							that.SETstatus(false, -1)
						}

					}
				}
			} catch (ex) {
				console.log(ex)
				that.SETstatus(false, -2)
			}

		}
		//获取黑盒子地址
		let list = [{
			field: 'org_id',
			level: 1,
		}, ]
		let form = {
			org_id: that.org_id
		}
		QueryExec_fob(634, list, form).then((res) => {
			try {
				//console.log(res.data);
				if (!res.hasOwnProperty('data') && res.data.length < 1) {
					callback(false);
					return;
				}
				let data = res.data;
				let ip = data[0].video_ip
				if (!ip || ip == '') {
					callback(false);
					return;
				}
				getchannelstream(ip);
			} catch (e) {
				callback(false, e);
			}
		}).catch((e, m) => {
			console.log(e, m);
			callback(false, e, m);
		})
		// const sData = '[Q]257{' + that.org_id + '}' + ROWSPLIT_vob + TableType;
		// AjaxHelper.QueryExec_fob(sData, function(res) {
		// 	try {
		// 		//console.log(res.data);
		// 		if (!res.hasOwnProperty('data') && res.data.length < 1) {
		// 			return;
		// 		}
		// 		let data = res.data;
		// 		let ip = data[0].video_ip
		// 		if (!ip || ip == '') {
		// 			callback(false);
		// 			return;
		// 		}
		// 		getchannelstream(ip);
		// 	} catch (e) {
		// 		callback(false, e);
		// 	}
		// }, function(e, m) {
		// 	console.log(e, m);
		// 	callback(false, e, m);
		// }, true);
		//尝试获取黑盒子视频流
		function getchannelstream(ip) {
			if (ip.indexOf('http://') < 0) {
				ip = 'http://' + ip;
			}
			that.ajax(ip + '/api/V1/getchannelstream', 'GET', {
				Channel: that.channel_id,
				Protocol: that.protocol,
				Line: 'local',
				From: 'lan'
			}, function(res) {
				if (success) {
					try {
						console.log('getchannelstream', res)
						if (typeof res == 'string') {
							res = JSON.parse(res);
						}


						if (res.EasyDarwin.Header.ErrorNum != '200') {
							callback(false);
							return;
						}
						let palyUrl = ip + res.EasyDarwin.Body.URL
						that.setURl(palyUrl)
						//that.url = ip + res.EasyDarwin.Body.URL;
						callback(true, undefined, undefined, palyUrl, ip)
					} catch (e) {
						callback(false, e);
					}
				}
			}, function(e, m) {
				callback(false, e, m);
			})
		}

	} catch (e) {
		callback(false, e);
	}
}

//从外网服务器获取流地址
Player.prototype.GetUrlServe = function(success) {
	try {
		let that = this;
		if (!that.org_id || !that.channel_id) {
			callback(false, '机构号或者通道号为空');
			return;
		}
		const video_prefix = that.getprefix();
		let sServe_ip = serve_ip;
		//console.log('GetUrlServe',serve_ip)
		if (sServe_ip.indexOf('http://') < 0) {
			sServe_ip = 'http://' + sServe_ip;
		}
		//'tl-101030101'
		const device = video_prefix + that.org_id;
		//从服务器返回的数据中获取ip 端口 类型
		function split_fob(Service) {
			try {
				let array = Service.split(';');
				let ip = '';
				let port = '';
				let type = '';
				let length = array.length;
				for (let i = 0; i < length; i++) {
					if (array[i].split('=').length < 2) {
						continue;
					}
					const stype = array[i].split('=')[0].toLocaleLowerCase()
					switch (stype) {
						case 'ip':
							ip = array[i].split('=')[1];
							break;
						case 'port':
							port = array[i].split('=')[1];
							break;
						case 'type':
							type = array[i].split('=')[1];
							break;
					}
				}
				return ['http://' + ip + ':' + port, type];
			} catch (e) {
				console.log(e)
			}
		}

		function callback(status, url, e, m, sServeIp) {
			try {
				if (status) {
					that.SETstatus(true, 2, sServeIp)
					setTimeout(function() {
						success(url, that)
					}, 5000)
				} else {
					if (url == '机构号或者通道号为空') {
						that.SETstatus(false, 0, sServeIp)
					} else {
						that.SETstatus(false, -1, sServeIp)
					}
					console.log(e, m)
				}
			} catch (ex) {
				that.SETstatus(false, -2, sServeIp)
				console.log(ex)
			}
		}
		//获取流地址
		function getdevicestreamServe(sServeIp, serial, channel_id, reserve, version, protocol, success) {
			if (sServeIp.indexOf('http://') < 0) {
				sServeIp = 'http://' + sServeIp;
			}
			that.ajax(sServeIp + '/api/' + version + '/getdevicestream', 'GET', {
				Channel: channel_id,
				Protocol: protocol,
				device: serial,
				reserve: reserve
			}, function(res) {
				if (success) {
					try {
						//res = JSON.parse(res);
						//console.log(res)
						if (res.EasyDarwin.Header.ErrorNum != '200') {
							return;
						}
						let palyUrl = res.EasyDarwin.Body.URL
						that.setURl(palyUrl)
						//that.url = res.EasyDarwin.Body.URL;
						callback(true, palyUrl, undefined, undefined, sServeIp);
					} catch (e) {
						console.log(e);
					}
				}
			}, function(e, m) {
				callback(false, e, m);
			})
		}
		//获取远端推流服务器地址
		//{ channel: that.channel_id, device: device, reserve: 1 }
		that.ajax(sServe_ip + '/api/v1/startdevicestream', 'GET', {
			channel: that.channel_id,
			device: device,
			reserve: 1
		}, function(res) {
			if (success) {
				try {
					//console.log(res)
					if (res.EasyDarwin.Header.ErrorNum != '200') {
						return;
					}
					const dss = split_fob(res.EasyDarwin.Body.Service);
					const serial = res.EasyDarwin.Body.Serial;
					const reserve = res.EasyDarwin.Body.Reserve;
					const sChannel = res.EasyDarwin.Body.Channel;
					const version = res.EasyDarwin.Header.Version;
					switch (dss[1].toLocaleLowerCase()) {
						case 'easydarwin':
							getdevicestreamServe(dss[0], serial, sChannel, reserve, version, that.protocol,
								success)
							break;

					}
				} catch (e) {
					callback(false, e);
				}
			}
		}, function(e, m) {
			callback(false, e);
		})
	} catch (e) {
		console.log(e)
	}
}
Player.prototype.ajax = function(url, type, data, successcall, errorcall) {
	request({
		url: url,
		method: type,
		params: data
	}).then((res) => {
		if (successcall) {
			try {
				successcall(res)
			} catch (e) {
				console.log(e);
			}
		}
	}).catch((e, m) => {
		if (errorcall) {
			errorcall(e, m);
		}
	})
	// $.ajax({
	// 	url: url,
	// 	data: data,
	// 	type: type,
	// 	success: function(res) {
	// 		if (successcall) {
	// 			try {
	// 				successcall(res)
	// 			} catch (e) {
	// 				console.log(e);
	// 			}
	// 		}

	// 	},
	// 	error: function(e, m, options, exc) {
	// 		if (errorcall) {
	// 			errorcall(e, m);
	// 		}

	// 	}
	// });
}
//分屏
Player.prototype.splitScreen = function(screen_type) {
	try {
		let that = this;
		if (that.screen_type == screen_type && that.row_num > 0) {
			return 0;
		}
		that.screen_type = screen_type;
		let num = GetCalculation(screen_type).splitScreen(screen_type, that.load_type)
		that.row_num = num[0];
		that.col_num = num[1];
		return 1;
	} catch (e) {
		console.log(e);
		return -1;
	}

}
Player.prototype.remove_txt = function() {
	let that = this;
	setTimeout(() => {
		$('#' + that.txtelem).empty()
	}, txt_time_out);
}
//自动生成模板
Player.prototype.Autotemplate = function(screen_type, num) {
	try {
		if (!idSet) {
			idSet = new idStorage();
		}
		if (typeof num == 'undefined') {
			num = idSet.GetAvailable();
		}
		let that = this;
		that.elem = 'newWasm' + num;
		that.txtelem = 'newWasm-txt' + num;
		let style =
			'color: blue; position: relative; background-color: black; width: 100%; height: 100%; overflow: hidden;';
		let style2 = 'background-color: black;color:white;width: 100%;'
		let style3 = "border-style: double;";
		let template = '<div class="item-player layui-col-xs{0}" data-v-4224c31a>' +
			'<div data-v-4224c31a class="player-active">' +
			'<div data-v-4224c31a class="wasm-box">' +
			'  <div data-v-4224c31a class="wasm-player" style="{1}">' +
			'<div id={2} style="{3}">' +
			'<span >{4}</span>' +
			'</div>' +
			'   <div id="{5}"  ' +
			'      style="{6}">' +
			'    </div>' +
			' </div>' +
			' </div>' +
			'</div>' +
			'</div>';
		//计算分屏下的行列数量
		that.splitScreen(screen_type);
		let room_name = '无摄像头连接';
		if (that.room_name) {
			room_name = that.room_name + '-[连接中]';
		} else {

		}
		const row_max = 24;
		that.wasmPlayerStyle = style3;
		that.playerStyle = style;
		that.playerTxtStyle = style2;
		that.playerTxt = room_name;
		that.col = row_max / that.row_num;
		//that.dom = template.format(row_max / that.row_num, that.elem, style, style2, room_name, that.txtelem, style3);
		//that.dom = template.format(row_max / that.row_num, style3, that.txtelem, style2, room_name, that.elem,
		//	style);
		return that.dom;
	} catch (e) {
		console.log(e);
		return '';
	}
}
//手动设置模板
Player.prototype.template = function(dom) {
	try {
		this.dom = dom;
	} catch (e) {
		console.log(e);
	}
}
//初始化播放器
Player.prototype.initPlay = function(id, url) {
	try {
		if (!id && !this.elem) {
			return undefined;
		}
		if (!this.Player) {
			this.destroy();
			//return this.Player;
		}
		if (!url) {
			url = null;
		}
		if (url) {
			this.url = url;
		}
		if (id) {
			this.elem = id;
		}
		let that = this;
		console.log('WasmPlayer', '初始化播放器')
		let Player = new WasmPlayer(url, this.elem, function callbackFun() {
			console.log('WasmPlayer', '初始化成功');
			that.initStatus = true;
		}, {
			cbUserPtr: this,
			decodeType: that.decodeType,
			openAudio: that.openAudio,
			BigPlay: that.BigPlay,
			Height: that.Height
		});
		this.Player = Player;
		return Player;
	} catch (e) {
		console.log(e);
		return undefined;
	}

}
//设置url
Player.prototype.setUrl = function(url) {
	this.url = url;
}
//设置封面
Player.prototype.setSnap_fob = function() {
	let that = this;
	let index = setInterval(function() {
		if (typeof that.status != 'undefined') {
			clearInterval(index);
			if (that.status) {
				//加载成功类型（1：内网，2：外网,0连接失败,-1无连接）

				switch (that.load_success) {
					case -1:
					case 0:
						that.Online(false)
						break;
					case 1:
						that.setSnapLoacl();
						break;
					case 2:
						that.setSnapServe();
						break;
				}

			} else {
				that.Online(false)
			}
		}
	})
}
//设置封面
Player.prototype.setSnap = function(url) {
	try {
		let that = this;
		that.Player.setSnap(url);
		that.snapUrl = url;
	} catch (e) {
		console.log(e)
	}

}
Player.prototype.setSnapLoacl = function() {
	let that = this;
	let ip = this.sServeIp;
	if (!ip) {
		return;
	}

	function findchannel(array, channel_id) {
		let length = array.length;
		for (let i = 0; i < length; i++) {
			if (array[i].Channel == channel_id) {
				if (array[i].SnapURL) {
					that.setSnap(ip + array[i].SnapURL);
				}
				if (array[i].Online > 0) {
					that.Online(true);
					return;
				} else {
					that.Online(false);
					return;
				}

			}
		}
		that.Online(false);
	}
	//获取本地截图地址
	that.ajax(ip + '/api/v1/getchannels', 'GET', {}, function(res) {
		try {
			if (typeof res == 'string') {
				res = JSON.parse(res);
			}

			if (res.EasyDarwin.Header.ErrorNum != '200') {
				return;
			}

			loacl_snap_temp = res.EasyDarwin.Body.Channels;
			findchannel(loacl_snap_temp, that.channel_id);

		} catch (e) {
			console.log(e)
			that.Online(false)
		}

	})
}
Player.prototype.setSnapServe = function() {
	let that = this;
	let sServe_ip = serve_ip;

	if (!sServe_ip) {
		return;
	}

	function findchannel(array, channel_id) {
		let length = array.length;
		console.log(array)
		for (let i = 0; i < length; i++) {
			if (array[i].Channel == channel_id) {
				if (array[i].SnapURL) {
					that.setSnap(array[i].SnapURL);
				}
				if (array[i].Status == 'online') {
					that.Online(true);
					return;
				} else {
					that.Online(false);
					return;
				}

			}
		}
		that.Online(false);
	}
	const video_prefix = that.getprefix();
	if (sServe_ip.indexOf('http://') < 0) {
		sServe_ip = 'http://' + sServe_ip;
	}
	//'tl-101030101'
	const device = video_prefix + that.org_id;
	//获取本地截图地址
	that.ajax(sServe_ip + '/api/v1/getdeviceinfo', 'GET', {
		device: device,
		r: Math.random()
	}, function(res) {
		try {
			if (res.EasyDarwin.Header.ErrorNum != '200') {
				return;
			}
			findchannel(res.EasyDarwin.Body.Channels, that.channel_id);

		} catch (e) {
			console.log(e)
			that.Online(false)
		}

	}, function() {
		that.Online(false)
	})
}
//模拟点击播放
Player.prototype.playBtn = function(force) {
	try {
		let that = this;
		//debugger
		if (!that.Player && !that.url) {
			return false;
		}
		if (!that.isOnline || !that.snapUrl) {
			return false;
		}
		if (!force && that.playBtn_status) {
			return false;
		}
		that.Player.pause();
		that.Player.playBtn.click();
		that.playBtn_status = true;
		console.log('模拟点击播放', that)
	} catch (e) {
		console.log(e);
	}

}
Player.prototype.emptyOrErrorTips = function() {
	let that = this
	let index = setInterval(async function() {
		//console.log('Player.prototype.emptyOrErrorTips', that.elem, that.isOnline, that.load_success)
		if (typeof that.isOnline != 'undefined' && typeof that.load_success != 'undefined' && that
			.Player) {
			//if (that.initStatus) {
			clearInterval(index)
			
			let snap = ''
			if (!that.isOnline) {
				snap = await drawOffLine()
			}
			switch (that.load_success) {
				case 0:
					snap = await drawEmpty()
					break
				case -2:
				case -1:
					snap = await drawError()
					break
			}
			if (snap) {
				that.setSnap(snap)
				if ($) {
					$(that.Player.loading).remove()
					$(that.Player.loadingBox).remove()
					$(that.Player.playBtn).remove()
				}
			}

		}
	}, 500)
}
//播放
Player.prototype.play = function(url, that) {
	try {
		if (url) {
			that.url = url;
		}
		if (!that.Player && !that.url) {
			return false;
		}

		let index = setInterval(function() {
			if (typeof that.isOnline != 'undefined' && that.initStatus) {
				//if (that.initStatus) {
				clearInterval(index)
				if (that.isOnline && !that.destroy_status) {
					//if (!that.destroy_status) {
					console.log(that.auto_play)
					that.Player.play(that.url, that.auto_play);
					that.play_status = true;
					//console.log(that.elem, that.play_status)
				}
			}
		}, 500)

		//that.Player.playBtn.click()
	} catch (e) {
		console.log(e);
	}

}
//销毁
Player.prototype.destroy = function() {
	try {
		if (!this.Player) {
			return false;
		}
		if (this.play_status) {
			this.Player.destroy();
		}
		this.destroy_status = true;
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}

}
//暂停
Player.prototype.pause = function() {
	try {
		if (!this.Player) {
			return false;
		}
		this.Player.pause();
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}

}
export default {
	idStorage,
	Calculation,
	Player
}
