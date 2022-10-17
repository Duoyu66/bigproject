import {
	getTestCacheData,
  ExecTestCacheData
} from '@/api/dataCache'
import {
  QueryExec,
  QueryExecNoCom
} from '@/api/table'
import {
	baseURL
} from '@/config'
import {
	ViewfileUrl,
	UploadFileNameUrl
} from '@/utils/servicefile'
import {
  QueryExecFile,
  ExecSql
} from '@/api/table'
import {
	ZlibHelper
} from '@/global/zlibHelper'
import {
  cellConvert,
  cellConvertToOffice
} from '@/utils/cellconvert'

const UNITSPLIT = '$`'

export async function TestDataHandle(sEntrust,entrust_id,tpl_id) {
  //console.log(sEntrust)
  let sVersion = await TestVersionRead(sEntrust)

  //console.log(sVersion)
  let data
  let sData = "1|^" + sVersion + "|^"+tpl_id+"|^"+entrust_id
  console.log(sData)
	const res = await ParameterReadUpload(sData)
  console.log(res)
  let datadetail = await EntrustDeal(sEntrust, res, tpl_id, sVersion.split('|^')[1])
  console.log(datadetail)
  data = await TestRead(sEntrust,tpl_id,datadetail.template_id)
  data.datadetail=datadetail.datadetail
  window.listdata=data
  return data
}

export async function TestDataHandleForTest(sEntrust,entrust_id,tpl_id,org_id) {
  //console.log(sEntrust)
  let sDeviceVersion = await DeviceVersionRead(org_id)

  let deviceData = await DeviceReadFromServer(sDeviceVersion,org_id)

  let sVersion = await TestVersionRead(sEntrust)
  //console.log(sVersion)
  let data
  let sData = "2|^" + sVersion + "|^"+tpl_id+"|^"+entrust_id
  console.log(sData)
	const res = await ParameterReadUpload(sData)
  console.log(res)
  let datadetail = await EntrustDeal(sEntrust, res, tpl_id, sVersion.split('|^')[1])
  console.log(datadetail)
  data = await TestRead(sEntrust,tpl_id,datadetail.template_id)
  data.datadetail=datadetail.datadetail
  window.listdata=data
  window.deviceData=deviceData
  return data
}

export async function EntrustDeal(sObjectId,sTestData,tpl_id,sTemplate) {
	let TestDataList = sTestData.split('|^')
  let sTestTemplate,sMetaVersionData,sMapVersionData
  if(TestDataList[0]==='1')
  {
    let db = TestDataSource()
    let listDataDetail,listEntrustDetail
    if(TestDataList[1] !== '')
    {
      let sTemplateSub = TestDataList[1].split('|`')
      let sMetaSub = TestDataList[2].split('|`')
      let sMapSub = TestDataList[3].split('|`')
      let sParamId = ""
      let sTemplateId = ""
      let sTemplateVersion = ""
      console.log(sMetaSub,sMapSub)
      for(let i=0;i<sTemplateSub.length;i++)
      {
        sTestTemplate = await TestTemplateWrite(db,tpl_id,sTemplateSub[i],sMetaSub[i],sMapSub[i],'TestTemplate')
        console.log(sTestTemplate)
      }
    }
    if(TestDataList[4] !== '')
    {
      let sDataGroupSub = TestDataList[4].split('|`')
      let sDataGroupVersion = ""
      for(let i=0;i<sDataGroupSub.length;i++)
      {
        sDataGroupVersion = await ParameterDataGroupWrite(db,sDataGroupSub[i],'DataGroup')
      }
    }
    if(TestDataList[5] !== '')
    {
      listDataDetail = dataDetail(TestDataList[5])
      return {'template_id':sTestTemplate,'datadetail':listDataDetail}
    }

  }
  return {'template_id':sTestTemplate,'datadetail':[]}
}

export function TestDataSource() {
	let db = openDatabase('TestSource', '1.0', 'Test Data DateBase', 100 * 1024 * 1024)
  return db
}

export function TestDataTable(db,sSQLCreate) {
  return new Promise((resolve, reject)=>{
    db.transaction(function (t){
      //成功获取的事务对象作为参数回调。
      t.executeSql(sSQLCreate, [], function(t, results){
        //console.log(results)
        resolve(true)
      }, null);
    }, function(e){
      //失败
      //console.log(e)
      resolve(false)
    });
  })
}

