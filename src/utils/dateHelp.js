/**
 *将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h[12]、H[24])、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
export function format_fob(date, fmt = 'yyyy-MM-dd') {
	try {
		//fmt = fmt.replaceAll('H','h')
		let o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"H+": date.getHours(), //小时 24小时制
			"h+": date.getHours() > 12 ? date.getHours() - 12 : date.getHours(), //小时 12小时制
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
			"S": date.getMilliseconds(), //毫秒
			"A": date.getHours() > 12 ? 'PM' : 'AM',
			"a": date.getHours() > 12 ? 'pm' : 'am',
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
				"00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	} catch (e) {
		console.log(e)
		return date
	}
}
export function mGetDate(year, month){
	try{
		let d = new Date(year, month, 0);
		return d.getDate();
	}catch(e){
		console.log(e);
		return 30;
	}
   
}
export function getToday() {
	try {
		return format_fob(new Date())
	} catch (e) {
		console.log(e)
		return date
	}

}
export function getTodayDatetime() {
	try {
		return format_fob(new Date(), dateFormat(1))
	} catch (e) {
		console.log(e)
		return date
	}

}

export function getdayEx(type, num, fmt = 'yyyy-MM-dd') {
	try {
		return format_fob(getday(type, num), fmt)
	} catch (e) {
		console.log(e)
		return new Date()
	}
}
export function calculationDayAndFormat(date, type, num, format) {
	try {
		if (typeof date == 'string') {
			date = new Date(date);
		}
		let nNum = 0
		if (num) {
			nNum = Number(num)
		}
		if (type) {
			type = type.toLowerCase();
		}
		switch (type) {
			case 'year':
				date.setFullYear(date.getFullYear() + nNum);
				break;
			case 'month':
				date.setMonth(date.getMonth() + nNum);
				break;
			case 'day':
				date.setDate(date.getDate() + nNum);
				break;
			case 'hour':
				date.setHours(date.getHours() + nNum);
				break;
			case 'minute':
				date.setMinutes(date.getMinutes() + nNum);
				break;
			case 'millisecond':
				date.setMilliseconds(date.getMilliseconds() + nNum);
				break;
			default:
				break;
		}
		if (typeof format == 'number') {
			return format_fob(date, dateFormat(format))
		}
		return format_fob(date, format)
	} catch (e) {
		console.log(e)
		return date
	}

}
export function getday(type, num) {
	try {
		let date = new Date()
		let nNum = 0
		if (num) {
			nNum = Number(num)
		}
		switch (type) {
			case 'year':
				date.setFullYear(date.getFullYear() + nNum)
				return date
			case 'month':
				date.setMonth(date.getMonth() + nNum)
				return date
			case 'day':
				date.setDate(date.getDate() + nNum)
				return date
			case 'hour':
				date.setHours(date.getHours() + nNum)
				return date
			case 'minute':
				date.setMinutes(date.getMinutes() + nNum)
				return date
			case 'millisecond':
				date.setMilliseconds(date.getMilliseconds() + nNum)
				return date
			default:
				return date
		}

	} catch (e) {
		console.log(e)
		return date
	}

}
export function pickerOptions(option) {
	//是否限制日期选择
	let disabledDate = false
	//限制类型
	let type_disable = ''
	//时间加减类型 
	let type_date = 'day'
	//加减数量
	let num_disable = 0
	//自定义函数
	let disabledDate_fob = ''
	let shortcuts_type = 'before'
	if (option) {
		if (option.disabledDate) {
			disabledDate = true
		}
		if (option.type_date) {
			type_date = option.type_date
		}
		if (option.num_disable) {
			num_disable = option.num_disable
		}
		if (option.type_disable) {
			type_disable = option.type_disable
		}
		if (option.shortcuts_type) {
			shortcuts_type = option.shortcuts_type
		}
	}
	let shortcuts_list = {
		before: [{
			text: '今天',
			onClick(picker) {
				picker.$emit('pick', new Date());
			}
		}, {
			text: '昨天',
			onClick(picker) {
				picker.$emit('pick', getday('day', -1));
			}
		}, {
			text: '一周前',
			onClick(picker) {
				picker.$emit('pick', getday('day', -7));
			}
		}, {
			text: '一个月前',
			onClick(picker) {
				picker.$emit('pick', getday('month', -1));
			}
		}, {
			text: '一年前',
			onClick(picker) {
				picker.$emit('pick', getday('year', -1));
			}
		}],
		after: [{
			text: '今天',
			onClick(picker) {
				picker.$emit('pick', new Date());
			}
		}, {
			text: '明天',
			onClick(picker) {
				picker.$emit('pick', getday('day', 1));
			}
		}, {
			text: '一周后',
			onClick(picker) {
				picker.$emit('pick', getday('day', 7));
			}
		}, {
			text: '一个月后',
			onClick(picker) {
				picker.$emit('pick', getday('month', 1));
			}
		}, {
			text: '一年后',
			onClick(picker) {
				picker.$emit('pick', getday('year', 1));
			}
		}]
	}
	let shortcuts = shortcuts_list[shortcuts_type]
	if (!shortcuts) {
		shortcuts = shortcuts_list.before
	}
	return {
		disabledDate(time) {
			if (disabledDate_fob && typeof disabledDate_fob == 'function') {
				return disabledDate_fob(time)
			}

			if (disabledDate) {
				switch (type_disable) {
					case 1:
						return time.getTime() > getday(type_date, num_disable);
					case 2:
						//return time.getTime() >= getday(type_date, num_disable);
						return new Date(format_fob(time) + ' 00:00:00').getTime() >= new Date(format_fob(getday(
							type_date,
							num_disable)) + ' 23:59:59');
					case 3:
						return new Date(format_fob(time)).getTime() < new Date(format_fob(getday(type_date,
							num_disable)));
					case 4:
						return time.getTime() <= getday(type_date, num_disable);
				}

			}
		},
		shortcuts: shortcuts
	}
}
export function pickerOptionsrange() {
	return {
		shortcuts: [{
			text: '最近一周',
			onClick(picker) {
				picker.$emit('pick', getday('day', -7));
			}
		}, {
			text: '最近一个月',
			onClick(picker) {
				picker.$emit('pick', getday('month', -1));
			}
		}, {
			text: '最近三个月',
			onClick(picker) {
				picker.$emit('pick', getday('month', -3));
			}
		}, {
			text: '最近一年',
			onClick(picker) {
				picker.$emit('pick', getday('year', -1));
			}
		}]
	}
}

export function dateFormat(type) {
	switch (type) {
		case 1:
			return 'yyyy-MM-dd HH:mm:ss'
		case 2:
			return 'yyyy-MM-dd HH:mm'
		case 3:
			return 'yyyy-MM-dd HH'
		case 4:
			return 'yyyy-MM-dd'
		case 5:
			return 'yyyy-MM'
		case 6:
			return 'yyyy'
		default:
			return 'yyyy-MM-dd'
	}

}


export default {

}