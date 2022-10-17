function JudgeTest() : String;
var
  nIndex,nTemp,I : Integer;
  sStandard,sTemp,s,sSteelSpec : String;
  sBelong,sTestType,sMetas,sPass : String;
  aBelong,aMetaName,aResult : array of String;
begin
  JudgeProcess;
  sTestType := GetValueByName('试验类别');
  sStandard := GetValueByName('评定依据');
  sSteelSpec := GetValueByName('钢筋级别牌号');
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
  nTemp := 0;
  sMetas :='';
  //计算不合格指标所属试验项目以及指标数量
  for nIndex := 0 to Length(aResult) - 1 do
  begin
    if aResult[nIndex] = '0' then
    begin
      nTemp := nTemp + 1;
      sTemp := aBelong[nIndex];
	  //showmessage(aMetaName[nIndex]);
      if Pos(sTemp,sMetas) <=0 then
        sMetas := sMetas + sTemp +';'
    end;
  end;
  if nTemp>0 then    //去除最后的分割符号
    sMetas := Copy(sMetas,1,Length(sMetas)-1);
  if (nTemp = 0)   then    //合格报告
  begin
    if (sTestType='初检') then
       Result :='依据'+sStandard+',所检项目均符合'+sSteelSpec+'钢筋技术要求。'
    else
       Result :='依据'+sStandard+','+ '复检结果符合'+sSteelSpec+'钢筋技术要求。';
    SetReportResult(1);
  end
  else
  begin
     if (POS(';',sMetas) > 0) and (sTestType='初检') then  //有两个及以上项目不合格，判定不合格
     begin
        Result :='依据'+sStandard+ ',所检项目中'+sMetas +'不符合'+sSteelSpec +'的钢筋技术要求,该试样不合格。';
        SetReportResult(2);
     end
     else if (sMetas<>'') and (sTestType='初检') then     //初检有一个项目不合格，判定复检
     begin
//        Result :='依据'+sStandard+'所检项目中'+sMetas +'不符合'+sSteelSpec+'钢筋技术要求,需取双倍试样复检。';
        Result :='依据'+sStandard+'所检项目中'+sMetas +'不符合'+sSteelSpec+'钢筋技术要求。';
        SetReportResult(2);
     end
     else if (sMetas<>'') and (sTestType='复检') then     //复检有一个项目不合格，判定不合格
     begin
        Result :='依据' +sStandard+ ','+sMetas+'复检结果不符合'+sSteelSpec +'钢筋技术要求,该试样不合格。';
        SetReportResult(2);
     end;
  end;
end;
function InternalDiameter():String;
var
  sDiameter,sSteelKind : String;
begin
  sSteelKind := GetValueByName('钢筋级别牌号');
  sDiameter := GetValueByName('公称直径');
  if (sSteelKind ='') or (sDiameter ='') then
  begin
     Result := '0';
     Exit;
  end;
  if POS('HRB',sSteelKind)>0 then
  begin
    case StrToFloatEx(sDiameter) of
       6: Result := '5.8';
       8: Result := '7.7';
       10: Result := '9.6';
       12: Result := '11.5';
       14: Result := '13.4';
       16: Result := '15.4';
       18: Result := '17.3';
       20: Result := '19.3';
       22: Result := '21.3';
       25: Result := '24.2';
       28: Result := '27.2';
       32: Result := '31.0';
       36: Result := '35.0';
       40: Result := '38.7';
       50: Result := '48.5';
    end;
  end
  else if POS('HPB',sSteelKind)>0 then
     Result := sDiameter
  else
       Result := '0';
end;
function TheoryWeight():String;
var
  sDiameter,sSteelKind : String;
begin
  sSteelKind := GetValueByName('钢筋级别牌号');
  sDiameter := GetValueByName('公称直径');
  if (sSteelKind ='') or (sDiameter ='') then
  begin
     Result := '0';
     Exit;
  end;
  if POS('HRB',sSteelKind)>0 then
  begin
    case StrToFloatEx(sDiameter) of
       6: Result := '0.222';
       8: Result := '0.395';
       10: Result := '0.617';
       12: Result := '0.888';
       14: Result := '1.21';
       16: Result := '1.58';
       18: Result := '2.00';
       20: Result := '2.47';
       22: Result := '2.98';
       25: Result := '3.85';
       28: Result := '4.83';
       32: Result := '6.31';
       36: Result := '7.99';
       40: Result := '9.87';
       50: Result := '15.42';
    end;
  end
  else if POS('HPB',sSteelKind)>0 then
  begin
    case StrToFloatEx(sDiameter) of
       6: Result := '0.222';
       6.5: Result := '0.260';
       8: Result := '0.395';
       10: Result := '0.617';
       12: Result := '0.888';
       14: Result := '1.21';
       16: Result := '1.58';
       18: Result := '2.00';
       20: Result := '2.47';
       22: Result := '2.98';
    end;
  end
  else
       Result := '0';

end;
function BentCoreDiameter():String;
var
  sDiameter,sSteelKind : String;
  fDiameter : Double;
begin
  sSteelKind := GetValueByName('钢筋级别牌号');
  sDiameter := GetValueByName('公称直径');
  if (sSteelKind ='') or (sDiameter ='') then
  begin
     Result := '0';
     Exit;
  end;
  fDiameter  := StrToFloatEx(sDiameter);
  if (sSteelKind='HRB335') or (sSteelKind='HRBF335') or (sSteelKind='HRB335E') then
  begin
     if (fDiameter>=6) and (fDiameter <=25) then
         Result := FloatToStr(fDiameter*3)
     else if (fDiameter>=28) and (fDiameter <=40) then
         Result := FloatToStr(fDiameter*4)
     else if (fDiameter>40) then
         Result := FloatToStr(fDiameter*5);
  end
  else if (sSteelKind='HRB400') or (sSteelKind='HRBF400') or (sSteelKind='HRB400E')  then
  begin
     if (fDiameter>=6) and (fDiameter <=25) then
         Result := FloatToStr(fDiameter*4)
     else if (fDiameter>=28) and (fDiameter <=40) then
         Result := FloatToStr(fDiameter*5)
     else if (fDiameter>40) then
         Result := FloatToStr(fDiameter*6);
  end
  else if (sSteelKind='HRB500') or (sSteelKind='HRBF500') or (sSteelKind='HRB500E') then
  begin
     if (fDiameter>=6) and (fDiameter <=25) then
         Result := FloatToStr(fDiameter*6)
     else if (fDiameter>=28) and (fDiameter <=40) then
         Result := FloatToStr(fDiameter*7)
     else if (fDiameter>40) then
         Result := FloatToStr(fDiameter*8);
  end
  else if (sSteelKind='HPB300') then
  begin
     Result := sDiameter;
  end
  else
       Result := '0';
end;
function GetSamples() : Integer;
var
  sTestKind : String;
  dBatch : Double;
begin
  sTestKind :=GetValueByName('试验类别');
  dBatch :=StrToFloatEx(GetValueByName('代表数量'));
  if (dBatch > 60) then
     Result := 3
  else
     Result := 2;
  if sTestKind = '复检' then
     Result := Result * 2;
end;
function GetSamples1() : Integer;
var
  sTestKind : String;
  dBatch : Double;
begin
  sTestKind :=GetValueByName('试验类别');
  dBatch :=StrToFloatEx(GetValueByName('代表数量'));
  if (dBatch > 60) then
     Result := 2
  else
     Result := 1;
  if sTestKind = '复检' then
     Result := Result * 2;
end;
BEGIN
END.