export function TestDataInsert(db,sSQL) {
  return new Promise((resolve, reject)=>{
    db.transaction(function (t){
      //成功获取的事务对象作为参数回调。
      t.executeSql(sSQL, [], function(t, results){
        // //console.log(results)
        resolve(true)
      }, null);
    }, function(e){
      //失败
      //console.log(e)
      resolve(false)
    });
  })
}

export function TestDataSelect(db,sSQL) {
  return new Promise((resolve, reject)=>{
    db.transaction(function(tx){
       //成功获取的事务对象作为参数回调。
      tx.executeSql(sSQL, [], function(tx, results){
        resolve(results)
      }, null);
    }, (e) => {
      //失败
      resolve(false)
    });
  })
}

export async function TestTemplateWrite(db,tpl_id,sTemplate,sMeta,sMap,tablename) {
	let sParameterTemplate = sTemplate.split("$^")
  let TestMetaList = sMeta.split("$^")
  let TestMapList = sMap.split("$^")
	let sParameterTemplateSub
  let sTemplateVersion = ""
  let sTemplateId = ""
  let sParam = ""
	let sSQL
  console.log(sTemplate)
	sSQL = 'CREATE TABLE IF NOT EXISTS '+tablename+' (template_id, template_json, entry_sheet, mixed_sheet, '
  +'order_sheet, record_sheet, report_sheet, check_sheet, judge_proc, metadata, mapdata)'
	const re1 = await TestDataTable(db,sSQL)
  //console.log(re1)
  if(re1)
  {
    for(let i=0;i<sParameterTemplate.length;i++)
    {
      sParameterTemplateSub = sParameterTemplate[i].split("$`")

      sSQL = 'DELETE FROM '+tablename+' WHERE template_id="' + sParameterTemplateSub[1] +'"'
      const re2 = await TestDataInsert(db,sSQL)
      //console.log(sSQL)
      sSQL = 'INSERT INTO '+tablename+'(template_id, template_json, entry_sheet, mixed_sheet,'
      +'order_sheet, record_sheet, report_sheet, check_sheet, judge_proc, metadata, mapdata) VALUES("'+sParameterTemplateSub[1]+'","'
      +sParameterTemplateSub[3]+'","'+sParameterTemplateSub[5]+'","'+sParameterTemplateSub[6]+'","'
      +sParameterTemplateSub[7]+'","'+sParameterTemplateSub[8]+'","'+sParameterTemplateSub[9]+'","'
      +sParameterTemplateSub[10]+'","'+sParameterTemplateSub[11]+'","'+sMeta+'","'+sMap+'")'
      const re3 = await TestDataInsert(db,sSQL)
      //console.log(re3)
      sParam = sParameterTemplateSub[0]
      sTemplateId = sParameterTemplateSub[1]
      if(sParameterTemplateSub[4])
      {
        sTemplateVersion = sParameterTemplateSub[4]
      }
      else {
        sTemplateVersion = tpl_id
      }
    }
  }
	return sTemplateId
}

export async function ParameterDataGroupWrite(db,sDataGroup,tablename) {
	let sParameterTemplate = sDataGroup.split("$^")
	let sSQL
	sSQL = 'CREATE TABLE IF NOT EXISTS '+tablename+' (group_id, groupdata)'
	const re1 = await TestDataTable(db,sSQL)
  if(re1)
  {
    sSQL = 'DELETE FROM '+tablename+' WHERE group_id="' + sParameterTemplate[0] + '"'
    const re2 = await TestDataInsert(db,sSQL)
    //console.log(re2)

    sSQL = 'INSERT INTO '+tablename+' (group_id, groupdata) VALUES("'+sParameterTemplate[0]+'","'+sParameterTemplate[1]+'")'
    const re3 = await TestDataInsert(db,sSQL)
    //console.log(re3)
  }
  return "1"
}


