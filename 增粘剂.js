function JudgeTest() {
  var nIndex,nTemp,nTemp2,nPass;
  var sStandard,sTemp,sTempPassMetas,s,sSteelSpec,sWeight,sStandardValue;
  var sBelong,sTestType,sMetas,sPassMetas,sPass;
  var aBelong,aMetaName,aResult;
  var isE,bJudgeResult;
  var dWeight,dWeightStandardValue;

  let jsonReportMeta = window.listdata;
  let listResultJson = window.listjudgeresult;

  sTestType = GetValueByMetaName(jsonReportMeta, '试验类别');
  sStandard = GetValueByMetaName(jsonReportMeta, '评定依据');
  sSteelSpec = GetValueByMetaName(jsonReportMeta, '钢筋级别牌号');

  if (listResultJson.length == 0) {
      console.log('未找到判定数据');
      return ['-1', '未找到判定数据']
  }

  nTemp = 0;
  nPass = 0;
  sMetas ='';
  sPassMetas = '';
  isE = sSteelSpec.indexOf('E')>=0;

  for(let i=0;i<jsonReportMeta.length;i++)
  {
    let sMetaName = jsonReportMeta[i].meta_stand.meta_name;
    sTemp = jsonReportMeta[i].belong;
    if(sMetaName.indexOf('重量偏差')>=0)
    {
      bJudgeResult = JudgeResult(sMetaName,'重量偏差标准值');
      if(bJudgeResult) {
        jsonReportMeta[i].result='1';
      }
    }
    if(sMetaName.indexOf('直径偏差')>=0)
    {
      bJudgeResult = JudgeResult(sMetaName,'直径偏差标准值');
      if(bJudgeResult) {
        jsonReportMeta[i].result='1';
      }
    }
    if(jsonReportMeta[i].result=='-1')
    {
      if(isE) {
        if(sMetaName.indexOf('直径偏差')>=0)
          continue;
      }
      else {
        if(sMetaName.indexOf('最大力总延伸率')>=0)
          continue;
      }
      nTemp = nTemp + 1;
      if(sMetas.indexOf(sTemp)<0 )
        sMetas = sMetas + sTemp +';'
    }
    else {
      nPass=nPass+1;
      if(sPassMetas.indexOf(sTemp)<0)
        sPassMetas := sPassMetas + sTemp +';'
    }
  }
  sTempPassMetas = sPassMetas;
  sPassMetas = '';
  while(sTempPassMetas.indexOf(';')>=0) {
    nTempPassMetas= sTempPassMetas.indexOf(';');
    sTemp = sTemp.substr(0,nTempPassMetas)
    if(sMetas.indexOf(sTemp)<0) {
      sPassMetas = sPassMetas + sTemp +';';
    }
    sTempPassMetas.substr(0,nTempPassMetas)
  }
  if(nTemp>0)    //去除最后的分割符号
    sMetas = sMetas.substr(0,sMetas.length);
  if(nPass>0)    //去除最后的分割符号
    sTempPassMetas = sTempPassMetas.substr(0,sTempPassMetas.length);
  if(sPassMetas != '') {
    sPassMetas =sPassMetas+'符合'+sSteelSpec+'钢筋技术要求，';
  }
  if(sStandard.indexOf('1499.1-')>=0) {
    sStandard = 'GB/T 1499.1-2017《钢筋混凝土用钢 第1部分：热轧光圆钢筋》';
  }
  else if(sStandard.indexOf('1499.2-')>=0) {
    sStandard := 'GB/T 1499.2-2018《钢筋混凝土用钢 第2部分：热轧带肋钢筋》';
  }
  if(nTemp == 0) {  //合格报告
    if(sTestType=='初检')
      return '依据'+sStandard+',所检项目符合'+sSteelSpec+'钢筋技术要求。'
    else 
      return '依据'+sStandard+','+ '复检结果符合'+sSteelSpec+'钢筋技术要求。';
    
  } 
  else {
    if((sMetas.indexOf(sTemp) >= 0) && (sTestType=='初检')) { //有两个及以上项目不合格，判定不合格
      return '依据'+sStandard+ ',所检项目中'+sMetas +'不符合'+sSteelSpec +'的钢筋技术要求,该试样不合格。';
    }
    else if((sMetas != '') && (sTestType=='初检'))     //初检有一个项目不合格，判定复检
    {
      return '依据'+sStandard+'所检项目中'+sPassMetas+sMetas +'不符合'+sSteelSpec+'钢筋技术要求,需取双倍试样复检。';
    }
    else if((sMetas != '') && (sTestType=='复检')) {
      return '依据' +sStandard+ ','+sMetas+'复检结果不符合'+sSteelSpec +'钢筋技术要求,该试样不合格。';
    }
  }
  
}

