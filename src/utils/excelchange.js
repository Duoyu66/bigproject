import {
  QueryExec,
} from '@/api/table'
import {
  getHandwritingByPersonelId,
} from '@/api/handwriting'
import {
  baseURL
} from '@/config'
import {
  cellConvert,
  cellCount,
  cellConvertToOffice
} from '@/utils/cellconvert'
import {
  Report
} from '@/utils/dataCache'

import {
	getParamUnit
} from '@/utils/Parameter'

const isCompressed=true

function reSetExcel(spread)
{
  let josndata=spread.toJSON()
  spread.fromJSON({})
  spread.fromJSON(josndata)
}

async function initStandardList(object_id) {
  let sData

  sData = '[Q]472{'+object_id+'$`}|^SYS'
  const res = await QueryExec(sData)

  window.liststandard=res.data
  console.log(sData,res)
}

export async function initexcel(spread,listdata,index,param_id, object_id,current_org,isAccept)
{
  try
  {
    let paste = new pasteManual(spread);//粘贴模板
    let test = await paste.ManualPaste(listdata.template_json, 0, 0, true, undefined, {sheet: { start_sheet_id: 0 },isFrozen: false});
    reSetExcel(spread)

    AddFunctions(spread);

    console.log(isAccept)

    if(isAccept===1)
    {
      let sheet = spread.getActiveSheet()
      sheet.setIsProtected(true)
      await initSetCellFormat(sheet,listdata.mapdata,listdata.datagroup,Number(listdata.order_sheet)-1, object_id,current_org,'',0) //设置格式
      FormulaReplace(spread,listdata.template_id,listdata.mapdata,object_id,listdata.datadetail,Number(listdata.order_sheet)-1) //公式转换
      initSetCellFormula(spread,listdata.mapdata,Number(listdata.order_sheet)-1) //设置公式
    }
    else if(isAccept===2) {
      let listEntrySheet = listdata.entry_sheet.split(',')
      for(let i=0;i<listEntrySheet.length;i++)
      {
        let sheet = spread.getSheet(Number(listEntrySheet[i])-1)
        // console.log(sheet)
        sheet.setIsProtected(true)
        await initSetCellFormat(sheet,listdata.mapdata,listdata.datagroup,Number(listEntrySheet[i])-1, object_id,current_org,'',0) //设置格式
        FormulaReplace(spread,listdata.template_id,listdata.mapdata,object_id,listdata.datadetail,Number(listEntrySheet[i])-1) //公式转换
        initSetCellFormula(spread,listdata.mapdata,Number(listEntrySheet[i])-1) //设置公式
      }

    }
    else {
      let sheet = spread.getActiveSheet()
      sheet.setIsProtected(true)
      await initSetCellFormat(sheet,listdata.mapdata,listdata.datagroup,Number(listdata.order_sheet)-1, object_id,current_org,'',0) //设置格式
      FormulaReplace(spread,listdata.template_id,listdata.mapdata,object_id,listdata.datadetail,Number(listdata.order_sheet)-1) //公式转换
      initSetCellFormula(spread,listdata.mapdata,Number(listdata.order_sheet)-1) //设置公式
    }

    await setParamterValue(spread,listdata.datadetail,listdata.mapdata,Number(listdata.order_sheet)-1)

    let num = spread.getSheetCount()
    for(let i=0;i<num;i++)
    {
      if(i != Number(listdata.order_sheet)-1)
      {
        // spread.removeSheet(i);
      }
    }
    // sheettemp.visible(false);
  }
  catch(e) {
    console.log(e)
  }
}