export async function TestRead(object_id,tpl_id,sTemplateId) {
  let db = TestDataSource()
	let listparam = {
    "object_id":"",
    "template_id":"",
    "tpl_class":"",
    "template_json":{},
    "mapdata":[],
    "metadata":[],
    "datagroup":[],
    "standrad":[],
    "testparam":[],
    "datadetail":[],
    "judge_proc":''
  }
  let template_id = await TestTemplateRead(db,object_id,tpl_id,listparam,'TestTemplate',sTemplateId)
  await TestMetaDataRead(db,object_id,tpl_id,listparam,'TestTemplate',sTemplateId)
  for(let i=0;i<listparam.mapdata.length;i++)
  {
    if(listparam.mapdata[i].group_id !== '0')
    {
      await ParameterDataGroupRead(db,listparam.mapdata[i].group_id,listparam,'DataGroup')
    }
  }

  return listparam
}


export function dataDetail(sDetail) {
  let list = []
  let listdata = sDetail.split('$^')

  for(let i=0;i<listdata.length;i++)
  {
    let datadetail = {
      "entrust_id":"",
      "value":"",
      "meta_id":"",
    }
    let desdatadetail = ZlibHelper.DeCompressInterData_fob(listdata[i])
    let listdetail = desdatadetail.split('$`')
    datadetail.entrust_id = listdetail[0]
    datadetail.value = listdetail[2]
    datadetail.meta_id = listdetail[1]

    list.push(datadetail)
  }
  return list
}

export async function TestMetaDataRead(db,object_id,tpl_id,listparam,TableName,sTemplateId) {
	let sSQLParam = 'SELECT * FROM '+TableName+' WHERE template_id="' + sTemplateId + '"'
  const temptemplatedata = await TestDataSelect(db,sSQLParam)
  // console.log(sSQLParam)
	var len = temptemplatedata.rows.length, i;
  // console.log(len)
	for(let i=0;i<len;i++)
	{
    let metadata = (temptemplatedata.rows.item(i).metadata).split("$^")
    // console.log(mapdata.length)
    for(let j=0;j<metadata.length;j++)
    {
      let list = {
        "object_id":"",
        "meta_id":"",
        "meta_name":"",
        "group_id":"",
        "data_type":"",
        "in_entry":"",
        "in_order":"",
        "in_record":"",
        "in_report":"",
        "share_name":"",
        "is_auto":"",
        "item_category":"",
        "act_samples":"",
        "max_samples":"",
        "scale":"",
        "rounding":"",
        "expression":"",
        "samples_proc":"",
        "need_judge":"",
        "belong":"",
        "input_type":"",
        "in_mixed":"",
        "in_check":"",
        "metric":"",
        "metric_unit":"",
        "parent_id":"",
        "id":"",
        "template_version":""
      }
      let metadatasub=ZlibHelper.DeCompressInterData_fob(metadata[j].split("$`")[3]).split("$`")
      list.object_id=metadata[j].split("$`")[0]
      list.meta_id=metadata[j].split("$`")[2]
      list.meta_name=metadatasub[0]
      list.group_id=metadatasub[1]
      list.data_type=metadatasub[2]
      list.in_entry=metadatasub[3]
      list.in_order=metadatasub[4]
      list.in_record=metadatasub[5]
      list.in_report=metadatasub[6]
      list.share_name=metadatasub[7]
      list.is_auto=metadatasub[8]
      list.item_category=metadatasub[9]
      list.act_samples=metadatasub[10]
      list.max_samples=metadatasub[11]
      list.scale=metadatasub[12]
      list.rounding=metadatasub[13]
      list.expression=metadatasub[14]
      list.samples_proc=metadatasub[15]
      list.need_judge=metadatasub[16]
      list.belong=metadatasub[17]
      list.input_type=metadatasub[18]
      list.in_mixed=metadatasub[19]
      list.in_check=metadatasub[20]
      list.metric=metadatasub[21]
      list.metric_unit=metadatasub[22]
      list.parent_id=metadatasub[23]
      list.id=metadatasub[24]
      listparam.metadata.push(list)
      // console.log(list)
    }
	}

  return listparam.template_id

}

