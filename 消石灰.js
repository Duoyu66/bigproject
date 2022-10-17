function test() {
    try {
        let sAddEx = '';
        let reportList = listreport;
        //获取数据
        let sStandard = GetValueByMetaName(reportList, '评定依据');
        let sMaterial = GetValueByMetaName(reportList, '增黏剂种类');
        let sTestItems = GetValueByMetaName(reportList, '试验项目');
        let sTime1 = GetValueByMetaName(reportList, '报告日期');
        let sTime2 = GetValueByMetaName(listentrust, '成型日期');
        let conclusion = '';
        let isQualified = true;
        let nIndex = 0;
        let listScript = [];
        let dDay = 0;
        //计算不合格指标所属试验项目以及指标数量
        let sNotQualified = '';
        let aNotQualified = {};
        let sNotJudge = '';
        let config = {
            defalutParamConfig: {
                unit: '%',
            },
            '细度': {
                unit: '%',
            },
            '需水量比': {
                unit: '%',
            },
            '氯离子含量': {
                unit: '%',
            },
            '含水量': {
                unit: '%',
            },
            '密度': {
                unit: 'g/cm' + '³',
            },
            '比表面积': {
                unit: 'm' + '²' + '/kg',
            },
            '安定性': {
                unit: ''
            }, '初凝': {
                unit: 'min'
            }, '终凝': {
                unit: 'min'
            }, '读数均值': {
                unit: '',
                display_param_name: 'PH'
            }, "用水量敏感度": {
                unit: 'kg/m' + '³',
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
        function isJump(item, sTestItems, dDay) {
            if (dDay < 3) {
                if (sTestItems.indexOf('抗压强度比3d') >= 0 && item.param_name.indexOf('抗压强度比3d') >= 0) {
                    return true;
                }
                if (sTestItems.indexOf('抗压强度比28d') >= 0 && item.param_name.indexOf('抗压强度比28d') >= 0) {
                    return true;
                }
                if (sTestItems.indexOf('收缩率比') >= 0 && item.param_name.indexOf('收缩率比') >= 0) {
                    return true;
                }
            } else if (dDay < 28) {
                if (sTestItems.indexOf('抗压强度比28d') >= 0 && item.param_name.indexOf('抗压强度比28d') >= 0) {
                    return true;
                }
                if (sTestItems.indexOf('收缩率比') >= 0 && item.param_name.indexOf('收缩率比') >= 0) {
                    return true;
                }
            }
            return false;
        }
        //获取判定数据
        for (let i = 0; i < listjudgeresult.length; i++) {
            let jsonScript = {
                "param_name": "",
                "value": "",
                "result": ""
            };
            jsonScript.param_name = listjudgeresult[i].param_name;
            jsonScript.display_param_name = listjudgeresult[i].param_name;
            jsonScript.value = listjudgeresult[i].meta_act.value;
            jsonScript.result = listjudgeresult[i].result;
            jsonScript.display_value = SetUnit(jsonScript.param_name, jsonScript.value);
            listScript.push(jsonScript);
            nIndex = nIndex + 1;
        };
        if (nIndex == 0) {
            console.log('未找到判定数据');
            //return [-1, '/'];
            return [-1,'未找到判定数据'];
        }

        if (sTime1 == '/' || sTime1 == '') {
            sTime1 = dateHelper.format_fob(new Date());
        }
        if (sTime1 == '/' || sTime1 == '' || sTime2 == '/' || sTime2 == '') {
            if (sTestItems.indexOf('抗压强度') >= 0) {
                console.log('报告日期或者成型日期为空');
                //return [-1, '报告日期或者制件日期为空'];
                return [-1,'报告日期或者成型日期为空'];
            }
        } else if (sTestItems.indexOf('抗压强度') >= 0) {
            dDay = dateHelper.getDaysBetween(sTime1, sTime2);
            if (dDay < 3 && sTestItems.indexOf('抗压强度比3d') >= 0) {
                sAddEx += "(3天后补)。";
            } else if (dDay < 28 && sTestItems.indexOf('抗压强度比28d') >= 0) {
                sAddEx += "(28天后补)。";
            } else if (dDay < 28 && sTestItems.indexOf('收缩率比') >= 0) {
                sAddEx += "(28天后补)。";
            } else {
                sAddEx = '';
            }
        }
        let item = '';
        for (let i = 0; i < listScript.length; i++) {
            item = listScript[i];
            switch (item.result) {
                //不符合标准值的
                case -1:
                    isQualified = false;
                    if (isJump(item, sTestItems, dDay)) {
                        continue;
                    }
                    if (aNotQualified[item.display_param_name]) {
                        aNotQualified[item.display_param_name].itemList.push(item)
                    } else {
                        aNotQualified[item.display_param_name] = {
                            label: item.display_param_name,
                            itemList: [item]
                        }
                    }
                    break;
                //没有标准值的
                case 0:
                    if (isJump(item, sTestItems, dDay)) {
                        continue;
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
        conclusion = '该样品';
        if (sNotJudge) {
            conclusion = conclusion + '经检测，' + sNotJudge;
        }

        if (isQualified) {
            if (sNotJudge) {
                conclusion = conclusion + '其余所检项目均符合';
            } else {
                conclusion = conclusion + '所检项目符合';
            }

        } else {
            conclusion = conclusion + '所检项目中' + sNotQualified + '不符合';
        }
        conclusion = conclusion + sStandard + '中对' + '增粘剂技术标准要求' + sAddEx;

        //conclusion += '。';

        return [1,conclusion];
    } catch (e) {
        console.log(e);
        //return [-1, e];
        return e;
    }
}
test();