export async function initreviewexcel(spread,listdata,entrust_id,object_id,testData)
{
  try
  {
    let i,count=0
    let time1 = new Date().getTime();
    spread.isPaintSuspended(true);
    window.listdata=listdata
    await initStandardList(object_id)
    console.log(listdata)
    console.log(testData)
    let paste = new pasteManual(spread);//粘贴模板
    // let test
    let test = await paste.ManualPaste(listdata.template_json, 0, 0, true, undefined, {sheet: { start_sheet_id: 0 },isFrozen: false});
    reSetExcel(spread)
    AddFunctions(spread);
    // setJudgeProcInEval(listdata.judge_proc)
    let listrecordsheet = listdata.record_sheet.split(',')
    let listreportsheet = listdata.report_sheet.split(',')
    let testItem = GetValueByMetaNameForNew(listdata,'试验项目')

    // console.log(testItem)
    for(i=0;i<spread.getSheetCount();i++)
    {
      let sheet = spread.getSheet(i)
      sheet.setIsProtected(true)
    }
    if(testData.windowstate===1)
    {
      for(let i=0;i<listrecordsheet.length;i++)
      {
        let sheet = spread.getSheet(Number(listrecordsheet[i])-1)
        await initSetCellFormat(sheet,listdata.mapdata,listdata.datagroup,Number(listrecordsheet[i])-1, object_id,testData.org_id,testItem,1) //设置格式
        FormulaReplace(spread,listdata.template_id,listdata.mapdata,object_id,listdata.datadetail,Number(listrecordsheet[i])-1) //公式转换
        initSetCellFormula(spread,listdata.mapdata,Number(listrecordsheet[i])-1)
      }
      for(let i=0;i<listreportsheet.length;i++)
      {
        console.log(Number(listreportsheet[i])-1)
        let sheet = spread.getSheet(Number(listreportsheet[i])-1)
        await initSetCellFormat(sheet,listdata.mapdata,listdata.datagroup,Number(listreportsheet[i])-1, object_id,testData.org_id,testItem,1) //设置格式
        FormulaReplace(spread,listdata.template_id,listdata.mapdata,object_id,listdata.datadetail,Number(listreportsheet[i])-1) //公式转换
        initSetCellFormula(spread,listdata.mapdata,Number(listreportsheet[i])-1)
      }
    }
    else if(testData.windowstate===2) {
      for(let i=0;i<listrecordsheet.length;i++)
      {
        let sheet = spread.getSheet(Number(listrecordsheet[i])-1)
        await initSetCellFormat(sheet,listdata.mapdata,listdata.datagroup,Number(listrecordsheet[i])-1, object_id,testData.org_id,testItem,1) //设置格式
        FormulaReplace(spread,listdata.template_id,listdata.mapdata,object_id,listdata.datadetail,Number(listrecordsheet[i])-1) //公式转换
        initSetCellFormula(spread,listdata.mapdata,Number(listrecordsheet[i])-1)
      }
      for(let i=0;i<listreportsheet.length;i++)
      {
        console.log(Number(listreportsheet[i])-1)
        let sheet = spread.getSheet(Number(listreportsheet[i])-1)
        await initSetCellFormat(sheet,listdata.mapdata,listdata.datagroup,Number(listreportsheet[i])-1, object_id,testData.org_id,testItem,1) //设置格式
        FormulaReplace(spread,listdata.template_id,listdata.mapdata,object_id,listdata.datadetail,Number(listreportsheet[i])-1) //公式转换
        initSetCellFormula(spread,listdata.mapdata,Number(listreportsheet[i])-1)
      }
    }
    else if(testData.windowstate===3) {
      window.listdata.operateState = 3
      for(let i=0;i<listrecordsheet.length;i++)
      {
        let sheet = spread.getSheet(Number(listrecordsheet[i])-1)
        await initSetCellFormat(sheet,listdata.mapdata,listdata.datagroup,Number(listrecordsheet[i])-1, object_id,testData.org_id,testItem,1) //设置格式
        // FormulaReplace(spread,listdata.template_id,listdata.mapdata,object_id,listdata.datadetail,Number(listrecordsheet[i])-1) //公式转换
        // initSetCellFormula(spread,listdata.mapdata,Number(listrecordsheet[i])-1)
      }
      for(let i=0;i<listreportsheet.length;i++)
      {
        console.log(Number(listreportsheet[i])-1)
        let sheet = spread.getSheet(Number(listreportsheet[i])-1)
        await initSetCellFormat(sheet,listdata.mapdata,listdata.datagroup,Number(listreportsheet[i])-1, object_id,testData.org_id,testItem,1) //设置格式
        FormulaReplace(spread,listdata.template_id,listdata.mapdata,object_id,listdata.datadetail,Number(listreportsheet[i])-1) //公式转换
        initSetCellFormula(spread,listdata.mapdata,Number(listreportsheet[i])-1)
      }
    }
    for(i=0;i<spread.getSheetCount();i++)
    {
      await setParamterValue(spread,listdata.datadetail,listdata.mapdata,i)
    }
    spread.isPaintSuspended(false);
    let time2 = new Date().getTime();
    console.log(time2-time1)
    return i+1
  }
  catch(e) {
    console.log(e)
  }
}