export async function TestTemplateRead(db,object_id,tpl_id,listparam,TableName,sTemplateId) {
	let sSQLParam = 'SELECT * FROM '+TableName+' WHERE template_id="' + sTemplateId + '"'
  const temptemplatedata = await TestDataSelect(db,sSQLParam)
  console.log(sSQLParam)
	var len = temptemplatedata.rows.length, i;
  // console.log(len)
	for(let i=0;i<len;i++)
	{
    listparam.template_json = temptemplatedata.rows.item(i).template_json
    listparam.template_id = temptemplatedata.rows.item(i).template_id
    listparam.entry_sheet = temptemplatedata.rows.item(i).entry_sheet
    listparam.mixed_sheet = temptemplatedata.rows.item(i).mixed_sheet
    listparam.order_sheet = temptemplatedata.rows.item(i).order_sheet
    listparam.record_sheet = temptemplatedata.rows.item(i).record_sheet
    listparam.report_sheet = temptemplatedata.rows.item(i).report_sheet
    listparam.check_sheet = temptemplatedata.rows.item(i).check_sheet
    listparam.judge_proc = ZlibHelper.DeCompressInterData_fob(temptemplatedata.rows.item(i).judge_proc)
    let metadata = (temptemplatedata.rows.item(i).metadata).split("$^")
    let mapdata = (temptemplatedata.rows.item(i).mapdata).split("$^")
    // console.log(mapdata.length)
    for(let j=0;j<mapdata.length;j++)
    {
      let list = {
        "object_id":"",
        "template_id":"",
        "meta_id":"",
        "meta_name":"",
        "group_id":"",
        "data_type":"",
        "in_entry":"",
        "in_order":"",
        "in_record":"",
        "in_report":"",
        "share_name":"",
        "is_auto":"",
        "item_category":"",
        "act_samples":"",
        "max_samples":"",
        "scale":"",
        "rounding":"",
        "expression":"",
        "samples_proc":"",
        "need_judge":"",
        "belong":"",
        "input_type":"",
        "in_mixed":"",
        "in_check":"",
        "metric":"",
        "metric_unit":"",
        "parent_id":"",
        "id":"",
        "template_version":"",
        "sheet_id":"",
        "cell":""
      }
      let mapdatasub=mapdata[j].split("$`")
      let mapdatasublist=ZlibHelper.DeCompressInterData_fob(mapdatasub[2]).split("$`")
      let num = getMetadataOrder(metadata,mapdatasub[1],mapdatasublist[1])
      if(num>=0)
      {
        let metadatasub=ZlibHelper.DeCompressInterData_fob(metadata[num].split("$`")[3]).split("$`")

        list.object_id=mapdatasub[0]
        list.template_id=mapdatasub[1]
        list.sheet_id=mapdatasublist[0]
        list.meta_id=mapdatasublist[1]
        list.cell=mapdatasublist[2]
        list.meta_name=metadatasub[0]
        list.group_id=metadatasub[1]
        list.data_type=metadatasub[2]
        list.in_entry=metadatasub[3]
        list.in_order=metadatasub[4]
        list.in_record=metadatasub[5]
        list.in_report=metadatasub[6]
        list.share_name=metadatasub[7]
        list.is_auto=metadatasub[8]
        list.item_category=metadatasub[9]
        list.act_samples=metadatasub[10]
        list.max_samples=metadatasub[11]
        list.scale=metadatasub[12]
        list.rounding=metadatasub[13]
        list.expression=metadatasub[14]
        list.samples_proc=metadatasub[15]
        list.need_judge=metadatasub[16]
        list.belong=metadatasub[17]
        list.input_type=metadatasub[18]
        list.in_mixed=metadatasub[19]
        list.in_check=metadatasub[20]
        list.metric=metadatasub[21]
        list.metric_unit=metadatasub[22]
        list.parent_id=metadatasub[23]
        list.id=metadatasub[24]
        listparam.mapdata.push(list)
      }
      // console.log(list)
    }
    listparam.object_id = object_id
    listparam.tpl_id = tpl_id
	}

  return listparam.template_id

}

function getMetadataOrder(metadatalist,template_id,meta_id)
{

  for(let i=0;i<metadatalist.length;i++)
  {
    let metadatasub = metadatalist[i].split("$`")

    if(metadatasub[1]==template_id && metadatasub[2]==meta_id)
    {
      return i
    }
  }
  return -1
}

