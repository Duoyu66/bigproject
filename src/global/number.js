/*
 * @Author: Mortar
 * @Date: 2021-03-05 15:19:22
 * @LastEditors: Mortar
 * @LastEditTime: 2021-03-05 18:32:00
 * @Description:
 * @FilePath: \母体实验室\src\global\number.js
 */
export function contact(arrayA, arrayB, isUnique) {
  try {
    let list = []
    let listA = JSON.parse(JSON.stringify(arrayA))
    let listB = JSON.parse(JSON.stringify(arrayB))
    if (listA.length > listB.length) {
      listA.push.apply(listA, listB)
      list = listA
    } else {
      listB.push.apply(listB, listA)
      list = listB
    }
    if (isUnique) {
      list = unique(list)
    }
    return list
  } catch (e) {
    console.log(e)
    return []
  }

}

export function unique(array) {
  try {
    let set = new Set(array);
    return [...set]
  } catch (e) {
    console.log(e)
    return []
  }

}
//从a数组中删除b数组的元素
export function deleteFromList(arrayA, arrayB) {
  try {
    const listA = JSON.parse(JSON.stringify(arrayA))
    //const listB = JSON.parse(JSON.stringify(arrayB))
    let list = []
    const length = arrayA.length
    for (let i = 0; i < length; i++) {
      if (arrayB.indexOf(listA[i]) >= 0) {
        continue
      }
      list.push(listA[i])
    }
    return list
  } catch (e) {
    console.log(e)
    return []
  }
}