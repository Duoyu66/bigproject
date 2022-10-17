function  GroundSlagJudgeTest() {
  let sAddEx ='';
  let reportList = listreport;
  let sStandard = GetValueByMetaName(reportList, '评定依据');
  let sTestItems = GetValueByMetaName(reportList, '试验项目');
  let sTime1 = GetValueByMetaName(reportList, '报告日期');
  let sTime2 = GetValueByMetaName(reportList, '制件日期');
  let sLevel = GetValueByMetaName(reportList, '矿渣粉规格');
  let conclusion = '';
  let isQualified = true;
  let nIndex = 0;
  let listScript = [];
  let dDay = 0;
  //计算不合格指标所属试验项目以及指标数量
  let sNotQualified = '';
  let aNotQualified = {};
  let sNotJudge = '';
  try {
    let config = {
        defalutParamConfig: {
            unit: '%',
        },
        '比表面积': {
            unit: '%',
        },
        '密度': {
            unit: '%',
        }
    };
    //设置单位
    function SetUnit(param_name, value) {
        if (config[param_name] && typeof config[param_name].unit != 'undefined') {
            return value + config[param_name].unit;
        }
        if (config.defalutParamConfig && config.defalutParamConfig.unit) {
            return value + config.defalutParamConfig.unit;
        }
        return value;
    }
    //获取判定数据
    for (let i = 0; i < listjudgeresult.length; i++) {
        let jsonScript = {
            "param_name": "",
            "value": "",
            "result": "",
            "display_value": ""
        };
        jsonScript.param_name = listjudgeresult[i].param_name;
        jsonScript.display_param_name = listjudgeresult[i].param_name;
        jsonScript.value = listjudgeresult[i].meta_act.value;
        jsonScript.result = listjudgeresult[i].result;
        jsonScript.display_value = SetUnit(jsonScript.param_name, jsonScript.value);
        listScript.push(jsonScript);
        nIndex = nIndex + 1;
    }
    if (nIndex == 0) {
        console.log('矿渣粉 未找到判定数据');
        //return [-1, '/'];
        return [-1,'矿渣粉 未找到判定数据'];
    }
    if ((sTime1 ='/') || (sTime1 ='') || (sTime2 ='/') || (sTime2 ='')) {
      if (sTestItems.indexOf("活性指数")>=0) {
        console.log('矿渣粉 未找到判定数据');
        //return [-1, '/'];
        return [-1,'需要检测活性指数项目，但是未找到制件日期或报告日期'];
      }
    }
    else if(sTestItems.indexOf("活性指数")>=0) {
      let tTime1=StrToDate(sTime1);
      let tTime2=StrToDate(sTime2);
      dDay=tTime1-tTime2;
      if (dDay<7) {
        if (sTestItems.indexOf("7d活性指数")>=0)
        {
          sAddEx='(7天后补)';
        }
      }
      else if (dDay<28) {
        if (sTestItems.indexOf("28d活性指数")>=0)
        {
          sAddEx='(28天后补)';
        }
      }
      else {
        sAddEx='';
      }
    }
    sAddEx=sAddEx+'。';
    for (let i = 0; i < listScript.length; i++) {
        let item = listScript[i];
        switch (item.result) {
            //不符合标准值的
            case -1:
                isQualified = false;
                if (dDay < 28) {
                    if (sTestItems.indexOf('活性指数') >= 0 && item.param_name.indexOf('活性指数') >= 0) {
                        continue;
                    }
                }
                if (aNotQualified[item.display_param_name]) {
                    aNotQualified[item.display_param_name].itemList.push(item);
                } else {
                    aNotQualified[item.display_param_name] = {
                        label: item.display_param_name,
                        itemList: [item]
                    }
                }
                break;
            //没有标准值的
            case 0:
                if (dDay < 28) {
                    if (sTestItems.indexOf('活性指数') >= 0 && item.param_name.indexOf('活性指数') >= 0) {
                        continue;
                    }
                }
                sNotJudge = sNotJudge + item.display_param_name + '为' + item.display_value + '、';
                break;
            //符合标准值的
            case 1:
                break;
        }
    }
    for (let key in aNotQualified) {
        sNotQualified = sNotQualified + aNotQualified[key].label + '、';
    }
    if (sNotQualified != '') {
        sNotQualified = sNotQualified.substring(0, sNotQualified.length - 1);
    }
    if (sNotJudge != '') {
        sNotJudge = sNotJudge.substring(0, sNotJudge.length - 1);
        sNotJudge = sNotJudge + '，';
    }
    conclusion = '该样品经检测，';
    if (sNotJudge) {
        conclusion = conclusion + sNotJudge;
    }

    if (isQualified) {
        if (sNotJudge) {
            conclusion = conclusion + '其余所检项目均符合';
        } else {
            conclusion = conclusion + '所检项目均符合';
        }
    } else {
        conclusion = conclusion + sNotQualified + '不符合';
    }
    conclusion = conclusion + sStandard + '中' + sLevel + '级混凝土用矿渣粉的技术标准要求' + sAddEx;

    //conclusion += '。';

    return [-1,conclusion];
  } catch (e) {
      console.log(e);
      return [-1, e];
      return e;
  }

}
GroundSlagJudgeTest()