/*
 * @Author: hi7t
 * @since: 2020-01-16 21:09:45
 * @lastTime: 2020-04-27 16:02:53
 * @LastAuthor: hi7t
 * @FilePath: \TestManageWeb\src\lib\gtlib\basic.helper.js
 * @Description: 
 */
var login_status = true;
var slider_login = "";
var ROWSPLIT_vob = '|^';
var UNITSPLIT_vob = '$`';
var SECUNITSPLIT_vob = "@*";
var PARTSPLIT_vob = "!#@$^&";
var TableType = 'SYS';
var AffectRows = 1; //返回影响行数
var AffectDatas = 2; //返回数据
//var BaseUrl = 'http://localhost:5000';
var BaseUrl = 'http://192.168.0.199:5005';
var databaseType = 1;//1 sql service 2008 2 sql service 2012 3 
//var BaseUrl = 'http://192.168.0.199:5002';
//var BaseUrl = 'http://127.0.0.1:5000';
//var BaseUrl = 'http://192.168.123.103:5000';
var gtConfig_fob = {
  /// <summary>登录</summary>
  LoginUrl: BaseUrl + '/api/Login/Login',
  /// <summary>获取服务器时间</summary>
  GetServerTimeUrl: BaseUrl + '/api/Common/GetServerTime',
  /// <summary>执行语句</summary>
  ExecSqlUrl: BaseUrl + '/api/Common/ExecSql',
  /// <summary>查询数据</summary>
  QueryExecUrl: BaseUrl + '/api/Common/QueryExec',
  /// <summary>导出数据</summary>
  ExportDataUrl: BaseUrl + '/api/Common/ExportData',
  /// <summary>导出数据</summary>
  ExportDataExUrl: BaseUrl + '/api/Common/ExportDataEx',
  /// <summary>保存映射</summary>
  SaveTemplateItem: BaseUrl + '/api/Common/SaveTemplateItem',
  /// <summary>执行存储过程</summary>
  ExecStoreProcUrl: BaseUrl + '/api/Common/ExecStoreProc',
  /// <summary>导入excel</summary>
  ImportExcelUrl: BaseUrl + '/api/Common/ImportExcel',
  /// <summary>文件上传</summary>
  UploadFileUrl: BaseUrl + '/api/File/UploadFile',
  /// <summary>切片上传</summary>
  UploadFileBySliceUrl: BaseUrl + '/api/File/UploadFileBySlice',
  /// <summary>文件删除</summary>
  DeleteFileUrl: BaseUrl + '/api/File/DeleteFile',
  /// <summary>自动生成Page</summary>
  InitLayUIPageUrl: BaseUrl + '/api/LayUI/InitLayUIPage',
  /// <summary>下载Page</summary>
  LayUIFileUrl: BaseUrl + '/api/LayUI',
  /// <summary>考试试卷生成</summary>
  ExamCreatePaperUrl: BaseUrl + '/api/Exam/CreatePaperEntry',
  /// <summary>获取试卷</summary>
  GetPaperInfoUrl: BaseUrl + '/api/Exam/GetPaperInfo',
  /// <summary>报告原</summary>
  ReportImageUrl: BaseUrl + '/ReportImage',
  /// <summary>检测室</summary>   
  RoomImageUrl: BaseUrl + '/RoomImage',
  /// <summary>见证</summary>   
  WitnessImageUrl: BaseUrl + '/WitnessImage',
  /// <summary>证书</summary> 
  CertImageUrl: BaseUrl + '/CertImage',
  /// <summary>设备</summary>
  DeviceImageUrl: BaseUrl + '/DeviceImage',
  /// <summary>设备证书</summary> 
  DeviceCertImageUrl: BaseUrl + '/DeviceCertImage',
  /// <summary>报告现</summary>   
  ReportExImageUrl: BaseUrl + '/ReportExImage',
  /// <summary>问题库</summary>   
  RisksFilesUrl: BaseUrl + '/RisksFiles',
  /// <summary>技术文档</summary>   
  TechManageFileUrl: BaseUrl + '/TechManageFile',
  /// <summary>现场检测文件</summary>   
  SiteTestFileUrl: BaseUrl + '/SiteTestFile',
  /// <summary>首盘鉴定</summary>   
  FirstCheckFileUrl: BaseUrl + '/FirstCheckFile',
  /// <summary>资质审批</summary>   
  AcceptFileUrl: BaseUrl + '/AcceptFile',
  /// <summary>合同</summary>   
  ContractFileUrl: BaseUrl + '/ContractFile',
  /// <summary>现场检测曲线</summary>   
  SiteTestWaveDataFileUrl: BaseUrl + '/SiteTestWaveDataFile',
  /// <summary>签字</summary>   
  AssignPicFileUrl: BaseUrl + '/AssignPicFile',
  /// <summary>教育培训</summary>   
  EducationFileUrl: BaseUrl + '/EducationFile',
  /// <summary>张拉压浆</summary>   
  TensionFileUrl: BaseUrl + '/TensionFile',
  HangingplateFilePath: BaseUrl + '/HangingplateFilePath',
  basejs: "../../controller/",//存放页面js
  StrReg: /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g,
}
var shortcut_key_item = [];//快捷键
if (!shortcut_key_item) {
  shortcut_key_item = [];
}




