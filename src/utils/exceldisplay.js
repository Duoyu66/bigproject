import {
  getTestCacheData
} from '@/api/dataCache'
import {
  QueryExec
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
  DataGroupReadById
} from '@/utils/dataCache'


let testdatajson = class testdatajson {
  constructor(object_id, template_id, tpl_id, template_json, meta, map, datagroup, data) {
    this.object_id = object_id
    this.template_id = template_id
    this.tpl_id = tpl_id
    this.template_json = template_json
    this.list_meta = meta
    this.list_map = map
    this.list_datagroup = datagroup
    this.list_data = data
  }
  getParamId(object_id) {
    return this.object_id
  }
  setParamId(object_id) {
    this.object_id = object_id
  }
  getTemplateId(template_id) {
    return this.template_id
  }
  setTemplateId(template_id) {
    this.template_id = template_id
  }
  getTplId(tpl_id) {
    return this.tpl_id
  }
  setTplId(tpl_id) {
    this.tpl_id = tpl_id
  }
  getTemplateJson(template_json) {
    return this.template_json
  }
  setTemplateJson(template_json) {
    this.template_json = template_json
  }
  getMeta(meta) {
    return this.meta
  }
  setMeta(meta) {
    this.meta = meta
  }
  getMap(map) {
    return this.map
  }
  setMap(map) {
    this.map = map
  }
  getDataGroup(datagroup) {
    return this.datagroup
  }
  setDataGroup(datagroup) {
    this.datagroup = datagroup
  }
  getData(data) {
    return this.data
  }
  setData(data) {
    this.data = data
  }
}

export function setCellFormatCustomize(luckysheet, cell, attr, value) {
  let rowcolumn = cellConvert(cell)
  let row = rowcolumn[0]
  let column = rowcolumn[1]
  luckysheet.setCellFormat(row, column, attr, value)
}

export function setCellValueCustomize(luckysheet, cell, value) {
  let rowcolumn = cellConvert(cell)
  let row = rowcolumn[0]
  let column = rowcolumn[1]
  luckysheet.setCellValue(row, column, value)
}

// export function setDataTypeMap(listmeta,listmap,luckysheet) {
//   let i = 0
//   for(i=0;i<listmeta.length;i++)
//   {
//     if(listmeta.data_type === '文本')
//     {
//       listmeta.sheet_type='General'
//       listmeta.sheet_typeg = 'g'
//     }
//     else if(listmeta.data_type === '数值')
//     {
//       listmeta.sheet_type='General'
//       listmeta.sheet_typeg = 'g'
//     }
//   }
// }

export async function initCell(listmeta, listmap, template_json, index, current_org, object_id) {
  let i = 0
  console.log(listmap)
  formula(object_id,listmeta,listmap)
  formulacalcChain(template_json,listmeta,listmap,index)
  for (i = 0; i < listmap.length; i++) {
    let num = findmeta(listmeta, listmap[i].meta_id)
    if (num !== -1) {
      template_json = await initCellData(listmeta, listmap, template_json, index, num, i ,current_org, object_id)
    }
  }
  return template_json
}

export async function initCellData(listmeta, listmap, template_json, index, num, i,current_org, object_id) {
  let template_json1
  let rowcolumn = cellConvert(listmap[i].cell)
  console.log(rowcolumn)

  if(listmeta[num].input_type === '')
  {
    if(listmeta[num].data_type === '文本')
    {
      template_json = initCellDataInput(template_json, index, rowcolumn, 'General', 'g')
    }
    else if(listmeta[num].data_type === '日期')
    {
      template_json = initCellDataInput(template_json, index, rowcolumn, 'yyyy-MM-dd', 'd')
    }
    else if(listmeta[num].data_type === '数值')
    {
      template_json = initCellDataInput(template_json, index, rowcolumn, 'General', 'g')
    }
    initCellDataFormula(listmeta, listmap, template_json, index, num, rowcolumn, object_id)
  }
  else
  {
    if(listmeta[num].group_id === '1') //标准
    {
      let sData = '[Q]472{'+current_org+'}|^SYS'
      const res = await QueryExec(sData)
      console.log(res)
      let data = StandardChange(res.data)
      initCellDataStandard(listmeta, listmap, template_json, index, num, rowcolumn, data)
    }
    else if(listmeta[num].group_id === '2'){
      let sData = '[Q]473{'+object_id+'}|^SYS'
      const res = await QueryExec(sData)
      let data = GroupChange(res.data)
      initCellDataSelect(listmeta, listmap, template_json, index, num, rowcolumn, data)
    }
    // else if(listmeta[num].group_id === '3') {
    //   initCellDataSelect(listmeta, listmap, template_json, index, num, i, rowcolumn, dataGroupJson)
    // }
    // else {
    //   initCellDataSelect(listmeta, listmap, template_json, index, num, i, rowcolumn, dataGroupJson)
    // }
    //
  }

  // console.log(template_json[index].celldata[num].v.ct.fa)
  return template_json
}

