import request from '@/utils/request'
import {
  ZlibHelper
} from '@/global/zlibHelper'

export async function getTableData(data) {
  const getData = await request({
    url: '/api/Common/QueryExec',
    method: 'get',
    params: {
      sData: data
    }
  })
  const res = await ZlibHelper.CombineTableJsonAysnc_fob(getData)
  return res
}

export async function QueryExec(data) {

  const getData = await request({
    url: '/api/Common/QueryExec',
    method: 'get',
    params: {
      sData: data
    }
  })
  // console.log(getData)
  const res = await ZlibHelper.CombineTableJsonAysnc_fob(getData)
  return res
}

export async function QueryExecNoCom(data) {

  const getData = await request({
    url: '/api/Common/QueryExec',
    method: 'get',
    params: {
      sData: data
    }
  })
  // console.log(getData)
  // const res = await ZlibHelper.CombineTableJsonAysnc_fob(getData)
  return getData
}

export async function QueryExecNoCompress(data) {

  const getData = await request({
    url: '/api/Common/QueryExec',
    method: 'get',
    params: {
      sData: data,
      sReturnType: '1'
    }
  })
  // console.log(getData)
  // const res = await ZlibHelper.CombineTableJsonAysnc_fob(getData)
  return getData
}


export async function QueryExecBySql(sql, param) {

  const getData = await request({
    url: '/api/Common/QueryExecBySql',
    method: 'get',
    params: {
      sql: sql,
      param: param
    }
  })
  const res = await ZlibHelper.CombineTableJsonAysnc_fob(getData)

  return res
}

export async function QueryExecFile(urldetail) {
  const res = await request({
    url: urldetail,
    method: 'get',
  })
  return res
}

export async function ExecSql(data) {
  const getData = await request({
    url: '/api/Common/ExecSql',
    method: 'post',
    data: {
      sData: data
    }
  })

  return getData
}

export function getList(data) {
  return {
    code: 200,
    data: [],
    total: 0
  }
  // return request({
  // 	url: '/table/getList',
  // 	method: 'post',
  // 	data: {
  // 		sData: data
  // 	}
  // })
}

export function doEdit(data) {
  return request({
    url: '/table/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/api/Common/ExecSql',
    method: 'post',
    data: {
      sData: data
    },
  })
}

export function getExcel(data) {
  return request({
    url: '/table/excellist',
    method: 'post',
    data,
  })
}

export function getReport(data) {
  return request({
    url: '/table/reportlist',
    method: 'post',
    data,
  })
}

export function getparamlistone(data) {
  return request({
    url: '/tree/paramlistone',
    method: 'post',
    data,
  })
}

export function getparamlistsecond(data) {
  return request({
    url: '/tree/paramlistsecond',
    method: 'post',
    data,
  })
}

export function getentrust(data) {
  return request({
    url: '/tree/entrust',
    method: 'post',
    data,
  })
}