var FormVerify = {
  // // 只能输入正整数
  // PositiveInteger:function (value) {
  // 	value = value.replace(/[^\d]/g, '');
  // 	if ('' != value) {
  // 		value = parseInt(value);
  // 	}
  // 	return value;
  // },
  // 限制只能输入正数
  Postive: function (val) {
    var parten = new RegExp(/[^(^\d*(\.?\d*)?)]/g)
    if (parten.test(val)) {
      layer.msg('只能输入正数', { icon: 5 })
    }
    return val.replace(parten, '')
  },
  //只能输入正整数
  PositiveInteger: function (val) {
    var parten = new RegExp(/[^\d]/)
    if (parten.test(val)) {
      layer.msg('请输入正整数', { icon: 5 })
    }
    return val.replace(/[^\d]/, '')
  },
  //只能输入中文
  Chinese: function (val) {
    return val.replace(/[^\u4e00-\u9fa5]/g, '')
  },
  //不能输入中文
  NotChinese: function (val) {
    var parten = new RegExp(/[\u4e00-\u9fa5]/g)
    if (parten.test(val)) {
      layer.msg('不能输入中文字符!!', { icon: 5 })
    }
    return val.replace(parten, '')
  }, required: function (val) {

  }

}
var sql_helper = {
  /**
   * 
   * @param {*} type 语句类型 1 查询 2 更新  3 插入 4 删除 5、批量插入
   * @param {*} sqlcode sql编号
   * @param {*} jsonlist 查询 [{field:"field",type:1,//1分割日期2、模糊查询 3、不做处理(默认)4、直接取字段 [page] or [limit]split:"~",//分割日期范围的分隔符level:1//优先级}]
   *  更新 [{field:"field",level:1//优先级}]
   *  插入 和 删除 与更新一致
   * @param {*} field 
   */
  splicing_fob: function (type, sqlcode, jsonlist, field, filed_list) {
    try {
      function sortLevel(a, b) {
        return a.level - b.level
      }
      if (typeof type == 'undefined' || typeof sqlcode == 'undefined' || typeof jsonlist == 'undefined') {
        return { code: -2, sql: '', msg: '部分值未定义' };
      }
      if (type < 0 || type > 5) {
        return { code: -3, sql: '', msg: 'type无效' };
      }
      if (typeof field == 'undefined') {
        field = {};
      } else {
        field = js_common.trim_fob(field);
      }
      jsonlist.sort(sortLevel);
      var where = '';

      switch (type) {
        case 1:
          for (var i = 0; i < jsonlist.length; i++) {
            var filed_type = Number(jsonlist[i].type);
            switch (filed_type) {
              case 1:
                var split_list = ['', ''];
                try {
                  let str = field[jsonlist[i].field];
                  if (typeof str != 'undefined') {
                    split_list = field[jsonlist[i].field].split(jsonlist[i].split);
                  }
                  if (split_list.length < 2) {
                    split_list = ['', ''];
                  }
                } catch (e) {
                  console.log(e);
                }
                if (i == 0) {
                  where = where + split_list[0] + UNITSPLIT_vob + split_list[1];
                } else {
                  where = where + UNITSPLIT_vob + split_list[0] + UNITSPLIT_vob + split_list[1];
                }
                break;
              case 2:
                var code = '%';
                if (i == 0) {
                  where = where + code + field[jsonlist[i].field] + code;
                } else {
                  where = where + UNITSPLIT_vob + code + field[jsonlist[i].field] + code;
                }
                break;
              case 4:
                if (i == 0) {
                  where = where + jsonlist[i].field;
                } else {
                  where = where + UNITSPLIT_vob + jsonlist[i].field;
                }
                break;
              case 3:
              default:
                if (i == 0) {
                  where = where + field[jsonlist[i].field];
                } else {
                  where = where + UNITSPLIT_vob + field[jsonlist[i].field];
                }
                break;
            }
          }
          break;
        case 2:
        case 3:
        case 4:
          for (var i = 0; i < jsonlist.length; i++) {
            if (i == 0) {
              where = where + field[jsonlist[i].field];
            } else {
              where = where + UNITSPLIT_vob + field[jsonlist[i].field];
            }
          }
          break;
        case 5:
          for (var j = 0; j < filed_list.length; j++) {

            for (var i = 0; i < jsonlist.length; i++) {
              if (i == 0) {
                where = where + filed_list[j][jsonlist[i].field];
              } else {
                where = where + UNITSPLIT_vob + filed_list[j][jsonlist[i].field];
              }
            }
            if (j != filed_list.length - 1) {
              where = where + SECUNITSPLIT_vob;
            }
          }
          break;
      }
      where = where.replace(/undefined/g, '').replace(/%%/g, '');
      var prefix = '[Q]' + sqlcode;
      if (type < 5) {
        prefix = '[Q]' + sqlcode;
      } else if (type == 5) {
        prefix = '[R][Q]' + sqlcode;
      }
      var suffix = '';
      switch (type) {
        case 1:
          suffix = ROWSPLIT_vob + TableType;
          break;
        case 2:
          suffix = ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType;
          break;
        case 3:
          suffix = ROWSPLIT_vob + AffectDatas + ROWSPLIT_vob + TableType;
          break;
        case 4:
          suffix = ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType;
          break;
        case 5:
          suffix = ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType;
          break;
      }
      var sData = prefix + "{" + where + "}" + suffix;
      return { code: 1, sql: sData, msg: 'ok' };
    } catch (e) {
      console.log(e);
      return { code: -1, sql: '', msg: e };
    }
  }
}
var base64_arraybuffer_fob = {
  base64_encode: function (arraybuffer) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var bytes = new Uint8Array(arraybuffer),
      i, len_vob = bytes.length,
      base64 = "";

    for (i = 0; i < len_vob; i += 3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len_vob % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len_vob % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }
    return base64;
  },

  base64_decode: function (base64) {

    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var lookup = new Uint8Array(256);
    for (var i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
    }
    var bufferLength = base64.length * 0.75,
      len_vob = base64.length,
      i, p = 0,
      encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }
    // var arraybuffer = new ArrayBuffer(bufferLength),
    var bytes = new Uint8Array(bufferLength);

    for (i = 0; i < len_vob; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return bytes;
  }
}
var ZlibHelper = {

  Encrbytes2StringEx_fob: function (arr_vob) {
    var inflate_vob = new Zlib.Inflate(arr_vob);
    var plain_vob = inflate_vob.decompress();
    //数组转string
    var res_vob = UTF8UnsignedBytesToString_fob(plain_vob);
    return res_vob;
  },
  String2EncrbytesBase64_fob: function (str_vob) {
    var utf8arr = ZlibHelper.Utf8StringToByte_fob(str_vob);
    var deflate_vob = new Zlib.Deflate(utf8arr);
    var compressed_vob = deflate_vob.compress();
    return base64_arraybuffer_fob.base64_encode(compressed_vob);
  },
  UTF8UnsignedBytesToString_fob: function (ubArr) {
    var index_vob, temp_vob = 0,
      unicode_vob = 0;
    var matchs_vob = [0x00, 0xc0, 0xe0];
    var sTarget_vob = '',
      sResult_vob;
    //0x7f	0x1f  0xf
    for (index_vob = 0; index_vob < ubArr.length;) {
      temp_vob = ubArr[index_vob];
      temp_vob = temp_vob & 0xff;
      if ((temp_vob - (temp_vob & 0x7f)) === matchs_vob[0]) {
        unicode_vob = temp_vob;
        index_vob++;
      } else if ((temp_vob - (temp_vob & 0x1f)) === matchs_vob[1]) {
        unicode_vob = ((ubArr[index_vob] & 0x1f) << 6) | ((ubArr[index_vob + 1]) & 0x3f);
        index_vob += 2;
      } else if ((temp_vob - (temp_vob & 0x0f)) === matchs_vob[2]) {
        unicode_vob = ((ubArr[index_vob] & 0x0f) << 12) | ((ubArr[index_vob + 1] & 0x3f) << 6) | ((ubArr[index_vob + 2] & 0x3f));
        index_vob += 3;
      }
      sTarget_vob += String.fromCharCode(unicode_vob);
    }
    sResult_vob = sTarget_vob;
    return sResult_vob;
  },
  stringToBytes_fob: function (str_vob) {
    var ch, st, re = [];
    for (var i = 0; i < str_vob.length; i++) {
      ch = str_vob.charCodeAt(i); // get char   
      st = []; // set up "stack"  
      do {
        st.push(ch & 0xFF); // push byte to stack  
        ch = ch >> 8; // shift value down by 1 byte  
      }
      while (ch);
      // add stack contents to result  
      // done because chars have "wrong" endianness  
      re = re.concat(st.reverse());
    }
    // return an array of bytes  
    return re;
  },
  Utf8StringToByte_fob: function (str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if (c >= 0x010000 && c <= 0x10FFFF) {
        bytes.push(((c >> 18) & 0x07) | 0xF0);
        bytes.push(((c >> 12) & 0x3F) | 0x80);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        bytes.push(((c >> 12) & 0x0F) | 0xE0);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        bytes.push(((c >> 6) & 0x1F) | 0xC0);
        bytes.push((c & 0x3F) | 0x80);
      } else {
        bytes.push(c & 0xFF);
      }
    }
    return bytes;
  },
  byteToUtf8String_fob: function (arr) {
    if (typeof arr === 'string') {
      return arr;
    }
    var str = '',
      _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
      var one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/);
      if (v && one.length == 8) {
        var bytesLength = v[0].length;
        var store = _arr[i].toString(2).slice(7 - bytesLength);
        for (var st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2);
        }
        str += String.fromCharCode(parseInt(store, 2));
        i += bytesLength - 1;
      } else {
        str += String.fromCharCode(_arr[i]);
      }
    }
    return str;
  },
  CombineTableJson_fob: function (res_vob) {
    if (res_vob == '') {
      return {};
    }
    var decoder = base64_arraybuffer_fob.base64_decode(res_vob);
    var inflate_vob = new Zlib.Inflate(decoder);
    var plain_vob = inflate_vob.decompress();
    //数组转string
    res_vob = ZlibHelper.UTF8UnsignedBytesToString_fob(plain_vob);
    var arrRows_vob = res_vob.split(ROWSPLIT_vob);
    var obj = {};
    obj.code = 0;
    obj.msg = '';
    obj.count = 0;
    obj.data = new Array();
    var arrFields_vob = arrRows_vob[0].split(UNITSPLIT_vob);
    var b = false;
    for (var i_vob = 1; i_vob < arrRows_vob.length; i_vob++) {
      if (arrRows_vob[i_vob] == '') { continue; }
      var arrUnits_vob = arrRows_vob[i_vob].split(UNITSPLIT_vob);
      var o = {};
      for (var j_vob = 0; j_vob < arrFields_vob.length; j_vob++) {
        o[arrFields_vob[j_vob]] = arrUnits_vob[j_vob];
      }
      b = true;
      obj.count = arrUnits_vob[0];//ToTal
      obj.data.push(o);
    }
    if (!b) {
      obj.code = -1;
      obj.msg = '数据为空';
    }
    //console.log(obj);
    return obj;
  },
  DeCompressInterData_fob: function (res_vob) {
    if (res_vob == '') {
      return {};
    }
    var decoder = base64_arraybuffer_fob.base64_decode(res_vob);
    var inflate_vob = new Zlib.Inflate(decoder);
    var plain_vob = inflate_vob.decompress();
    //数组转string
    res_vob = ZlibHelper.UTF8UnsignedBytesToString_fob(plain_vob);
    return res_vob;
  },
}
///动态生成下拉框 name 和id 写下拉框要注意别名
var DOMHelper = {
  //页面表头数量提示
  html_head: function (id, sData, max, tips) {
    if (id.indexOf('#') < 0) {
      id = '#' + id;
    }

    AjaxHelper.QueryExec_fob(sData, function (res) {
      for (var i = 0; i < res.data.length; i++) {
        try {
          var count = res.data.length;
          if (Number(count) > Number(max)) {
            count = max;
            layer.msg(tips);
          }
          layui.$(id).text(count);
        } catch (e) {
          console.log(e);
        }
      }
    }, function (e, m) {
      console.log(e, m);
    }, true);
  },
  SetSingleSelect_fob: function (Id, dt, succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.QueryExecUrl,
      data: { sData: dt },
      headers: { "Authorization": layui.data('gtwise').access_token },
      type: 'GET',
      success: function (data) {
        layui.$(Id).empty();
        layui.$(Id).append(new Option("", ""));//初始化不选择
        var obj = {};
        var decoder = base64_arraybuffer_fob.base64_decode(data);
        var inflate_vob = new Zlib.Inflate(decoder);
        var plain_vob = inflate_vob.decompress();
        //数组转string
        res_vob = ZlibHelper.UTF8UnsignedBytesToString_fob(plain_vob);
        var arrRows_vob = res_vob.split(ROWSPLIT_vob);
        var arrFields_vob = arrRows_vob[0].split(UNITSPLIT_vob);
        for (var i_vob = 1; i_vob < arrRows_vob.length; i_vob++) {
          if (arrRows_vob[i_vob] == '') { continue; }
          var arrUnits_vob = arrRows_vob[i_vob].split(UNITSPLIT_vob);
          var o = {};
          for (var j_vob = 0; j_vob < arrFields_vob.length; j_vob++) {
            o[arrFields_vob[j_vob]] = arrUnits_vob[j_vob];
          }
          layui.$(Id).append(new Option(o.qname, o.qid));//往下拉菜单里添加元素
        }
        layui.form.render();
        succcall();
      },
      error: function (e) {
        console.log(e);
        errorcall(e);
      }
    })
  },
  ///从本地获取数据进行设置 select option
  SetLocalSingleSelect_fob: function (Id, org_id, item_id) {
    var str = localStorage.getItem("item_" + item_id + "_" + org_id);
    if (str == null) { return; }
    var arrFields_vob = str.split(UNITSPLIT_vob);
    for (var i_vob = 0; i_vob < arrFields_vob.length; i_vob++) {
      if (arrFields_vob[i_vob] == '') { continue; }
      layui.$(Id).append(new Option(arrFields_vob[i_vob], arrFields_vob[i_vob]));//往下拉菜单里添加元素
    }
    layui.form.render();
  },
  //设置本地关于Item数据
  SetLocalSelectItemsVal: function (org_id, item_id, value) {
    var key = "item_" + item_id + "_" + org_id;
    var str = localStorage.getItem(key);
    if (str == null) {
      localStorage.setItem(key, value)
    }
    else {
      var arrFields_vob = str.split(UNITSPLIT_vob);
      for (var i = 0; i < arrFields_vob.length; i++) {
        if (arrFields_vob[i] == value) {
          arrFields_vob.splice(i, 1);
          break;
        }
      }
      arrFields_vob.splice(0, 0, value);
      if (arrFields_vob.length > 8) {
        arrFields_vob.splice(7, arrFields_vob.length - 8);
      }
      localStorage.setItem(key, arrFields_vob.join(UNITSPLIT_vob));
    }
    return true;
  },
  //为了兼容select选择后内容
  RemoveRepetfields: function (field, name, suffix) {
    for (var item in field) {
      if (item.indexOf(name + suffix) > 0) {
        field[item] = field[name + suffix];
      }
    }
    return field;
  },
  //获取 treetable
  //sRootVal 根节点的值 sKey 父子关系中的id字段名字  sPkey  父id字段名字  open 展开 不展开
  GetTreeTableJson_fob: function (sData, sRootVal, sKey, sPkey, open, succcall, errorcall, haveChild) {

    function findChildren(perData, aDist) {
      for (var tem in aDist) {
        if (perData[sKey] == aDist[tem][sPkey]) {
          if (perData.children == undefined) {
            perData.children = new Array();
          }
          if (perData.open == undefined) {
            perData.open = open;
          }
          perData.children.push(findChildren(aDist[tem], aDist));
        }
      }
      if (perData.children == undefined) {
        perData.children = new Array();
      }
      if (perData.open == undefined) {
        perData.open = open;
      }
      if (typeof haveChild != 'undefined' && perData.hasOwnProperty(haveChild)) {
        try {
          if (Number(perData[haveChild]) > 0) {
            perData[haveChild] = true;
          } else {
            perData[haveChild] = false;
          }
        } catch (e) {
          console.log(e);
        }

      }
      return perData;
    }

    AjaxHelper.QueryExec_fob(sData, function (res) {
      //处理res
      var aData = res.data;
      var aDist = new Array();
      for (var t in aData) {
        aData[t].open = open;
        if (aData[t][sPkey] == sRootVal || aData[t][sPkey] == null || aData[t][sPkey] == 'null') {
          aDist.push(findChildren(aData[t], aData));
        }
      }

      succcall(aDist);
    }, function (e, m) {
      errorcall(e, m);
    });
  },
  GetTreeTableJsonEx_fob: function (aData, sRootVal, sKey, sPkey, open, haveChild) {
    function findChildren(perData, aDist) {
      for (var tem in aDist) {
        if (perData[sKey] == aDist[tem][sPkey]) {
          if (perData.children == undefined) {
            perData.children = new Array();
          }
          if (perData.open == undefined) {
            perData.open = open;
          }
          perData.children.push(findChildren(aDist[tem], aDist));
        }
      }
      if (perData.children == undefined) {
        perData.children = new Array();
      }
      if (perData.open == undefined) {
        perData.open = open;
      }
      if (typeof haveChild != 'undefined' && perData.hasOwnProperty(haveChild)) {
        try {
          if (Number(perData[haveChild]) > 0) {
            perData[haveChild] = true;
          } else {
            perData[haveChild] = false;
          }
        } catch (e) {
          console.log(e);
        }

      }
      return perData;
    }
    var aDist = new Array();
    for (var t in aData) {
      aData[t].open = open;
      if (aData[t][sPkey] == sRootVal || aData[t][sPkey] == null || aData[t][sPkey] == 'null') {
        aDist.push(findChildren(aData[t], aData));
      }
    }
    return aDist;
  },
  //sRootVal 根节点的值 sKey 父子关系中的id字段名字  sPkey  父id字段名字  open 展开 不展开
  GetObjectTreeJson_fob: function (sData, sRootVal, sKey, sPkey, open, succcall, errorcall) {

    function findChildren(perData, aDist) {
      for (var tem in aDist) {
        if (perData[sKey] == aDist[tem][sPkey]) {
          if (perData.children == undefined) {
            perData.children = new Array();
          }
          if (perData.open == undefined) {
            perData.open = open;
          }
          perData.children.push(findChildren(aDist[tem], aDist));
        }
      }
      if (perData.children == undefined) {
        perData.children = new Array();
      }
      if (perData.open == undefined) {
        perData.open = open;
      }
      return perData;
    }
    var sData1 = '[Q]496{}' + ROWSPLIT_vob + TableType;
    //SELECT test_id as id,object_id as org_id,object_name as org_name,group_id as parent_id,'试验项目' as org_type FROM TestObject WHERE 1=1 ;

    AjaxHelper.QueryExec_fob(sData1, function (res1) {
      var aData1 = res1.data;
      AjaxHelper.QueryExec_fob(sData, function (res) {
        //处理res
        var aData = res.data;
        var aDist = new Array();
        var aData2 = JSON.parse(JSON.stringify(aData));
        for (var t in aData) {
          if (aData[t].org_type.indexOf('试验') > -1 && aData[t].org_id.length == 11) {//说明有节点
            var aTemp = JSON.parse(JSON.stringify(aData1));
            for (var t1 in aTemp) {
              aData2.push({
                id: aData[t].org_id * 100 + aTemp[t1].id,
                org_id: aData[t].org_id + '-' + aTemp[t1].org_id,
                org_name: aTemp[t1].org_name,
                parent_id: aTemp[t1].parent_id == 0 ? aData[t].org_id : aData[t].org_id + '-' + aTemp[t1].parent_id,
                org_type: aTemp[t1].org_type
              });
            }
          }
        }
        for (var t in aData2) {
          aData2[t].open = open;
          if (aData2[t][sPkey] == sRootVal || aData2[t][sPkey] == null || aData2[t][sPkey] == 'null') {
            aDist.push(findChildren(aData2[t], aData2));
          }
        }
        succcall(aDist);
      }, function (e, m) {
        errorcall(e, m);
      });
    }, function (e, m) {
      errorcall(e, m);
    });

  },
  //根据不同的规则生成机构树 data objct类型数据 type :1 获取全部机构信息 2.根据机构类型获取机构树 3.根据org_id查询下属某机构类型的所有机构信息,机构类型不填就是查询org_id 下属所有的机构类型
  //4.展示所有外派项目部 根据项目信息确认是否完工状态展示
  GetOrgTreeByCondition_fob: function (data, type, succcall, errorcall) {
    if (type == 1) {
      //获取全部机构信息
      sData = '[Q]69{}' + ROWSPLIT_vob + TableType;
      DOMHelper.GetTreeTableJson_fob(sData, 0, 'org_id', 'parent_id', true, function (res) {
        succcall(res);
      }, function (e, m) {
        errorcall(e, m);
      })
    }
    else if (type == 2) {
      //根据机构类型获取全部机构树
      //select org_id,SUBSTRING(org_id,1,11) o1,SUBSTRING(org_id,1,9) o2,SUBSTRING(org_id,1,8) o3,SUBSTRING(org_id,1,5) o4,SUBSTRING(org_id,1,3) o5,SUBSTRING(org_id,1,1) o6 from Organization where 1=1 ~AND org_type =$p1~ ~AND org_id like $p2~ ~AND org_id in($p3)~;
      var sData = "[Q]382{" + data.org_type + UNITSPLIT_vob + UNITSPLIT_vob + "}" + ROWSPLIT_vob + TableType;
      var str = '';
      AjaxHelper.QueryExec_fob(sData, function (res) {
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            str += "'" + res.data[i].org_id + "',";
            str += "'" + res.data[i].o1 + "',";
            str += "'" + res.data[i].o2 + "',";
            str += "'" + res.data[i].o3 + "',";
            str += "'" + res.data[i].o4 + "',";
            str += "'" + res.data[i].o5 + "',";
            str += "'" + res.data[i].o6 + "',";
          }
        }
        if (str != '') {
          str = str.substring(0, str.length - 1);
        }
        sData = "[Q]381{" + UNITSPLIT_vob + UNITSPLIT_vob + str + "}" + ROWSPLIT_vob + TableType;
        DOMHelper.GetTreeTableJson_fob(sData, 0, 'org_id', 'parent_id', true, function (res) {
          succcall(res);
        }, function (e, m) {
          errorcall(e, m);
        })
      }, function (e, m) {
        console.log(e, m);
      }, true);
    }
    else if (type == 3) {
      //根据org_id查询下属某机构类型的所有机构信息,机构类型不填就是查询org_id 下属所有的机构类型
      if (data.org_type1 == "施工中心试验室") {
        data.org_id = "%" + data.org_id.substring(0, data.org_id.length - 2) + "%";
      }
      else {
        data.org_id = "%" + data.org_id + "%";
      }
      var sData = "[Q]382{" + data.org_type + UNITSPLIT_vob + data.org_id + UNITSPLIT_vob + "}" + ROWSPLIT_vob + TableType;
      var str = '';
      AjaxHelper.QueryExec_fob(sData, function (res) {
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            str += "'" + res.data[i].org_id + "',";
            str += "'" + res.data[i].o1 + "',";
            str += "'" + res.data[i].o2 + "',";
            str += "'" + res.data[i].o3 + "',";
            str += "'" + res.data[i].o4 + "',";
            str += "'" + res.data[i].o5 + "',";
            str += "'" + res.data[i].o6 + "',";
          }
        }
        if (str != '') {
          str = str.substring(0, str.length - 1);
        }
        sData = "[Q]381{" + UNITSPLIT_vob + UNITSPLIT_vob + str + "}" + ROWSPLIT_vob + TableType;
        DOMHelper.GetTreeTableJson_fob(sData, 0, 'org_id', 'parent_id', true, function (res) {
          succcall(res);
        }, function (e, m) {
          errorcall(e, m);
        })
      }, function (e, m) {
        console.log(e, m);
      }, true);
    }
    else if (type == 4) {
      //展示所有外派项目部 根据项目信息确认
      //select org_id,SUBSTRING(org_id,1,3) o1,SUBSTRING(org_id,1,1) o2 from Organization WHERE org_type ='工程公司外协部';
      var sData = "[Q]382{" + '工程公司外协部' + UNITSPLIT_vob + UNITSPLIT_vob + "}" + ROWSPLIT_vob + TableType;
      var str = '';
      AjaxHelper.QueryExec_fob(sData, function (res) {
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            str += "'" + res.data[i].org_id + "',";
            str += "'" + res.data[i].o1 + "',";
            str += "'" + res.data[i].o2 + "',";
            str += "'" + res.data[i].o3 + "',";
            str += "'" + res.data[i].o4 + "',";
            str += "'" + res.data[i].o5 + "',";
            str += "'" + res.data[i].o6 + "',";
          }
        }
        if (str != '') {
          str = str.substring(0, str.length - 1);
        }
        //select id,org_id,org_name,parent_id,org_type from Organization WHERE 1=1  ~AND (LEFT(org_id,5) in($p1) OR org_id in ($p1))~ ~AND LEFT(org_id,9) NOT IN (select org_id from Project WHERE is_over =$p2)~;
        if (data.is_over == 1) {
          sData = "[Q]385{" + str + UNITSPLIT_vob + "0" + "}" + ROWSPLIT_vob + TableType;
        }
        else if (data.is_over == 0) {
          sData = "[Q]385{" + str + UNITSPLIT_vob + "1" + "}" + ROWSPLIT_vob + TableType;
        }
        else {
          sData = "[Q]385{" + str + UNITSPLIT_vob + "}" + ROWSPLIT_vob + TableType;
        }
        DOMHelper.GetTreeTableJson_fob(sData, 0, 'org_id', 'parent_id', true, function (res) {
          succcall(res);
        }, function (e, m) {
          errorcall(e, m);
        })
      }, function (e, m) {
        console.log(e, m);
      }, true);
    }
    else if (type == 5) {
      //根据org_id查询下属某机构类型的所有机构信息,机构类型不填就是查询org_id 下属所有的机构类型
      if (data.org_type1 == "施工中心试验室") {
        data.org_id = "%" + data.org_id.substring(0, data.org_id.length - 2) + "%";
      }
      else {
        data.org_id = "%" + data.org_id + "%";
      }
      var sData = "[Q]382{%" + data.org_type + "%" + UNITSPLIT_vob + data.org_id + UNITSPLIT_vob + "}" + ROWSPLIT_vob + TableType;
      var str = '';
      AjaxHelper.QueryExec_fob(sData, function (res) {
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            str += "'" + res.data[i].org_id + "',";
            str += "'" + res.data[i].o1 + "',";
            str += "'" + res.data[i].o2 + "',";
            str += "'" + res.data[i].o3 + "',";
            str += "'" + res.data[i].o4 + "',";
            str += "'" + res.data[i].o5 + "',";
            str += "'" + res.data[i].o6 + "',";
          }
        }
        if (str != '') {
          str = str.substring(0, str.length - 1);
        }
        sData = "[Q]381{" + UNITSPLIT_vob + UNITSPLIT_vob + str + "}" + ROWSPLIT_vob + TableType;
        //查询下属所有的机构信息

        DOMHelper.GetObjectTreeJson_fob(sData, 0, 'org_id', 'parent_id', true, function (res) {
          succcall(res);
        }, function (e, m) {
          errorcall(e, m);
        })
      }, function (e, m) {
        console.log(e, m);
      }, true);
    }
  },
  //根据登录用户的信息获取对应的机构类型
  GetOrgTreeByPermission_fob: function (type, succcall, errorcall) {
    // type -1 = 如下编号
    //0"总工办", 1"总经办", 2"综合办公室", 3"财务部", 4"人事部", 5"母体试验室", 6"外协部", 7"试验室", 8"混凝土拌和站", 9"水稳拌和站", 10"沥青拌和站", 11"工程部", 12"安质部", 13"物资部", 14"委托台账"
    //15 试验台账  16 混凝土拌和站对应工程部  17 试验组对应工程部  18 工程部或者物资部或试验室组对应试验室  19 拌和站配比获取自机构 


    /*
      ORG_DPMT_LAB         = 1;  //工程部委托试验室   
物资部委托试验室试验室委托试验室(试验组委托工区或中心,
   工区试验室委托中心试验室等
  ENG_DPMT_MIX         = 2;  //工程部对应拌合站
  MAT_DPMT_MIX         = 4;  //物资部对应拌合站
  ORG_MSG_ORG          = 5;  //拌合站或试验室下发短信消息
  MIX_RATIO_FROM       = 6;  //配比获取自机构
  SUP_MGT_CSTT         = 7;  //监理施工单位
  ORG_MGT_SECT         = 8;  //管理标段
  GROUP_PARENT         = 9;  //试验组归属

    */
    var org_id = layui.setter.DESHelper.UserInfo_fob().org_pid;
    var orgtype = OrgCache.GetOrgType_fob(org_id);
    var org_id1 = "";
    if (orgtype.indexOf('工程局') > -1) {//说明是工程局或者工程局下属部门
      org_id1 = org_id.substring(0, 1);
      org_id = org_id.substring(0, 1);
      //SELECT id,org_id,org_name,parent_id,org_type FROM Organization WHERE org_id like $p1;
    }
    else if (orgtype.indexOf('工程公司') > -1) {
      org_id1 = "'" + org_id.substring(0, 1) + "'";
      org_id = org_id.substring(0, 3);

    }
    else if (orgtype.indexOf('施工中心试验室') > -1) {
      org_id1 = "'" + org_id.substring(0, 1) + "','" + org_id.substring(0, 3) + "','" + org_id.substring(0, 5) + "','" + org_id.substring(0, 8) + "'";
      org_id = org_id.substring(0, 8);
    }
    else if (orgtype.indexOf('施工分部试验室') > -1) {
      org_id1 = "'" + org_id.substring(0, 1) + "','" + org_id.substring(0, 3) + "','" + org_id.substring(0, 5) + "','" + org_id.substring(0, 8) + "'";
      org_id = org_id.substring(0, 9);
    }
    else { //其他单位
      org_id1 = "'" + org_id.substring(0, 1) + "','" + org_id.substring(0, 3) + "','" + org_id.substring(0, 5) + "','" + org_id.substring(0, 8) + "','" + org_id.substring(0, 9) + "'";
      org_id = org_id.substring(0, 11);
    }
    //debugger;
    var aData2 = [];
    var aLinkOrg = [];
    if (type == 15) {//委托台账
      if (orgtype.indexOf("试验室组") > -1) { //试验室组 需要进行拌和站的显示
        //debugger;
        aLinkOrg = OrgCache.GetOrgRelation_fob(layui.setter.DESHelper.UserInfo_fob().org_pid, 6, false);
      }
      aData2 = OrgCache.GetOrgLike_fob(org_id1, org_id, aLinkOrg);
    }
    else if (type == 16) {//试验台账
      aData2 = OrgCache.GetOrgLike_fob(org_id1, org_id, []);
    }
    else if (type == 17) { //混凝土拌和站对应的工程部
      if (orgtype.indexOf("拌和站") > -1) {
        //debugger;
        aLinkOrg = OrgCache.GetOrgRelation_fob(layui.setter.DESHelper.UserInfo_fob().org_pid, 2, false);//找到对应的linkorgid 反查orgid为工程部
      }
      org_id1 = "'" + org_id.substring(0, 1) + "','" + org_id.substring(0, 3) + "','" + org_id.substring(0, 5) + "','" + org_id.substring(0, 8) + "','" + org_id.substring(0, 9) + "'";
      org_id = org_id.substring(0, 9);
      aData2 = OrgCache.GetOrgLike_fob(org_id1, org_id, aLinkOrg);
    }
    else if (type == 18) { //试验组对应的工程部


      aLinkOrg = OrgCache.GetOrgRelation_fob(layui.setter.DESHelper.UserInfo_fob().org_pid, 6, false);//找到对应的linkorgid 反查orgid为拌和站 
      var temp = [];
      for (var i = 0; i < aLinkOrg.length; i++) {
        var aLinkOrg1 = OrgCache.GetOrgRelation_fob(layui.setter.DESHelper.UserInfo_fob().org_pid, 2, false);//找到对应的linkorgid 反查orgid为工程部
        for (var j = 0; j < aLinkOrg1.length; j++) {
          temp.push(aLinkOrg1[j]);
        }
      }

      org_id1 = "'" + org_id.substring(0, 1) + "','" + org_id.substring(0, 3) + "','" + org_id.substring(0, 5) + "','" + org_id.substring(0, 8) + "','" + org_id.substring(0, 9) + "'";
      org_id = org_id.substring(0, 9);
      aData2 = OrgCache.GetOrgLike_fob(org_id1, org_id, temp);
    }
    else if (type == 19) { //工程部或者物资部或者试验组对应试验室     
      aLinkOrg = OrgCache.GetOrgRelation_fob(layui.setter.DESHelper.UserInfo_fob().org_pid, 1, true);//找到对应的orgid 查询link_org_id 
      org_id1 = "'" + org_id.substring(0, 1) + "','" + org_id.substring(0, 3) + "','" + org_id.substring(0, 5) + "','" + org_id.substring(0, 8) + "','" + org_id.substring(0, 9) + "'";
      org_id = org_id.substring(0, 11);
      aData2 = OrgCache.GetOrgLike_fob(org_id1, org_id, aLinkOrg);
    }
    else if (type == 20) { //拌和站配比获取自机构     
      aLinkOrg = OrgCache.GetOrgRelation_fob(layui.setter.DESHelper.UserInfo_fob().org_pid, 6, true);//找到对应的orgid 查询link_org_id 
      org_id1 = "'" + org_id.substring(0, 1) + "','" + org_id.substring(0, 3) + "','" + org_id.substring(0, 5) + "','" + org_id.substring(0, 8) + "','" + org_id.substring(0, 9) + "'";
      org_id = org_id.substring(0, 11);
      aData2 = OrgCache.GetOrgLike_fob(org_id1, org_id, aLinkOrg);
    }
    else {
      aData2 = OrgCache.GetOrgLike_fob(org_id1, org_id, []);
    }

    //查询成功 然后进行遍历处理
    aData2 = DOMHelper.RemoveUnSelectDepartment_fob(aData2, type, orgtype);
    //然后进行递归查询处理
    var aDist = new Array();
    for (var t in aData2) {
      aData2[t].open = true;
      if (aData2[t]['parent_id'] == "0") {
        aDist.push(DOMHelper.FindChildren_fob(aData2[t], aData2, 'org_id', 'parent_id', true));
      }
    }
    if (aDist.length > 0) {
      succcall(aDist);
    }
    else {
      errorcall(null, null);
    }
    //组织语句    
    //SELECT id,org_id,org_name,parent_id,org_type FROM Organization WHERE 1=1 ~ AND org_id IN($p1)~~ OR org_id LIKE $p2~;
    // var sData = "[Q]525{" + org_id1 + UNITSPLIT_vob + org_id + "%}" + ROWSPLIT_vob + TableType;

    // AjaxHelper.QueryExec_fob(sData, function (res) {
    //   if (res.data.length > 0) {
    //     var aData2 = res.data;
    //     //查询成功 然后进行遍历处理
    //     aData2 = DOMHelper.RemoveUnSelectDepartment_fob(aData2, type, org_type);
    //     //然后进行递归查询处理
    //     var aDist = new Array();
    //     for (var t in aData2) {
    //       aData2[t].open = true;
    //       if (aData2[t]['parent_id'] == "0") {
    //         aDist.push(DOMHelper.FindChildren_fob(aData2[t], aData2, 'org_id', 'parent_id', true));
    //       }
    //     }
    //   }
    //   succcall(aDist);
    // }, function (e, m) {
    //   errorcall(e, m);
    // }, true);
  },
  RemoveUnSelectDepartment_fob: function (data, type, orgtype) {
    if (type == 0) { //全部
      return data;
    }
    var arrorgtype = ["总工办", "总经办", "综合办公室", "财务部", "人事部", "母体试验室", "外协部", "试验室", "混凝土拌和站",
      "水稳拌和站", "沥青拌和站", "工程部", "安质部", "物资部", "委托台账", "试验台账", "混凝土拌和站对应工程部", '试验组对应工程部', '工程部或者物资部或试验室组对应试验室', '拌和站配比获取自机构']
    var data1 = [];
    //debugger;
    switch (arrorgtype[type - 1]) {
      case "总工办":
      case "总经办":
      case "综合办公室":
      case "财务部":
      case "人事部":
      case "母体试验室":
        delete arrorgtype[type - 1];
        break;
      case "外协部":
        arrorgtype.splice(6, 8);
        break;
      case "试验室":
        //留下外协部和试验室节点
        arrorgtype.splice(5, 3);
        break;
      case "混凝土拌和站":
        //只留下外协部和拌和站节点
        arrorgtype.splice(6, 1);
        arrorgtype.splice(7, 1);
        break;
      case "水稳拌和站":
        arrorgtype.splice(6, 1);
        arrorgtype.splice(8, 1);
        break;
      case "沥青拌和站":
        arrorgtype.splice(6, 1);
        arrorgtype.splice(9, 1);
        break;
      case "工程部":
        arrorgtype.splice(6, 1);
        arrorgtype.splice(10, 1);
        break;
      case "安质部":
        arrorgtype.splice(6, 1);
        arrorgtype.splice(11, 1);
        break;
      case "物资部":
        arrorgtype.splice(6, 1);
        arrorgtype.splice(12, 1);
      case "委托台账":
        //实际上就是加载外协部信息
        arrorgtype.splice(5, 9);
        break;
      case "试验台账":
        //实际上就是加载外协部信息
        arrorgtype.splice(5, 9);
        break;
      case "混凝土拌和站对应工程部":
        arrorgtype.splice(6, 1);
        arrorgtype.splice(10, 1);
        break;
      case "试验组对应工程部":
        arrorgtype.splice(6, 1);
        arrorgtype.splice(10, 1);
        break;
      case "工程部或者物资部或试验室组对应试验室":
        debugger;
        if (orgtype.indexOf("试验室组") > -1) {
          arrorgtype.splice(5, 3);
        } else if (orgtype.indexOf("工程部") > -1) {
          arrorgtype.splice(5, 3);
          arrorgtype.splice(8, 1);
        }
        else if (orgtype.indexOf("物资部") > -1) {
          arrorgtype.splice(5, 3);
          arrorgtype.splice(10, 1);
        }
        break;
      case "拌和站配比获取自机构":
        arrorgtype.splice(5, 4);

        break;
    }
    for (var i = 0; i < data.length; i++) {
      var b = false;
      for (var j = 0; j < arrorgtype.length; j++) {
        if (data[i].org_type.indexOf(arrorgtype[j]) > -1) {
          b = true;
          break;
        }
      }
      if (!b) {
        data1.push(data[i]);
      }
    }
    return data1;
  },
  //获取左侧机构树对应的机构号和试验id
  GetTreeObjectId_fob: function (org_id) {
    //分为若干种情况
    //1.选择的试验项目节点 机构号-试验项目编号 11+1+4 就是16位
    //2.选择的是试验项目类目 机构号-试验项目两位编号 11+1+2 14位
    //3.选择的是试验室节点 就是11位的节点 
    //4.选择的是项目部节点 就是9位节点
    //5.选择的是线路节点 就是8位节点
    var res = "";
    switch (org_id.length) {
      case 16:
        res = org_id;
        break;
      case 14:
        var arr = org_id.split('-');
        res = arr[0] + "-" + arr[1] + "%";
        break;
      case 11:
        res = org_id + "-" + "";
        break;
      case 9:
        res = org_id + "%-";
        break;
      case 8:
        res = org_id + "%-";
        break;
      default:
        res = org_id;
    }
    return res;
  },
  GetTreeObjectIdEx_fob: function (field) {
    //debugger;
    //分为若干种情况
    //1.选择的试验项目节点 机构号-试验项目编号 11+1+4 就是16位
    //2.选择的是试验项目类目 机构号-试验项目两位编号 11+1+2 14位
    //3.选择的是试验室节点 就是11位的节点 
    //4.选择的是项目部节点 就是9位节点
    //5.选择的是线路节点 就是8位节点
    var arr = [];
    var object = [];
    // var arr2 = field.org_id.split('-');
    // arr.push(arr2[0]);
    arr.push(field.org_id);
    if (field.children.length > 0) {
      cc(field.children);

    }

    function cc(children) {
      if (children == undefined) {
        return;
      }
      if (children.length > 0) {
        for (var i = 0; i < children.length; i++) {
          var temp = children[i];
          if (temp.org_id.indexOf('-') > -1) {
            var arr1 = temp.org_id.split('-');
            //本身要提取方法的 但是加载总是出错 所以就直接顺序写了
            var b = false;
            for (var j = 0; j < arr.length; j++) {
              if (arr[j] == arr1[0]) {
                b = true;
                break;
              }
            }
            if (!b) {
              arr.push(arr1[0]);
            }
            var b1 = false;
            for (var j = 0; j < object.length; j++) {
              if (object[j] == arr1[1]) {
                b1 = true;
                break;
              }
            }
            if (!b1) {
              object.push(arr1[1]);
            }

            // arr.push(arr1[0]);
            // object.push(arr1[1]);


          }
          else {
            //arr.push(temp.org_id);

            var b = false;
            for (var j = 0; j < arr.length; j++) {
              if (arr[j] == temp.org_id) {
                b = true;
                break;
              }
            }
            if (!b) {
              arr.push(temp.org_id);
            }
          }
          if (children[i] != undefined) {
            cc(children[i].children);
          }
        }

      } else {
        return;
      }
    }
    //console.log(arr);
    var res = "";
    if (arr.length == 1) {
      org_id = field.org_id;
      switch (org_id.length) {
        case 16:
          res = org_id;
          break;
        case 14:
          var arr = org_id.split('-');
          res = arr[0] + "-" + arr[1] + "%";
          break;
        case 11:
          res = org_id + "-" + "";
          break;
        default:
          res = org_id;
      }
    }
    else {
      //多个 应该拼接自付出
      var sTemp = '';
      var sObj = '';
      for (var i = 0; i < arr.length; i++) {
        var arr3 = arr[i].split('-');
        sTemp += "'" + arr3[0] + "',";
      }
      if (sTemp != '') {
        sTemp = sTemp.substring(0, sTemp.length - 1);
      }
      if (sTemp.indexOf(",") < 0) { //如果不包含,说明in只有一项 如果是多项 后台会自动过滤'
        //如果是数字 则 去掉首尾的'
        sTemp = sTemp.substring(1, sTemp.length - 1);
      }

      var sObj = '';
      for (var i = 0; i < object.length; i++) {
        var arr3 = object[i].split('-');
        sObj += "'" + arr3[0] + "',";
      }
      if (sObj != '') {
        sObj = sObj.substring(0, sObj.length - 1);
      }
      if (sObj.indexOf(",") < 0) { //如果不包含,说明in只有一项 如果是多项 后台会自动过滤'
        //如果是数字 则 去掉首尾的'
        sObj = sObj.substring(1, sObj.length - 1);
      }
      if (arr[0].length < 11) {
        res = sTemp + '-' + "";
        //alert(1);
      }
      else if (arr[0].length == 14 || arr[0].length == 11) {
        res = sTemp + '-' + sObj;
        //alert(2);
      }
      else {
        res = sTemp + '-' + sObj;
        //alert(3);
      }
    }
    return res;
  },


  //动态加载js
  LoadScript_fob: function (url, prefix) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    if (prefix == undefined) {
      prefix = '';
    }
    script.src = prefix + layui.setter.base + url + '?v=' + (layui.admin.v + '-1');
    document.body.appendChild(script);

  },
  LoadCss_fob: function (url, prefix) {
    var linkScript = document.createElement("link");
    linkScript.type = "text/css";
    linkScript.rel = "stylesheet";
    if (prefix == undefined) {
      prefix = '';
    }
    linkScript.href = prefix + layui.setter.base + url + '?v=' + (layui.admin.v + '-1');
    document.body.appendChild(linkScript);
  },
  //获取下拉树TreeSelect sql 语句中要标明 as name as value字段别名
  //sRootVal 根节点的值 sKey 父子关系中的id字段名字  sPkey  父id字段名字 
  GetTreeSelectJson_fob: function (sData, sRootVal, sKey, sPkey, succcall, errorcall) {
    function findChildren(perData, aDist) {
      for (var tem in aDist) {
        if (perData[sKey] == aDist[tem][sPkey]) {
          if (perData.children == undefined) {
            perData.children = new Array();
          }
          perData.children.push(findChildren(aDist[tem], aDist));
        }
      }
      if (perData.children == undefined) {
        perData.children = new Array();
      }
      return perData;
    }

    AjaxHelper.QueryExec_fob(sData, function (res) {
      //处理res     
      var aData = res.data;
      var aDist = new Array();
      for (var t in aData) {
        if (aData[t][sPkey] == sRootVal || aData[t][sPkey] == null || aData[t][sPkey] == 'null') {
          aDist.push(findChildren(aData[t], aData));
        }
      }
      // var aDist1 = new Array();
      // for(var i =0;i<aDist.length;i++){
      //   aDist1.push({name : aDist[i][sName],value : aDist[i][sValue],children:aDist[i]['children']})
      // }
      //consoleconsole.log(JSON.stringify(aDist));
      succcall(aDist);
    }, function (e, m) {
      errorcall(e, m);
    });
  },
  //设置Table单选行的状态
  setTableRowRadioCheck_fob: function (table, obj, tableName) {
    obj.tr.find('input[lay-type="layTableRadio"]').prop("checked", "checked");
    var index = obj.tr.data('index');
    var thisData = table.cache[tableName];
    //重置数据单选属性    
    layui.each(thisData, function (i, item) {
      if (index === i) {
        item.LAY_CHECKED = true;
      } else {
        delete item.LAY_CHECKED;
      }
    });
    obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');//选中行样式    
    //重置radio的样式
    layui.form.render('radio');
  },
  //设置treeTable单选行的状态
  setTreeTableRowRadioCheck_fob: function (obj, radio) {

    try {
      //选中行样式
      obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
      //if (radio) {
      //选中radio样式
      obj.tr.find('i[class="layui-anim layui-icon"]').trigger("click");
      //}

    } catch (err) {
      console.log(err);
    }

  },
  SetLikeStr_fob: function (str, type) {
    if (str == "") {
      return "";
    }
    if (type == 1) { return str + '%'; }
    else if (type == 2) { return '%' + str + '%'; }
    else { return str; }
  },
  //设置有testobject的节点信息
  SetObjectTreeNode_fob: function (insTb, obj, siteTest) {
    function FindChildrenExist_fob(temp, val) {
      var b = false;
      for (var j = 0; j < temp.length; j++) {
        if (temp[j].org_id == val.org_id) {
          b == true;
          if (target == undefined) {
            target = temp[j];
          }
        }
        if (!b) {
          FindChildrenExist_fob(temp[j].children, val);
        }
      }
    }
    var field = obj.data;
    //为了防止二次刷新所以先判断是否已经有了子节点 但是此处操作不能以field进行判断 因为field是提交之前的 尚未进行变换
    var aTreeData = insTb.options.data;
    //debugger;
    var target;
    for (var i = 0; i < aTreeData.length; i++) {
      var temp = aTreeData[i].children;
      FindChildrenExist_fob(temp, field);
      if (target != undefined) {
        if (target.children.length > 0) {
          return false;
        }
      }
    }

    if (field.children.length > 0 || field.org_type == "试验项目") {
      return false;
    }
    layer.load(1);
    var sData = '[Q]510{' + field.org_id + UNITSPLIT_vob + UNITSPLIT_vob + '61}' + ROWSPLIT_vob + TableType;
    if (siteTest) {
      sData = '[Q]510{' + field.org_id + UNITSPLIT_vob + '61' + UNITSPLIT_vob + '}' + ROWSPLIT_vob + TableType;
    }
    //SELECT c.object_id,t.object_name,t.group_id FROM CommonTestObject c LEFT JOIN TestObject t on t.object_id = c.object_id WHERE c.org_id =$p1 ~ AND LEFT(object_id,2)>=$p2~;
    AjaxHelper.QueryExec_fob(sData, function (res) {
      //处理res
      var aData = res.data; //查询的所有CommonTestObject数据
      if (aData.length == 0) { //说明下属没有挂常用试验
        layer.closeAll('loading');
        return false;
      }
      var aData2 = new Array();
      var aTemp = JSON.parse(JSON.stringify(aData)); //复制一份aData信息然后进行操作
      // 将根节点先提交进来
      aData2.push({
        id: field.id,
        org_id: field.org_id,
        org_name: field.org_name,
        parent_id: field.parent_id,
        org_type: field.org_type
      });
      for (var t1 in aTemp) {
        aData2.push({
          id: field.org_id * 100 + t1,
          org_id: field.org_id + '-' + aTemp[t1].object_id,
          org_name: aTemp[t1].object_name,
          parent_id: aTemp[t1].group_id == 0 ? field.org_id : field.org_id + '-' + aTemp[t1].group_id,
          org_type: '试验项目'
        });
      }
      var aDist = new Array();
      for (var t in aData2) {
        if (aData2[t].org_id == field.org_id) {
          aData2[t].open = true; //默认展开 项目节点 
        }
        else {
          aData2[t].open = false;
        }
        if (aData2[t]['parent_id'] == field.parent_id) {
          aDist.push(DOMHelper.FindChildren_fob(aData2[t], aData2, 'org_id', 'parent_id', false));
        }
      }
      var aTreeData = insTb.options.data;
      for (var i = 0; i < aTreeData.length; i++) {
        var temp = aTreeData[i].children;
        DOMHelper.SetObjectChildren_fob(temp, aDist[0]);
      }
      insTb.refresh(aTreeData);
      layer.closeAll('loading');
      return true;
    }, function (e, m) {
      layer.msg('加载试验项目异常');
    }, false);
    return true;

  },
  //设置节点的object孩子
  SetObjectChildren_fob: function (temp, val) {
    var b = false;
    for (var j = 0; j < temp.length; j++) {
      if (temp[j].org_id == val.org_id) {
        temp[j] = val;
        b = true;
        break;
      }
      if (!b) {
        DOMHelper.SetObjectChildren_fob(temp[j].children, val);
      }
    }
  },
  //查找或添加指定的孩子
  FindChildren_fob: function (perData, aDist, sKey, sPkey, open) {
    for (var tem in aDist) {
      if (perData[sKey] == aDist[tem][sPkey]) {
        if (perData.children == undefined) {
          perData.children = new Array();
        }
        if (perData.open == undefined) {
          perData.open = open;
        }
        perData.children.push(DOMHelper.FindChildren_fob(aDist[tem], aDist, sKey, sPkey, open));
      }
    }
    if (perData.children == undefined) {
      perData.children = new Array();
    }
    if (perData.open == undefined) {
      perData.open = open;
    }
    return perData;
  },
  //下载文件用
  DownloadFile_fob: function (url) {
    if (url != "" && url != undefined) {
      if (url.toLowerCase().indexOf('http') == 0) {
        var arr = url.split("/");
        var str = "txt|pdf|html";
        if (str.indexOf(arr[arr.length - 1].split(".")[1].toLowerCase()) > -1) {
          window.open(url, "_blank");
        }
        else {
          var elink = document.createElement("a");
          elink.id = "downloadfile";
          elink.href = url;
          elink.download = arr[arr.length - 1];
          elink.style.display = 'none';
          //elink.target ="_blank";
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        }
      }
      else {
        layer.msg("文件地址无效");
      }
    }
    else {
      layer.msg("暂无文件信息");
    }
  },
  DownloadImage_fob: function (url1) {
    var image = new Image()
    // 解决跨域 Canvas 污染问题 解决跨域问题-并不好使，需要改对应的请求服务器
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = function () {
      var canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      var context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)
      var url = canvas.toDataURL('image/png')
      // 生成一个a元素
      var a = document.createElement('a')
      // 创建一个单击事件
      var event = new MouseEvent('click')
      // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
      var arr = url1.split("/");
      a.download = arr[arr.length - 1] || '下载图片'
      // 将生成的URL设置为a.href属性
      a.href = url
      // 触发a的单击事件
      a.dispatchEvent(event)
    }
    image.src = url1;
  },
  Download_fob: function (url) {
    var arr = url.split(".");
    var type = ["jpg", "png", "gif", "bmp", "jpeg"];
    for (let i in type) {
      if (arr[arr.length - 1].toLowerCase() == type[i]) {
        return DOMHelper.DownloadImage_fob(url);
      }
    }
    return DOMHelper.DownloadFile_fob(url);

    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', url, true);//get请求，请求地址，是否异步
    // xhr.responseType = "blob";    // 返回类型blob
    // xhr.onload = function () {// 请求完成处理函数
    //   if (this.status === 200) {
    //     var blob = this.response;// 获取返回值
    //     var a = document.createElement('a');
    //     a.download = url.split("/").pop();
    //     a.href = window.URL.createObjectURL(blob);
    //     a.click();
    //   }
    // };
    // // 发送ajax请求
    // xhr.send();

  }
}
/// 用作增删改查的接口
var AjaxHelper = {
  Login_fob: function (user, pwd, succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.LoginUrl
      , contentType: "application/x-www-form-urlencoded; charset=utf-8"
      , data: { user: user, pwd: pwd, plate: 0 }
      , headers: {}
      , type: 'POST'
      , success: function (res) {
        succcall(res);
      }
      , error: function (e, m) {
        errorcall(e, m);
      }
    });
  },
  ///获取服务器时间
  GetServerTime_fob: function (succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.GetServerTimeUrl
      , data: {}
      , async: true
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'GET'
      , success: function (res) {
        succcall(res);
      }
      , error: function (e, m) {
        errorcall(e, m);
      }
    });
  },
  ///查询的数据都是在obj.data中  obj.count 在此查询条件下最富
  QueryExec_fob: function (sData, succcall, errorcall, async) {
    if (async == undefined) {
      async = true;
    }
    layui.$.ajax({
      url: gtConfig_fob.QueryExecUrl
      , data: { sData: sData }
      , async: async
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'GET'
      , success: function (res) {
        res = ZlibHelper.CombineTableJson_fob(res);
        succcall(res);
      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }

      }
    });
  },
  ExecSql_fob: function (sData, succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.ExecSqlUrl
      , contentType: "application/x-www-form-urlencoded; charset=utf-8"
      , data: { sData: sData }
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'POST'
      , success: function (res) {
        if (typeof res === 'number' && !isNaN(res)) {
          //是数字  
        }
        else { //不是数字
          res = ZlibHelper.CombineTableJson_fob(res);
        }
        succcall(res);
      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
        // if (e.status == 401) {
        //   layer.msg('登录验证过期,请重新登录!');
        //   var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        //   if (redirect == "%2Fuser%2Flogin") {
        //     return location.hash = '/user/login'; //跳转到登入页
        //   }
        //   return location.hash = '/user/login/redirect=' + redirect; //跳转到登入页
        // }
        // errorcall(e, m);
      }
    });
  },
  SaveTemplateItem: function (object_id, ToSaveData, succcall, errorcall, async) {
    if (async == undefined) {
      async = true;
    }
    layui.$.ajax({
      url: gtConfig_fob.SaveTemplateItem
      , data: { object_id: object_id, ToSaveData: ToSaveData }
      , async: async
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , contentType: "application/x-www-form-urlencoded"
      , type: 'POST'
      , success: function (res) {
        try {
          try {
            res = JSON.parse(res);
          } catch (err) {
            console.log(err);
            try {
              res = eval("(" + res + ")");
            } catch (err) {
              console.log(err);
              errorcall();
              return;
            }

          }
          if (res.code > 0) {
            succcall();
          } else {
            errorcall();
          }
        } catch (err) {
          console.log(err);
          errorcall();
        }

      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
      }
    });
  },
  ExportData: function (export_id, sData, succcall, errorcall, async) {
    if (async == undefined) {
      async = true;
    }
    let url = gtConfig_fob.ExportDataUrl;
    switch (databaseType) {
      case 1:
        url = gtConfig_fob.ExportDataExUrl;
        break;
      case 2:
        url = gtConfig_fob.ExportDataUrl;
        break;
      default:
        url = gtConfig_fob.ExportDataUrl;
        break;
    }
    layui.$.ajax({
      url: url
      , data: { export_id: export_id, sData: sData }
      , async: async
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'GET'
      , success: function (res) {
        var selectData = "";
        var title = "";
        var table_head = "";
        try {
          res = ZlibHelper.DeCompressInterData_fob(res).replace(/[\r]/g, "").replace(/[\n]/g, "");
          //res = JSON.parse(res);
          try {
            res = JSON.parse(res);
          } catch (err) {
            console.log(err);
            try {
              res = eval("(" + res + ")");
            } catch (err) {
              console.log(err);
              errorcall();
              return;
            }

          }
          if (Number(res.code) > 0) {
            title = res.title;
            table_head = ZlibHelper.DeCompressInterData_fob(res.head);
            table_head = JSON.parse(table_head);
            selectData = ZlibHelper.CombineTableJson_fob(res.data);
            console.log();
            if (selectData.data.length == 0) {
              layer.msg("没有数据需要导出");
              errorcall();
              return;
            }
            succcall(title, table_head, selectData);
          } else {
            layer.msg(res.msg);
            errorcall();
          }
        } catch (err) {
          console.log(err);
          errorcall();
        }
        // try {
        //   var list = res.split(ROWSPLIT_vob + ROWSPLIT_vob);
        //   if (list[0] == '1@') {
        //     title = list[1];
        //     table_head = ZlibHelper.DeCompressInterData_fob(list[2]);
        //     table_head = JSON.parse(table_head);
        //     selectData = ZlibHelper.CombineTableJson_fob(list[3]);
        //     succcall(title, table_head, selectData);
        //   } else {
        //     layer.msg(list[1]);
        //     errorcall();
        //   }
        // } catch (err) {
        //   console.log(err);
        //   errorcall(e, m);
        // }

      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
        // if (e.status == 401) {
        //   layer.msg('登录验证过期,请重新登录!');
        //   var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        //   if (redirect == "%2Fuser%2Flogin") {
        //     return location.hash = '/user/login'; //跳转到登入页
        //   }
        //   return location.hash = '/user/login/redirect=' + redirect; //跳转到登入页
        // }
        // errorcall(e, m);
      }
    });
  },
  ExecStoreProc_fob: function (sData, succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.ExecStoreProcUrl
      , contentType: "application/x-www-form-urlencoded; charset=utf-8"
      , data: { sData: sData }
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'POST'
      , success: function (res) {
        res = ZlibHelper.CombineTableJson_fob(res);
        succcall(res);
      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
        // if (e.status == 401) {
        //   layer.msg('登录验证过期,请重新登录!');
        //   var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        //   if (redirect == "%2Fuser%2Flogin") {
        //     return location.hash = '/user/login'; //跳转到登入页
        //   }
        //   return location.hash = '/user/login/redirect=' + redirect; //跳转到登入页
        // }
        // errorcall(e, m);
      }
    });
  },
  InitLayUIPage_fob: function (sData, succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.InitLayUIPageUrl
      //, contentType: "application/x-www-form-urlencoded; charset=utf-8"
      //, contentType: "application/json; charset=utf-8"
      , data: sData
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'POST'
      , success: function (res) {
        succcall(res);
      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
        // if (e.status == 401) {
        //   layer.msg('登录验证过期,请重新登录!');
        //   var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        //   if (redirect == "%2Fuser%2Flogin") {
        //     return location.hash = '/user/login'; //跳转到登入页
        //   }
        //   return location.hash = '/user/login/redirect=' + redirect; //跳转到登入页
        // }
        // errorcall(e, m);
      }
    });
  },
  InitLayUIPage_fob: function (sData, succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.InitLayUIPageUrl
      //, contentType: "application/x-www-form-urlencoded; charset=utf-8"
      //, contentType: "application/json; charset=utf-8"
      , data: sData
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'POST'
      , success: function (res) {
        succcall(res);
      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
        // if (e.status == 401) {
        //   layer.msg('登录验证过期,请重新登录!');
        //   var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        //   if (redirect == "%2Fuser%2Flogin") {
        //     return location.hash = '/user/login'; //跳转到登入页
        //   }
        //   return location.hash = '/user/login/redirect=' + redirect; //跳转到登入页
        // }
        // errorcall(e, m);
      }
    });
  },
  ///删除文件
  DeleteFile_fob: function (filetype, filename, succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.DeleteFileUrl
      , data: { fileType: filetype, fileName: filename }
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'GET'
      , success: function (res) {
        succcall(res);
      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
        // if (e.status == 401) {
        //   layer.msg('登录验证过期,请重新登录!');
        //   var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        //   if (redirect == "%2Fuser%2Flogin") {
        //     return location.hash = '/user/login'; //跳转到登入页
        //   }
        //   return location.hash = '/user/login/redirect=' + redirect; //跳转到登入页
        // }
        // errorcall(e, m);
      }
    });
  },
  ///生成试卷
  ExamCreatePaper_fob: function (paperId, subject, course, createType, queNum, ratio, ratioJson, must_qutsion, succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.ExamCreatePaperUrl
      , data: { paperId: paperId, subject: subject, courses: course, createType: createType, queNum: queNum, ratio: ratio, ratioJson: ratioJson, must_qutsion: must_qutsion }
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'GET'
      , success: function (res) {
        if (res != '') {
          if (res[0] > 0) {
            res = ZlibHelper.DeCompressInterData_fob(res.substring(2));
            succcall('1@' + res);
          }
          else {
            succcall(res);
          }
        }
      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
        // if (e.status == 401) {
        //   layer.msg('登录验证过期,请重新登录!');
        //   var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        //   if (redirect == "%2Fuser%2Flogin") {
        //     return location.hash = '/user/login'; //跳转到登入页
        //   }
        //   return location.hash = '/user/login/redirect=' + redirect; //跳转到登入页
        // }
        // errorcall(e, m);
      }
    });
  },
  //获取试卷  
  GetPaperInfo_fob: function (paperId, paperName, createType, personId, succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.GetPaperInfoUrl
      , data: { paperId: paperId, paperName: paperName, createType: createType, personId: personId }
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'GET'
      , success: function (res) {
        if (res != '') {
          if (res[0] > 0) {
            res = ZlibHelper.DeCompressInterData_fob(res.substring(2));
            succcall('1@' + res);
          }
          else {
            succcall(res);
          }
        }
      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
        // if (e.status == 401) {
        //   layer.msg('登录验证过期,请重新登录!');
        //   var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        //   if (redirect == "%2Fuser%2Flogin") {
        //     return location.hash = '/user/login'; //跳转到登入页
        //   }
        //   return location.hash = '/user/login/redirect=' + redirect; //跳转到登入页
        // }
        // errorcall(e, m);
      }
    });
  },
  //导入excel
  ImportExcel_fob: function (sData, succcall, errorcall) {
    layui.$.ajax({
      url: gtConfig_fob.ImportExcelUrl
      , contentType: "application/x-www-form-urlencoded; charset=utf-8"
      , data: { sData: sData }
      , headers: { "Authorization": layui.data('gtwise').access_token }
      , type: 'POST'
      , success: function (res) {
        succcall(res);
      }
      , error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
        // if (e.status == 401) {
        //   layer.msg('登录验证过期,请重新登录!');
        //   var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        //   if (redirect == "%2Fuser%2Flogin") {
        //     return location.hash = '/user/login'; //跳转到登入页
        //   }
        //   return location.hash = '/user/login/redirect=' + redirect; //跳转到登入页
        // }
        // errorcall(e, m);
      }
    });
  },
  UploadFileBySlice_fob: function (file, i, fileType, process, showdiv, inputdiv, downdiv) {
    var $ = layui.$;
    var name = file.name,
      size = file.size,
      shardSize = 1024 * 1024,
      shardCount = Math.ceil(size / shardSize);//分的片数
    if (i >= shardCount) {
      return;
    }
    var start = i * shardSize,
      end = Math.min(size, start + shardSize);
    var form = new FormData();
    form.append("fileType", fileType);
    form.append("data", file.slice(start, end));
    form.append("lastModified", file.lastModified);
    form.append("fileName", name);
    form.append("total", shardCount);
    form.append("index", i + 1);
    UploadPath = file.lastModified;
    $.ajax({
      url: gtConfig_fob.UploadFileBySliceUrl,
      headers: { "Authorization": layui.data('gtwise').access_token },
      type: "POST",
      data: form,
      async: true,
      processData: false,
      contentType: false,
      success: function (result) {
        if (result != null) {
          i = result.number++;
          let num = Math.ceil(i * 100 / shardCount);
          $("#" + process + "_div").show();
          layui.element.progress(process, num + "%");
          AjaxHelper.UploadFileBySlice_fob(file, i, fileType, process, showdiv, inputdiv, downdiv);
          if (result.mergeOk) {
            let s = "";
            let dir = result.dir;
            let realName = result.realName;
            s = dir + '/' + realName;
            $('#' + inputdiv).val(s);
            $('#' + showdiv).val(gtConfig_fob.ReportImageUrl + '/' + s);
            $('#' + downdiv).show();
            layui.layer.msg('上传成功');
            $("#" + process + "_div").hide();
          }
        }
      }, error: function (e, m) {
        if (!js_common.AjaxError401(e, 0)) {
          errorcall(e, m);
        }
        // if (e.status == 401) {
        //   layer.msg('登录验证过期,请重新登录!');
        //   var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        //   if (redirect == "%2Fuser%2Flogin") {
        //     return location.hash = '/user/login'; //跳转到登入页
        //   }
        //   return location.hash = '/user/login/redirect=' + redirect; //跳转到登入页
        // }
        // errorcall(e, m);
        layui.layer.msg('上传失败:' + e.message);
      }
    })
  },

}