export function initCellDataFormula(listmeta, listmap, template_json, index, i, rowcolumn, object_id) {
  let num = findnum(template_json[index].celldata,rowcolumn[0],rowcolumn[1])
  let celldatacontent = template_json[index].celldata[num]
  celldatacontent = {"r":rowcolumn[0],"c":rowcolumn[1],"v":{"ct":{"fa":"General","t":"g"},"fs":10,"fc":"#000000","ff":"宋体","ht":0,"vt":0,"tb":2,"f":listmeta[i].expression}}
  template_json[index].celldata[num] = celldatacontent
  return template_json
}

export function initCellDataSelect(listmeta, listmap, template_json, index, i, rowcolumn, dataGroupJson) {
  let num = findnum(template_json[index].celldata,rowcolumn[0],rowcolumn[1])
  let celldatacontent = template_json[index].celldata[num]
  if(listmeta[i].input_type === '单选')
  {
    celldatacontent = {"r":rowcolumn[0],"c":rowcolumn[1],"v":{"ct":{"fa":"","t":"trRa"},"data":dataGroupJson,"fs":10,"fc":"#000000","ff":"宋体","ht":0,"vt":0,"tb":2}}
  }
  else {
    celldatacontent = {"r":rowcolumn[0],"c":rowcolumn[1],"v":{"ct":{"fa":"","t":"trCh"},"data":dataGroupJson,"fs":10,"fc":"#000000","ff":"宋体","ht":0,"vt":0,"tb":2}}
  }
  template_json[index].celldata[num] = celldatacontent
  return template_json
}

export function initCellDataStandard(listmeta, listmap, template_json, index, i, rowcolumn, dataGroupJson) {
  let num = findnum(template_json[index].celldata,rowcolumn[0],rowcolumn[1])
  let celldatacontent = template_json[index].celldata[num]
  celldatacontent = {"r":rowcolumn[0],"c":rowcolumn[1],"v":{"ct":{"fa":"","t":"trCh"},"data":dataGroupJson,"fs":10,"fc":"#000000","ff":"宋体","ht":0,"vt":0,"tb":2}}
  template_json[index].celldata[num] = celldatacontent
  return template_json
}

export function initCellDataInput(template_json, index, rowcolumn, fa, t) {

  let num = findnum(template_json[index].celldata,rowcolumn[0],rowcolumn[1])

  let celldatacontent = template_json[index].celldata[num]
  celldatacontent = {"r":rowcolumn[0],"c":rowcolumn[1],"v":{"ct":{"fa":fa,"t":t},"fs":10,"fc":"#000000","ff":"宋体","ht":0,"vt":0,"tb":2}}
  console.log(celldatacontent)
  template_json[index].celldata[num] = celldatacontent
  return template_json
}

export function initAuthority(listmeta, listmap, template_json, index, num, i) {
  let rowcolumn = cellConvert(listmap[i].cell)

  template_json[index].config.authority = {
    selectLockedCells: 1, //选定锁定单元格
    selectunLockedCells: 1, //选定解除锁定的单元格
    formatCells: 1, //设置单元格格式
    formatColumns: 1, //设置列格式
    formatRows: 1, //设置行格式
    insertColumns: 1, //插入列
    insertRows: 1, //插入行
    insertHyperlinks: 1, //插入超链接
    deleteColumns: 1, //删除列
    deleteRows: 1, //删除行
    sort: 1, //排序
    filter: 1, //使用自动筛选
    usePivotTablereports: 1, //使用数据透视表和报表
    editObjects: 1, //编辑对象
    editScenarios: 1, //编辑方案
    sheet: 1, //如果为1或true，则该工作表受到保护；如果为0或false，则该工作表不受保护。
    hintText: "", //弹窗提示的文字
    algorithmName: "None", //加密方案：MD2,MD4,MD5,RIPEMD-128,RIPEMD-160,SHA-1,SHA-256,SHA-384,SHA-512,WHIRLPOOL
    saltValue: null, //密码解密的盐参数，为一个自己定的随机数值
  }
  // let sqrefdata = listmap[i].cell
  // template_json[index].config.authority.allowRangeList.push({ //区域保护
  //   sqref: sqrefdata //区域范围
  // })
}