async function initSetCellFormat(sheet,listmap,datagroup,index, object_id,current_org,testItem,excelState)
{
  let i,j
  let dataGroup
  // console.log(listmap)
  for(i=0;i<listmap.length;i++)
  {
    try {
      let rowcolumn = cellConvert(listmap[i].cell)
      if(excelState===0 || listmap[i].belong==='')
      {
        await setCellFormatPer(sheet, listmap, i, datagroup, object_id, current_org, index)
      }
      else if(testItem && testItem.indexOf(listmap[i].belong)>=0) {
        await setCellFormatPer(sheet, listmap, i, datagroup, object_id, current_org, index)
      }
      else {
        if(listmap[i].sheet_id === index.toString())
        {
          console.log(listmap[i].meta_name)
          sheet.getCell(rowcolumn[0],rowcolumn[1]).text('/').foreColor('#000000');
        }

      }
    }
    catch(e) {
      console.log(e)
    }

  }
}

async function setCellFormatPer(sheet,listmap,i,datagroup, object_id,current_org, index)
{
  let dataGroup
  if(listmap[i].sheet_id === index.toString())
  {
    if(listmap[i].metric!=='1')
    {
      let rowcolumn = cellConvert(listmap[i].cell)
      if(listmap[i].input_type === '')
      {

        if(listmap[i].data_type === '文本')
        {
          sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').foreColor('#000000');
        }
        else if(listmap[i].data_type === '日期')
        {
          sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').foreColor('#000000').formatter(new $.wijmo.wijspread.GeneralFormatter('yyyy-MM-dd'));
          sheet.setCellType(rowcolumn[0], rowcolumn[1], new window.$.wijmo.wijspread.DatePickerCellType());
        }
        else if(listmap[i].data_type === '时间')
        {
          sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').foreColor('#000000');
          sheet.getCell(rowcolumn[0],rowcolumn[1]).cellType(new $.wijmo.wijspread.DatePickerCellType({type: 'hh:mm:ss'})).foreColor('#000000').formatter(new $.wijmo.wijspread.GeneralFormatter('HH:mm:ss'));
        }
        else if(listmap[i].data_type === '时分')
        {
          sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').foreColor('#000000');
          sheet.getCell(rowcolumn[0],rowcolumn[1]).cellType(new $.wijmo.wijspread.DatePickerCellType({type: 'hh:mm'})).foreColor('#000000').formatter(new $.wijmo.wijspread.GeneralFormatter("HH:mm"));
        }
        else if(listmap[i].data_type === '分秒')
        {
          sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').foreColor('#000000');
          sheet.getCell(rowcolumn[0],rowcolumn[1]).cellType(new $.wijmo.wijspread.DatePickerCellType({type: 'mm:ss'})).foreColor('#000000').formatter(new $.wijmo.wijspread.GeneralFormatter('mm:ss'));
        }
        else if(listmap[i].data_type === '数值')
        {
          sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').foreColor('#000000');
        }
        else
        {
          sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').foreColor('#000000');
        }
      }
      else if(listmap[i].input_type === '单选')
      {
        dataGroup = await initCellDataSpecialSelect(listmap, datagroup, i, object_id,current_org)
        sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').foreColor('#000000');
        var cellType = new window.$.wijmo.wijspread.ComboTreeCellType({
            checkbox: false
        });
        cellType.items(dataGroup);
        sheet.setCellType(rowcolumn[0], rowcolumn[1], cellType);
      }
      else if(listmap[i].input_type === '多选')
      {
        dataGroup = await initCellDataSpecialSelect(listmap, datagroup, i, object_id,current_org)
        sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').foreColor('#000000');
        var cellType = new window.$.wijmo.wijspread.ComboTreeCellType({
            checkbox: true
        });
        cellType.items(dataGroup);
        sheet.setCellType(rowcolumn[0], rowcolumn[1], cellType);
      }
      setCellUnProtect(sheet,rowcolumn)
    }

    else {
      let rowcolumn = cellConvert(listmap[i].cell)
      sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').backColor("#ffefef");
      setCellUnProtect(sheet,rowcolumn)
    }
  }
}

function setCellUnProtect(sheet,rowcolumn) {
  let style = sheet.getStyle(rowcolumn[0], rowcolumn[1])
  if(style)
  {
    style.locked = false
    sheet.setStyle(rowcolumn[0], rowcolumn[1],style)
  }

}

function setCellProtect(sheet,rowcolumn) {
  let style = sheet.getStyle(rowcolumn[0], rowcolumn[1])
  if(style) {
    style.locked = true
    sheet.setStyle(rowcolumn[0], rowcolumn[1],style)
  }

}

