import {
  getTestCacheData
} from '@/api/dataCache'
import {
  QueryExec,
  ExecSql
} from '@/api/table'
import {
  baseURL
} from '@/config'
import {
  cellConvert,
  cellCount,
  cellConvertToOffice
} from '@/utils/cellconvert'
import {
	ZlibHelper
} from '@/global/zlibHelper'
import {
  GetValueByMetaNameForNew
} from '@/utils/excelchange'
import {
  calculationDayAndFormat,
  getToday,
  format_fob
} from '@/utils/dateHelp'



export async function autoCreateNo(org_id,object_id,type_name,code_type) {
  let sDataCodeData = '[Q]727{'+org_id+'$`'+code_type+'}|^SYS'
  const resCodeData = await QueryExec(sDataCodeData)
  console.log(sDataCodeData)
  let sNo,sNoTemp
  if(resCodeData.data.length>0)
  {
    let ruleData = resCodeData.data[0]
    
    sNoTemp = ruleData.code_rule
    sNoTemp = sNoTemp.replace(/\{DT\}/g,format_fob(new Date(),'yyyyMM'))
    sNoTemp = sNoTemp.replace(/\{NO\}/g,ruleData.code_num)
    
    
    let sDataTestObjectCode = '[Q]728{'+object_id+'}|^SYS'
    const resTestObjectCode = await QueryExec(sDataTestObjectCode)
    if(resTestObjectCode.data.length===0) {
      return ''
    }
    let sTestObjectCode = resTestObjectCode.data[0].code
    
    sNoTemp = sNoTemp.replace(/\{MN\}/g,sTestObjectCode)
    
    sNo = sNoTemp;
  }
  else {
    sNo = ''
  }
  return sNo
}

export async function autoUpdateRule(org_id,object_id,type_name) {
  let sData = '[Q]727{'+org_id+'$`'+object_id+'$`'+type_name+'}|^SYS'
  const res = await QueryExec(sData)
  console.log(res)
  let sNo
  if(res.data.length>0)
  {
    let d = new Date();
    let y = d.getFullYear()
    let Mo = d.getMonth() //月份

    let sData1 = '[Q]728{'+org_id+'$`'+object_id+'$`'+res.data[0].rule_id+'}|^SYS'
    const res1 = await QueryExec(sData1)
    let ruleData = res1.data[0]

    let sData2 = '[Q]729{'+y+'$`'+Mo+'$`'+(Number(ruleData.current_num)+1).toString()+'$`'+res.data[0].rule_id+'}|^1|^SYS'
    const res2 = await QueryExec(sData2)
    // // let sNo = eval("function getEntrustNo() {

    // //   return s1+sa;
    // // } getEntrustNo()")
    // console.log(sNo)
    // let s1 = ruleData.prefix_code;
    // let s2 = ruleData.year;
    // let s3 = ruleData.month;
    // let s4 = Number(ruleData.current_num)+1;
    // let sa = (Number(s2)*100+Number(s3))*1000+Number(s4);
    // sNo = s1+sa;
  }
  // else {
  //   sNo = 'MRBH-0001'
  // }
  // return sNo
}

async function getTaskReference(object_id)
{
  let sData = '[Q]1055{'+object_id+'}|^SYS'
  const res = await QueryExec(sData)
  return res.data
}

