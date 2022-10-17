function test() {
    try {
        let sAddEx = '';
        let reportList = listreport;
        //获取数据
        let sStandard = GetValueByMetaName(reportList, '评定依据');
        let sMaterial = GetValueByMetaName(reportList, '矿渣粉规格');
        let sTestItems = GetValueByMetaName(reportList, '试验项目');
        let sTime = GetValueByMetaName(reportList, '报告日期');
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
        };
        console.log(' listScript', listScript);
        if (nIndex == 0) {
            console.log('粉煤灰 未找到判定数据');
            //return [-1, '/'];
            return '粉煤灰 未找到判定数据';
        }

        if (sTime1 == '/' || sTime1 == '') {
            let tempDate = dateHelper.format_fob(new Date());
            sTime1 = tempDate;
        }
        if (sTime1 == '/' || sTime1 == '' || sTime2 == '/' || sTime2 == '') {
            if (sTestItems.indexOf('活性指数') >= 0) {
                console.log('报告日期或者制件日期为空');
                //return [-1, '报告日期或者制件日期为空'];
                return '报告日期或者制件日期为空';
            }
        } else if (sTestItems.indexOf('活性指数') >= 0) {
            dDay = dateHelper.getDaysBetween(sTime1, sTime2);
            if (dDay < 28) {
                sAddEx += "(28天后补)。"
            }
        }
        let item = '';
        for (let i = 0; i < listScript.length; i++) {
            item = listScript[i];
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
            if (dLoss > 3) {
                conclusion = conclusion + '但不宜用于严重冻融破坏环境';
            }
        } else {
            conclusion = conclusion + sNotQualified + '不符合';
        }
        conclusion = conclusion + sStandard + '中' + sLevel + '粉煤灰的技术标准要求' + sAddEx;

        //conclusion += '。';

        return conclusion;
    } catch (e) {
        console.log(e);
        //return [-1, e];
        return e;
    }
}
test();

function JudgeParticleDistribution()
var
  p1,p2,p3,p4,p5,p6,dTotal,dTemp1,dTemp2,dTemp3 : double;
  pp1,pp2,pp3,pp4,pp5,pp6 : double;
  sStandard,sType : String;
begin
  Result :='';
  sStandard := GetValueByName('评定依据');
  sType := GetValueByName('细骨料类别');
  p1 := StrToFloatEx(GetValueByName('筛孔1平均累计筛余'));   //4.75     *
  p2 := StrToFloatEx(GetValueByName('筛孔2平均累计筛余'));   //2.36
  p3 := StrToFloatEx(GetValueByName('筛孔3平均累计筛余'));   //1.18
  p4 := StrToFloatEx(GetValueByName('筛孔4平均累计筛余'));   //600      *
  p5 := StrToFloatEx(GetValueByName('筛孔5平均累计筛余'));   //300
  p6 := StrToFloatEx(GetValueByName('筛孔6平均累计筛余'));   //150
  dTotal := 5;
//  dTotal := (p1+p2+p3+p4+p5+p6)*5/100;


  dTemp1 := 0;
  if p2 < 5 then  dTemp1 := dTemp1 + 5 - p2;
  if p2 >35 then  dTemp1 := dTemp1 + p2 - 35;
  if p3 < 35 then  dTemp1 := dTemp1 + 35 - p3;
  if p3 >65 then  dTemp1 := dTemp1 + p3 - 65;
  if p5 < 80 then  dTemp1 := dTemp1 + 80 - p5;
  if p5 >95 then  dTemp1 := dTemp1 + p5 - 95;
  if sType='天然砂' then
  begin
    if p6 < 90 then  dTemp1 := dTemp1 + 90 - p6;
    if p6 >100 then  dTemp1 := dTemp1 + p6 - 100;
  end
  else
  begin
    if p6 < 85 then  dTemp1 := dTemp1 + 85 - p6;
    if p6 >97 then  dTemp1 := dTemp1 + p6 - 97;
  end;
  dTemp2 := 0;
  if p2 >25 then  dTemp2 := dTemp2 + p2 - 25;
  if p3 < 10 then  dTemp2 := dTemp2 + 10 - p3;
  if p3 >50 then  dTemp2 := dTemp2 + p3 - 50;
  if p5 < 70 then  dTemp2 := dTemp2 + 70 - p5;
  if p5 >92 then  dTemp2 := dTemp2 + p5 - 92;
  if sType='天然砂' then
  begin
    if p6 < 90 then  dTemp2 := dTemp2 + 90 - p6;
    if p6 >100 then  dTemp2 := dTemp2 + p6 - 100;
  end
  else
  begin
    if p6 < 80 then  dTemp2 := dTemp2 + 80 - p6;
    if p6 >94 then  dTemp2 := dTemp2 + p6 - 94;
  end;
  dTemp3 := 0;
  if p2 < 0 then  dTemp3 := dTemp3 + 0 - p2;
  if p2 >15 then  dTemp3 := dTemp3 + p2 - 15;
  if p3 < 0 then  dTemp3 := dTemp3 + 0 - p3;
  if p3 >25 then  dTemp3 := dTemp3 + p3 - 25;
  if p5 < 55 then  dTemp3 := dTemp3 + 55 - p5;
  if p5 >85 then  dTemp3 := dTemp3 + p5 - 85;
  if sType='天然砂' then
  begin
    if p6 < 75 then  dTemp3 := dTemp3 + 75 - p6;
    if p6 >94 then  dTemp3 := dTemp3 + p6 - 94;
  end
  else
  begin
    if p6 < 90 then  dTemp3 := dTemp3 + 90 - p6;
    if p6 >100 then  dTemp3 := dTemp3 + p6 - 100;
  end;
//  ShowMessage(dTemp2);
//  ShowMessage(dTotal);
  if (p1>=0) and (p1<=10) and (p4>=71) and (p4<=85) and (dTemp1 <=dTotal) then
     Result := 'Ⅰ区'
  else if (p1>=0) and (p1<=10) and (p4>=41) and (p4<=70) and (dTemp2 <= dTotal) then
     Result := 'Ⅱ区'
  else if (p1>=0) and (p1<=10) and  (p4>=16) and (p4<=40) and (dTemp3 <=dTotal) then
     Result := 'Ⅲ区'
  else
     Result :='无法确定级配区属';
end;