var OrgCache = {
  //获取所有机构信息
  GetAllOrg_fob: function () {
    var sData = '[Q]69{}' + ROWSPLIT_vob + TableType;
    AjaxHelper.QueryExec_fob(sData, function (res) {
      if (res.data.length > 0) {
        var key = "OrgCache";
        localStorage.setItem(key, layui.setter.DESHelper.EncryptByDESModeEBC_fob(JSON.stringify(res.data)));
      }
    }, function (e, m) {
      console.log(e, m);
    }, true);

    //SELECT * FROM OrgRelation WHERE 1=1;
    sData = '[Q]576{}' + ROWSPLIT_vob + TableType;
    AjaxHelper.QueryExec_fob(sData, function (res) {
      if (res.data.length > 0) {
        var key = "OrgRelationCache";
        localStorage.setItem(key, layui.setter.DESHelper.EncryptByDESModeEBC_fob(JSON.stringify(res.data)));
      }
    }, function (e, m) {
      console.log(e, m);
    }, true);
  },
  //获取机构的关联关系
  GetOrgRelation_fob: function (org_id, type_id, is_primary) {
    var key = "OrgRelationCache";
    var json = localStorage.getItem(key);
    try {
      json = JSON.parse(layui.setter.DESHelper.DecryptByDESModeEBC_fob(json));
    }
    catch (e) {
      OrgCache.GetOrgRelation_fob();
      layui.layer.msg('请刷新后再试', { icon: 2 });
    }
    var arr = [];
    for (var i = 0; i < json.length; i++) {
      if (is_primary) {
        if (json[i].org_id == org_id && json[i].link_type == type_id) {
          arr.push(json[i]);
        }
      }
      else {
        if (json[i].link_org_id == org_id && json[i].link_type == type_id) {
          arr.push(json[i]);
        }
      }
    }
    return arr;
  },
  GetOrgLike_fob: function (inOrgids, likeOrgids, linkOrgids) {
    var key = "OrgCache";
    var json = localStorage.getItem(key);
    try {
      json = JSON.parse(layui.setter.DESHelper.DecryptByDESModeEBC_fob(json));
    }
    catch (e) {
      OrgCache.GetAllOrg_fob();
      layui.layer.msg('请刷新后再试', { icon: 2 });
    }

    var arr = inOrgids.split(',');
    var res = [];
    for (var i = 0; i < json.length; i++) {
      //inorgids进行运算
      for (var j = 0; j < arr.length; j++) {
        arr[j] = arr[j].replace(/'/g, "");
        if (json[i].org_id == arr[j]) {
          res.push(json[i]);
        }
      }
      //outorgids进行运算
      if (json[i].org_id.substring(0, likeOrgids.length) == likeOrgids) {
        var b = false;
        for (var k = 0; k < res.length; k++) {
          if (res[k].org_id == json[i].org_id) {
            b = true;
            break;
          }
        }
        if (!b) {
          res.push(json[i]);
        }
      }
      //linkOrgids进行运算
      for (var j = 0; j < linkOrgids.length; j++) {

        if (json[i].org_id == linkOrgids[j].link_org_id) {
          var b = false;
          for (var k = 0; k < res.length; k++) {
            if (res[k].org_id == json[i].org_id) {
              b = true;
              break;
            }
          }
          if (!b) {
            res.push(json[i]);
          }
        }
      }
    }
    return res;
  },
  GetOrgType_fob: function (org_id) {
    var key = "OrgCache";
    var json = localStorage.getItem(key);
    try {
      json = JSON.parse(layui.setter.DESHelper.DecryptByDESModeEBC_fob(json));
    }
    catch (e) {
      OrgCache.GetAllOrg_fob();
      layui.layer.msg('请刷新后再试', { icon: 2 });
    }
    for (var i = 0; i < json.length; i++) {
      if (json[i].org_id == org_id) {
        return json[i].org_type;

      }
    }
    return "";
  },
  //根据机构号获取2级机构名称
  GetOrgName2Level_fob: function (org_id) {
    var key = "OrgCache";
    var json = localStorage.getItem(key);
    try {
      json = JSON.parse(layui.setter.DESHelper.DecryptByDESModeEBC_fob(json));
    }
    catch (e) {
      OrgCache.GetAllOrg_fob();
      layui.layer.msg('请刷新后再试', { icon: 2 });
    }
    var name1 = '';
    var parent_id1 = '';
    var name2 = '';
    var parent_id2 = '';
    for (var i = 0; i < json.length; i++) {
      if (json[i].org_id == org_id) {
        name1 = json[i].org_name;
        parent_id1 = json[i].parent_id;
        break;
      }
    }
    if (name1 == '') {
      return "未知机构";
    }
    for (var i = 0; i < json.length; i++) {
      if (json[i].org_id == parent_id1) {
        name2 = json[i].org_name;
        parent_id2 = json[i].parent_id;
        break;
      }
    }
    if (name2 != '') {
      name2 = name2 + "-";
    }
    return name2 + name1;
  },
  //根据机构号获取3级机构名称
  GetOrgName3Level_fob: function (org_id) {
    var key = "OrgCache";
    var json = localStorage.getItem(key);
    try {
      json = JSON.parse(layui.setter.DESHelper.DecryptByDESModeEBC_fob(json));
    }
    catch (e) {
      OrgCache.GetAllOrg_fob();
      layui.layer.msg('请刷新后再试', { icon: 2 });
    }
    var name1 = '';
    var parent_id1 = '';
    var name2 = '';
    var parent_id2 = '';
    var name3 = '';
    var parent_id3 = '';
    for (var i = 0; i < json.length; i++) {
      if (json[i].org_id == org_id) {
        name1 = json[i].org_name;
        parent_id1 = json[i].parent_id;
        break;
      }
    }
    if (name1 == '') {
      return "未知机构";
    }
    for (var i = 0; i < json.length; i++) {
      if (json[i].org_id == parent_id1) {
        name2 = json[i].org_name;
        parent_id2 = json[i].parent_id;
        break;
      }
    }
    if (name2 != '') {
      name2 = name2 + "-";
    }
    for (var i = 0; i < json.length; i++) {
      if (json[i].org_id == parent_id2) {
        name3 = json[i].org_name;
        parent_id3 = json[i].parent_id;
        break;
      }
    }
    if (name3 != '') {
      name3 = name3 + "-";
    }
    return name3 + name2 + name1;
  },
  GetOrgType_fob: function (org_id) {
    var key = "OrgCache";
    var json = localStorage.getItem(key);
    try {
      json = JSON.parse(layui.setter.DESHelper.DecryptByDESModeEBC_fob(json));
    }
    catch (e) {
      OrgCache.GetAllOrg_fob();
      layui.layer.msg('请刷新后再试', { icon: 2 });
    }
    var org_type = '';
    for (var i = 0; i < json.length; i++) {
      if (json[i].org_id == org_id) {
        org_type = json[i].org_type;
        break;
      }
    }
    if (org_type == '') {
      return "未知机构";
    }
    return org_type;
  },
  GetOrgTreeByPermission_type_fob: function (org_type) {
    var type = 0;
    try {
      if (org_type.toString().indexOf('总工办') >= 0) {
        type = 1;
      } else if (org_type.toString().indexOf('总经办') >= 0) {
        type = 2;
      } else if (org_type.toString().indexOf('综合办公室') >= 0) {
        type = 3;
      } else if (org_type.toString().indexOf('财务部') >= 0) {
        type = 4;
      }
      //  else if (org_type.toString().indexOf('母体试验室') >= 0) {
      //     type = 6;
      // } 
      else if (org_type.toString().indexOf('外协部') >= 0) {
        type = 7;
      } else if (org_type.toString().indexOf('试验室') >= 0) {
        type = 8;
      } else if (org_type.toString().indexOf('工程部') >= 0) {
        type = 12;
      } else if (org_type.toString().indexOf('安质部') >= 0) {
        type = 13;
      } else if (org_type.toString().indexOf('混凝土拌和站') >= 0) {
        type = 9;
      } else if (org_type.toString().indexOf('水稳拌和站') >= 0) {
        type = 10;
      } else if (org_type.toString().indexOf('沥青拌和站') >= 0) {
        type = 11;
      }
      return type;
    } catch (err) {
      console.log(err);
      return type;
    }

  }

}

var ObjectCache = {
  //获取所有试验项目信息
  GetAllObject_fob: function () {
    var sData = '[Q]428{}' + ROWSPLIT_vob + TableType;
    AjaxHelper.QueryExec_fob(sData, function (res) {
      if (res.data.length > 0) {
        var key = "ObjectCache";
        localStorage.setItem(key, layui.setter.DESHelper.EncryptByDESModeEBC_fob(JSON.stringify(res.data)));
      }
    }, function (e, m) {
      console.log(e, m);
    }, true);
  },
  //获取一级试验项目名称
  GetObjectName1Level_fob: function (object_id) {
    var key = "ObjectCache";
    var json = localStorage.getItem(key);
    try {
      json = JSON.parse(layui.setter.DESHelper.DecryptByDESModeEBC_fob(json));
    }
    catch (e) {
      ObjectCache.GetAllObject_fob();
      layui.layer.msg('请刷新后再试', { icon: 2 });
    }
    var name1 = '';
    var parent_id1 = '';
    for (var i = 0; i < json.length; i++) {
      if (json[i].object_id == object_id) {
        name1 = json[i].object_name;
        parent_id1 = json[i].group_id;
        break;
      }
    }
    if (name1 == '') {
      return "未试试验";
    }
    return name1;
  },
  //获取二级试验项目名称
  GetObjectName2Level_fob: function (object_id) {
    var key = "ObjectCache";
    var json = localStorage.getItem(key);
    try {
      json = JSON.parse(layui.setter.DESHelper.DecryptByDESModeEBC_fob(json));
    }
    catch (e) {
      ObjectCache.GetAllObject_fob();
      layui.layer.msg('请刷新后再试', { icon: 2 });
    }
    var name1 = '';
    var parent_id1 = '';
    var name2 = '';
    var parent_id2 = '';
    for (var i = 0; i < json.length; i++) {
      if (json[i].object_id == object_id) {
        name1 = json[i].object_name;
        parent_id1 = json[i].group_id;
        break;
      }
    }
    if (name1 == '') {
      return "未试试验";
    }
    for (var i = 0; i < json.length; i++) {
      if (json[i].object_id == parent_id1) {
        name2 = json[i].object_name;
        parent_id2 = json[i].parent_id;
        break;
      }
    }
    if (name2 != '') {
      name2 = name2 + "-";
    }

    return name2 + name1;
  }
}

var js_common = {
  isRealNum: function (val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，

    if (val === "" || val == null) {
      return false;
    }
    if (!isNaN(val)) {
      //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
      //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
      return true;
    }

    else {
      return false;
    }
  },
  fnTable1Height: function (height) {
    if (height >= layui.$(window).height()) {
      height = layui.$(window).height() * 0.95;

    }
    //console.log(height, $(window).height());
    return height;
  },
  fnTable1Width: function (width) {
    //var width = "700";
    if (width >= layui.$(window).width()) {
      width = layui.$(window).width();
    }
    //console.log(width, layui.$(window).width());
    return width;
  },
  downloadFileBycontent: function (filename, content) {

    var a = document.createElement('a')
    var blob = new Blob([content])
    var url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  },
  downloadFileByUrl: function (name, url) {
    function ajax(url, callback, options) {
      window.URL = window.URL || window.webkitURL
      var xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      if (options.responseType) {
        xhr.responseType = options.responseType
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          callback(xhr)
        }
      }
      xhr.send()
    }
    ajax(url, function (xhr) {

      js_common.downloadFileBycontent(name, xhr.response)
    }, {
      responseType: 'blob'
    })

  },
  sumStrlength: function (value) {
    var i, sum;
    sum = 0;
    for (i = 0; i < value.length; i++) {
      if ((value.charCodeAt(i) >= 0) && (value.charCodeAt(i) <= 255))
        sum = sum + 1;
      else
        sum = sum + 2;
    }
    return sum;
  },
  sleep: function (n) {
    var start = new Date().getTime();
    //  console.log('休眠前：' + start);
    while (true) {
      if (new Date().getTime() - start > n) {
        break;
      }
    }
    // console.log('休眠后：' + new Date().getTime());
  },
  get_spread_js: function () {
    var list = ["lib/spreadjs/gc.spread.sheets.all.12.2.2.min.js", "lib/spreadjs/gc.spread.sheets.resources.zh.12.2.2.min.js",
      "lib/spreadjs/gc.spread.excelio.12.2.2.min.js", "lib/spreadjs/FileSaver.min.js", "lib/spreadjs/gc.spread.sheets.print.12.2.2.min.js"];
    let prefix = '<script src="' + layui.setter.base;
    let suffix = '"></script>';
    let sReult = "";
    for (let i = 0; i < list.length; i++) {
      let str = prefix + list[i] + suffix + "\n";
      sReult = sReult + str;
    }
    //console.log(sReult);
    return sReult;
  },
  loadJS: function (url, callback) {
    try {
      var script = document.createElement('script'),
        fn = callback || function () { };
      script.type = 'text/javascript';
      //IE
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null;
            fn();
          }
        };

      } else {
        //其他浏览器
        script.onload = function () {
          fn();
        };
      }
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    } catch (e) {
      console.log(e);
    }

  },
  LoadCss_fob: function (url, prefix) {
    var linkScript = document.createElement("link");
    linkScript.type = "text/css";
    linkScript.rel = "stylesheet";
    if (prefix == undefined) {
      prefix = '';
    }
    var suffix = ""
    try {
      suffix = '?v=' + (layui.admin.v + '-1')
    } catch (e) {
      console.log(e);
    }
    linkScript.href = prefix + url + suffix;
    console.log(linkScript.href)
    document.body.appendChild(linkScript);
  },
  trim_fob: function (field) {
    for (key in field) {
      field[key] = field[key].toString().trim();
    }
    return field;
  },
  listToStr: function (list) {
    var sTemp = '';
    for (var i = 0; i < list.length; i++) {
      sTemp += "'" + list[i] + "',";
    }
    if (sTemp != '') {
      sTemp = sTemp.substring(0, sTemp.length - 1);
    }
    if (sTemp.indexOf(",") < 0) { //如果不包含,说明in只有一项 如果是多项 后台会自动过滤'
      //如果是数字 则 去掉首尾的'
      sTemp = sTemp.substring(1, sTemp.length - 1);
    }
    return sTemp;
  },
  listToStrByKey: function (list, Key, spiltStr) {
    var sTemp = '';
    for (var i = 0; i < list.length; i++) {
      sTemp += spiltStr + list[i][Key] + spiltStr + ",";
    }
    if (sTemp != '') {
      sTemp = sTemp.substring(0, sTemp.length - 1);
    }
    if (sTemp.indexOf(",") < 0) { //如果不包含,说明in只有一项 如果是多项 后台会自动过滤'
      //如果是数字 则 去掉首尾的'
      sTemp = sTemp.substring(1, sTemp.length - 1);
    }
    return sTemp;
  },
  getExecStrs: function (str, reg) {
    //var reg = /\$\{(.+?)\}/g
    var list = [];
    var result = reg.exec(str);
    // do {

    //   result && list.push(result[1]);
    // } while (result);
    return result;
  },
  getMatchedStrs: function (str, reg) {
    //var reg = /\$\{(.+?)\}/
    //var reg_g = /\$\{(.+?)\}/g;
    var result = str.match(reg_g);
    //var list = [];
    // for (var i = 0; i < result.length; i++) {
    //   var item = result[i];
    //   list.push(item.match(reg)[1]);
    // }
    return result;
  },
  sizeHightSingle: function (tableNmae, id) {
    var height = layui.$(window).height();
    var searchHeight = layui.$(id).height();
    var mainTalbe = height - searchHeight - 150;
    var minHeight = 200;
    if (mainTalbe < minHeight) {
      mainTalbe = minHeight;
    }

    layui.table.reload(tableNmae, {
      height: mainTalbe
    });
  },
  login_invalid: function () {
    if (typeof layui.data('gtwise').access_token == 'undefined') {
      js_common.AjaxError401({ status: 401 }, 1);
    }
  },
  AjaxError401: function (e, type) {
    if (e.status == 401) {
      //if (login_status) {
      login_status = false;
      var url = '';
      layer.msg('登录验证过期,请重新登录!');
      if (type == 1) {
        url = 'user/login.html'; //跳转到登入页
      } else {

        // var redirect = encodeURIComponent(layui.admin.correctRouter(layui.router().path.join('/')));
        // if (redirect == "%2Fuser%2Flogin") {
        //   url = 'user/login.html'; //跳转到登入页
        // }
        // url = 'user/login.html/redirect=' + redirect; //跳转到登入页
        url = 'user/login.html'; //跳转到登入页
      }

      if (top == self) {
        // if (top.location != self.location) {
        layui.admin.exit(function () {
          location.href = url;
        });
        //}
      } else {
        //top.admin_exit();
        top.layui.admin.exit(function () {
          top.location.href = '../user/login.html';
        });
        // if (top.admin_exit) {
        //   top.admin_exit();
        // } else {

        // }

      }

      //}
      return true;
    }
    return false;
  },
  cellConvert: function (cell) {//A1 to [0,0]
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
  },
  cellConvertToOffice: function (col, row) {
    try {
      let ACode = 'A'.charCodeAt(0);
      col = String.fromCharCode(Number(ACode) + Number(col));
      return col + Number(row + 1);
    } catch (err) {
      console.log(MediaStreamErrorEvent);
      return -1;
    }
  },
  fnShowPic2_fob: function (sText, type) {
    let src = picture_reader_helper.getTypeUrl(type);
    sText = sText.trim();
    console.log(sText, sText != "");
    if (sText != "") {
      if (sText.indexOf(".pdf") == -1 && sText != "未上传") {
        layer.photos({
          photos: { "data": [{ "src": src + "/" + sText }] },
          closeBtn: 1,
          shade: 0.5,
          //anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });
      } else if (sText != "未上传") {
        layui.use('layer', function () {
          var layer = layui.layer;
          layer.open({
            //title:'文件查看',
            type: 2,
            shade: 0.3,
            shadeClose: true,
            offset: 'auto',
            resize: true,
            title: false,
            closeBtn: 1,
            area: ['80%', '90%'],
            //area:auto,
            //iframeAuto,
            maxmin: true,
            skin: 'layui-layer-nobg', //'layui-layer-nobg', //没有背景色
            //shadeClose: true,
            scrollbar: true,
            content: src + "/" + sText,
          });
          layer.msg('文件预览', { time: 500 });
        });
      }
    } else {
      layer.msg('未上传图片', { time: 500 });
    }

  },
  fnShowPic: function (id, type) {
    try {
      let sText = document.getElementById(id).innerText;
      if (typeof sText == 'undefined') {
        sText = '';
      }
      if (sText == '') {
        sText = document.getElementById(id).value
      }
      if (typeof sText == 'undefined') {
        sText = '';
      }
      js_common.fnShowPic2_fob(sText, type);
    } catch (err) {
      layer.msg(err, { time: 500 });
    }

  },    /**
  *判断是否是数字
  *
  **/

  isRealNum: function (val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，

    if (val === "" || val == null) {
      return false;
    }
    if (!isNaN(val)) {
      //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
      //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
      return true;
    }

    else {
      return false;
    }
  }
}

//试验台账相关操作
var test_data_helper = {
  //工具条
  tool_help: function (obj, testprocess, tableName) {
    var data = obj.data;
    var event = obj.event;
    var data = obj.data;
    var area = ['130px', 80];//宽高

    if (event == 'operate') {
      var menu_data = [
        { 'data': data, 'type': 1, 'event': 'vieworder', 'title': '查看委托单', icon: 'layui-icon layui-icon-template' },
        { 'data': data, 'type': 1, 'event': 'exporEntrustExcel', 'title': '导出委托单', icon: 'layui-icon layui-icon-export' }
        // { 'data': data, 'type': 1, 'event': 'exporTestExcel', 'title': '导出试验单', icon: 'layui-icon layui-icon-export' }
      ]
      var testDataLedger_edit = permission.JudgeRightByIdEx("testDataLedger-edit", "testDataLedger");
      var testDataLedger_del = permission.JudgeRightByIdEx("testDataLedger-del", "testDataLedger");
      var testDataLedger_report = permission.JudgeRightByIdEx("testDataLedger-report", "testDataLedger");
      var testDataLedger_realreport = permission.JudgeRightByIdEx("testDataLedger-realreport", "testDataLedger");
      var testDataLedger_send = permission.JudgeRightByIdEx("testDataLedger-send", "testDataLedger");
      var testDataLedger_view = permission.JudgeRightByIdEx("testDataLedger-view", "testDataLedger");
      if (data.org_id == layui.setter.DESHelper.UserInfo_fob().org_pid && layui.setter.DESHelper.UserInfo_fob().duty == "调度员" && testDataLedger_edit) { //这说明这是这个机构创建的委托单
        menu_data.push({ 'data': data, 'type': 1, 'event': 'editorder', 'title': '编辑委托单', icon: 'layui-icon layui-icon-edit' });
        area[1] += 34;
        //如果不是受理状态可以删除 是受理状态就不能再删除了 并且如果是其他单位委托就不能再删除
        if (data.stage == 0 && data.entrust_id < 0 && testDataLedger_del) {
          menu_data.push({ 'data': data, 'type': 1, 'event': 'deleteorder', 'title': '删除委托单', icon: 'layui-icon layui-icon-delete' });
          area[1] += 34;
          //menu_data.push({ 'data': data, 'type': 1, 'event': 'assignperson', 'title': '分配/重配试验员', icon: 'layui-icon layui-icon-template' });          
        }
      }
      //必须是同机构下同personid 并且还要具有此权限的
      if (data.org_id == layui.setter.DESHelper.UserInfo_fob().org_pid && testDataLedger_report && data.test_person == layui.setter.DESHelper.UserInfo_fob().person_id && data.stage >= 1) {
        menu_data.push({ 'data': data, 'type': 1, 'event': 'editreport', 'title': '上报台账报告', icon: 'layui-icon layui-icon-add-1' });
        area[1] += 34;
      }
      if (data.stage >= 1) {
        menu_data.push({ 'data': data, 'type': 1, 'event': 'viewreport', 'title': '查看台账报告', icon: 'layui-icon layui-icon-template' });
        area[1] += 34;
      }

      if (data.org_id == layui.setter.DESHelper.UserInfo_fob().org_pid && testDataLedger_realreport && data.test_person == layui.setter.DESHelper.UserInfo_fob().person_id && data.stage >= 1) {
        menu_data.push({ 'data': data, 'type': 1, 'event': 'editrealreport', 'title': '真实数据反馈', icon: 'layui-icon layui-icon-add-1' });
        area[1] += 34;
      }
      if (data.org_id == layui.setter.DESHelper.UserInfo_fob().org_pid && testDataLedger_send && data.stage >= 1) {
        menu_data.push({ 'data': data, 'type': 1, 'event': 'send', 'title': '发送真实数据', icon: 'layui-icon layui-icon-release' });
        area[1] += 34;
      }
      if (data.org_id == layui.setter.DESHelper.UserInfo_fob().org_pid && testDataLedger_view) {
        menu_data.push({ 'data': data, 'type': 1, 'event': 'view', 'title': '查看材质单', icon: 'layui-icon layui-icon-form' });
        area[1] += 34;
      }
      if (data.stage >= 1) {
        menu_data.push({ 'data': data, 'type': 1, 'event': 'viewrealreport', 'title': '查看数据反馈', icon: 'layui-icon layui-icon-template' });
        area[1] += 34;
      }

      if (data.stage >= 1) {
        menu_data.push({ 'data': data, 'type': 1, 'event': 'compare', 'title': '试验数据对比', icon: 'layui-icon layui-icon-template' });
        area[1] += 34;
      }

      area[1] = area[1] + 'px';
      //权限清洗 用于后续权限扩充
      // var mouseRight = index.getMouseRight(menu_data);                              
      var trindex = obj.tr[0].rowIndex;
      var mouseRight = menu_data;
      layui.mouseRightMenu.open(mouseRight, {
        id: "testdataLedger_mouseRightMenu",
        area: area,//宽高 
      }, function (obj1) {
        if (obj1.event == 'vieworder' || obj1.event == 'editorder') { //查看 编辑委托单       
          var params = {}, viewdatas = {};
          params.type = 1; //委托单
          params.key = "data_id"; //试验委托类型
          if (obj1.event == 'vieworder') {
            params.action = 3; //查看
          }
          else {
            params.action = 2; //编辑
          }
          params.object_id = data.object_id;
          params.org_pid = data.org_id; //这个应该是输入方的下拉选的机构
          params.entrust_id = data.entrust_id || 0;
          params.lab_id = data.org_id || "";
          params.data_id = data.data_id || 0;
          //查询详细数据
          //SELECT meta_id,value,CONVERT(varchar(32),a.test_person)+'-'+p.name as Assign,r.keep_id FROM TestDetail t LEFT JOIN Assign a ON t.data_id = a.data_id LEFT JOIN personnel p ON p.person_id = a.test_person LEFT JOIN RetainSample r ON t.data_id = r.data_id WHERE t.data_id =$p1;
          var sData = "[Q]477{" + params.data_id + "}" + ROWSPLIT_vob + TableType;
          AjaxHelper.QueryExec_fob(sData, function (res) {
            if (res.data.length > 0) {
              viewdatas = testprocess.GetMetaValue_fob(res.data);
              viewdatas["Assign"] = res.data[0]['Assign'];
              viewdatas["RetainSample"] = res.data[0]['keep_id'] == '' ? 0 : 1;
            }
            //console.log(this);
            //1
            test_data_helper.showOrderModel_fob(viewdatas, params, testprocess, tableName);
          }, function (e, m) {
            console.log(e, m);
            layer.msg('详细条目获取失败,无法查看委托');
          }, true);
        } else if (obj1.event == 'deleteorder') {
          //2
          test_data_helper.delModel_fob(obj, data, testprocess, tableName);
        } else if (obj1.event == 'editreport' || obj1.event == 'viewreport') { //编辑报告
          //开始处理
          var params = {}, viewdatas = {};
          params.type = 2; //报告单
          params.key = "data_id"; //试验台账类型  
          if (obj1.event == 'editreport') {
            params.action = 2; //编辑
          }
          else {
            params.action = 3; //查看
          }
          params.object_id = data.object_id;
          params.org_pid = data.org_id; //这个应该是输入方的下拉选的机构
          params.entrust_id = data.entrust_id || 0;
          params.lab_id = data.org_id || "";
          params.data_id = data.data_id || 0;
          params.conclusion = data.conclusion || 0;
          //查询详细数据
          //SELECT meta_id,value FROM TestDetail WHERE data_id =$p1;
          var sData = "[Q]478{" + params.data_id + "}" + ROWSPLIT_vob + TableType;
          AjaxHelper.QueryExec_fob(sData, function (res) {
            if (res.data.length > 0) {
              viewdatas = testprocess.GetMetaValue_fob(res.data);
              testprocess.GetDeviceUsedData_fob(params.data_id, function (obj) {
                for (let key in obj) {
                  console.log(key + '---' + obj[key])
                  viewdatas[key] = obj[key];
                }
                viewdatas["conclusion1"] = data.conclusion;
                //3
                test_data_helper.showReportModel_fob(viewdatas, params, testprocess, tableName);
              }, function (e) { })
            }

          }, function (e, m) {
            console.log(e, m);
            layer.msg('详细条目获取失败,无法操作报告');
          }, true);

        } else if (obj1.event == 'editrealreport' || obj1.event == 'viewrealreport') {
          //开始处理
          var params = {}, viewdatas = {};
          params.type = 3; //真实数据
          params.key = "data_id"; //试验台账类型  
          if (obj1.event == 'editrealreport') {
            params.action = 2; //编辑
          }
          else {
            params.action = 3; //查看
          }
          params.object_id = data.object_id;
          params.org_pid = data.org_id; //这个应该是输入方的下拉选的机构
          params.entrust_id = data.entrust_id || 0;
          params.lab_id = data.org_id || "";
          params.data_id = data.data_id || 0;
          //查询详细数据          
          //SELECT meta_id,value FROM TestReport WHERE data_id =$p1 UNION SELECT meta_id,value FROM TestDetail WHERE data_id =$p1 AND meta_id=$p2;
          var sData = "[Q]484{" + params.data_id + UNITSPLIT_vob + '100014' + "}" + ROWSPLIT_vob + TableType;
          AjaxHelper.QueryExec_fob(sData, function (res) {
            if (res.data.length > 0) {
              viewdatas = testprocess.GetMetaValue_fob(res.data);
            }
            //4
            test_data_helper.showRealReportModel_fob(viewdatas, params, testprocess, tableName);
          }, function (e, m) {
            console.log(e, m);
            layer.msg('详细条目获取失败,无法操作真实数据反馈');
          }, true);

        } else if (obj1.event == 'view') {
          var sData = '[Q]915{' + data.entrust_id + '}' + ROWSPLIT_vob + TableType;
          AjaxHelper.QueryExec_fob(sData, function (res) {
            if (res.data.length > 0) {
              var link = gtConfig_fob.ReportImageUrl + "/" + res.data[0].value;
              window.open(link);
              return;
            } else {
              layer.msg("材质单并未上传");
              return;
            }
          }, function (e, m) {
            layer.msg("发送失败");
          }, false);
        } else if (obj1.event == 'compare') {
          //开始处理
          var params = {}, viewdatas = {};
          params.type = 4; //对比
          params.key = "data_id"; //试验台账类型           
          params.action = 3; //查看
          params.object_id = data.object_id;
          params.org_pid = data.org_id; //这个应该是输入方的下拉选的机构
          params.entrust_id = data.entrust_id || 0;
          params.lab_id = data.org_id || "";
          params.data_id = data.data_id || 0;
          //查询详细数据          
          //SELECT '1' as type,meta_id,value FROM TestReport WHERE data_id =$p1 UNION SELECT '2' as type,meta_id,value FROM TestDetail WHERE data_id =$p1;
          var sData = "[Q]488{" + params.data_id + "}" + ROWSPLIT_vob + TableType;
          AjaxHelper.QueryExec_fob(sData, function (res) {
            if (res.data.length > 0) {
              viewdatas = testprocess.GetMetaValueEx_fob(res.data);
            }
            //5
            test_data_helper.showCompareReportModel_fob(viewdatas, params, testprocess, tableName);
          }, function (e, m) {
            console.log(e, m);
            layer.msg('详细条目获取失败,无法操作真实数据反馈');
          }, true);
        }
        else if (obj1.event == 'send') {
          var data_idf = data.data_id;
          layui.use(['admin', 'laydate', 'upload', 'layer', 'view', 'table', 'form'], function () {
            var $ = layui.$
              , laydate = layui.laydate
              , layer = layui.layer
              , view = layui.view
              , table = layui.table
              , form = layui.form
              , admin = layui.admin
              , upload = layui.upload;
            admin.popup({
              title: '发送真实数据'
              , area: ['650px', '400px']
              , id: 'add'
              , success: function (layero, index) {
                //将主表主键传递进去
                var data1 = {};
                data1.data_id = data_idf;
                view(this.id).render('materialtest/SendForm', data1).done(function () {
                  form.render(null, 'send-form');
                  //监听提交
                  form.on('submit(send-form-submit)', function (data) {
                    var field = data.field; //获取提交的字段
                    if (field.object == '') {
                      layer.msg("请选择发送目标");
                    } else {
                      var object = field.object.split(',');
                      var count = object.length;
                      var count1 = 0;
                      for (var i = 0; i < object.length; i++) {
                        var sData = '[Q]877{' + object[i] + UNITSPLIT_vob + data_idf + '}' + ROWSPLIT_vob + TableType;
                        AjaxHelper.QueryExec_fob(sData, function (res) {
                          if (res.data.length > 0) {
                            if (res.data[0]["Column1"] > 0) {
                              layer.msg("已经发送,不能重复发送");
                              console.log(count + "---------" + count1);
                              count--;
                              return;
                            }
                          }
                          //组织语句进行提交
                          //var sData = "[Q]223{" + field.org_id + UNITSPLIT_vob + field.room_id + "}" + ROWSPLIT_vob + AffectDatas + ROWSPLIT_vob + TableType;
                          //INSERT INTO RoomMap(org_id,room_id)VALUES($p1,$p2);SELECT @@IDENTITY;
                          var sData = "[Q]878{" + data_idf + UNITSPLIT_vob + object[i] + "}" + ROWSPLIT_vob + AffectDatas + ROWSPLIT_vob + TableType;
                          AjaxHelper.ExecSql_fob(sData, function (res) {
                            console.log("count1:" + count1 + "----count" + count);
                            //debugger;
                            if (res > 0) {
                              layer.msg("发送成功");
                              count1++;
                              if (count1 >= count) {
                                layer.close(index); //执行关闭
                              }
                            }
                            else {
                              layer.msg("发送失败");
                            }
                          }, function (e, m) {
                            layer.msg("发送失败");
                          }, false);

                        }, function (e, m) {
                          layer.msg("发送失败");
                        }, false);
                      }

                    }


                  });
                  layero.find('#send-form-cancel').on('click', function () {
                    layer.close(index);
                  });
                });
              }
            });
          });

        } else if (obj1.event == 'exporTestExcel') {
          ExportData_fob.testDataPrint_fob(data.object_id, data.data_id);
        } else if (obj1.event == 'exporEntrustExcel') {
          ExportData_fob.entrustPrint_fob(data.object_id, data.entrust_id);
        }

      });

    }



  },
  showReportModel_fob: function (viewdatas, params, testprocess, tableName) {
    var title;
    switch (params.action) {
      case 2:
        title = '编辑报告';
        break;
      case 3:
        title = '查看报告';
        break;
    }
    layui.testingform(this.id).render(viewdatas, params).done(function (html, dict) {
      //debugger;
      layui.use(['admin', 'laydate', 'upload', 'layer', 'view', 'table', 'form'], function () {
        var $ = layui.$
          , laydate = layui.laydate
          , layer = layui.layer
          , view = layui.view
          , table = layui.table
          , form = layui.form
          , upload = layui.upload;
        layer.open({
          type: 1
          , title: title
          , area: ['700px', '630px']
          , content: html
          , id: 'LAY-system-view-popup'
          , skin: 'layui-layer-admin'
          , shadeClose: false
          , closeBtn: false
          , btn: ['确认', '取消']
          , btnAlign: 'r'
          , yes: function (index, layero) {
            if (params.action == 3) {
              layer.close(index);
            }
            else {
              $("#DynamicData-form-submit").click();
            }
          }
          , btn2: function (index, layero) {
            layer.close(index);
          }
          , success: function (layero, index) {
            // var elemClose = $('<i class="layui-icon" close>&#x1006;</i>');
            // layero.append(elemClose);
            // elemClose.on('click', function () {
            //   layer.close(index);
            // });
            form.render(null, 'DynamicData-form');

            //监听提交
            form.on('submit(DynamicData-form-submit)', function (data) {
              if (params.action < 3) { //这是增加和修改
                var field = data.field; //获取提交的字段
                layer.confirm('确定信息无误,提交吗？', function (ind) {
                  layer.close(ind);
                  //查询报告编号是否已经存在
                  //SELECT report_id FROM TestData WHERE data_id !=$p1 AND report_id=$p2;
                  var sData = "[Q]489{" + params.data_id + UNITSPLIT_vob + field['item_100038'] + "}" + ROWSPLIT_vob + TableType;
                  AjaxHelper.QueryExec_fob(sData, function (res) {
                    if (res.data.length > 0) {
                      layer.alert('报告编号重复,请修改报告编号后保存!');
                    }
                    else {
                      //先把输入的内容存入localstorage中    
                      testprocess.SaveLocalStorage_fob(params.org_pid, field, dict);
                      testprocess.SaveTestReport_fob(field, dict, params, index, viewdatas, data.elem, tableName);
                    }
                  }, function (e, m) {
                    console.log(e, m);
                  }, true);
                });
              }
              else { //查看 3
                layer.close(index);
              }


            });

            layero.find('#DynamicData-form-cancel').on('click', function () {
              var formdata = form.val("DynamicData-form1");
              console.log('formdata', formdata);
              layer.close(index);
            });

          }
        });
      });

    });
  },
  showOrderModel_fob: function (viewdatas, params, testprocess, tableName) {
    var title;
    switch (params.action) {
      case 1:
        title = '新建委托';
        break;
      case 2:
        title = '编辑委托';
        break;
      case 3:
        title = '查看委托';
        break;
    }
    layui.testingform(this.id).render(viewdatas, params).done(function (html, dict) {
      layui.use(['admin', 'laydate', 'upload', 'layer', 'view', 'table', 'form'], function () {
        var $ = layui.$
          , laydate = layui.laydate
          , layer = layui.layer
          , view = layui.view
          , table = layui.table
          , form = layui.form
          , upload = layui.upload;
        layer.open({
          type: 1
          , title: title
          , area: ['700px', '630px']
          , content: html
          , id: 'LAY-system-view-popup'
          , skin: 'layui-layer-admin'
          , shadeClose: false
          , closeBtn: false
          , btn: ['确认', '取消']
          , btnAlign: 'r'
          , yes: function (index, layero) {
            if (params.action == 3) {
              layer.close(index);
            }
            else {
              $("#DynamicData-form-submit").click();
            }
          }
          , btn2: function (index, layero) {
            layer.close(index);
          }
          , success: function (layero, index) {
            // var elemClose = $('<i class="layui-icon" close>&#x1006;</i>');
            // layero.append(elemClose);
            // elemClose.on('click', function () {
            //   layer.close(index);
            // });
            form.render(null, 'DynamicData-form');
            //监听提交

            form.on('submit(DynamicData-form-submit)', function (data) {
              if (params.action < 3) { //这是增加和修改
                var field = data.field; //获取提交的字段
                layer.confirm('确定信息无误,提交吗？', function (ind) {
                  layer.close(ind);
                  //查询委托编号是否已经存在 
                  //SELECT order_id FROM TestData WHERE data_id !=$p1 AND order_id=$p2;
                  var sData = "[Q]474{" + params.data_id + UNITSPLIT_vob + field['item_100000'] + "}" + ROWSPLIT_vob + TableType;
                  AjaxHelper.QueryExec_fob(sData, function (res) {
                    if (res.data.length > 0) {
                      layer.alert('委托编号重复,请修改委托编号后保存!');
                    }
                    else {
                      //先把输入的内容存入localstorage中    
                      testprocess.SaveLocalStorage_fob(params.org_pid, field, dict);
                      testprocess.SaveTestOrder_fob(field, dict, params, index, data.elem, tableName);
                    }
                  }, function (e, m) {
                    console.log(e, m);
                  }, true);
                });
              }
              else { //查看 3
                layer.close(index);
              }
            });

            layero.find('#DynamicData-form-cancel').on('click', function () {
              layer.close(index);
            });

          }
        });


      });

    });
  },
  showRealReportModel_fob: function (viewdatas, params, testprocess, tableName) {
    var title;
    switch (params.action) {
      case 2:
        title = '编辑真实反馈数据';
        break;
      case 3:
        title = '查看真实反馈数据';
        break;
    }
    layui.testingform(this.id).render(viewdatas, params).done(function (html, dict) {
      //debugger;
      layui.use(['admin', 'laydate', 'upload', 'layer', 'view', 'table', 'form'], function () {
        var $ = layui.$
          , laydate = layui.laydate
          , layer = layui.layer
          , view = layui.view
          , table = layui.table
          , form = layui.form
          , upload = layui.upload;
        layer.open({
          type: 1
          , title: title
          , area: ['700px', '630px']
          , content: html
          , id: 'LAY-system-view-popup'
          , skin: 'layui-layer-admin'
          , shadeClose: false
          , closeBtn: false
          , btn: ['确认', '取消']
          , btnAlign: 'r'
          , yes: function (index, layero) {
            if (params.action == 3) {
              layer.close(index);
            }
            else {
              $("#DynamicData-form-submit").click();
            }
          }
          , btn2: function (index, layero) {
            layer.close(index);
          }
          , success: function (layero, index) {
            // var elemClose = $('<i class="layui-icon" close>&#x1006;</i>');
            // layero.append(elemClose);
            // elemClose.on('click', function () {
            //   layer.close(index);
            // });
            form.render(null, 'DynamicData-form');
            //监听提交         
            form.on('submit(DynamicData-form-submit)', function (data) {
              if (params.action < 3) { //这是增加和修改
                var field = data.field; //获取提交的字段
                layer.confirm('确定信息无误,提交吗？', function (ind) {
                  layer.close(ind);

                  // var formdata = form.val("DynamicData-form1");
                  // console.log('formdata', formdata);   
                  //先把输入的内容存入localstorage中    
                  //testprocess.SaveLocalStorage_fob(params.org_pid, field, dict);
                  testprocess.SaveRealTestReport_fob(field, dict, params, index, viewdatas, data.elem, tableName);

                });
              }
              else { //查看 3
                layer.close(index);
              }
            });

            layero.find('#DynamicData-form-cancel').on('click', function () {
              layer.close(index);
            });

          }
        });
      });

    });
  },
  showCompareReportModel_fob: function (viewdatas, params, testprocess, tableName) {
    var title;
    switch (params.action) {
      case 3:
        title = '查看真实反馈数据和报告数据对比';
        break;
    }
    layui.testingform(this.id).render(viewdatas, params).done(function (html, dict) {
      //debugger;
      layui.use(['admin', 'laydate', 'upload', 'layer', 'view', 'table', 'form'], function () {
        var $ = layui.$
          , laydate = layui.laydate
          , layer = layui.layer
          , view = layui.view
          , table = layui.table
          , form = layui.form
          , upload = layui.upload;
        layer.open({
          type: 1
          , title: title
          , area: ['700px', '630px']
          , content: html
          , id: 'LAY-system-view-popup'
          , skin: 'layui-layer-admin'
          , shadeClose: false
          , closeBtn: false
          , btn: ['关闭']
          , btnAlign: 'c'
          , yes: function (index, layero) {
            layer.close(index);
          }
          , success: function (layero, index) {
            var elemClose = $('<i class="layui-icon" close>&#x1006;</i>');
            layero.append(elemClose);
            elemClose.on('click', function () {
              layer.close(index);
            });
            form.render(null, 'DynamicData-form');
            //监听提交         
            form.on('submit(DynamicData-form-submit)', function (data) {
              if (params.action < 3) {
                var field = data.field;
                layer.close(ind);
              }
              else { //查看 3
                layer.close(index);
              }
            });

            layero.find('#DynamicData-form-cancel').on('click', function () {
              layer.close(index);
            });

          }
        });
      });

    });
  },
  delModel_fob: function (obj, data, testprocess, tableName) {
    layer.confirm('删除此台账,关联留样信息也一并会删除,确定删除？', function (index) {
      //DELETE FROM Assign WHERE data_id=$p1;DELETE FROM RetainSample WHERE data_id=$p1;DELETE FROM TestDetail WHERE data_id=$p1;DELETE FROM TestData WHERE data_id =$p1;
      var sData = "[Q]475{" + data.data_id + UNITSPLIT_vob + "0}" + ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType;
      AjaxHelper.ExecSql_fob(sData, function (res) {
        if (res > 0) {
          obj.del();//前端删除 减少一次服务器交互
          layer.close(index); //执行关闭    
          layer.msg("删除成功!");
        } else {
          layer.msg("删除失败,请刷新列表检查数据是否存在!");
        }
      }, function (e, m) {
        layer.close(index); //执行关闭 
        layer.msg("删除失败");
      });

    });
  }
}
var entrust_data_helper = {
  tool_help: function (obj, testprocess, tableName) {
    var data = obj.data;
    var event = obj.event;
    var area_height = 110;
    var area = ['110px', '110px'];//宽高
    //console.log(obj);
    if (event == 'operate') {
      var menu_data = [
        { 'data': data, 'type': 1, 'event': 'vieworder', 'title': '查看委托单', icon: 'layui-icon layui-icon-template' },
        { 'data': data, 'type': 1, 'event': 'view', 'title': '查看材质单', icon: 'layui-icon layui-icon-form' },
        { 'data': data, 'type': 1, 'event': 'exportExcel', 'title': '导出委托单', icon: 'layui-icon layui-icon-export' }
      ]

      var entrustLedger_edit = permission.JudgeRightByIdEx("entrustLedger-edit", "entrustLedger");
      var entrustLedger_accept = permission.JudgeRightByIdEx("entrustLedger-accept", "entrustLedger");
      var entrustLedger_back = permission.JudgeRightByIdEx("entrustLedger-back", "entrustLedger");
      var entrustLedger_del = permission.JudgeRightByIdEx("entrustLedger-del", "entrustLedger");
      var entrustLedger_view = permission.JudgeRightByIdEx("entrustLedger-view", "entrustLedger");
      if (data.org_id == layui.setter.DESHelper.UserInfo_fob().org_pid && entrustLedger_edit && (data.accepted == 0 || data.accepted == 4)) { //这说明这是这个机构创建的委托单
        menu_data.push({ 'data': data, 'type': 1, 'event': 'editorder', 'title': '编辑委托单', icon: 'layui-icon layui-icon-edit' });
        area = ['110px', '72px'];//宽高
        area_height += 40;
        //如果是为受理状态可以删除是受理状态就不能再删除了
        if (data.org_id == layui.setter.DESHelper.UserInfo_fob().org_pid && (data.accepted == 0 || data.accepted == 4) && entrustLedger_del) {
          menu_data.push({ 'data': data, 'type': 1, 'event': 'deleteorder', 'title': '删除委托单', icon: 'layui-icon layui-icon-delete' });
          area = ['110px', '108px'];//宽高
          area_height += 40;
        }
      }

      else if (data.lab_id == layui.setter.DESHelper.UserInfo_fob().org_pid && layui.setter.DESHelper.UserInfo_fob().duty == "调度员" && data.accepted == 0) {
        if (entrustLedger_accept) {
          menu_data.push({ 'data': data, 'type': 1, 'event': 'acceptorder', 'title': '受理委托单', icon: 'layui-icon layui-icon-template' });
          area = ['110px', '72px'];//宽高
          //area = ['110px', '140px'];//宽高
          area_height += 40;
        }

        if (entrustLedger_back) {
          menu_data.push({ 'data': data, 'type': 1, 'event': 'back', 'title': '退回委托单', icon: 'layui-icon layui-icon-template' });
          area = ['110px', '72px'];//宽高
          area_height += 40;
        }
      }
      // if (data.org_id == layui.setter.DESHelper.UserInfo_fob().org_pid &&entrustLedger_view){
      //   menu_data.push({ 'data': data, 'type': 1, 'event': 'view', 'title': '查看材质单', icon: 'layui-icon layui-icon-picture' });
      //   area = ['110px', '72px'];//宽高
      // }
      // else if (data.lab_id == layui.setter.DESHelper.UserInfo_fob().org_pid && layui.setter.DESHelper.UserInfo_fob().duty == "调度员" && data.accepted == 0 && ) {
      //   layer.msg(entrustLedger_back);
      //
      //   //area = ['110px', '140px'];//宽高
      // }
      //权限清洗 用于后续权限扩充
      // var mouseRight = index.getMouseRight(menu_data);                              
      var trindex = obj.tr[0].rowIndex;
      var mouseRight = menu_data;
      layui.mouseRightMenu.open(mouseRight, {
        id: "ensrustLedger_mouseRightMenu",
        area: ['110px', area_height + 'px'],//宽高 
      }, function (obj1) {
        if (obj1.event == 'vieworder' || obj1.event == 'editorder') { //查看委托单       
          var params = {}, viewdatas = {};
          params.type = 1; //委托单
          params.key = "entrust_id"; //试验委托类型
          if (obj1.event == 'vieworder') {
            params.action = 3; //查看
          }
          else {
            params.action = 2; //编辑
          }
          params.object_id = data.object_id;
          params.org_pid = data.org_id; //这个应该是输入方的下拉选的机构
          params.entrust_id = data.entrust_id || 0;
          params.lab_id = data.lab_id || "";
          //查询详细数据
          //SELECT meta_id,value FROM EntrustDetail WHERE entrust_id =$p1;
          var sData = "[Q]447{" + params.entrust_id + "}" + ROWSPLIT_vob + TableType;
          AjaxHelper.QueryExec_fob(sData, function (res) {
            if (res.data.length > 0) {
              viewdatas = testprocess.GetMetaValue_fob(res.data, testprocess);
            }
            viewdatas.back_reason = data.back_reason;
            //1
            entrust_data_helper.showModel_fob(viewdatas, params, testprocess, tableName);
          }, function (e, m) {
            console.log(e, m);
            layer.msg('详细条目获取失败,无法查看委托');
          }, true);
        } else if (obj1.event == 'acceptorder') {
          var params = {}, viewdatas = {};
          params.type = 1; //委托单
          params.key = "entrust_id"; //试验委托类型
          params.action = 4; //受理委托单
          params.object_id = data.object_id;
          params.org_pid = data.org_id; //这个应该是输入方的下拉选的机构
          params.entrust_id = data.entrust_id || 0;
          params.lab_id = data.lab_id || "";
          params.data_id = data.data_id || 0;
          //查询详细数据
          //SELECT meta_id,value FROM EntrustDetail WHERE entrust_id =$p1;
          var sData = "[Q]447{" + params.entrust_id + "}" + ROWSPLIT_vob + TableType;
          AjaxHelper.QueryExec_fob(sData, function (res) {
            if (res.data.length > 0) {
              viewdatas = testprocess.GetMetaValue_fob(res.data);
            }
            viewdatas.back_reason = data.back_reason;
            //2
            entrust_data_helper.showModel_fob(viewdatas, params, testprocess, tableName);
          }, function (e, m) {
            console.log(e, m);
            layer.msg('详细条目获取失败,无法查看委托');
          }, true);
        } else if (obj1.event == 'deleteorder') {
          //3
          entrust_data_helper.delModel_fob(obj, data, testprocess, tableName);
        } else if (obj1.event == 'view') {

          var sData = '[Q]915{' + data.entrust_id + '}' + ROWSPLIT_vob + TableType;
          AjaxHelper.QueryExec_fob(sData, function (res) {
            if (res.data.length > 0) {
              var link = gtConfig_fob.ReportImageUrl + "/" + res.data[0].value;
              window.open(link);
              return;
            } else {
              layer.msg("材质单并未上传");
              return;
            }
          }, function (e, m) {
            layer.msg("发送失败");
          }, false);

        } else if (obj1.event == 'back') {
          entrust_data_helper.backModel_fob(obj, data, testprocess, tableName);

        } else if (obj1.event == 'exportExcel') {
          ExportData_fob.entrustPrint_fob(data.object_id, data.entrust_id);
        }
      });

    }
  },
  showModel_fob: function (viewdatas, params, testprocess, tableName) {
    var title;
    switch (params.action) {
      case 1:
        title = '新建委托';
        break;
      case 2:
        title = '编辑委托';
        break;
      case 3:
        title = '查看委托';
        break;
      case 4:
        title = '受理委托';
        break;
    }
    console.log(viewdatas);
    layui.testingform(this.id).render(viewdatas, params).done(function (html, dict) {
      layui.use(['admin', 'laydate', 'upload', 'layer', 'view', 'table', 'form'], function () {
        var $ = layui.$
          , laydate = layui.laydate
          , layer = layui.layer
          , view = layui.view
          , table = layui.table
          , form = layui.form
          , admin = layui.admin
          , upload = layui.upload;
        var btns = [];
        if (title == '受理委托') {
          btns = ['受理', '退回', '关闭',];
        } else {
          btns = ['确认', '取消'];
        }
        //受理委托
        function Acceptance(data, index) {
          if (params.action < 3) { //这是增加和修改
            var field = data.field; //获取提交的字段
            layer.confirm('确定信息无误,提交吗？', function (ind) {
              layer.close(ind);
              //查询委托编号是否已经存在 
              //SELECT order_id FROM EntrustData WHERE entrust_id !=$p1 AND order_id=$p2;
              var sData = "[Q]446{" + params.entrust_id + UNITSPLIT_vob + field['item_100000'] + "}" + ROWSPLIT_vob + TableType;
              AjaxHelper.QueryExec_fob(sData, function (res) {
                if (res.data.length > 0) {
                  layer.alert('委托编号重复,请修改委托编号后保存!');
                  //$($(data.elem)[0].children[0]).removeClass("layui-icon-loading");
                }
                else {
                  //先把输入的内容存入localstorage中    
                  testprocess.SaveLocalStorage_fob(params.org_pid, field, dict);
                  testprocess.SaveEntrustOrder_fob(field, dict, params, index, data.elem, tableName);
                }
              }, function (e, m) {
                console.log(e, m);
                //$($(data.elem)[0].children[0]).removeClass("layui-icon-loading");
              }, true);
            });
          }
          else if (params.action == 4) { //受理委托
            debugger;
            var field = data.field; //获取提交的字段
            layer.confirm('一旦受理将无法撤销,确定受理么?', function (ind) {
              layer.close(ind);
              //查询委托编号是否已经存在 
              //SELECT order_id FROM EntrustData WHERE entrust_id !=$p1 AND order_id=$p2;
              var sData = "[Q]446{" + params.entrust_id + UNITSPLIT_vob + field['item_100000'] + "}" + ROWSPLIT_vob + TableType;
              AjaxHelper.QueryExec_fob(sData, function (res) {
                if (res.data.length > 0) {
                  layer.alert('试验台账中有委托编号重复,请修改此委托编号后保存!');
                  $($(data.elem)[0].children[0]).removeClass("layui-icon-loading");
                }
                else {
                  //先把输入的内容存入localstorage中                        
                  testprocess.SaveLocalStorage_fob(params.org_pid, field, dict);
                  testprocess.SaveTestOrder_fob(field, dict, params, index, data.elem, "EntrustData-table");
                }
              }, function (e, m) {
                console.log(e, m);
                //$($(data.elem)[0].children[0]).removeClass("layui-icon-loading");
              }, true);
            });
          }
          else { //查看 3
            layer.close(index);
            //$($(data.elem)[0].children[0]).removeClass("layui-icon-loading");
          }
        }
        //layer success 绑定事件
        function successcall(layero, index) {
          // var elemClose = $('<i class="layui-icon" close>&#x1006;</i>');
          // layero.append(elemClose);
          // elemClose.on('click', function () {
          //   layer.close(index);
          // });
          form.render(null, 'DynamicData-form');
          //监听提交
          form.on('submit(DynamicData-form-submit)', function (data) {
            // if ($($(data.elem)[0].children[0]).hasClass("layui-icon-loading")) {
            //   return;
            // }
            // $($(data.elem)[0].children[0]).addClass("layui-icon-loading");

            Acceptance(data, index);
          });

          layero.find('#DynamicData-form-cancel').on('click', function () {
            layer.close(index);
          });
        }
        layer.open({
          type: 1
          , title: title
          , area: ['680px', '650px']
          , content: html
          , id: 'LAY-system-view-popup'
          , skin: 'layui-layer-admin'
          , shadeClose: false
          , closeBtn: false
          , closeBtn: false
          , btn: btns
          , skin: 'layui-layer-molv'
          , btnAlign: 'r'
          , yes: function (index, layero) {
            $("#DynamicData-form-submit").click();
          }
          , btn2: function (index, layero) {
            if (title === '受理委托') {
              let data = {};
              data.entrust_id = params.entrust_id;
              entrust_data_helper.backModel_fob('', data, testprocess, tableName, index);
            } else {
              layer.close(index);
            }
            return false;
          }, btn3: function (index, layero) {
            layer.close(index);
          }
          , success: function (layero, index) {
            successcall(layero, index);
          }
        });
      });

    });
  },
  backModel_fob: function (obj, data, testprocess, tableName, indexUpper) {
    layui.use(['admin', 'laydate', 'upload', 'layer', 'view', 'table', 'form'], function () {
      var $ = layui.$
        , laydate = layui.laydate
        , layer = layui.layer
        , view = layui.view
        , table = layui.table
        , form = layui.form
        , admin = layui.admin
        , upload = layui.upload;
      admin.popup({
        title: '委托单退回'
        , area: ['650px', '300px']
        , id: 'LAY-popup-Back-form'
        , success: function (layero, index) {
          view(this.id).render('materialtest/Backform', data).done(function () {
            form.render(null, 'Back-form');
            //监听提交
            form.on('submit(Back-form-submit)', function (data) {
              var field = data.field; //获取提交的字段
              //layer.msg(field.back_reason+"----"+field.entrust_id);
              //组织语句进行提交
              //UPDATE Personnel set org_id = $p1,org_pid = $p2,name = $p3,sex = $p4,birthday = $p5,education = $p6,major = $p7,school = $p8,graduate_date = $p9,politics = $p10,title = $p11,title_image = $p12,marital_state = $p13,native_place = $p14,id_no = $p15,card_image = $p16,photo = $p17,handwriting = $p18,contract_no = $p19,contract_image = $p20,entry_date = $p21,work_date = $p22,duty = $p23,auth_cert = $p24,start_date = $p25,user_id = $p26,user_name = $p27,password = $p28,nick_name = $p29,head_con = $p30,mobile = $p31,telephone = $p32,e_mail = $p33,qq = $p34,wechat = $p35,open_id = $p36,pwd_question = $p37,pwd_answer = $p38,allow_startme = $p39,allow_endtime = $p40,lock_start_date = $p41,lock_end_date = $p42,enabled_mark = $p43,delete_mark = $p44,description = $p45 WHERE person_id=$p46;
              var sData = "[Q]874{" + field.entrust_id + UNITSPLIT_vob + field.back_reason + "}" + ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType;

              AjaxHelper.ExecSql_fob(sData, function (res) {
                if (res > 0) {
                  layui.table.reload(tableName); //重载表格
                  layer.close(index); //执行关闭
                  if (typeof indexUpper != 'undefined') {
                    layer.close(indexUpper);
                  }
                  layer.msg("退回成功");
                } else {
                  layer.msg("退回失败");
                }
              }, function (e, m) {
                layer.msg("退回失败");
              });
            });
            layero.find('#Back-form-cancel').on('click', function () {
              layer.close(index);
            });
          });
        }
      });
    });
  },
  delModel_fob: function (obj, data, testprocess, tableName) {
    layer.confirm('确定删除此委托么？', function (index) {
      //DELETE FROM EntrustData WHERE entrust_id =$p1 AND accepted=$p2;     
      var sData = "[Q]444{" + data.entrust_id + UNITSPLIT_vob + "0}" + ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType;
      AjaxHelper.ExecSql_fob(sData, function (res) {
        if (res > 0) {
          //DELETE FROM EntrustDetail WHERE entrust_id=$p1;
          sData = "[Q]445{" + data.entrust_id + UNITSPLIT_vob + "}" + ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType;
          AjaxHelper.ExecSql_fob(sData, function (res1) {
            debugger;
            if (res1 >= 0) {
              obj.del();//前端删除 减少一次服务器交互
              layer.close(index); //执行关闭 
              layer.msg("删除成功");
            }
            else {
              layer.msg("删除明细条目失败");
            }
          }, function (e, m) {
            layer.msg("删除明细条目失败");
          });
        } else {
          layer.msg("删除失败,请刷新列表检查此委托是否已经受理!");
        }
      }, function (e, m) {
        layer.close(index); //执行关闭 
        layer.msg("删除失败");
      });

    });
  }
}
var Supervise_proc_1 = {
  rule_id_fob: function (rule_id) {
    var list = rule_id.toString().split(',');
    var str = '';
    if (list.length < 2) {
      list.push(-1);
    }
    for (var i = 0; i < list.length; i++) {
      str = str + "'" + list[i] + "',";
    }
    if (str != '') {
      str = str.substring(0, str.length - 1);
    }
    return str;
  },
  table_fob: function (res) {
    var ssData = '';
    var json = {};
    for (var i = 0; i < res.data.length; i++) {
      var object = res.data[i];
      if (object.category == '') {
        object.category = '其他';
      }
      if (json.hasOwnProperty(object.category)) {
        json[object.category] = json[object.category] + object.description + ";";
      } else {
        json[object.category] = object.description + ";";
      }
    }
    for (var key in json) {
      var value = json[key].toString();
      if (key != '') {
        ssData = ssData + key + "-" + value.substring(0, value.length - 1) + "、";
      } else {
        ssData = ssData + value.substring(0, value.length - 1) + "、";
      }
    }
    if (ssData != '') {
      ssData = ssData.substring(0, ssData.length - 1);
    }
    return ssData;
  },
  detailed_fob: function (res) {
    var ssData = '';
    var json = {};
    var list = [];
    // for (var i = 0; i < res.data.length; i++) {
    // }
    try {
      return res.data;
    } catch (err) {
      console.log(err);
      return [];
    }


  },
  getRule_fob: function (rule_id, successcall) {
    var str = Supervise_proc_1.rule_id_fob(rule_id);
    var sData = '[Q]836{' + str + '}' + ROWSPLIT_vob + TableType;
    console.log(sData)
    var ssData = '';
    AjaxHelper.QueryExec_fob(sData, function (res) {
      ssData = successcall(res);
    }, function (e) {
      layer.msg('查询出错');
    }, false)
    return ssData;
  }
}
var RetainSample_helper = {
  RetainSample: function (obj, tableName) {
    var data = obj.data;

    layui.use(['admin', 'laydate', 'upload', 'layer', 'view', 'table', 'form'], function () {
      var $ = layui.$
        , laydate = layui.laydate
        , layer = layui.layer
        , view = layui.view
        , table = layui.table
        , form = layui.form
        , admin = layui.admin
        , upload = layui.upload;
      function check(field) {
        var sError = "";
        if (field.location.toString().length > 64 / 2) {
          sError += "放置位置长度应小于32、";//
        }
        if (field.proc_type.toString().length > 128 / 2) {
          sError += "样品处理方式长度应小于64、";//
        }
        if (field.proc_desc.toString().length > 128 / 2) {
          sError += "样品处理描述应小于64、";//quantity
        }
        if (field.sample_id.toString().length > 128 / 2) {
          sError += "样品编号描述应小于64、";//quantity
        }
        if (field.customer_id == '') {
          sError += "未选择客户、";//quantity
        }
        if (sError != "") {
          sError = sError.substring(0, sError.length - 1);
        }
        return sError;
      }
      if (obj.event == 'retain') {
        admin.popup({
          title: '留样管理'
          , area: ['750px', '350px']
          , id: 'LAY-popup-RetainSample-form'
          , success: function (layero, index) {
            var data1 = data;
            data1.test_person = data.test_name;//设置留样人
            view(this.id).render('MaterialTesting/RetainSampleform', data1).done(function () {
              form.render(null, 'RetainSample-form');
              //监听提交
              //fnSetPerson("#test_person", layui.$("#test_person_def").val());
              form.on('submit(RetainSample-form-submit)', function (data) {
                var field = data.field; //获取提交的字段
                console.log("field", field);
                field = js_common.trim_fob(field);
                var sError = check(field);
                if (sError != '') {
                  layer.msg(sError);
                  return;
                }
                field.test_person = layui.setter.DESHelper.UserInfo_fob().name;//data1.test_name;
                //debugger
                var org_id = data1.lab_id;// layui.setter.DESHelper.UserInfo_fob().org_pid;
                //组织语句进行提交
                //UPDATE RetainSample set data_id = $p1,                     org_id = $p2,                  test_person = $p3,                  keep_time = $p4,                  location = $p5,                  sample_id = $p6,                  customer_id = $p7,                  proc_type = $p8,                  proc_desc = $p9,                  attachment = $p10,                 print_time = $p11,                reserved_day = $p12 WHERE           keep_id=$p13;
                var sData = "";
                customer_id = "";
                if (field.keep_id == '') {
                  //INSERT INTO RetainSample(data_id,org_id,test_person,keep_time,location,sample_id,customer_id,proc_type,proc_desc,attachment,print_time,reserved_day, object_id, reason)VALUES($p1,$p2,$p3,$p4,$p5,$p6,$p7,$p8,$p9,$p10,$p11,$p12,$p13,$p14);select @@Identity
                  sData = "[Q]33{" + field.data_id + UNITSPLIT_vob + org_id + UNITSPLIT_vob + field.test_person + UNITSPLIT_vob + field.keep_time + UNITSPLIT_vob + field.location + UNITSPLIT_vob + field.sample_id + UNITSPLIT_vob + customer_id + UNITSPLIT_vob + field.proc_type + UNITSPLIT_vob + field.proc_desc + UNITSPLIT_vob + field.attachment + UNITSPLIT_vob + field.print_time + UNITSPLIT_vob + field.reserved_day + UNITSPLIT_vob + UNITSPLIT_vob + "}" + ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType;;
                } else {
                  sData = "[Q]41{" + field.data_id + UNITSPLIT_vob + org_id + UNITSPLIT_vob + field.test_person + UNITSPLIT_vob + field.keep_time + UNITSPLIT_vob + field.location + UNITSPLIT_vob + field.sample_id + UNITSPLIT_vob + customer_id + UNITSPLIT_vob + field.proc_type + UNITSPLIT_vob + field.proc_desc + UNITSPLIT_vob + field.attachment + UNITSPLIT_vob + field.print_time + UNITSPLIT_vob + field.reserved_day + UNITSPLIT_vob + field.keep_id + "}" + ROWSPLIT_vob + AffectRows + ROWSPLIT_vob + TableType;
                }
                console.log(sData);
                AjaxHelper.ExecSql_fob(sData, function (res) {
                  if (res > 0) {
                    layui.table.reload(tableName); //重载表格
                    layer.close(index); //执行关闭 
                    layer.msg("修改成功");
                  } else {
                    layer.msg("修改失败");
                  }
                }, function (e, m) {
                  layer.msg("修改失败");
                });
              });
              layero.find('#moudel-form-cancel').on('click', function () {
                layer.close(index);
              });
            });
          }
        });
      }

    })
  }

}
var layui_helper = {
  //设置layui datatable的某一行的颜色
  //TabDivId:tab id id;RowIndex:行序列号，从0开始；ColorString：颜色字符串，如'#123456'
  Layui_SetDataTableRowColor: function (TabDivId, RowIndex, style, cu_class) {
    try {
      var div = layui.$(TabDivId);

      if (div != null) { //找到对象了
        div = div.parent()[0];
        if (div) {
          var table_main = div.getElementsByClassName('layui-table-main');  //通过class获取table_main

          if (table_main != null && table_main.length > 0) {
            var table = table_main[0].getElementsByClassName('layui-table');  //通过class获取table

            if (table != null && table.length > 0) {
              var trs = table[0].querySelectorAll("tr");

              if (trs != null && trs.length > 0) {
                //console.log(trs[RowIndex]);
                if (style) {
                  if (style.background_color) {
                    trs[RowIndex].style.backgroundColor = style.background_color;
                  }
                  if (style.ColorString) {
                    trs[RowIndex].style.color = style.ColorString;
                  }
                  if (style.fontWeight) {
                    trs[RowIndex].style.fontWeight = style.fontWeight;
                  }
                }
                if (cu_class) {
                  layui.$(trs[RowIndex]).addClass(cu_class);
                }

              }
            }
          }
        }


      }
    }
    catch (e) {
      console.log(e.message);
    }
  }
  , destroy: function (id) {
    elemTemp = layui.$(id);
    var key = elemTemp.attr('lay-key');
    if (key) {
      // 如果打开着就给关掉
      layui.$('#layui-laydate' + key).remove();
    }
    // copy 当前的节点
    var nodeClone = elemTemp.clone(true);
    // 替换节点 去掉lay-key方便后面重新render
    elemTemp.replaceWith(nodeClone.attr('lay-key', null));
  }, resizeLayer: function (layerIndex, layerInitWidth, layerInitHeight) {
    var docWidth = $(document).width();
    var docHeight = $(document).height();
    var minWidth = layerInitWidth > docWidth ? docWidth : layerInitWidth;
    var minHeight = layerInitHeight > docHeight ? docHeight : layerInitHeight;
    console.log("doc:", docWidth, docHeight);
    console.log("lay:", layerInitWidth, layerInitHeight);
    console.log("min:", minWidth, minHeight);
    layer.style(layerIndex, {
      top: 0,
      width: minWidth,
      height: minHeight
    });
  }, resize_listener: function () {
    window.onresize = function () {
      layui.each(layui.$('.layui-layer'), function (_, item) {
        let id = item.id;
        let height = 300;
        let width = 300;
        try {
          if (layer.open_list['layer_' + id.replace('layui-layer', '')]) {
            let config = layer.open_list['layer_' + id.replace('layui-layer', '')]
            let config_Height = -1;
            let config_Width = -1;
            if (config.maxHeight) {
              if (typeof config.maxHeight == 'string' && config.maxHeight.indexOf('%') >= 0) {
                try {
                  config_Height = layui.$(window).height() * Number(config.maxHeight.replace("%", "")) / 100;
                } catch (e) {
                  console.log(e);
                }

              }
              else if (typeof config.maxHeight != 'number') {
                let str = config.maxHeight + '';
                config_Height = Number(str.replace(/[^\d]/g, ''));
              } else {
                config_Height = Number(config.maxHeight);
              }
            } else {
              config_Height = Number(config.height.replace(/[^\d]/g, ''));
            }
            if (config.maxWidth) {
              if (typeof config.maxWidth == 'string' && config.maxWidth.indexOf('%') >= 0) {
                try {
                  config_Width = layui.$(window).width() * Number(config.maxWidth.replace("%", "")) / 100;
                } catch (e) {
                  console.log(e);
                }

              }
              else if (typeof config.maxWidth != 'number') {
                let str = config.maxWidth + '';
                config_Width = Number(str.replace(/[^\d]/g, ''));
              } else {
                config_Width = Number(config.maxWidth);
              }
            } else {
              config_Width = Number(config.width.replace(/[^\d]/g, ''));
            }
            if (layui.$(window).height() > config_Height && config_Height != -1) {
              height = config_Height;
            } else {
              height = layui.$(window).height();
            }
            if (layui.$(window).width() > config_Width && config_Width != -1) {
              width = config_Width;
            } else {
              width = layui.$(window).width();
            }
            layer.style(Number(id.replace('layui-layer', '')), {
              width: width,
              height: height
            });
          }

        } catch (e) {
          console.log(e);
        }



        //$(this).blur();
      })
    }
  }, progress_open: function (time) {
    let op_time = 1000 * 100;
    if (time) {
      op_time = time;
    }
    return layer.open({
      type: 1,
      title: false,
      area: [js_common.fnTable1Width(640) + 'px', js_common.fnTable1Height(18) + 'px'],
      closeBtn: 0,
      shadeClose: false,
      time: op_time,
      resize: false,
      move: false,
      id: 'progress',
      success: function (layero, index) {
        layui.view(this.id).render('../../views/layer/progress').done(function () {

        })
      }
    })
  }, input_select_fob: function (select_id, value) {
    layui.use(["form"], function () {
      var $ = layui.$,
        form = layui.form;
      $(select_id).val(value);
      form.render();
      //$(select_id).next().find("dl").css({ "display": "block" });
      var dl = $(select_id).next().find("dl").children();
      var j = -1;
      for (var i = 0; i < dl.length; i++) {
        if (dl[i].innerHTML.indexOf(value) <= -1) {
          dl[i].style.display = "none";
          j++;
        }

      }
      if (j == dl.length - 1) {
        $(select_id).next().find("dl").removeClass("layui-form-select-block");
        //$(select_id).next().find("dl").addClass("layui-form-select-hidden");
      } else {
        // $(select_id).next().find("dl").removeClass("layui-form-select-hidden");
        $(select_id).next().find("dl").addClass("layui-form-select-block");
      }
    })

  }, input_select_dl_show_fob: function (dl_list) {
    for (var i = 0; i < dl_list.length; i++) {
      dl_list[i].style.display = 'block';

    }
  }
}
//乘法函数
function accMul(arg1, arg2) {

  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();

  try {
    m += s1.split(".")[1].length;
  } catch (e) { }
  try {
    m += s2.split(".")[1].length;
  } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
//给Number类型增加一个mul方法，使用时直接用 .mul 即可完成计算。 
Number.prototype.mul = function (arg) {
  return accMul(arg, this);
};
//除法函数 
function accDiv(arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) { }
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) { }
  //with (Math) {//关于js中with关键字的使用请查看链接 http://luopq.com/2016/02/14/js-with-keyword/
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
  //}
} //给Number类型增加一个div方法，使用时直接用 .div 即可完成计算。 
Number.prototype.div = function (arg) {
  return accDiv(this, arg);
};
// 修改toFixed方法，由原本的四舍六入五成双，改为四舍五入
Number.prototype.toFixeds = function (s) {
  changenum = (parseInt(this.mul(Math.pow(10, s) + 0.5)).div(Math.pow(10, s))).toString();
  index = changenum.indexOf(".");
  if (index < 0 && s > 0) {
    changenum = changenum + ".";
    for (i = 0; i < s; i++) {
      changenum = changenum + "0";
    }
  } else {
    index = changenum.length - index;
    for (i = 0; i < (s - index) + 1; i++) {
      changenum = changenum + "0";
    }
  }
  return changenum;
}
String.prototype.format = function (args) {
  var result = this;
  if (arguments.length > 0) {
    if (arguments.length == 1 && typeof (args) == "object") {
      for (var key in args) {
        if (args[key] != undefined) {
          var reg = new RegExp("({" + key + "})", "g");
          result = result.replace(reg, args[key]);
        }
      }
    }
    else {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
          var reg = new RegExp("({)" + i + "(})", "g");
          result = result.replace(reg, arguments[i]);
        }
      }
    }
  }
  return result;
}
/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}