async function initCellDataSpecialSelect(listmap, datagroup, j, object_id,current_org) {
  let data,sData
  // console.log(j)
  if(listmap[j].group_id === '1')
  {
    sData = '[Q]472{'+object_id+'$`1}|^SYS'
    const res = await QueryExec(sData)
    // console.log(sData,res)
    data = ChangeJudgeStandard(res.data)
    return data
  }
  else if(listmap[j].group_id === '2')
  {
    sData = '[Q]473{'+object_id+'}|^SYS'
    const res1 = await QueryExec(sData)
    // console.log(sData,res1)
    data = DataGroupChange(res1.data)
    return data
  }
  else if(listmap[j].group_id === '3')
  {
    sData = '[Q]472{'+object_id+'$`2}|^SYS'
    const res2 = await QueryExec(sData)
    // console.log(sData,res2)
    data = ChangeTestStandard(res2.data)
    return data
  }
  else
  {
    let dataGroupJson = []
    for(let i=0;i<datagroup.length;i++)
    {
      if(listmap[j].group_id === datagroup[i].group_id)
      {
        dataGroupJson = []
        for(let j=0;j<datagroup[i].item.length;j++)
        {
          dataGroupJson.push({ id: datagroup[i].item[j].item_id, p_id: listmap[j].group_id, name: datagroup[i].item[j].item_name, open: true })
        }
      }
    }
    return dataGroupJson
  }
}

function initSetCellFormula(spread,listmap,index)
{
  let i,j
  let dataGroup
  for(i=0;i<listmap.length;i++)
  {
    let sheet = spread.getSheet(index)
    let rowcolumn = cellConvert(listmap[i].cell)
    if(listmap[i].expression !== '' && listmap[i].sheet_id==index.toString())
    {
      try {
        sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').backColor('#F4F4F4');
        console.log(listmap[i].meta_name,listmap[i].expression)
        let test = sheet.setFormula(rowcolumn[0],rowcolumn[1],listmap[i].expression);
      }
      catch(e) {
        console.log(e)
      }
    }
    else{
      //sheet.getCell(rowcolumn[0],rowcolumn[1]).text('').foreColor('#000000');
    }
  }
}

export async function FormulaReplace(spread,param_id,listmap,object_id,datadetail,index) {
  let count = 0
  try {
    for(let i=0;i<listmap.length;i++)
    {
      let expression = listmap[i].expression
      let expressionnew,expressiontwice

      if(expression !== '' && listmap[i].sheet_id==index.toString())
      {
        expressionnew=expression
        for(let j=0;j<listmap.length;j++)
        {
          if(listmap[j].sheet_id !== index.toString())
          {
            let sheet=spread.getSheet(Number(listmap[j].sheet_id))
            let sheetname=sheet._name
            expression = expression.replace(new RegExp("{"+listmap[j].meta_name+"}", 'g'),"'"+sheetname+"'!"+listmap[j].cell)
          }
          else {
            // console.log(expression,listmap[j].meta_name)
            expression = expression.replace(new RegExp("{"+listmap[j].meta_name+"}", 'g'),listmap[j].cell)
          }
        }
        // console.log(listmap[i].meta_name,expression)
        if(listmap[i].rounding!==0)
        {
          switch (listmap[i].rounding) {
            case "1":
              expression = "RoundEx(" + expression + ",1," + listmap[i].scale + ")";
              break;
            case "2":
              expression = "RoundEx(" + expression + ",0.2," + listmap[i].scale + ")";
              break;
            case "3":
              expression = "RoundEx(" + expression + ",0.5," + listmap[i].scale + ")";
              break;
          }
        }
        listmap[i].expression = "=" + expression
      }
    }
  }
  catch(e) {
    console.log(e)
  }

}

async function getSheetById(spread,sheet_id) {
	let sheet;
	sheet = spread.getSheet(sheet_id);
	return sheet;
}

