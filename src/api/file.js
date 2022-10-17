/*
 * @Author: Mortar
 * @Date: 2021-03-29 11:51:29
 * @LastEditors: Mortar
 * @LastEditTime: 2021-03-29 11:55:31
 * @Description:
 * @FilePath: \src\api\file.js
 */
import request from '@/utils/request'
export async function doDelete(filetype, filename) {
  const res = await request({
    url: '/api/File/DeleteFile',
    method: 'get',
    params: {
      fileType: filetype,
      fileName: filename,
    },
  })
  
  return res
}
