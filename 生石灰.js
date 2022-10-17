function  GroundSlagJudgeTest() {
  let sAddEx ='';
  let reportList = listreport;
  let sStandard = GetValueByMetaName(reportList, '评定依据');
  let sTestItems = GetValueByMetaName(reportList, '试验项目');
  let sTime1 = GetValueByMetaName(reportList, '报告日期');
  let sTime2 = GetValueByMetaName(reportList, '制件日期');
  let sLevel = GetValueByMetaName(reportList, '规格等级');
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
        '松散密度': {
            unit: 'g/cm³',
        },
        '密度': {
            unit: 'g/cm³',
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
        console.log('消石灰 未找到判定数据');
        //return [-1, '/'];
        return [-1,'消石灰 未找到判定数据'];
    }
    // if ((sTime1 ='/') || (sTime1 ='') || (sTime2 ='/') || (sTime2 ='')) {
    //   if (sTestItems.indexOf("活性指数")>=0) {
    //     console.log('消石灰 未找到判定数据');
    //     //return [-1, '/'];
    //     return [-1,'需要检测活性指数项目，但是未找到制件日期或报告日期'];
    //   }
    // }
    // else if(sTestItems.indexOf("活性指数")>=0) {
    //   let tTime1=StrToDate(sTime1);
    //   let tTime2=StrToDate(sTime2);
    //   dDay=tTime1-tTime2;
    //   if (dDay<7) {
    //     if (sTestItems.indexOf("7d活性指数")>=0)
    //     {
    //       sAddEx='(7天后补)';
    //     }
    //   }
    //   else if (dDay<28) {
    //     if (sTestItems.indexOf("28d活性指数")>=0)
    //     {
    //       sAddEx='(28天后补)';
    //     }
    //   }
    //   else {
    //     sAddEx='';
    //   }
    // }
    sAddEx=sAddEx+'。';
    for (let i = 0; i < listScript.length; i++) {
        let item = listScript[i];
        switch (item.result) {
            //不符合标准值的
            case -1:
                isQualified = false;
                // if (dDay < 28) {
                //     if (sTestItems.indexOf('活性指数') >= 0 && item.param_name.indexOf('活性指数') >= 0) {
                //         continue;
                //     }
                // }
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
                // if (dDay < 28) {
                //     if (sTestItems.indexOf('活性指数') >= 0 && item.param_name.indexOf('活性指数') >= 0) {
                //         continue;
                //     }
                // }
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
    conclusion = conclusion + sStandard + '中' + sLevel + '消石灰的技术标准要求' + sAddEx;

    //conclusion += '。';

    return [-1,conclusion];
  } catch (e) {
      console.log(e);
      return [-1, e];
      return e;
  }

}
GroundSlagJudgeTest()
var
  sStandard,sTemp,sParam,sMaterial,sBelong,sAddEx,sTime1,sTime2,sItems : String;
  nIndex,nTemp,i,nYears,nFlux : Integer;
  bResult,bAge : boolean;
  dDay: Double;
  aBelong,aMetaName,aResult : array of String;
  tTime1,tTime2 : TDateTime;
begin
  sAddEx :='';
  sStandard := GetValueByName('评定依据');
  sMaterial := GetValueByName('矿渣粉规格');
  sItems := GetValueByName('试验项目');
  let conclusion = '';
  let isQualified = true;
  let nIndex = 0;
  let listScript = [];

  JudgeProcess;
  nIndex := 0;
  while true do       //获取指标比对结果
  begin
    sTemp := GetJudgedValue(nIndex);
    if sTemp<>'' then
    begin
      SetLength(aBelong,nIndex+1);
      SetLength(aMetaName,nIndex+1);
      SetLength(aResult,nIndex+1);
      nTemp := Pos(';',sTemp);
      aBelong[nIndex] := Copy(sTemp,1,nTemp-1);
      delete(sTemp,1,nTemp);
      nTemp := Pos(';',sTemp);
      aMetaName[nIndex]:= Copy(sTemp,1,nTemp-1);
      delete(sTemp,1,nTemp);
      aResult[nIndex] := sTemp;
    end
    else
      break;
    nIndex :=nIndex + 1;
  end;
  //没有判断结果数据， 直接返空
  if nIndex = 0 then
  begin
    Result :='';
    Exit;
  end;
  sParam := '该矿渣粉';
  sTemp := GetValueByName('需水量比');
  if (sTemp <> '')  and (sTemp <> '/') then
    sParam := sParam + '需水量比为'+sTemp+'%,';
  sTemp := GetValueByName('碱含量');
  if (sTemp <> '')  and (sTemp <> '/') then
    sParam := sParam + '碱含量为'+sTemp+'%,';

  if sParam <> '该矿渣粉' then
     sParam := Copy(sParam,1,Length(sParam)-1)+';'
  else
     sParam :='';

  //没有判断结果数据， 直接返空
  if (nIndex = 0) and (sParam='') then
  begin
    Result :='';
    Exit;
  end;
  sTime1:=GetvalueByName('报告日期');
  sTime2:=GetvalueByName('制件日期');
  if ((sTime1 ='/') or (sTime1 ='') or (sTime2 ='/') or (sTime2 =''))  then
  begin
    if Pos('活性指数',sItems)>0 then
    begin
      Result :='';
      exit;
    end
  end
  else  if Pos('活性指数',sItems)>0 then
  begin
    tTime1:=StrToDate(sTime1);
    tTime2:=StrToDate(sTime2);
    dDay:=tTime1-tTime2;
    if (dDay<7)  then
    begin
        if (Pos('7d活性指数',sItems)>0) then
          sAddEx:='(7天后补)';
    end
    else if (dDay<28)  then
    begin
    if (Pos('28d活性指数',sItems)>0) then
         sAddEx:='(28天后补)'
    end
    else
        sAddEx:='';
  end;

  nTemp := 0;
  //计算不合格指标所属试验项目以及指标数量
  sBelong :='';
  for nIndex := 0 to Length(aResult) - 1 do
  begin
    if aResult[nIndex] = '0' then
    begin
      sTemp := aMetaName[nIndex];
      if (dDay < 7) and (Pos('7d活性指数',sItems)>0) then
      begin
          if (Pos('7d活性指数',sTemp)>0)  or (Pos('28d活性指数',sTemp)>0) then
             continue;
      end
      else if (dDay < 28) and (Pos('28d活性指数',sItems)>0)  then
      begin
          if (Pos('28d活性指数',sTemp)>0) then
             continue;
      end;

      nTemp := nTemp + 1;
      sTemp := aMetaName[nIndex];
      if Pos(aBelong[nIndex],sBelong) <= 0 then
         sBelong := sBelong + aBelong[nIndex]+',';
    end;
  end;
  if nTemp>0 then    //去除最后的分割符号
    sBelong := Copy(sBelong,1,Length(sBelong)-1);
  if (nTemp = 0) then    //合格报告
  begin
    if sParam<>'' then
       Result := sParam + '依据'+sStandard+',其他所检项目均符合'+sMaterial+' 技术要求'+sAddEx
    else
       Result := sParam + '依据'+sStandard+',所检项目均符合'+sMaterial+' 技术要求'+sAddEx;
    SetReportResult(1);
  end
  else
  begin
    Result := sParam + '依据'+sStandard+',所检项目中，'+sBelong+ '不符合'+sMaterial+'技术要求,其他所检项目均符合'+sMaterial+' 技术要求'+sAddEx;
    SetReportResult(2);
  end;
end;
BEGIN
END.