export function setCell(listmeta, listmap, luckysheet, value) {
  let i = 0
  for (i = 0; i < listmap.length; i++) {
    let num = findmeta(listmeta, listmap[i].meta_id)
    if (num !== -1) {
      setCellValueCustomize(luckysheet, listmap[i].cell, value)

    }
  }
}

export function StandardChangeForJudge(dataGroup) {
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

export function StandardChangeForTest(dataGroup) {
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

export function GroupChange(dataGroup) {
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

export function findmeta(listmeta, meta_id) {
  for(let i=0;i<listmeta.length;i++)
  {
    if(listmeta[i].meta_id === meta_id)
    {
      return i
    }
  }
  return -1
}

export function findmap(listmap, meta_id) {
  for(let i=0;i<listmap.length;i++)
  {
    if(listmap[i].meta_id === meta_id)
    {
      return i
    }
  }
  return -1
}

export function findmeta1(listmeta, meta_id) {
  let start = 0
  let end = listmeta.length - 1
  let i = 0
  while (start <= end) {
    let mid = start + (end - start) / 2;
    mid = parseInt(mid)
    console.log(mid)
    if (meta_id < listmeta[mid].meta_id) {
      end = mid - 1;
    } else if (meta_id > listmeta[mid].meta_id) {
      start = mid + 1;
    } else {
      return mid;
    }
  }
  return -1
}

export function findnum(celldata, rowcolumn0,rowcolumn1) {
  console.log(celldata)
  for(let i=0;i<celldata.length;i++)
  {
    if(celldata[i].r===rowcolumn0 && celldata[i].c===rowcolumn1)
    {
      return i
    }
  }
  return -1
}

export function findcell(r,c,listmap)
{
  let cell = cellConvertToOffice(c,r)
  for(let i=0;i<listmap.length;i++)
  {
    if(cell === listmap[i].cell)
    {
      return i
    }
  }
  return -1
}

export async function dataoldachieve(object_id) {
  let sData = '[Q]474{'+object_id+'}|^SYS'
  const res = await QueryExec(sData)
  return res.data
}

export async function datacopy(listdataold) {
  let listdatanew = JSON.parse(JSON.stringify(listdataold))
  return listdatanew
}

export async function formula(param_id,listmeta,listmap) {
  for(let i=0;i<listmeta.length;i++)
  {
    let expression = listmeta[i].expression
    let expressionnew
    if(expression !== '')
    {
      for(let j=0;j<listmap.length;j++)
      {
        let search = '{'+param_id+'-'+listmap[j].meta_id+'}'
        expressionnew = expression.replace(new RegExp(search, 'g'),listmap[j].cell)
      }
      console.log(expressionnew)
      listmeta[i].expression = "=" + expressionnew
    }
  }
}

export async function formulacalcChain(template_json,listmeta,listmap,index) {
  let calcChain
  for(let i=0;i<listmap.length;i++)
  {
    let rc = cellConvert(listmap[i].cell)
    let num = findmeta(listmeta,listmap[i].meta_id)
    if(listmeta[num].expression !== '')
    {
      calcChain = {
        "r": rc[0], //行数
        "c": rc[1], //列数
        "index": 1, //工作表id
        "func": [true, 23.75, listmeta[num].expression], //公式信息，包含公式计算结果和公式字符串
        "color": "b", //"w"：采用深度优先算法 "b":普通计算
        "parent": null,
        "chidren": {},
        "times": 0
      }
      template_json[index].calcChain.push(calcChain)
    }
  }
}


export default testdatajson
