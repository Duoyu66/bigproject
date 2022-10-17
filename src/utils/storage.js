import { storage } from '@/config'
export function getItem(tokenTableName) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenTableName)
    } else {
      return localStorage.getItem(tokenTableName)
    }
  } else {
    return localStorage.getItem(tokenTableName)
  }
}

export function setItem(tokenTableName, info) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(tokenTableName, info)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(tokenTableName, info)
    } else {
      return localStorage.setItem(tokenTableName, info)
    }
  } else {
    return localStorage.setItem(tokenTableName, info)
  }
}
export function remove(tokenTableName) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else {
      return localStorage.removeItem(tokenTableName)
    }
  } else {
    return localStorage.removeItem(tokenTableName)
  }
}