export async function ParameterDataGroupRead(db,group_id,listparam,TableName) {
	let sSQLParam = 'SELECT * FROM '+TableName+' WHERE group_id="' + group_id +'"'
  const tempgroupdata = await TestDataSelect(db,sSQLParam)
  if(tempgroupdata)
  {
    let len = tempgroupdata.rows.length, i;
    for(let i=0;i<len;i++)
    {
      try {
        let list = {
          "group_id":"",
          "item":[]
        }
        // console.log(tempgroupdata.rows.item(i).groupdata)
        let groupdata = ZlibHelper.DeCompressInterData_fob(tempgroupdata.rows.item(i).groupdata).split("$^")

        list.group_id=group_id
        for(let j=0;j<groupdata.length;j++)
        {
          let itemlist = {
            "item_id":"",
            "item_name":""
          }
          let itemdata = groupdata[j].split("$`")
          itemlist.item_id=itemdata[0]
          itemlist.item_name=itemdata[1]
          list.item.push(itemlist)
        }
        listparam.datagroup.push(list)
      }
      catch(e) {
        console.log(e)
      }
    }
  }
}

export async function TestVersionRead(sEntrust,tpl_id) {
  let db = TestDataSource()
  let TableName = 'TemplateVersion'
  let sData1 = await TestTemplateVersionRead(db,sEntrust,TableName,tpl_id)

  let sTemplate = sData1.split('|^')[2]
  let sTemplateVersion = sData1.split('|^')[1]

  let sData = sEntrust + '|^' + sTemplateVersion + '|^' + sTemplateVersion + '|^' + sTemplateVersion
  return sData
}

export function StrReplace(str) {
  str = str.substr(0, str.length - 2);
  let l = str.split('$`')

  let rstr = ''
  for(let i=0;i<l.length;i++)
  {
    if(l[i] === '')
    {
      l[i] = '0'
    }
    rstr = rstr + l[i] + '$`'
  }

  if(rstr.length>0)
  {
    rstr = rstr.substr(0, rstr.length - 2);
  }
  //console.log(rstr)
  return(rstr)
}

export async function TestTemplateVersionRead(db,sObjectId,TableName,tpl_id) {


	let ObjectIdList = sObjectId.split("$`")
  let sDataparam = ""
  let sDataversion = ""
  let sDatatemplate = ""
  let i,j
  for(j=0;j<ObjectIdList.length;j++)
  {
    let sSQLParam = 'SELECT * FROM '+TableName+' WHERE object_id="' + ObjectIdList[j] + '" and tpl_class="'+tpl_id+'"'
    //console.log(sSQLParam)
    let tempdata = await TestDataSelect(db,sSQLParam)
    //console.log(tempdata)
    if(tempdata)
    {
      let len = tempdata.rows.length, i;
      if(len===0)
      {
        sDataparam = sDataparam + "0$`"
        sDataversion = sDataversion + "0$`"
        sDatatemplate = sDatatemplate + "0$`"
      }
      else {
        for(i=0;i<len;i++)
        {
          sDataparam = sDataparam + tempdata.rows.item(i).param_id + "$`"
          sDataversion = sDataversion + tempdata.rows.item(i).template_version + "$`"
          sDatatemplate = sDatatemplate + tempdata.rows.item(i).template_id + "$`"
        }
      }

    }
    else {
      sDataversion = sDataversion + "0$`"
    }
  }
  sDataparam = StrReplace(sDataparam)
  sDataversion = StrReplace(sDataversion)
  sDatatemplate = StrReplace(sDatatemplate)
  return sDataparam+'|^'+sDataversion+'|^'+sDatatemplate
}



export async function ParameterMetaVersionWrite(db,sParam,sTemplate,tpl_id,sMetaVersion,tablename) {
	let sParameterTemplate = sParam.split("$^")
  let sTemplateId = ""
	let sSQL
	sSQL = 'CREATE TABLE IF NOT EXISTS '+tablename+' (param_id, template_id, tpl_class, meta_version)'
	const re1 = await TestDataTable(db,sSQL)
  //console.log(re1)
  if(re1)
  {
    sSQL = 'DELETE FROM '+tablename+' WHERE param_id="' + sParam + '" and template_id="' + sTemplate + '" and tpl_class="' + tpl_id +'"'
    const re2 = await TestDataInsert(db,sSQL)
    //console.log(sSQL)
    sSQL = 'INSERT INTO '+tablename+'(param_id, template_id, tpl_class, meta_version) VALUES("'+sParam+
    '","'+sTemplate+'","'+tpl_id+'","'+sMetaVersion+'")'
    const re3 = await TestDataInsert(db,sSQL)
    //console.log(re3)
  }
}