export async function ResetSheetCellSize(spread,width,height,widthleave,heightleave) {
  // console.log(width,height)
  let rowheight=0,columnwidth=0,i,r=0,c=0,hmuti=1,wmuti=1
  let sheet
  let rowcolumn = []
  let n = spread.getSheetCount()
  console.log(n)
  if(n===1)
  {
    spread.tabStripVisible(false);
    spread.tabEditable(false);
  }
  spread.newTabVisible(false);
  spread.setHScrollBarVisible(false);
  spread.setVScrollBarVisible(false);
  spread.isPaintSuspended(true)
  for(let k=0;k<n;k++)
  {
    rowheight=0,columnwidth=0,r=0,c=0,hmuti=1,wmuti=1
    //spread.setActiveSheetIndex(i);

    sheet = await getSheetById(spread,k)
    // console.log(sheet)
    let rowcount = sheet.getRowCount();
    let columncount = sheet.getColumnCount();
    rowheight=0
    columnwidth=0
    for(i=0;i<rowcount;i++)
    {
      rowheight = rowheight + sheet.getRowHeight(i);
    }
    for(i=0;i<columncount;i++)
    {
      columnwidth = columnwidth + sheet.getColumnWidth(i);
    }
    // console.log(columnwidth,rowheight,width,height)
    let hper=height/rowheight
    let wper=width/columnwidth
    let useper
    if(hper>wper)
    {
      useper=wper
    }
    else {
      useper=hper
    }
    if(wper<1)
    {
      wper=1
      spread.setHScrollBarVisible(true);
    }
    if(hper<1)
    {
      hper=1
      spread.setVScrollBarVisible(true);

    }
    // console.log(wper,hper)
    if(rowheight<height)
    {

      for(i=0;i<rowcount;i++)
      {
        sheet.setRowHeight(i, parseFloat(hper)*sheet.getRowHeight(i));
      }
    }
    if(columnwidth<width)
    {
      for(i=0;i<columncount;i++)
      {
        sheet.setColumnWidth(i, parseFloat(wper)*sheet.getColumnWidth(i));
      }
    }
    if(rowheight<height)
    {
      sheet.addRows(0, 1);
      sheet.setRowHeight(0, (height-rowheight*hper+heightleave)/2);
      sheet.addSpan(0, 0, 1, columncount+1);
      r=1
      // console.log('row')
    }
    if(columnwidth<width)
    {
      sheet.addColumns(0, 1);
      sheet.setColumnWidth(0, (width-columnwidth*wper+widthleave)/2);
      sheet.addSpan(0, 0, rowcount+1, 1);
      c=1
      // console.log('column')
    }
    // console.log(spread)
    sheet.gridline.showHorizontalGridline = false;
    sheet.gridline.showVerticalGridline = false;

    sheet.setRowHeaderVisible(false)
    sheet.setColumnHeaderVisible(false)
    hmuti=hper
    wmuti=wper


    // console.log(r,c)
    sheet.setActiveCell(r,c)
    rowcolumn.push([r,c,wmuti,hmuti])
  }

  spread.isPaintSuspended(false)
  return rowcolumn
}

function setParamterValue(spread,datadetail,listmap,index,rows,order)
{
  let sheet
  if(!order)
  {
    order = 0
  }
  if(!index)
  {
    index = 0
  }
  if(!rows)
  {
    rows = 0
  }
  let i,j
  let dataGroup
  console.log(rows,datadetail)
  for(i=0;i<datadetail.length;i++)
  {
    if(datadetail[i])
    {
      let numlist = getCellAxisByMetaId(listmap, datadetail[i].meta_id)
      for(j=0;j<numlist.length;j++)
      {
        let num=numlist[j]
        if(num>=0 && index===Number(listmap[num].sheet_id))
        {
          sheet = spread.getSheet(Number(listmap[num].sheet_id))
          let rowcolumn = cellConvert(listmap[num].cell)
          sheet.setValue(rowcolumn[0],rowcolumn[1],datadetail[i].value)
        }
      }

    }
  }
}

function getCellAxisByMetaId(listmap, meta_id)
{
  let numlist=[]
  for(let i=0;i<listmap.length;i++)
  {
    if(listmap[i].meta_id===meta_id)
    {
      numlist.push(i)
    }
  }
  return numlist
}

function getdatadetailbyid(datadetail, meta_id)
{
  for(let i=0;i<datadetail.length;i++)
  {
    if(datadetail[i].meta_id===meta_id)
    {
      return i
    }
  }
  return -1
}

