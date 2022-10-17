import {
	doEdit,
	ExecSql,
	QueryExec,
	QueryExecFile,
  QueryExecBySql
} from '@/api/table'
import {
	cellConvert,
	cellCount,
	cellConvertToOffice
} from '@/utils/cellconvert'
import {
	ZlibHelper
} from '@/global/zlibHelper'

export async function getExportData(spread,template_id,param) {

  let sData = '[Q]692{'+template_id+'}|^SYS'
  const res = await QueryExec(sData)
  console.log(sData)
  let templateData = res.data[0]
  let stageData = await getStageDataValue(template_id)
  await pasteExcel(spread,templateData)
  for(let i=0;i<stageData.length;i++)
  {
    let cellDataMap = await getCellDataMap(stageData[i])
    let cellData = await getCellDataValue(stageData[i],param)
    if(stageData[i].isTable === '1') {
      await setDataValue(spread,cellDataMap,cellData,stageData[i],templateData)
    }
    else {
      await setDataValue(spread,cellDataMap,cellData,stageData[i],templateData)
    }
  }
}

async function pasteExcel(spread,templateData,order)
{
  let paste = new pasteManual(spread);
  let test = await paste.ManualPaste(templateData.template_json, 0, 0, true, undefined, {sheet: { start_sheet_id: order }});
  return test
}

async function getStageDataValue(template_id)
{
  let sData = '[Q]693{'+template_id+'}|^SYS'
  const res = await QueryExec(sData)
  console.log(res)
  return res.data
}

async function getCellDataValue(stageData,param)
{
  let sData = stageData.sql_val
  console.log(sData,param)
  const res = await QueryExecBySql(sData,param)
  console.log(res)
  return res.data
}

async function getCellDataMap(stageData)
{
  let sData = '[Q]695{'+stageData.stage_id+'}|^SYS'

  const res = await QueryExec(sData)
  console.log(sData,res)
  return res.data
}

async function setDataValue(spread,cellDataMap,cellData,stageData,templateData)
{
  spread.isPaintSuspended(true)
  for(let k=0;k<stageData.page_nums;k++)
  {
    for(let i=0;i<stageData.each_page_nums;i++)
    {
      if(i<cellData.length)
      {
        for(let j=0;j<cellDataMap.length;j++)
        {

          let rowcolumn = cellConvert(cellDataMap[j].cell)
          let sheet = spread.getSheet(Number(stageData.sheet_id)+k)
          sheet.setValue(rowcolumn[0]+i,rowcolumn[1],cellData[i+(k*stageData.page_nums)][cellDataMap[j].field_title])
        }
      }
      else {
        break;
      }
    }
  }
  spread.isPaintSuspended(false)

}