export async function generateTestTask(listdata,object_id,org_id,data_id)
{
  console.log(listdata,object_id,org_id,data_id)
  let sProductDate,dDate,sAge,sAgeUnit,dNow,sExpectedDate,nTestCount,sSize,count=0
  let taskReference = await getTaskReference(object_id)
  console.log(taskReference)
  if(taskReference.length===0 && data_id && data_id<=0)
  {
    return false;
  }
  for(let i=0;i<taskReference.length;i++)
  {
    if(taskReference[i].auto === '1' || taskReference[i].age_alert === '1')
    {
      sProductDate = GetValueByMetaNameForNew(listdata,taskReference[i].product_date);
      sAge = taskReference[i].age;
      sAgeUnit = GetValueByMetaNameForNew(listdata,'龄期单位');
      if(sAge = '') {
        sAge = '0'
      }
      else if(Number(sAge)!==0) {
        sAge = GetValueByMetaNameForNew(listdata,sAge);
      }
      if(taskReference[i].age_alert === '1') {
        if(sProductDate === '' || sAge==='') {
          console.log('无龄期或日期');
          continue;
        }
        else {
          //已经超过试验日期,不再生成任务
          if(sAgeUnit==='h') {
            dDate = calculationDayAndFormat(sProductDate,'hour',parseInt(sAge),1)
          }
          else {
            dDate = calculationDayAndFormat(sProductDate,'day',parseInt(sAge),4);
          }
          dNow = getToday();
          if(dDate < dNow) {
            continue;
          }
          if(sAgeUnit==='h') {
            sExpectedDate = calculationDayAndFormat(sProductDate,'hour',parseInt(sAge),4)
          }
          else {
            sExpectedDate = calculationDayAndFormat(sProductDate,'day',parseInt(sAge),4);
          }
        }
      }
      else  {//非提醒试验委托日期就是期望的试验日期
        if(GetValueByMetaNameForNew(listdata,'委托日期') === '') {
           continue;
        }
        sExpectedDate = GetValueByMetaNameForNew(listdata,'委托日期');
      }
      let sIndexId = taskReference[i].index_id;
      let sObjectId = taskReference[i].object_id;
      let sMetaId = taskReference[i].meta_id;
      let sTaskId = data_id;
      let sMetaName = taskReference[i].meta_name;
      let sTestCategory = taskReference[i].test_category;
      let bItemSelected = false;
      for(let j=0;j<listdata.metadata.length;j++)
      {
        console.log(taskReference[i].meta_id,listdata.metadata[j].meta_id)
        if(taskReference[i].meta_id === listdata.metadata[j].meta_id) {
          bItemSelected = true;
          nTestCount = listdata.metadata[j].act_samples;
          break;
        }
      }
      if(!bItemSelected) {
        continue;
      }
      let sOrderId = GetValueByMetaNameForNew(listdata,'委托编号');
      let sSampleId = GetValueByMetaNameForNew(listdata,'样品编号');
      let sSampleSpec = GetValueByMetaNameForNew(listdata,'规格');
      if (sObjectId==='1103') {
        let sT1 = GetValueByMetaNameForNew(listdata,'试样厚度试样1');
        let sT2 = GetValueByMetaNameForNew(listdata,'试样宽度试样1');
        let sT3 = GetValueByMetaNameForNew(listdata,'试样内径试样1');
        if (sT1!=='' && sT1!=='/') {
          if (sT2!=='' && sT2!=='/') {
            sSize =sT2+'×'+sT1
          }
          else if (sT3!=='' && sT3!=='/') {
            sSize ='Φ'+sT3+'×'+sT1
          }
          else {
            return false;
          }
        }
        else {
          if (sT3!=='' && sT3!=='/') {
            sSize ='Φ'+sT3
          }
          else {
            return false;
          }
        }
      }
      else {
        sSize = GetValueByMetaNameForNew(listdata,'试件尺寸');
      }
      if(sSize==='') {
        sSize = taskReference[i].default_size;
      }

      let sOriginalGauge = GetValueByMetaNameForNew(listdata,'原始标距');
      let sStrength = GetValueByMetaNameForNew(listdata,'强度等级');
      //为采集软件提供
      if(sStrength !== '') {
        sSampleSpec = sSampleSpec + '-' + sStrength;
      }
      //对于有多组试验, 试件数量使用指标试件数量乘仪组数
      let sGroups
      if(taskReference[i].group_count !== '') {
        sGroups = taskReference[i].group_count;
        if(sGroups !== '') {
          nTestCount = nTestCount * Number(sGroups);
        }
      }
      else {
        sGroups = GetValueByMetaNameForNew(listdata,'测区数量');
        if (sGroups !== '' && sGroups !== '/') {
          nTestCount = Number(sGroups);
        }
      }
      if(sGroups==='') {
        sGroups='0';
      }
      if(sOriginalGauge ==='') {
        sOriginalGauge = '0';
      }
      let sData = '[Q]1056{'+org_id+'$`'+sTestCategory+'$`'+sTaskId+'$`'+sOrderId+'$`'+sObjectId
      +'$`'+sIndexId+'$`'+sMetaId+'$`'+sMetaName+'$`'+taskReference[i].test_name+'$`'+sOrderId
      +'$`'+sSampleId+'$`'+nTestCount.toString()+'$`'+sSampleSpec+'$`'+sSize+'$`'+sOriginalGauge
      +'$`'+sAge+'$`'+sExpectedDate+'$`'+sProductDate+'$`'+sGroups+'}|^1|^SYS'
      const res = await ExecSql(sData)
      console.log(sData,res)
      if(res>0)
      {
        count++;
      }
    }
  }
  if(count===taskReference.length && count!==0)
  {
    return true
  }
  else {
    return false
  }
}

export default {}