export async function JudgeTestAndGetConclusion(spread,listdata,data_id) {
  window.listdata=listdata
  let sheetactive,testersigndata='',reviewersigndata=''
  spread.isPaintSuspended(true)
  try {
    let listjudgeresultreport = []
    let listjudgedata = await GetNeedJudgeData(listdata) //组成空的需要判定的指标list,包含标准值和平行的试样值
    console.log('listjudgedata',listjudgedata)
    let listjudgestandard = await GetJudgeStandard(listdata) //获取判定规则
    console.log('listjudgestandard',listjudgestandard)
    let listjudgeconditiondata = await GetJudgeCondition(listdata) //获取判定条件所需数据，并标准化
    console.log('listjudgeconditiondata',listjudgeconditiondata)
    let listjudgeresult = await GetJudgeResult(listjudgedata,listjudgestandard,listjudgeconditiondata,listdata) //获取判定结果 更改listjudgedata内标准值的数值
    console.log('listjudgeresult',listjudgeresult)
    window.listjudgeresult = listjudgeresult
    // await setParamterValue(spread,listreport.datadetail,listreport.mapdata,0,0,order)
    for(let i=0;i<listjudgeresult.length;i++)
    {
      let num = GetOrderByMetaIdInListData(listdata.mapdata,listjudgeresult[i].meta_stand.meta_id)
      if(num>=0)
      {
        let rowcolumn = cellConvert(listdata.mapdata[num].cell)
        sheetactive = spread.getSheet(Number(listdata.mapdata[num].sheet_id));
        sheetactive.setValue(rowcolumn[0],rowcolumn[1],listjudgeresult[i].meta_stand.value)
      }
    }
    let sreportdata = eval(listdata.judge_proc) //执行插件返回试验结论
    // console.log(listdata.judge_proc)
    // let sreportdata = setJudgeProcInEval(listdata.judge_proc);
    for(let i=0;i<listdata.mapdata.length;i++)
    {
      if(listdata.mapdata[i].meta_name==='试验结论' && sreportdata && sreportdata!=='')
      {
        let rowcolumn = cellConvert(listdata.mapdata[i].cell)
        sheetactive = spread.getSheet(Number(listdata.mapdata[i].sheet_id));
        sheetactive.setValue(rowcolumn[0],rowcolumn[1],sreportdata[1])
      }
    }
  }
  catch(err) {
    console.log(err)
  }
  finally {
    spread.isPaintSuspended(false)
  }
}

async function GetJudgeCondition(listdata)
{
  let listjudge = []
  for(let i=0;i<listdata.datadetail.length;i++)
  {
    let judgedata = {
      "object_id":"",
      "meta_id":"",
      "meta_name":"",
      "value":""
    }
    if(listdata.datadetail[i])
    {
      let num = GetOrderByMetaIdInListData(listdata.mapdata,listdata.datadetail[i].meta_id)
      if(num>=0 && listdata.mapdata[num].item_category === '约束项')
      {
        judgedata.object_id=listdata.mapdata[num].object_id
        judgedata.meta_id=listdata.datadetail[i].meta_id
        judgedata.meta_name=listdata.mapdata[num].meta_name
        judgedata.value=listdata.datadetail[i].value
        listjudge.push(judgedata)
      }
    }
  }
  return listjudge
}

async function GetJudgeStandard(listdata)
{
  let listjudgestandard = []
  let sData = '[Q]632{'+listdata.object_id+'}|^SYS'
  const res = await QueryExec(sData)
  return res.data
}

