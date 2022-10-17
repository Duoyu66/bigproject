export function cellConvert(cell) {//A1 to [0,0]
  cell = cell.toString();
  var col = cell.replace(/\d+/g, '');
  var row = cell.replace(col, '');
  col = col.toUpperCase();
  var num = 0;
  var base = 1;
  var ACode = 'A'.charCodeAt(0);
  for (var i = col.length - 1; i >= 0; i--) {
    var ch = col.charCodeAt(i);
    num += (ch - ACode + 1) * base;
    base *= 26;
    if (num > Number.MAX_VALUE) { // 防止内存溢出
      debugger
      return -1;
    }
  }
  return [Number(row) - 1, Number(num) - 1];
}
// export function cellConvertToOffice(col, row) {
//   try {
//     let ACode = 'A'.charCodeAt(0);
//     col = String.fromCharCode(Number(ACode) + Number(col));
//     return col + Number(row + 1);
//   } catch (err) {
//     console.log(MediaStreamErrorEvent);
//     return -1;
//   }
// }
//添加了AA列之后的双字母列转换
export function cellConvertToOffice(col, row) {
  try {
    let ACode = 'A'.charCodeAt(0);
	if(Number(col)>25)
	{
		let f = String.fromCharCode(Number(ACode) + Number(col)/26 - 1)
		let s = String.fromCharCode(Number(ACode) + Number(col)%26)
		col = f + s
	}
	else {
		col = String.fromCharCode(Number(ACode) + Number(col));
	}
    return col + Number(row + 1);
  } catch (err) {
    console.log(MediaStreamErrorEvent);
    return -1;
  }
}
export function cellCount(collen, rowlen, cell) {
  cell = cell.toString();
  var col = cell.replace(/\d+/g, '');
  var row = cell.replace(col, '');
  col = col.toUpperCase();
  var num = 0;
  var base = 1;
  var ACode = 'A'.charCodeAt(0);
  for (var i = col.length - 1; i >= 0; i--) {
    var ch = col.charCodeAt(i);
    num += (ch - ACode + 1) * base;
    base *= 26;
    if (num > Number.MAX_VALUE) { // 防止内存溢出
      debugger
      return -1;
    }
  }
  console.log((Number(row)-1)*collen+Number(num)-1)
  return (Number(row)-1)*collen+Number(num)-1
}
