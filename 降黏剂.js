function  TfmTestProcess.GenerateTestTask : boolean;
var
  I,J,K, nTestCount : Integer;
  sSQL,sGroups,sProductDate,sOrderId,sTestCategory : String;
  sIndexId,sObjectId,sTaskId,sMetaId,sMetaName,sSampleId,sSampleSpec,sSize,sOriginalGauge,sAge,sExpectedDate:String;
  sStrength : string;
  bItemSelected : boolean;
  dDate : TDateTime;
  dNow : TDateTime;
  sT1,sT2,sT3,sAgeUnit : String;
begin
    Log(ERROR,'Enter GenerateTestTask ');
   Result := False;
   if (Length(TaskReference) = 0) or (nDataId = 0) then
   begin
      Log(ERROR,'TaskReferenceis empty or nDataId = 0 ');
      Exit;
   end;
//   sSQL := 'DELETE FROM TestTask WHERE data_id='+IntToStr(nDataId);
//   dmDataBase.ExecuteSQL(sSQL);
    Log(ERROR,'Enter GenerateTestTask1 ');

   for I := 0  to Length(TaskReference) - 1  do
   begin
     //求取试验日期
     if  (TaskReference[I].nAuto = 1) or (TaskReference[I].nAgeAlert = 1) then
     begin
         Log(ERROR,'Enter GenerateTestTask3 ');

        sProductDate := TestData.Values[TaskReference[I].sProductDate];
        sAge := TaskReference[I].sAge;
        sAgeUnit := TestData.Values['龄期单位'];
        if sAge = '' then
           sAge := '0'
        else if not TryStrToInt(sAge, K) then
           sAge := TestData.Values[sAge];
        //提醒试验必须有制件日期和龄期
         Log(ERROR,'Enter GenerateTestTask4 ');

        if (TaskReference[I].nAgeAlert = 1) then
        begin
          if (sProductDate = '') or (sAge='') then
          begin
            Log(ERROR,'Enter GenerateTestTask5  ');
            continue;
          end
          else
          begin
             //已经超过试验日期,不再生成任务
             if sAgeUnit='h' then
               dDate := IncHour(StrToDate(sProductDate)+StrToInt(sAge))
             else
               dDate := IncDay(StrToDate(sProductDate)+StrToInt(sAge));
             dNow := StrToDate(FormatDateTime('YYYY-MM-DD',now));
             if dDate < dNow then
                 continue;
             if sAgeUnit='h' then
               sExpectedDate := FormatDateTime('YYYY-MM-DD',StrToDate(sProductDate)+StrToFloat(sAge)/24)
             else
               sExpectedDate := FormatDateTime('YYYY-MM-DD',StrToDate(sProductDate)+StrToInt(sAge));
          end;
        end
        else  //非提醒试验委托日期就是期望的试验日期
        begin
           if TestData.Values['委托日期'] ='' then
              continue;
           sExpectedDate := TestData.Values['委托日期'];
        end;
        Log(ERROR,'Enter GenerateTestTask6 ');

        sIndexId := IntToStr(TaskReference[I].nIndexId);
        sObjectId := IntToStr(TaskReference[I].nObjectId);
        sMetaId := IntToStr(TaskReference[I].nMetaId);
        sTaskId := IntToStr(nDataId);
        sMetaName := TaskReference[I].sMetaName;
        sTestCategory := IntToStr(TaskReference[I].nTestCategory);
        bItemSelected := false;
        for J := 0 to Length(TestDict) - 1 do
        begin
           //LogEx(ERROR,'TaskReference[I].nMetaId=%d  TestDict[J].nMetaId=%d',[TaskReference[I].nMetaId,TestDict[J].nMetaId]);
           if TaskReference[I].nMetaId = TestDict[J].nMetaId then
           begin

              bItemSelected := TestDict[J].bVisible;

              nTestCount := TestDict[J].nActSamples;
              LogEx(ERROR,'样品数量1=%d',[nTestCount]);
              break;
           end;
        end;
        if not bItemSelected  then   continue;

        sOrderId := TestData.Values['委托编号'];
        sSampleId := TestData.Values['样品编号'];
        sSampleSpec := GetMetaValueByNickName('规格');
        if sObjectId='1003' then
        begin
          sT1 := TestData.Values['试样厚度试样1'];
          sT2 := TestData.Values['试样宽度试样1'];
          sT3 := TestData.Values['试样内径试样1'];
          if (sT1<>'') and (sT1<>'/') then
          begin
            if (sT2<>'') and (sT2<>'/') then
             sSize :=sT2+'×'+sT1
            else if (sT3<>'') and (sT3<>'/') then
             sSize :='Φ'+sT3+'×'+sT1
            else
             Exit;
          end
          else
          begin
            if (sT3<>'') and (sT3<>'/') then
             sSize :='Φ'+sT3
            else
             Exit;
          end;
        end
        else
          sSize := GetMetaValueByNickName('试件尺寸');
        if sSize='' then
           sSize := TaskReference[I].sSize;
        sOriginalGauge := TestData.Values['原始标距'];
        sStrength := GetMetaValueByNickName('强度等级');
        //为采集软件提供
        if  sStrength <> '' then
             sSampleSpec := sSampleSpec + '-' + sStrength;
        //对于有多组试验, 试件数量使用指标试件数量乘仪组数

        if TaskReference[I].sGroupCount <> '' then
        begin
           sGroups := TaskReference[I].sGroupCount;
           if sGroups <> '' then
              nTestCount := nTestCount * StrToInt(sGroups);
        end ;
        {else
        begin
           sGroups := GetValueByName('测区数量');
           if (sGroups <> '')  AND (sGroups <> '/') then
              nTestCount := StrToInt(sGroups);
        end;
        LogEx(ERROR,'样品数量=%d',[nTestCount]); }

        if sGroups='' then   sGroups:='0';
        if sOriginalGauge ='' then  sOriginalGauge := '0';
        sSQL := 'SELECT data_id from TestTask WHERE data_id='+ sTaskId+' and index_id='+ sIndexId;
        dmDatabase.OpenSQLTable(sSQL,0);
        if dmDatabase.dsShare0.DataSet.eof then
        begin
          if dmDatabase.nDBType = ORACLE then
             sSQL := 'INSERT INTO TestTask(org_id,test_category,data_id,order_id,object_id,index_id,meta_id,meta_name,test_name,sample_id,test_count,sample_spec,"SIZE",original_gauge,age,expected_date,product_date,groups) values('
          else
             sSQL := 'INSERT INTO TestTask(org_id,test_category,data_id,order_id,object_id,index_id,meta_id,meta_name,test_name,sample_id,test_count,sample_spec,SIZE,original_gauge,age,expected_date,product_date,groups) values(';

          sSQL := sSQL + ''''+ dmDatabase.sLabId+''',';
          sSQL := sSQL + sTestCategory +',';
          sSQL := sSQL + sTaskId +',''';
          sSQL := sSQL + sOrderId +''',';
          sSQL := sSQL + sObjectId +',';
          sSQL := sSQL + sIndexId +',';
          sSQL := sSQL + sMetaId +',';
          sSQL := sSQL + ''''+ sMetaName +''',';
          sSQL := sSQL + ''''+ TaskReference[I].sTestName +''',';
          sSQL := sSQL + '''' + sSampleId +''',';
          sSQL := sSQL + IntToStr(nTestCount) +',';
          sSQL := sSQL + '''' + sSampleSpec +''',';
          sSQL := sSQL + '''' + sSize +''',';
          sSQL := sSQL + '''' + sOriginalGauge +''',';
          sSQL := sSQL + sAge +',';
          sSQL := sSQL + '''' + sExpectedDate +''',';
          sSQL := sSQL + '''' + sProductDate +''',';
          sSQL := sSQL + sGroups +')';

          dmDatabase.CloseSQLTable(0);
          LogEx(ERROR,'Task insert=%s',[sSQL]);
          Result := (dmDataBase.ExecuteSQL(sSQL)>0);
        end
        else
        begin
          sSQL := 'UPDATE  TestTask SET  order_id=''' + sOrderId +''',';
          sSQL := sSQL + 'sample_id='''+ sSampleId+''',';
          sSQL := sSQL + 'test_category='+ sTestCategory+',';
          sSQL := sSQL + 'test_count='+ IntToStr(nTestCount)+',';
          sSQL := sSQL + 'sample_spec='''+ sSampleSpec+''',';
          if dmDatabase.nDBType = ORACLE then
             sSQL := sSQL + '"SIZE"='''+ sSize+''','
          else
             sSQL := sSQL + 'SIZE='''+ sSize+''',';

          sSQL := sSQL + 'groups='+ sGroups+',';
          sSQL := sSQL + 'original_gauge='''+ sOriginalGauge+''',';
          sSQL := sSQL + 'age='+ sAge+',';
          sSQL := sSQL + 'expected_date='''+sExpectedDate+''',';
          sSQL := sSQL + 'product_date='''+ sProductDate+''' WHERE data_id='+ sTaskId+' and index_id='+ sIndexId;
          dmDatabase.CloseSQLTable(0);
          LogEx(ERROR,'Task update=%s',[sSQL]);

          Result := (dmDataBase.ExecuteSQL(sSQL)>0);
        end;
     end;
   end;
end;