async function GetNeedJudgeData(listdata)
{
  let listjudge = []
  try {
    for(let i=0;i<listdata.metadata.length;i++)
    {

      if(listdata.metadata[i].item_category === '指标项' && Number(listdata.metadata[i].meta_id)<=99999)
      {
        console.log(listdata.metadata[i])
        let judgedata = {
          "object_id":"",
          "param_name":"",
          "data_type":"",
          "meta_act":[],
          "meta_stand":{
            "meta_id":"",
            "meta_name":"",
            "value":"/"
          },
          "result":0 // 0为空，不判定，1为正确，2为错误
        }
        judgedata.object_id=listdata.metadata[i].object_id;
        judgedata.data_type=listdata.metadata[i].data_type;
        judgedata.param_name=listdata.metadata[i].belong;
        if(listdata.metadata[i].max_samples>1)
        {
          let numList = GetOrderListByParentIdInJudgeData(listdata.metadata,listdata.metadata[i].id)
          for(let j=0;j<numList.length;j++)
          {
            let meta_act = {
              "meta_id":"",
              "value":"",
              "result":0
            }
            let num = GetOrderByMetaIdInListData(listdata.datadetail,listdata.metadata[numList[j]].meta_id)
            if(num>=0 && listdata.datadetail[num].meta_id<=(Number(listdata.metadata[i].meta_id)*1000+Number(listdata.metadata[i].max_samples))) {
              meta_act.meta_id=listdata.datadetail[num].meta_id
              meta_act.value=listdata.datadetail[num].value
              judgedata.meta_act.push(meta_act);
            }
            else {
              judgedata.meta_stand.meta_id=listdata.metadata[numList[j]].meta_id
              judgedata.meta_stand.meta_name=listdata.metadata[numList[j]].meta_name
            }
          }
        }
        else {
          let num = GetOrderByMetaIdInListData(listdata.datadetail,listdata.metadata[i].meta_id)
          if(num>=0) {
            let meta_act = {
              "meta_id":"",
              "value":"",
              "result":0
            }
            meta_act.meta_id=listdata.datadetail[num].meta_id
            meta_act.value=listdata.datadetail[num].value
            judgedata.meta_act.push(meta_act);
          }
          let numList = GetOrderListByParentIdInJudgeData(listdata.metadata,listdata.metadata[i].id)
          if(numList.length>0)
          {
            judgedata.meta_stand.meta_id=listdata.metadata[numList[0]].meta_id
            judgedata.meta_stand.meta_name=listdata.metadata[numList[0]].meta_name
          }
        }
        if(judgedata.meta_act.length>0)
        {
          listjudge.push(judgedata)
        }
      }
    }
    console.log(listjudge)
  }
  catch(e) {
    console.log(e)
  }

  return listjudge
}

async function GetJudgeResult(listjudgedata,listjudgestandard,listjudgeconditiondata,listdata)
{
  try {
    let listresult = []
    let count=0
    console.log(listjudgedata,listjudgestandard,listjudgeconditiondata,listdata)
    for(let i=0;i<listjudgestandard.length;i++)
    {
      let re = await GetMetaJudgeResult(listjudgestandard[i].expression,listjudgeconditiondata)
      if(re===1)
      {
        let num1 = GetOrderByMetaIdInJudgeData(listjudgedata,listjudgestandard[i].meta_id)
        if(num1>=0)
        {
          console.log(num1)
          let expression = '';
          try {
            listjudgedata[num1].meta_stand.value = listjudgestandard[i].spec_hint
            let expression = listjudgestandard[i].compare_op
            if(expression==='min<x<max' || expression==='min<=x<max' || expression==='min<x<=max' || expression==='min<=x<=max')
            {
              expression=expression.replace("x","x && x")
            }
            expression=expression.replace("max",listjudgestandard[i].max_value)
            let conditionExpression = '';
            if(expression==='x==min')
            {
              expression=expression.replace("min","'"+listjudgestandard[i].min_value+"'")
              conditionExpression='1==1';
              for(let k=0;k<listjudgedata[num1].meta_act.length;k++)
              {
                let tempExpression = expression.replace(/x/g,"'"+listjudgedata[num1].meta_act[k].value+"'")
                let judgeperexpression = "("+tempExpression+")?1:-1"
                console.log(tempExpression,judgeperexpression)
                listjudgedata[num1].meta_act[k].result = eval(judgeperexpression)
                conditionExpression = conditionExpression+' && ' + tempExpression
              }
            }
            else {
              expression=expression.replace("min",listjudgestandard[i].min_value)
              conditionExpression='1==1';
              for(let k=0;k<listjudgedata[num1].meta_act.length;k++)
              {
                if(listjudgedata[num1].data_type==='时分' || listjudgedata[num1].data_type==='分秒')
                {
                  listjudgedata[num1].meta_act[k].value=TimeToValue(listjudgedata[num1].meta_act[k].value);
                }
                let tempExpression=expression.replace(/x/g,listjudgedata[num1].meta_act[k].value)
                let judgeperexpression = "("+tempExpression+")?1:-1"
                console.log(tempExpression,judgeperexpression)
                listjudgedata[num1].meta_act[k].result = eval(judgeperexpression)
                conditionExpression=conditionExpression+' && ' + tempExpression
              }
            }
            console.log(conditionExpression)
            let judgeexpression = "("+conditionExpression+")?1:-1"
            console.log('achievejudgeresult',listjudgedata[num1])
            listjudgedata[num1].result = eval(judgeexpression)
            // console.log(listjudgedata[num1].result)
          } catch(e) {
            console.log('achievejudgeresult execept',e)
          }
        }
      }
    }
    console.log(listjudgedata)
  }
  catch(e) {
    console.log(e)
  }

  return listjudgedata
}