function JudgeResult(jsonReportMeta,sMetaName,sStandardName) {
  var sValue,sStandardValue,dValue,dStandardValue,nType;

  sValue = GetValueByMetaName(jsonReportMeta, sMetaName);
  sStandardValue = GetValueByMetaName(jsonReportMeta, sStandardName);

  if ((sValue != '') && (sValue != '/') && (sStandardValue != '') && (sStandardValue != '/'))
    dValue = parseFloat(sValue);
  
  if (sStandardValue.indexOf('±') >=0) {
    nType = 0;
    dStandardValue = parseFloat(sStandardValue.substr(1,sStandardValue.length));
  }
  else if (sStandardValue.indexOf('≥') >=0) {
    nType = 10;
    dStandardValue = parseFloat(sStandardValue.substr(1,sStandardValue.length));
  }
  else if (sStandardValue.indexOf('≤') >=0) {
    nType = 20;
    dStandardValue = parseFloat(sStandardValue.substr(1,sStandardValue.length));
  }
  else if (sStandardValue.indexOf('<') >=0) {
    nType = 21;
    dStandardValue = parseFloat(sStandardValue.substr(1,sStandardValue.length));
  }
  else if (sStandardValue.indexOf('>') >=0) {
    nType = 11;
    dStandardValue = parseFloat(sStandardValue.substr(1,sStandardValue.length));
  }
  else {
    nType = 100;
    dStandardValue = parseFloat(sStandardValue.substr(1,sStandardValue.length));
  }
  
  if(nType==0) {
    if((dValue <=  dStandardValue ) || ( dValue >= (0-dStandardValue) )) {
      return true;
    }
  }
  else if(nType==10) {
    if(dValue >= dStandardValue) {
      return true;
    }
  }
  else if(nType==11) {
    if(dValue > dStandardValue) {
      return true;
    }
  }
  else if(nType==20) {
    if(dValue <= dStandardValue) {
      return true;
    }
  }
  else if(nType==21) {
    if(dValue < dStandardValue) {
      return true;
    }
  }
  else if(nType==100) {
    if(dValue = dStandardValue) {
      return true;
    }
  }
}


function InternalDiameter() {
  var sDiameter,sSteelKind;
  let result = '0';
  let jsonReportMeta = window.listdata;
  
  sSteelKind = GetValueByMetaName(jsonReportMeta, '钢筋级别牌号');
  sDiameter = GetValueByMetaName(jsonReportMeta, '公称直径');
  
  if((sSteelKind =='') || (sDiameter =='')) {
    return result
  }
  if(sSteelKind.indexOf('HRB')>=0) {
    switch(parseFloat(sDiameter)) {
      case 6:
        result = '5.8';
        break;
      case 8:
        result = '7.7';
        break;
      case 10:
        result = '9.6';
        break;
      case 12:
        result = '11.5';
        break;
      case 14:
        result = '13.4';
        break;
      case 16:
        result = '15.4';
        break;
      case 18:
        result = '17.3';
        break;
      case 20:
        result = '19.3';
        break;
      case 22:
        result = '21.3';
        break;
      case 25:
        result = '24.2';
        break;
      case 28:
        result = '27.2';
        break;
      case 32:
        result = '31.0';
        break;
      case 36:
        result = '35.0';
        break;
      case 40:
        result = '38.7';
        break;
      case 50:
        result = '48.5';
        break;
      
    }      
  }
  else if(sSteelKind.indexOf('HPB')>=0) {
    result = sDiameter;
  }
  return result;
}

