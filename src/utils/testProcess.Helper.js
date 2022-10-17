export const testProcessOption = {
	entrustStatus: {
		statusField: 'accepted',
		//未提交委托
		noEntrust: {
      label: '未委托',
			status: -2
		},
		//未受理
		noAccepted: {
      label: '未受理',
			status: 0
		},
		//已受理
		accepted: {
      label: '已受理',
			status: 1
		},
		//受理拒绝
		refuse: {
      label: '受理拒绝',
			status: -1
		},

	},
	TestStatus: {
		statusField: 'stage',
		//取样 待收样
		sampleAccept: {
			status: 0,
		},
		//试验 待试验
		testTask: {
			status: 1,
		},
    //退回任务
    testTask: {
    	status: -1,
    },
		//复核 待复核
		testCheck: {
			status: 2,
		},
		//复核不通过
		notTestCheck: {
			status: -2,
		},
		//批准 待批准
		testApprove: {
			status: 3
		},
		//批准不通过
		noTestApprove: {
			status: -3
		},
    //待用印
    testComplete: {
    	status: 4
    },
    //待寄发
    testComplete: {
    	status: 5
    },
    //已寄发
    testComplete: {
    	status: 6
    }
	},
  ParamStatus: {
		statusField: 'status',
		//未试验
		noTest: {
			status: 0
		},
    //退回任务
    Testing: {
    	status: -1
    },
		//已完成试验
		Testing: {
			status: 1
		},
		//复核已完成
		Tested: {
			status: 2
		},
    //复核未通过
    TestRefuse: {
      status: -2
    }
  },
}
export const bookmap = {
	meta_desc: [
    {
    	"item_name": "委托编号",
    	"item_id": "委托编号",
      "booktype": "1"
    },
    {
    	"item_name": "委托日期",
    	"item_id": "委托日期",
      "booktype": "1"
    },
    {
    	"item_name": "委托单位",
    	"item_id": "委托单位",
      "booktype": "1"
    },
    {
    	"item_name": "试件尺寸",
    	"item_id": "试件尺寸",
      "booktype": "1"
    },
    {
    	"item_name": "强度等级",
    	"item_id": "强度等级",
      "booktype": "1"
    },
    {
    	"item_name": "规格",
    	"item_id": "规格",
      "booktype": "1"
    },
    {
    	"item_name": "代表数量",
    	"item_id": "代表数量",
      "booktype": "1"
    },
    {
    	"item_name": "产品批号",
    	"item_id": "产品批号",
      "booktype": "1"
    },
    {
    	"item_name": "龄期",
    	"item_id": "龄期",
      "booktype": "1"
    },
    {
    	"item_name": "工程名称",
    	"item_id": "工程名称",
      "booktype": "1"
    },
    {
    	"item_name": "委托人",
    	"item_id": "委托人",
      "booktype": "1"
    },
    {
    	"item_name": "上料仓位",
    	"item_id": "上料仓位",
      "booktype": "1"
    },
    {
    	"item_name": "取样人",
    	"item_id": "取样人",
      "booktype": "2"
    },
    {
    	"item_name": "试验员",
    	"item_id": "试验员",
      "booktype": "2"
    },
    {
    	"item_name": "复核人",
    	"item_id": "复核人",
      "booktype": "2"
    },
    {
    	"item_name": "记录编号",
    	"item_id": "记录编号",
      "booktype": "2"
    },
    {
    	"item_name": "批准人",
    	"item_id": "批准人",
      "booktype": "2"
    },
    {
    	"item_name": "专业监理工程师",
    	"item_id": "专业监理工程师",
      "booktype": "2"
    },
    {
    	"item_name": "报告编号",
    	"item_id": "报告编号",
      "booktype": "2"
    },
    {
    	"item_name": "报告日期",
    	"item_id": "报告日期",
      "booktype": "2"
    },
    {
    	"item_name": "代表数量A",
    	"item_id": "代表数量A",
      "booktype": "3"
    },

  ]
}
export function GetEntrustStatusJsonByName(status_name) {
	try {
		let entrustStatus = testProcessOption.entrustStatus
		for (let key in entrustStatus) {
			return entrustStatus[key]
		}
	} catch (e) {
		console.log(e)
	}
	return ''
}
export function GetBookMapIndexByName(meta_desc) {
	try {
		let meta_desc_list = bookmap.meta_desc
		for (let i=0;i<meta_desc_list.length;i++) {
      if(bookmap.meta_desc[i].item_id===meta_desc)
        return i
		}
	} catch (e) {
		console.log(e)
	}
	return -1
}
export function GetEntrustStatusByName(status_name) {
	try {
		let json = GetEntrustStatusJsonByName(status_name)
		if (json && json.hasOwnProperty(status)) {
			return json.status
		}
	} catch (e) {
		console.log(e)
	}
	return ''
}

export function GetParamStatusJsonByName(status_name) {
	try {
		let ParamStatus = testProcessOption.ParamStatus
		for (let key in ParamStatus) {
      if(k === status_name)
        return ParamStatus[key]
		}
	} catch (e) {
		console.log(e)
	}
	return ''
}
export function GetParamStatusByName(status_name) {
	try {
		let json = GetParamStatusJsonByName(status_name)
		if (json && json.hasOwnProperty(status)) {
			return json.status
		}
	} catch (e) {
		console.log(e)
	}
	return ''
}
export default {
	testProcessOption
}