async function GetMetaJudgeResult(condition,listjudgeconditiondata) {
	let re
	  // console.log('getjudgerules begin');
	let conditionnew=condition
	try {

    let i
    // console.log(condition)
    for(i=0;i<listjudgeconditiondata.length;i++)
    {
      if(condition !== '')
      {
        let search = '{'+listjudgeconditiondata[i].meta_name+'}'
        // console.log(search)
        let reg = /^((\-)?(([0-9]*)|(([0]\.\d{1,9}|[1-9][0-9]*\.\d{1,9}))))$/;
        if (!reg.test(listjudgeconditiondata[i].value)) {
          conditionnew = conditionnew.replace(new RegExp(search, 'g'),'"'+listjudgeconditiondata[i].value+'"')
        } else {
          conditionnew = conditionnew.replace(new RegExp(search, 'g'),listjudgeconditiondata[i].value)
        }

      }
    }
    let search = /\{.*?\}/g
    // console.log(search)
    conditionnew = conditionnew.replace(search,'""')
    console.log(conditionnew)

    if(conditionnew !== '')
    {

		  conditionnew = conditionnew+'?1:0'
		  re = eval(conditionnew)
      conditionnew = conditionnew+'?1:0'
      try {
        re = eval(conditionnew)
      }
      catch(e) {
        console.log(e)
      }
    }
    else {
      re = 0
    }
  } catch(e){
	  re =0;
	  console.log(e);
	  // console.log(condition);
	  // console.log(conditionnew);
  }
   // console.log('getjudgerules end')
  return re
}

function GetOrderByMetaIdInJudgeData(listdata, meta_id) {
  for(let i=0;i<listdata.length;i++)
  {
    if(listdata[i].meta_stand.meta_id === meta_id)
    {
      return i
    }
  }
  return -1
}

function GetOrderListByParentIdInJudgeData(listdata, parent_id) {
  let numList = []
  for(let i=0;i<listdata.length;i++)
  {
    if(listdata[i].parent_id === parent_id)
    {
      numList.push(i);
    }
  }
  return numList
}

function GetOrderByMetaIdInListData(listdata, meta_id) {  // listdata=listreport.metadata
  for(let i=0;i<listdata.length;i++)
  {
    if(listdata[i].meta_id === meta_id)
    {
      return i
    }
  }
  return -1
}

function TimeToValue(sTime) {
  let iValue=0;
  let listTime = sTime.split(':')
  for(let i=0;i<listTime.length;i++)
  {
    iValue=iValue*60+parseInt(listTime[i]);
  }
  return iValue.toString();
}

function DataGroupChange(dataGroup) {
  console.log(dataGroup)
  let list = []
  let listtemp = {}
  for(let i=0;i<dataGroup.length;i++)
  {
    listtemp = {"id":dataGroup[i].item_id,"pid":"0","name":dataGroup[i].item_name,"open":true}
    list.push(listtemp)
  }
  return list
}

function ChangeTestStandard(dataGroup) {
  console.log(dataGroup)
  let list = []
  let listtemp = {}
  for(let i=0;i<dataGroup.length;i++)
  {
    listtemp = {"id":dataGroup[i].standard_id,"pid":"0","name":dataGroup[i].standard_id,"open":true}
    list.push(listtemp)
  }
  return list
}

function ChangeJudgeStandard(dataGroup) {
  console.log(dataGroup)
  let list = []
  let listtemp = {}
  for(let i=0;i<dataGroup.length;i++)
  {
    listtemp = {"id":dataGroup[i].standard_id,"pid":"0","name":dataGroup[i].standard_id,"open":true}
    list.push(listtemp)
  }
  return list
}

/*
  eval执行代码获取结论所用函数
*/
//根据名称获取值 值不存在是为空
export function GetValueByMetaNameForNew(listdata,meta_name) {
  let i,j
  for(i=0;i<listdata.mapdata.length;i++)
  {

    if(listdata.mapdata[i].meta_name === meta_name)
    {
      break
    }
  }
  if(i !== listdata.mapdata.length)
  {

    for(j=0;j<listdata.datadetail.length;j++)
    {
      if(listdata.datadetail[j] && listdata.datadetail[j].meta_id === listdata.mapdata[i].meta_id)
      {
        console.log(listdata.mapdata[i],meta_name,listdata.datadetail[j].meta_id)
        return listdata.datadetail[j].value
      }
    }
  }
  return ''
}



export default {}