function TheoryWeight() {
  var sDiameter,sSteelKind,sLength;
  var dTheoryWeight,nLength,nTemp;
  let result = '0';
  let jsonReportMeta = window.listdata;
  
  sSteelKind = GetValueByMetaName(jsonReportMeta, '钢筋级别牌号');
  sDiameter = GetValueByMetaName(jsonReportMeta, '公称直径');
  sLength = GetValueByMetaName(jsonReportMeta, '试样总长度');
  
  if((sSteelKind =='') || (sDiameter =='')) {
    return result
  }
  nTemp = sLength.indexOf('.');
  if(nTemp < 0) {
    nLength = 3;
  }
  else {
    nLength = sLength.length-nTemp-1;
  }
  if(sSteelKind.indexOf('HRB')>=0) {
    switch(parseFloat(sDiameter)) {
      case 6:
        dTheoryWeight = 0.222;
        break;
      case 8:
        dTheoryWeight = 0.395;
        break;
      case 10:
        dTheoryWeight = 0.617;
        break;
      case 12:
        dTheoryWeight = 0.888;
        break;
      case 14:
        dTheoryWeight = 1.21;
        break;
      case 16:
        dTheoryWeight = 1.58;
        break;
      case 18:
        dTheoryWeight = 2.00;
        break;
      case 20:
        dTheoryWeight = 2.47;
        break;
      case 22:
        dTheoryWeight = 2.98;
        break;
      case 25:
        dTheoryWeight = 3.85;
        break;
      case 28:
        dTheoryWeight = 4.83;
        break;
      case 32:
        dTheoryWeight = 6.31;
        break;
      case 36:
        dTheoryWeight = 7.99;
        break;
      case 40:
        dTheoryWeight = 9.87;
        break;
      case 50:
        dTheoryWeight = 15.42;
        break;
    }
  }
  else if(sSteelKind.indexOf('HPB')>=0) {
    switch(parseFloat(sDiameter)) {
      case 6: 
        dTheoryWeight = 0.222;
        break;
      case 6.5:
        dTheoryWeight = 0.260;
        break;
      case 8:
        dTheoryWeight = 0.395;
        break;
      case 10:
        dTheoryWeight = 0.617;
        break;
      case 12:
        dTheoryWeight = 0.888;
        break;
      case 14:
        dTheoryWeight = 1.21;
        break;
      case 16:
        dTheoryWeight = 1.58;
        break;
      case 18:
        dTheoryWeight = 2.00;
        break;
      case 20:
        dTheoryWeight = 2.47;
        break;
      case 22:
        dTheoryWeight = 2.98;
        break;
    }
  }
  else {
    dTheoryWeight = 0;
  }
  return dTheoryWeight;
}


function GetSamples() {
  var sTestKind,dBatch
  let jsonReportMeta = window.listdata;
  let result = 0;
  
  sTestKind = GetValueByMetaName(jsonReportMeta, '试验类别');
  dBatch = GetValueByMetaName(jsonReportMeta, '代表数量');
  
  if(dBatch > 60) {
    result = 3;
  }
  else {
    result = 2;
  }
  if(sTestKind=='复检') {
    result = result*2;
  }
  return result;
}

function GetSamples1() {
  var sTestKind,dBatch
  let jsonReportMeta = window.listdata;
  let result = 0;
  
  sTestKind = GetValueByMetaName(jsonReportMeta, '试验类别');
  dBatch = GetValueByMetaName(jsonReportMeta, '代表数量');
  
  if(dBatch > 60) {
    result = 2;
  }
  else {
    result = 1;
  }
  if(sTestKind=='复检') {
    result = result*2;
  }
  return result;
}
