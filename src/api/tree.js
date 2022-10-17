import request from '@/utils/getrequest'

export async function getTreeList(data) {
  return request({
    url: '/api/Common/QueryExec',
    method: 'get',
    params: { sData: data },
    data
  })
}