export async function ParameterMapVersionWrite(db,sParam,sTemplate,tpl_id,sMetaVersion,tablename) {
	let sParameterTemplate = sParam.split("$^")
  let sTemplateId = ""
	let sSQL
	sSQL = 'CREATE TABLE IF NOT EXISTS '+tablename+' (param_id, template_id, tpl_class, map_version)'
	const re1 = await TestDataTable(db,sSQL)
  //console.log(re1)
  if(re1)
  {
    sSQL = 'DELETE FROM '+tablename+' WHERE param_id="' + sParam + '" and template_id="' + sTemplate + '" and tpl_class="' + tpl_id +'"'
    const re2 = await TestDataInsert(db,sSQL)
    //console.log(sSQL)
    sSQL = 'INSERT INTO '+tablename+'(param_id, template_id, tpl_class, map_version) VALUES("'+sParam+
    '","'+sTemplate+'","'+tpl_id+'","'+sMetaVersion+'")'
    const re3 = await TestDataInsert(db,sSQL)
    //console.log(re3)
  }
}

export function parenMatch(str) {
  let strArr = str.split(''),
      left = [];// 空栈
  for(let i=0;i<strArr.length;i++){
      if(strArr[i] == '(' || strArr[i] == '[' || strArr[i] == '{'){
          left.push(strArr[i]) //左括号入栈
      }else{
          if(strArr[i] == ')' && left.pop() != '('){
              return false //结束循环
          }
          if(strArr[i] == ']' && left.pop() != '['){
              return false
          }
          if(strArr[i] == '}' && left.pop() != '{'){
              return false
          }
      }
  }
  return left.length == 0
}

export async function ParameterReadUpload(sData) {
	const res = await getTestCacheData(sData)
	return res
}

async function DeviceVersionRead(org_id) {
  let db = TestDataSource()
  let sDataversion = ""
  let sSQL = 'SELECT device_version FROM DeviceVersion WHERE org_id="' + org_id +'" ORDER BY device_version'
  //console.log(sSQLParam)
  let tempdata = await TestDataSelect(db,sSQL)
  if(tempdata)
  {
    let len = tempdata.rows.length, i;
    if(len === 0)
    {
      sDataversion = "0"
    }
    else {
      sDataversion = tempdata.rows.item(0).device_version
    }

  }
  else {
    sDataversion = sDataversion + "0"
  }
  return sDataversion
}

async function DeviceReadFromServer(sDeviceVersion,org_id) {
  let sDataversion = ""
  let sData = '[Q]1057{'+org_id+'$`'+sDeviceVersion+'}|^SYS'
  const res = await QueryExecNoCom(sData)
  if(res)
  {
    await DeviceDataWrite(org_id,res)
  }
  let deviceData = []
  deviceData = await DeviceDataRead(org_id)
  return deviceData
}

async function DeviceDataWrite(org_id,deviceData) {
  let db = TestDataSource()
  let sSQL
  sSQL = 'CREATE TABLE IF NOT EXISTS DeviceData (org_id, deviceData)'
  const re1 = await TestDataTable(db,sSQL)
  //console.log(re1)
  if(re1)
  {
    sSQL = 'DELETE FROM DeviceData WHERE org_id="' + org_id + '"'
    const re2 = await TestDataInsert(db,sSQL)
    //console.log(sSQL)
    sSQL = 'INSERT INTO DeviceData(org_id, deviceData) VALUES("'+org_id+'","'+deviceData+'")'
    const re3 = await TestDataInsert(db,sSQL)
    //console.log(re3)
  }
}

async function DeviceDataRead(org_id) {
  let db = TestDataSource()
  let deviceDataStr = ""
  let deviceData = {}
  let sSQL = 'SELECT deviceData FROM DeviceData WHERE org_id="' + org_id +'"'
  //console.log(sSQLParam)
  let tempdata = await TestDataSelect(db,sSQL)
  if(tempdata)
  {
    let len = tempdata.rows.length, i;
    if(len > 0)
    {
      deviceDataStr = tempdata.rows.item(0).deviceData
      deviceData = await ZlibHelper.CombineTableJsonAysnc_fob(deviceDataStr)
    }
  }
  return deviceData.data
}


export default {

}
