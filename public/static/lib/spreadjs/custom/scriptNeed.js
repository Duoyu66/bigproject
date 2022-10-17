let GetValueByMetaName = function(listreport, meta_name) {
	let i, j
	for (i = 0; i < listreport.mapdata.length; i++) {
		if (listreport.mapdata[i].meta_name === meta_name) {
			break
		}
	}
	if (i !== listreport.mapdata.length) {
		// console.log(listreport.metadata[i].meta_name, meta_name)
		for (j = 0; j < listreport.datadetail.length; j++) {
			if (listreport.datadetail[j] && listreport.datadetail[j].meta_id === listreport.mapdata[i].meta_id) {
				break
			}
		}
		if (j !== listreport.datadetail.length) {
			return listreport.datadetail[j].value
		}
	}
	return ''
}

let GetValueByMetaNameInReport = function(meta_name) {
	let i, j
	for (i = 0; i < window.listreport.metadata.length; i++) {
		if (window.listreport.metadata[i].meta_name === meta_name) {
			break
		}
	}
	if (i !== window.listreport.metadata.length) {

		for (j = 0; j < window.listreport.datadetail.length; j++) {
			if (window.listreport.datadetail[j] && window.listreport.datadetail[j].meta_id === window.listreport.metadata[i].meta_id) {
				break
			}
		}
		if (j !== window.listreport.datadetail.length) {
      // console.log(window.listreport.datadetail[j].value, meta_name)
			return window.listreport.datadetail[j].value
		}
	}
	return ''
}

let SetValueByName = function(meta_name,value) {
	let i, j
	for (i = 0; i < window.listreport.metadata.length; i++) {
		if (window.listreport.metadata[i].meta_name === meta_name) {
			break
		}
	}

	if (i !== window.listreport.metadata.length) {
    let datadetail = {
      entrust_id:window.listreport.datadetail[0].entrust_id,
      meta_id:window.listreport.metadata[i].meta_id,
      param_id:window.listreport.datadetail[0].param_id,
      template_id:window.listreport.datadetail[0].template_id,
      value:value
    }
    window.listreport.datadetail.push(datadetail)

	}
	return ''
}

let SetValueByName_fob = function(meta_name,value) {
	let i, j
  let listdata=window.listdata
	for (i = 0; i < listdata.metadata.length; i++) {
		if (listdata.metadata[i].meta_name === meta_name) {
			break
		}
	}

	if (i !== listdata.metadata.length) {
    let datadetail = {
      entrust_id:listdata.datadetail[0].entrust_id,
      meta_id:listdata.metadata[i].meta_id,
      template_id:listdata.datadetail[0].template_id,
      value:value
    }
    listdata.datadetail.push(datadetail)

	}
	return ''
}

let GetValueByName_fob = function(listparamall, meta_name) {
	let i, j, k
	for (i = 0; i < listparamall.length; i++) {
    for(k=0;k<listparamall[i].metadata.length;k++)
    {
      if (listparamall[i].metadata[k].meta_name === meta_name) {
      	break
      }
    }
	}
	if (i !== listparamall.length) {
		for (j = 0; j < listparamall[i].datadetail.length; j++) {
			if (listparamall[i].datadetail[j] && listparamall[i].datadetail[j].meta_id === listparamall[i].metadata[k].meta_id) {
				break
			}
		}
		if (j !== listparamall[i].datadetail.length) {
			return listparamall[i].datadetail[j].value
		}
	}
	return ''
}

let GetValueByNameInTest = function(meta_name) {
	let i, j, k
  let listdata=window.listdata
	for (i = 0; i < listdata.mapdata.length; i++) {
    if(listdata.mapdata[i].meta_name===meta_name)
    {
      break;
    }
	}
	if (i !== listdata.mapdata.length) {
		for (j = 0; j < listdata.datadetail.length; j++) {
			if (listdata.datadetail[j] && listdata.datadetail[j].meta_id === listdata.mapdata[i].meta_id) {
				break
			}
		}
		if (j !== listdata.datadetail.length) {
			return listdata.datadetail[j].value
		}
	}
	return ''
}

function setJudgeProcInEval(judgeproc,execStr) {
  eval(judgeproc);
  return eval(execStr);
}


const dateHelper = {
	getDaysBetween: function(startDate, enDate) {
		if (!enDate) {
			enDate =dateHelper.format_fob(new Date());
		}
		if (!startDate || !enDate) {
			return 0;
		}
		const sDate = Date.parse(startDate)
		const eDate = Date.parse(enDate)
		if (sDate > eDate) {
			return 0
		}
		if (sDate === eDate) {
			return 1
		}
		const days = (eDate - sDate) / (1 * 24 * 60 * 60 * 1000)
		return days
	},
	format_fob: function(date, fmt = 'yyyy-MM-dd') {
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
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1
				.length));
			for (let k in o)
				if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
					(o[k]) : ((
						"00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		} catch (e) {
			console.log(e)
			return date
		}

	}
}
