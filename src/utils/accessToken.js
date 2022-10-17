/*
 * @Author: Mortar
 * @Date: 2021-03-02 09:51:13
 * @LastEditors: Mortar
 * @LastEditTime: 2021-03-29 10:56:08
 * @Description: 
 * @FilePath: \src\utils\accessToken.js
 */
import { storage, tokenTableName } from '@/config'
import { getItem, setItem,remove } from '@/utils/storage'
/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 获取accessToken
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getAccessToken() {
  return getItem(tokenTableName)
  // if (storage) {
  //   if ('localStorage' === storage) {
      
  //     return localStorage.getItem(tokenTableName)
  //   } else if ('sessionStorage' === storage) {
  //     return sessionStorage.getItem(tokenTableName)
  //   } else {
  //     return localStorage.getItem(tokenTableName)
  //   }
  // } else {
  //   return localStorage.getItem(tokenTableName)
  // }
}

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 存储accessToken
 * @param accessToken
 * @returns {void|*}
 */
export function setAccessToken(accessToken) {
  return setItem(tokenTableName,accessToken)
  // if (storage) {
  //   if ('localStorage' === storage) {
  //     return localStorage.setItem(tokenTableName, accessToken)
  //   } else if ('sessionStorage' === storage) {
  //     return sessionStorage.setItem(tokenTableName, accessToken)
  //   } else {
  //     return localStorage.setItem(tokenTableName, accessToken)
  //   }
  // } else {
  //   return localStorage.setItem(tokenTableName, accessToken)
  // }
}


/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 移除accessToken
 * @returns {void|Promise<void>}
 */
export function removeAccessToken() {
  return  remove(tokenTableName)
  // if (storage) {
  //   if ('localStorage' === storage) {
  //     return localStorage.removeItem(tokenTableName)
  //   } else if ('sessionStorage' === storage) {
  //     return sessionStorage.clear()
  //   } else {
  //     return localStorage.removeItem(tokenTableName)
  //   }
  // } else {
  //   return localStorage.removeItem(tokenTableName)
  // }
}
