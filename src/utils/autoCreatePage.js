import {
  QueryExec,
  ExecSql
} from '@/api/table'
import JSZip from 'jszip'

export function createAndDownloadFile(zip,fileName, content) {
  zip.file(fileName, content);

}

export function autoSqlCreate(maindata,tabledata,isPage) {
  let sql = {}
  sql.sqlquery = autoQuerySqlCreate(maindata.tablename,tabledata,isPage)
  for(let i=0;i<maindata.operate.length;i++)
  {
    console.log(maindata.operate[i])
    if(maindata.operate[i]==='添加')
    {
      sql.sqladd = autoAddSqlCreate(maindata.tablename,tabledata);
    }
    else if(maindata.operate[i]==='修改') {
      sql.sqledit = autoEditSqlCreate(maindata.tablename,tabledata);
    }
    else if(maindata.operate[i]==='删除') {
      sql.sqldel = autoDelSqlCreate(maindata.tablename,tabledata)
    }
  }
  return sql;
}

function autoQuerySqlCreate(tablename,tabledata,isPage) {
  let count=0;
  let mainkey='',searchstr='';
  let sqlquery = "SELECT COUNT(*) OVER(PARTITION BY'') AS Total,"
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].isDisplay==='1' || tabledata[i].isDisplay==='2') {
      if(tabledata[i].formatway && tabledata[i].formatway!=='') {
        sqlquery=sqlquery+tabledata[i].formatway
      }
      else {
        sqlquery=sqlquery+tablename+'.'+tabledata[i].field
      }
      sqlquery=sqlquery+','
    }
  }
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].displayIsFromTable && tabledata[i].displayIsFromTable!=='') {
       sqlquery=sqlquery+tabledata[i].displayIsFromTable+'.'+tabledata[i].tablefieldname+' as '+tabledata[i].customfieldname+','
    }
  }
  sqlquery=sqlquery.substr(0,sqlquery.length-1)
  sqlquery=sqlquery+' FROM '+tablename;
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].displayIsFromTable && tabledata[i].displayIsFromTable!=='') {
       sqlquery=sqlquery+' LEFT JOIN '+tabledata[i].displayIsFromTable+' ON '+tablename+'.'+tabledata[i].field+'='
       +tabledata[i].displayIsFromTable+'.'+tabledata[i].tablefieldid
    }
  }
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].issearch==='1') {
      searchstr=searchstr+tabledata[i].field+'=$p'+(count+1).toString()+'~ ~and ';
      count++
    }
    else if(tabledata[i].issearch==='2') {
      searchstr=searchstr+tabledata[i].field+' LIKE $p'+(count+1).toString()+'~ ~and ';
      count++
    }
  }
  if(count>0)
  {
    searchstr=searchstr.substr(0,sqlquery.length-4)
    sqlquery=sqlquery+' WHERE 1=1 ~and ' + searchstr +'~ ';

  }

  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].mainkey==='1') {
      mainkey = tabledata[i].field;
    }
  }
  if(mainkey.length>0)
  {
    sqlquery=sqlquery+' ORDER BY '+mainkey+' ASC'
  }

  if(isPage==='1')
  {
    sqlquery=sqlquery+' OFFSET $pp'+(count+1).toString()+' ROWS FETCH NEXT $pp'+(count+2).toString()+' ROWS ONLY;';
  }
  return sqlquery;
}

function autoAddSqlCreate(tablename,tabledata) {
  let count=0;
  let sqladd = 'INSERT INTO '+tablename+'('
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].isAdd==='1') {
      sqladd=sqladd+tabledata[i].field+','
      count++
    }
  }
  sqladd=sqladd.substr(0,sqladd.length-1)
  sqladd=sqladd+') VALUES(';
  for(let i=1;i<=count;i++)
  {
    sqladd=sqladd+'$p'+i.toString()+',';
  }
  sqladd=sqladd.substr(0,sqladd.length-1)
  sqladd=sqladd+');SELECT @@Identity;'
  return sqladd;
}

function autoEditSqlCreate(tablename,tabledata) {
  let count=0;
  let mainkey='';
  let sqledit = 'UPDATE '+tablename+' SET '
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].isEdit==='1') {
      sqledit=sqledit+tabledata[i].field+'=$p'+((count+1).toString())+','
      count++
    }
    if(tabledata[i].mainkey==='1') {
      mainkey = tabledata[i].field;
    }
  }
  sqledit=sqledit.substr(0,sqledit.length-1)
  sqledit = sqledit+' WHERE '+mainkey+'=$p'+(count+1).toString()+';SELECT @@Identity;'
  return sqledit;
}

function autoDelSqlCreate(tablename,tabledata) {
  let count=0;
  let mainkey='';
  let sqldel = 'DELETE FROM '+tablename+' WHERE '
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].mainkey==='1') {
      sqldel=sqldel+tabledata[i].field+'=$p'+(i+1).toString()+' and '
    }
  }
  sqldel=sqldel.substr(0,sqldel.length-4)
  sqldel = sqldel+';SELECT @@Identity;'
  return sqldel;
}

function mainHtmlPageCreate(maindata,tabledata,formdata) {
  let htmlstr="<template> \n"
  htmlstr=htmlstr+'  <div class="definition purchase contract equipment_btn calc"> \n'
  htmlstr=htmlstr+'    <el-tabs type="border-card" class="box_center" style="height: calc(100vh)"> \n'
  htmlstr=htmlstr+addTabPageCreate(maindata,tabledata,formdata)
  htmlstr=htmlstr+tableTabPageCreate(maindata,tabledata,formdata)

  htmlstr=htmlstr+'		 </el-tabs> \n'
  htmlstr=htmlstr+'  </div> \n'
  htmlstr=htmlstr+'</template> \n'
  return htmlstr;
}

function mainHtmlPageCreateMuti(maindatalist,tabledatalist,formdatalist) {
  let htmlstr="<template> \n"
  htmlstr=htmlstr+'  <div class="definition purchase contract equipment_btn calc"> \n'
  htmlstr=htmlstr+'    <el-tabs type="border-card" class="box_center" style="height: calc(100vh)"> \n'
  htmlstr=htmlstr+addTabPageCreate(maindatalist.main,tabledatalist[0],formdatalist[0])
  htmlstr=htmlstr+tableTabPageCreateMuti(maindatalist,tabledatalist,formdatalist)

  htmlstr=htmlstr+'		 </el-tabs> \n'
  htmlstr=htmlstr+'  </div> \n'
  htmlstr=htmlstr+'</template> \n'
  return htmlstr;
}

function mainVuePageCreate(maindata,tabledata,formdata,formdatalist) {
  let htmlstr=" \n"
  let searchdatalist = getSearchData(maindata,tabledata,formdata)
  htmlstr=htmlstr+"<script> \n"
  htmlstr=htmlstr+"  import "+formdata.pageNameTitle+"Table from '../table/"+formdata.pageNameTitle+"Table.vue' \n"
  for(let i=1;i<formdatalist.length;i++)
  {
    htmlstr=htmlstr+"  import "+formdatalist[i].pageNameTitle+"Table from '../table/"+formdatalist[i].pageNameTitle+"Table.vue' \n"
  }

  htmlstr=htmlstr+"  import "+formdata.pageNameTitle+"Form from '../form/"+formdata.pageNameTitle+"Form.vue' \n"

  htmlstr=htmlstr+"  export default { \n"
  htmlstr=htmlstr+"    name: '"+formdata.pageNameTitle+"', \n"
  htmlstr=htmlstr+"    components: { \n"
  htmlstr=htmlstr+"      "+formdata.pageNameTitle+"Table,  \n"
  for(let i=1;i<formdatalist.length;i++)
  {
     htmlstr=htmlstr+"      "+formdatalist[i].pageNameTitle+"Table,  \n"
  }
  htmlstr=htmlstr+"      "+formdata.pageNameTitle+"Form \n"
  htmlstr=htmlstr+"    }, \n"
  htmlstr=htmlstr+"    data() { \n"
  htmlstr=htmlstr+"      return { \n"
  htmlstr=htmlstr+"        primary_key: -1, \n"
  htmlstr=htmlstr+"        search: { \n"
  htmlstr=htmlstr+"          main: { \n"
  for(let i=0;i<searchdatalist.length;i++)
  {
    if(searchdatalist[i].fieldtype==='int')
    {
      htmlstr=htmlstr+"            "+searchdatalist[i].field+": 0, \n"
    }
    else {
      htmlstr=htmlstr+"            "+searchdatalist[i].field+": '', \n"
    }
  }
  htmlstr=htmlstr+"          }, \n"
  htmlstr=htmlstr+"        }, \n"
  htmlstr=htmlstr+"        permission: { \n"
  htmlstr=htmlstr+"          person_role: false, \n"
  htmlstr=htmlstr+"          self: false, \n"
  htmlstr=htmlstr+"        }, \n"
  htmlstr=htmlstr+"      } \n"
  htmlstr=htmlstr+"    }, \n"
  htmlstr=htmlstr+"    created() { \n"
  htmlstr=htmlstr+"      this.init() \n"
  htmlstr=htmlstr+"    }, \n"
  htmlstr=htmlstr+"    beforeDestroy() {}, \n"
  htmlstr=htmlstr+"    mounted: function() {}, \n"
  htmlstr=htmlstr+"    methods: { \n"
  htmlstr=htmlstr+"      async init() { \n"
  htmlstr=htmlstr+"        let permissionList = ['"+formdata.pagePermission+"']; \n"
  htmlstr=htmlstr+"        let permission = ''; \n"
  htmlstr=htmlstr+"        for (let i = 0; i < permissionList.length; i++) { \n"
  htmlstr=htmlstr+"          permission = await this.$store.dispatch( \n"
  htmlstr=htmlstr+"            'permission/GetALLPermissionByModel', \n"
  htmlstr=htmlstr+"            permissionList[i], \n"
  htmlstr=htmlstr+"          ) \n"
  htmlstr=htmlstr+"          if (permission) { \n"
  htmlstr=htmlstr+"            this.permission = Object.assign(this.permission, permission) \n"
  htmlstr=htmlstr+"          } \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        await this.fetchData() \n"
  htmlstr=htmlstr+"        //await this.getTableData() \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      async fetchData() { \n"
  htmlstr=htmlstr+"        this.$refs['"+formdata.pageNameTitle+"Table'].fetchData() \n"
  for(let i=1;i<formdatalist.length;i++)
  {
    htmlstr=htmlstr+"        this.$refs['"+formdatalist[i].pageNameTitle+"Table'].fetchData() \n"
  }
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"    }, \n"
  htmlstr=htmlstr+"  } \n"
  htmlstr=htmlstr+"</script> \n"
  return htmlstr;
}

function tableHtmlCreate(maindata,tabledata,formdata) {
  let htmlstr="<template> \n"
  htmlstr = htmlstr + '  <div class="draftPageHigh"> \n'
  htmlstr = htmlstr + '    <el-table ref="branchInstitutions" v-loading="listLoading" :data="tablelist" border \n'
  htmlstr = htmlstr + '      :element-loading-text="elementLoadingText" highlight-current-row :height="height" \n'
  htmlstr = htmlstr + '      :header-cell-style="{ background: '+"'#e8f0ff'"+' }" @selection-change="setSelectRows" \n'
  htmlstr = htmlstr + '      @sort-change="tableSortChange" @row-click="rowClick"> \n'
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].isDisplay==='1')
    {
      htmlstr = htmlstr + '      <el-table-column show-overflow-tooltip label="'+tabledata[i].fieldname+'" prop="'+tabledata[i].field+'" min-width="'+tabledata[i].widthnum+'"></el-table-column> \n'
    }
  }
  htmlstr = htmlstr + '      <el-table-column show-overflow-tooltip label="操作" width="55px" align="center" fixed="right"> \n'
  htmlstr = htmlstr + '        <template #default="scope"> \n'
  htmlstr = htmlstr + '          <el-dropdown trigger="click" placement="left-start"> \n'
  htmlstr = htmlstr + '            <el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button> \n'
  htmlstr = htmlstr + '            <el-dropdown-menu slot="dropdown"> \n'
  htmlstr = htmlstr + '              <el-dropdown-item @click.native="handleCommand('+"'view'"+', scope.$index, scope.row)">详情</el-dropdown-item> \n'
  for(let i=0;i<maindata.operate.length;i++)
  {
    if(maindata.operate[i]==='添加')
    {
      htmlstr = htmlstr + '              <el-dropdown-item @click.native="handleCommand('+"'add'"+', scope.$index, scope.row)">添加</el-dropdown-item> \n'
    }
    else if(maindata.operate[i]==='修改') {
      htmlstr = htmlstr + '              <el-dropdown-item @click.native="handleCommand('+"'edit'"+', scope.$index, scope.row)">修改</el-dropdown-item> \n'
    }
    else if(maindata.operate[i]==='删除') {
      htmlstr = htmlstr + '              <el-dropdown-item @click.native="handleCommand('+"'del'"+', scope.$index, scope.row)">删除</el-dropdown-item> \n'
    }
  }
  htmlstr = htmlstr + '            </el-dropdown-menu> \n'
  htmlstr = htmlstr + '          </el-dropdown> \n'
  htmlstr = htmlstr + '        </template> \n'
  htmlstr = htmlstr + '      </el-table-column> \n'
  htmlstr = htmlstr + '    </el-table> \n'
  if(formdata.isPage==='1')
  {
    htmlstr = htmlstr + '    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"	:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"@size-change="handleSizeChange"></el-pagination> \n'
  }
  htmlstr = htmlstr + '  </div> \n'
  htmlstr = htmlstr + '</template> \n'
  return htmlstr;
}

function tableVueCreate(maindata,tabledata,formdata) {
  let htmlstr="<script> \n"
  htmlstr=htmlstr+"  import { treePaging	} from '@/global/form.helper' \n"
  htmlstr=htmlstr+"  import { QueryExec } from '@/api/table' \n"
  htmlstr=htmlstr+"  import { mapGetters	} from 'vuex' \n"
  htmlstr=htmlstr+"  import { hasPermission } from '@/utils/permission' \n"
  htmlstr=htmlstr+"  import "+formdata.pageNameTitle+"Dialog from '../component/"+formdata.pageNameTitle+"Dialog' \n"
  htmlstr=htmlstr+"  export default { \n"
  htmlstr=htmlstr+"    name: '"+formdata.pageNameTitle+"Table', \n"
  htmlstr=htmlstr+"    components: { "+formdata.pageNameTitle+"Dialog, }, \n"
  htmlstr=htmlstr+"    props: { \n"
  htmlstr=htmlstr+"      type: {	type: Number,	default: 0, }, \n"
  htmlstr=htmlstr+"      primary_key: { type: Number, default: 0, }, \n"
  htmlstr=htmlstr+"      permission: { type: Object, default: function() { return {} }, }, \n"
  htmlstr=htmlstr+"      group_id: { type: Number, default: 0 }, \n"
  htmlstr=htmlstr+"      tablename: { type: String, default: '' }, \n"
  htmlstr=htmlstr+"    }, \n"
  htmlstr=htmlstr+"    provide() {	return { reload: this.fetchData, } }, \n"
  htmlstr=htmlstr+"    computed: { \n"
  htmlstr=htmlstr+"      ...mapGetters({ org_id: 'user/org_id',current_org_id: 'org/current_org',person_id: 'user/person_id',}), \n"
  htmlstr=htmlstr+"    }, \n"
  htmlstr=htmlstr+"    watch: { \n"
  htmlstr=htmlstr+"      primary_key(newVal, oldVal) { \n"
  htmlstr=htmlstr+"        if (this.type == 1 || this.type == 2 || this.type == 3) { \n"
  htmlstr=htmlstr+"          this.fetchData({ reload: 1, }) \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      main_dialog(newVal, oldVal) { \n"
  htmlstr=htmlstr+"        this.fetchData() \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      current_org_id() { \n"
  htmlstr=htmlstr+"        this.fetchData() \n"
  htmlstr=htmlstr+"      }, \n"
  let mainid='item_id';
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].mainkey) {
      mainid=tabledata[i].mainkey
    }
    else {
      mainid='main_id'
    }
  }

  htmlstr=htmlstr+"      rowClickData(newVal) { \n"
  htmlstr=htmlstr+"        if (newVal && newVal."+mainid+") { \n"
  htmlstr=htmlstr+"          switch (this.type) { \n"
  htmlstr=htmlstr+"            case 0: \n"
  htmlstr=htmlstr+"              this.$emit('update:primary_key', Number(newVal."+mainid+")); \n"
  htmlstr=htmlstr+"              break \n"
  htmlstr=htmlstr+"          } \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"      }, \n"

  htmlstr=htmlstr+"    }, \n"
  htmlstr=htmlstr+"    data() { \n"
  htmlstr=htmlstr+"      return { \n"
  htmlstr=htmlstr+"        height: 'calc(85%)', \n"
  htmlstr=htmlstr+"        main_dialog: false, \n"
  htmlstr=htmlstr+"        background: false, \n"
  htmlstr=htmlstr+"        listLoading: false, \n"
  htmlstr=htmlstr+"        tablelist: [], \n"
  htmlstr=htmlstr+"        elementLoadingText: '加载数据中', \n"
  htmlstr=htmlstr+"        queryForm: { group_id: 0, pageSize: 10, pageNo: 1, }, \n"
  htmlstr=htmlstr+"        tabledata: [], \n"
  htmlstr=htmlstr+"        layout: 'total, sizes, prev, next, jumper', \n"
  htmlstr=htmlstr+"        total: 0, \n"
  htmlstr=htmlstr+"        columnHideList: [], \n"
  htmlstr=htmlstr+"        rowClickData: {} \n"
  htmlstr=htmlstr+"      } \n"
  htmlstr=htmlstr+"    }, \n"
  htmlstr=htmlstr+"    created() { this.init() }, \n"
  htmlstr=htmlstr+"    methods: { \n"
  htmlstr=htmlstr+"      async init() { \n"
  htmlstr=htmlstr+"        this.role_max = await this.$store.dispatch('user/getRoleMax') \n"
  htmlstr=htmlstr+"        switch (this.type) { \n"
  htmlstr=htmlstr+"          case 0: \n"
  htmlstr=htmlstr+"            this.height = 'calc(85%)' \n"
  htmlstr=htmlstr+"            break \n"
  htmlstr=htmlstr+"          case 1: \n"
  htmlstr=htmlstr+"            this.height = 'calc(85%)' \n"
  htmlstr=htmlstr+"            break \n"
  htmlstr=htmlstr+"          case 3: \n"
  htmlstr=htmlstr+"            this.height = 'calc(85%)' \n"
  htmlstr=htmlstr+"            break \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      rowClick(row, col, event) { \n"
  htmlstr=htmlstr+"        this.rowClickData = row \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      clearChildren() { \n"
  let primaryKey = ''
  let primaryKeyList = getPrimayKey(tabledata)
  for(let i=0;i<primaryKeyList.length;i++)
  {
    primaryKey = primaryKey+primaryKeyList[i]+':-1,'
  }
  htmlstr=htmlstr+"        this.rowClickData = { "+primaryKey+" } \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      fencthRelod(row) { \n"
  htmlstr=htmlstr+"        if (!row) { \n"
  htmlstr=htmlstr+"          row = JSON.parse(JSON.stringify(this.rowClickData)) \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        this.clearChildren() \n"
  htmlstr=htmlstr+"        let that = this \n"
  htmlstr=htmlstr+"        setTimeout(() => { \n"
  htmlstr=htmlstr+"          that.rowClickData = row \n"
  htmlstr=htmlstr+"        }, 500) \n"
  htmlstr=htmlstr+"        this.fetchData({ \n"
  htmlstr=htmlstr+"          pageNo: this.queryForm.pageNo \n"
  htmlstr=htmlstr+"        }) \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      handleCommand(command, row) { \n"
  htmlstr=htmlstr+"        switch (command) { \n"
  htmlstr=htmlstr+"          case 'edit': \n"
  htmlstr=htmlstr+"            this.EditInfo(row) \n"
  htmlstr=htmlstr+"            break \n"
  htmlstr=htmlstr+"          case 'addChildren': \n"
  htmlstr=htmlstr+"            this.handleAddChild(row) \n"
  htmlstr=htmlstr+"            break \n"
  htmlstr=htmlstr+"          case 'delete': \n"
  htmlstr=htmlstr+"            this.handleDeletemodify(row) \n"
  htmlstr=htmlstr+"            break \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      ishasPermission(name, row) { \n"
  htmlstr=htmlstr+"        if (!name) { \n"
  htmlstr=htmlstr+"          if (this.dropdown.count[row.item_id]) { \n"
  htmlstr=htmlstr+"            this.dropdown.count[row.item_id]++ \n"
  htmlstr=htmlstr+"          } else { \n"
  htmlstr=htmlstr+"            this.dropdown.count[row.item_id] = 1 \n"
  htmlstr=htmlstr+"          } \n"
  htmlstr=htmlstr+"          return true \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        let permissionRegister = { \n"
  htmlstr=htmlstr+"          main_table: { \n"
  htmlstr=htmlstr+"            edit: 'sysDataGroupEdit', \n"
  htmlstr=htmlstr+"            delete: 'sysDataGroupDelete', \n"
  htmlstr=htmlstr+"            addChildren: 'sysDataGroupAdd', \n"
  htmlstr=htmlstr+"          } \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        let permission_name = '' \n"
  htmlstr=htmlstr+"        switch (name) { \n"
  htmlstr=htmlstr+"          default: \n"
  htmlstr=htmlstr+"            if (permissionRegister[this.type] && permissionRegister[this.type][name]) { \n"
  htmlstr=htmlstr+"              permission_name = permissionRegister[this.type][name] \n"
  htmlstr=htmlstr+"            } else { \n"
  htmlstr=htmlstr+"              permission_name = name \n"
  htmlstr=htmlstr+"            } \n"
  htmlstr=htmlstr+"            break \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        let flag = hasPermission(this.permission, permission_name) \n"
  htmlstr=htmlstr+"        let role_max = this.role_max \n"
  htmlstr=htmlstr+"        if (name == 'empty') { \n"
  htmlstr=htmlstr+"          if (!this.dropdown.count[row.item_id]) { \n"
  htmlstr=htmlstr+"            flag = true; \n"
  htmlstr=htmlstr+"          } \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        if (role_max == 'super_admin') { \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        let dropdowMenu = { \n"
  htmlstr=htmlstr+"          main_table: ['all'], \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        if (dropdowMenu[this.type]) { \n"
  htmlstr=htmlstr+"          let menu_list = dropdowMenu[this.type]; \n"
  htmlstr=htmlstr+"          if (menu_list.indexOf('all') >= 0) { \n"
  htmlstr=htmlstr+"          } else if (menu_list.indexOf(name) < 0) { \n"
  htmlstr=htmlstr+"            flag = false \n"
  htmlstr=htmlstr+"          } \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        if (!flag) { \n"
  htmlstr=htmlstr+"          return flag \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        switch (name) { \n"
  htmlstr=htmlstr+"          case 'addChildren': \n"
  htmlstr=htmlstr+"            if (row.nDeep > 0) { \n"
  htmlstr=htmlstr+"              flag = false \n"
  htmlstr=htmlstr+"            } \n"
  htmlstr=htmlstr+"            break \n"
  htmlstr=htmlstr+"          default: \n"
  htmlstr=htmlstr+"            flag = flag \n"
  htmlstr=htmlstr+"            break; \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        if (flag) { \n"
  htmlstr=htmlstr+"          switch (name) { \n"
  htmlstr=htmlstr+"            case 'empty': \n"
  htmlstr=htmlstr+"              break \n"
  htmlstr=htmlstr+"            default: \n"
  htmlstr=htmlstr+"              if (this.dropdown.count[row.item_id]) { \n"
  htmlstr=htmlstr+"                this.dropdown.count[row.item_id]++ \n"
  htmlstr=htmlstr+"              } else { \n"
  htmlstr=htmlstr+"                this.dropdown.count[row.item_id] = 1 \n"
  htmlstr=htmlstr+"              } \n"
  htmlstr=htmlstr+"              break \n"
  htmlstr=htmlstr+"          } \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"        return flag \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      EditInfo(row) { \n"
  htmlstr=htmlstr+"        this.handleAdd(row, undefined, undefined) \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      handleAdd(row, parent_info, disable) { \n"
  htmlstr=htmlstr+"        this.$refs['sysDataGroupDialog'].showEdit(row, parent_info, disable) \n"
  htmlstr=htmlstr+"      }, \n"
  primaryKey = ''
  for(let i=0;i<primaryKeyList.length;i++)
  {
    primaryKey = primaryKey+primaryKeyList[i]
  }
  htmlstr=htmlstr+"      handleDeletemodify(row) { \n"
  htmlstr=htmlstr+"        let that = this \n"
  htmlstr=htmlstr+"        let tips = '确定删除' + "+primaryKey+" \n"
  htmlstr=htmlstr+"        tips = tips + '?' \n"
  htmlstr=htmlstr+"        that.delete_from_fobEx(that, row, 661, { \n"
  htmlstr=htmlstr+"          'fetchData': 'fetchData', //加载数据 \n"
  htmlstr=htmlstr+"          'main_key': 'item_id', //主键 \n"
  htmlstr=htmlstr+"          'confirmMsg': tips, \n"
  htmlstr=htmlstr+"          'successMsg': '删除成功', \n"
  htmlstr=htmlstr+"        }) \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      handleCurrentChange(val) { \n"
  htmlstr=htmlstr+"        this.queryForm.pageNo = val \n"
  htmlstr=htmlstr+"        this.fetchData({pageNo: val,}) \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      handleSizeChange(val) { \n"
  htmlstr=htmlstr+"        this.queryForm.pageSize = val \n"
  htmlstr=htmlstr+"        this.fetchData({pageNo: this.queryForm.pageNo,}) \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      search(data) { \n"
  htmlstr=htmlstr+"        this.queryForm = Object.assign(data, this.queryForm) \n"
  htmlstr=htmlstr+"        this.fetchData() \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      fetchData(pageInfo, treeNode, resolve) { \n"
  htmlstr=htmlstr+"        let that = this \n"
  htmlstr=htmlstr+"        if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) { \n"
  htmlstr=htmlstr+"          this.queryForm.pageNo = pageInfo.pageNo \n"
  htmlstr=htmlstr+"        } else if (pageInfo) { \n"
  htmlstr=htmlstr+"          this.queryForm.pageNo = 1 \n"
  htmlstr=htmlstr+"        } else {} \n"
  htmlstr=htmlstr+"        switch (that.type) { \n"
  htmlstr=htmlstr+"          case 0: \n"
  htmlstr=htmlstr+"            that.fetchDataMain(pageInfo, treeNode, resolve) \n"
  htmlstr=htmlstr+"            break \n"
  htmlstr=htmlstr+"          case 1: \n"
  htmlstr=htmlstr+"            that.fetchDataMain(pageInfo, treeNode, resolve) \n"
  htmlstr=htmlstr+"            break \n"
  htmlstr=htmlstr+"        } \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"      setSelectRows() {}, \n"
  htmlstr=htmlstr+"      tableSortChange() {}, \n"

  htmlstr=htmlstr+"      async fetchDataMain(pageInfo, treeNode, resolve) { \n"
  htmlstr=htmlstr+"        let that = this \n"
  htmlstr=htmlstr+"        let select_list = [ \n"
  let count = 0;
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].issearch === '1')
    {
      htmlstr=htmlstr+"          { field: '"+tabledata[i].field+"',	type: 3,	level: "+(count+1).toString()+"	}, \n"
      count++;
    }
  }
  let slist = []
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].ismainid === '1')
    {
      slist.push("        that.queryForm."+tabledata[i].field+" = that.primary_key \n")
      htmlstr=htmlstr+"          { field: '"+tabledata[i].field+"',	type: 3,	level: "+(count+1).toString()+"	}, \n"
      count++;
    }
  }
  if(formdata.isPage === '1')
  {
    htmlstr=htmlstr+"          { field: 'pageNo',	type: 3,	level: "+(count+1).toString()+"	}, \n"
    htmlstr=htmlstr+"          { field: 'pageSize',	type: 3,	level: "+(count+2).toString()+"	}, \n"
  }

  htmlstr=htmlstr+"        ] \n"
  for(let i=0;i<slist.length;i++)
  {
    htmlstr=htmlstr+slist[i]
  }
  htmlstr=htmlstr+"        await that.search_fob(select_list, that, "+formdata.selectcode+", { \n"
  htmlstr=htmlstr+"          loading: 'listLoading', //加载画面 \n"
  htmlstr=htmlstr+"          data: 'tablelist', //数据存放位置 \n"
  htmlstr=htmlstr+"          total: 'total', //数据数量，根据该数量分页 \n"
  htmlstr=htmlstr+"          queryForm: 'queryForm', //查询数据表单，请将分页条件也放置在其中 \n"
  htmlstr=htmlstr+"        }) \n"
  htmlstr=htmlstr+"      }, \n"
  htmlstr=htmlstr+"    }, \n"
  htmlstr=htmlstr+"  } \n"
  htmlstr=htmlstr+"</script> \n"
  return htmlstr;
}

function dialogHtmlCreate(maindata,tabledata,formdata) {
  let htmlstr="<template> \n"
  htmlstr = htmlstr + '  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="650px" @close="close" top="5vh" center > \n'
  htmlstr = htmlstr + '    <div style="max-height: calc(100vh - 250px); overflow-y: auto"> \n'
  htmlstr = htmlstr + '      <'+formdata.pageNameTitle+'Form ref="'+formdata.pageNameTitle+'Form" :formData.sync="form" :table_type="option.table_type" :type="type" :outOrgStatus="option.outOrgStatus"></'+formdata.pageNameTitle+'Form> \n'
  htmlstr = htmlstr + '    </div> \n'
  htmlstr = htmlstr + '    <div slot="footer" class="dialog-footer dialog-footer-center-custom"> \n'
  htmlstr = htmlstr + '      <el-button type="primary" @click="save">确 定</el-button> \n'
  htmlstr = htmlstr + '      <el-button @click="close">取 消</el-button> \n'
  htmlstr = htmlstr + '    </div> \n'
  htmlstr = htmlstr + '  </el-dialog> \n'
  htmlstr = htmlstr + '</template> \n'
  return htmlstr;
}

function dialogVueCreate(maindata,tabledata,formdata) {
  let htmlstr="<script> \n"
  htmlstr = htmlstr + "  import "+formdata.pageNameTitle+"Form from '../form/"+formdata.pageNameTitle+"Form' \n"
  htmlstr = htmlstr + '  export default { \n'
  htmlstr = htmlstr + "    name: '"+formdata.pageNameTitle+"Dialog', \n"
  htmlstr = htmlstr + "    model: { \n"
  htmlstr = htmlstr + "      prop: 'isUpData', \n"
  htmlstr = htmlstr + "      event: 'on-change' \n"
  htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "    props: { \n"
  htmlstr = htmlstr + "      isUpData: { \n"
  htmlstr = htmlstr + "        type: Boolean, \n"
  htmlstr = htmlstr + "        default: false \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      type: { \n"
  htmlstr = htmlstr + "        type: Number, \n"
  htmlstr = htmlstr + "        default: 0 //0 正常表单 1 详情表单 \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "    watch: {}, \n"
  htmlstr = htmlstr + "    components: { \n"
  htmlstr = htmlstr + "      "+formdata.pageNameTitle+"Form, \n"
  htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "    data() { \n"
  htmlstr = htmlstr + "      return { \n"
  htmlstr = htmlstr + "        form: {}, \n"
  htmlstr = htmlstr + "        info: {}, \n"
  htmlstr = htmlstr + "        option: { \n"
  htmlstr = htmlstr + "          table_type: '0', \n"
  htmlstr = htmlstr + "          outOrgStatus: false, \n"
  htmlstr = htmlstr + "        }, \n"
  htmlstr = htmlstr + "        title: '', \n"
  htmlstr = htmlstr + "        dialogFormVisible: false, \n"
  htmlstr = htmlstr + "      } \n"
  htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "    created() {}, \n"
  htmlstr = htmlstr + "    methods: { \n"
  htmlstr = htmlstr + "      showEdit(row, formInfo, option) { \n"
  htmlstr = htmlstr + "        let form = {}; \n"
  htmlstr = htmlstr + "        if (!row) { \n"
  htmlstr = htmlstr + "          this.title = '"+formdata.addDialogTitle+"' \n"
  htmlstr = htmlstr + "        } else { \n"
  htmlstr = htmlstr + "          this.title = '"+formdata.editDialogTitle+"' \n"
  htmlstr = htmlstr + "          form = Object.assign(form, row) \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "        if (formInfo) { \n"
  htmlstr = htmlstr + "          form = Object.assign(form, formInfo) \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "        if (option) { \n"
  htmlstr = htmlstr + "          this.option = Object.assign(this.option, option) \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "        this.form = Object.assign({},this.form, form) \n"
  htmlstr = htmlstr + "        this.info = Object.assign(this.info, form); \n"
  htmlstr = htmlstr + "        this.dialogFormVisible = true \n"
  htmlstr = htmlstr + "        this.dialogFormVisible = true \n"
  htmlstr = htmlstr + "        if(this.$refs['"+formdata.pageNameTitle+"Form']) { \n"
  htmlstr = htmlstr + "          this.$refs['"+formdata.pageNameTitle+"Form'].init(this.form); \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      async close(event, status) { \n"
  htmlstr = htmlstr + "        if (status) { \n"
  htmlstr = htmlstr + "          await this.reload_table() \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "        this.$refs['"+formdata.pageNameTitle+"Form'].close() \n"
  htmlstr = htmlstr + "        this.dialogFormVisible = false \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      async reload_table() { \n"
  htmlstr = htmlstr + "        this.$emit('fencthRelod'); \n"
  htmlstr = htmlstr + "        this.$emit('fencthRelodChildren'); \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      save() { \n"
  htmlstr = htmlstr + "        let that = this \n"
  htmlstr = htmlstr + "        this.$refs['"+formdata.pageNameTitle+"Form'].save(async (valid) => { \n"
  htmlstr = htmlstr + "          if (valid) { \n"
  htmlstr = htmlstr + "            await that.close(undefined, true) \n"
  htmlstr = htmlstr + "          } \n"
  htmlstr = htmlstr + "        }) \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "  } \n"
  htmlstr = htmlstr + "</script> \n"
  return htmlstr;
}

function formHtmlCreate(maindata,tabledata,formdata) {
  let htmlstr="<template> \n"
  htmlstr = htmlstr + '<span class="purchasefrom"> \n'
  htmlstr = htmlstr + '  <el-form ref="form" :model="form" :rules="rules"> \n'
  htmlstr = htmlstr + '    <el-row> \n'
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].isAdd==='1')
    {
      if(tabledata[i].formfieldtype==='1')
      {
        htmlstr = htmlstr + '      <el-col :span="span"> \n'
        htmlstr = htmlstr + '        <el-form-item label="'+tabledata[i].formfieldlabel+'" :label-width="formLabelWidth" prop="'+tabledata[i].field+'" > \n'
        htmlstr = htmlstr + '          <el-input v-model="form.'+tabledata[i].field+'" :placeholder="isReadOnly('+"''"+')" style="width:100%" maxlength="'+tabledata[i].formmaxlen+'"></el-input> \n'
        htmlstr = htmlstr + '        </el-form-item> \n'
        htmlstr = htmlstr + '      </el-col> \n'
      }
      else if(tabledata[i].formfieldtype==='2')
      {
        htmlstr = htmlstr + '      <el-col :span="span"> \n'
        htmlstr = htmlstr + '        <el-form-item label="'+tabledata[i].formfieldlabel+'" :label-width="formLabelWidth" prop="'+tabledata[i].field+'" > \n'
        htmlstr = htmlstr + '          <el-select v-model="form.'+tabledata[i].field+'" :placeholder="isReadOnly('+"''"+')" style="width:100%"></el-input> \n'
        htmlstr = htmlstr + '            <el-option v-for="data in selectData.'+tabledata[i].field+'" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option> \n'
        htmlstr = htmlstr + '          </el-select> \n'
        htmlstr = htmlstr + '        </el-form-item> \n'

        htmlstr = htmlstr + '      </el-col> \n'
      }
      else if(tabledata[i].formfieldtype==='4')
      {
        htmlstr = htmlstr + '      <el-col :span="span"> \n'
        htmlstr = htmlstr + '        <el-form-item label="'+tabledata[i].formfieldlabel+'" :label-width="formLabelWidth" prop="'+tabledata[i].field+'" > \n'
        htmlstr = htmlstr + '          <el-date-picker v-model="form.'+tabledata[i].field+'" align="right" type="date" placeholder="选择日期" style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker> \n'
        htmlstr = htmlstr + '        </el-form-item> \n'
        htmlstr = htmlstr + '      </el-col> \n'
      }
      else if(tabledata[i].formfieldtype==='3')
      {
        htmlstr = htmlstr + '      <el-col :span="span"> \n'
        htmlstr = htmlstr + '        <el-form-item label="'+tabledata[i].formfieldlabel+'" :label-width="formLabelWidth" prop="'+tabledata[i].field+'" > \n'
        htmlstr = htmlstr + '          <'+tabledata[i].field+'upload ref="'+tabledata[i].field+'" :tip_show="upload.tip_show" \n'
        htmlstr = htmlstr + '            :upload_type="upload.upload_type.'+tabledata[i].field+'" :original_name="upload.original_name.'+tabledata[i].field+'" :type_str="upload.type_str" \n'
        htmlstr = htmlstr + '            :type_array="upload.type_array" :success_status.sync="upload.success.'+tabledata[i].field+'" \n'
        htmlstr = htmlstr + '            v-model="form.'+tabledata[i].field+'" :delte_service="upload.delte_service" \n'
        htmlstr = htmlstr + '            :old_delete.sync="upload.old_delete.'+tabledata[i].field+'"> \n'
        htmlstr = htmlstr + '          </'+tabledata[i].field+'upload> \n'
        htmlstr = htmlstr + '        </el-form-item> \n'
        htmlstr = htmlstr + '      </el-col> \n'
      }
    }
  }

  htmlstr = htmlstr + '    </el-row> \n'
  htmlstr = htmlstr + '  </el-form> \n'
  htmlstr = htmlstr + '</span> \n'
  htmlstr = htmlstr + '</template> \n'
  return htmlstr;
}

function formVueCreate(maindata,tabledata,formdata) {
  let uploadfilelist=[]
  let uploadfilejson={}
  let isuploadfileexist=0
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].formfieldtype==='3')
    {
      uploadfilejson={}
      uploadfilejson.field=tabledata[i].field
      uploadfilejson.fieldclass=tabledata[i].fieldclass
      uploadfilelist.push(uploadfilejson)
      isuploadfileexist=1
    }
  }
  let htmlstr="<script> \n"
  if(isuploadfileexist===1) {
    htmlstr = htmlstr + "  import "+uploadfilejson.field+"upload from '@/components/Upload/upload' \n"
  }
  htmlstr = htmlstr + "  import { mapGetters } from 'vuex' \n"
  htmlstr = htmlstr + "  import { \n"
  htmlstr = htmlstr + "    format_fob, \n"
  htmlstr = htmlstr + "    pickerOptions, \n"
  htmlstr = htmlstr + "    getToday, \n"
  htmlstr = htmlstr + "    dateFormat, \n"
  htmlstr = htmlstr + "  } from '@/utils/dateHelp' \n"
  htmlstr = htmlstr + "  import { \n"
  htmlstr = htmlstr + "    GetGroupData, \n"
  htmlstr = htmlstr + "    GetGroupDataEx, \n"
  htmlstr = htmlstr + "  } from '@/utils/htmlDataGroup' \n"
  // htmlstr = htmlstr + "  import { \n"
  // htmlstr = htmlstr + "    isNumEx, \n"
  // htmlstr = htmlstr + "    isTel, \n"
  // htmlstr = htmlstr + "    isPhone, \n"
  // htmlstr = htmlstr + "    dateFormat, \n"
  // htmlstr = htmlstr + "  } from '@/utils/dateHelp' \n"
  htmlstr = htmlstr + '  export default { \n'
  htmlstr = htmlstr + "    name: '"+formdata.pageNameTitle+"Form', \n"
  // htmlstr = htmlstr + "    components: { \n"
  // htmlstr = htmlstr + "      "+formdata.pageNameTitle+"Form, \n"
  // htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "    model: { \n"
  htmlstr = htmlstr + "      prop: 'formData', \n"
  htmlstr = htmlstr + "      event: 'on-change' \n"
  htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "    props: { \n"
  htmlstr = htmlstr + "      formData: { \n"
  htmlstr = htmlstr + "        type: Object, \n"
  htmlstr = htmlstr + "        default: function() { return {} } \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      type: { \n"
  htmlstr = htmlstr + "        type: Number, \n"
  htmlstr = htmlstr + "        default: 0 //0 正常表单 1 详情表单 \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      table_type: { \n"
  htmlstr = htmlstr + "        type: String, \n"
  htmlstr = htmlstr + "        default: '0' \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      outOrgStatus: { \n"
  htmlstr = htmlstr + "        type: Boolean, \n"
  htmlstr = htmlstr + "        default: false \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "    computed: { \n"
  htmlstr = htmlstr + "      ...mapGetters({ \n"
  htmlstr = htmlstr + "        org_id: 'user/org_id', \n"
  htmlstr = htmlstr + "        current_org_id: 'org/current_org', \n"
  htmlstr = htmlstr + "        person_id: 'user/person_id' \n"
  htmlstr = htmlstr + "      }), \n"
  htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "    watch: { \n"
  htmlstr = htmlstr + "      formData(newVal, oldVal) { \n"
  htmlstr = htmlstr + "        if (newVal) { \n"
  htmlstr = htmlstr + "          this.form = Object.assign({}, this.formdefalut) \n"
  htmlstr = htmlstr + "          this.init() \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "    }, \n"

  htmlstr = htmlstr + "    data() { \n"
  htmlstr = htmlstr + "      return { \n"
  htmlstr = htmlstr + "        span: 24, \n"
  htmlstr = htmlstr + "        readonly: false, \n"
  htmlstr = htmlstr + "        formdefalut: {}, \n"
  htmlstr = htmlstr + "        selectData: {  \n"
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].formfieldtype==='2')
    {
      htmlstr = htmlstr + "       "+tabledata[i].field+": [], \n"
    }
  }
  htmlstr = htmlstr + "        }, \n"
  htmlstr = htmlstr + "        form: { \n"
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].isAdd==='1')
    {
      htmlstr = htmlstr + "          "+tabledata[i].field+": '', \n"
    }
  }
  htmlstr = htmlstr + "        }, \n"
  htmlstr = htmlstr + "        rules_temp: { \n"
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].isAdd==='1' && tabledata[i].checkcustom && tabledata[i].checkcustom!=='')
    {
      htmlstr = htmlstr + "          "+tabledata[i].field+":"+tabledata[i].checkcustom+": '', \n"
    }
  }
  htmlstr = htmlstr + "        }, \n"

  if(isuploadfileexist===1)
  {
    htmlstr = htmlstr + "        upload: { \n"
    htmlstr = htmlstr + "          tip_show: false, \n"
    htmlstr = htmlstr + "          delte_service: false, \n"
    htmlstr = htmlstr + "          upload_type: { \n"
    for(let i=0;i<uploadfilelist.length;i++)
    {
      htmlstr = htmlstr + "          "+uploadfilelist[i].field+": "+uploadfilelist[i].fieldclass+", \n"
    }
    htmlstr = htmlstr + "          }, \n"
    htmlstr = htmlstr + "          type_str: 'jpg/pdf/png/jpeg', \n"
    htmlstr = htmlstr + "          type_array: ['image/jpeg', 'image/png', 'application/pdf'], \n"
    htmlstr = htmlstr + "          file_size: '16', \n"
    htmlstr = htmlstr + "          size_unit: 'MB', \n"
    htmlstr = htmlstr + "          original_name: { \n"
    for(let i=0;i<uploadfilelist.length;i++)
    {
      htmlstr = htmlstr + "          "+uploadfilelist[i].field+": {}, \n"
    }
    htmlstr = htmlstr + "          }, \n"
    htmlstr = htmlstr + "          success: { \n"
    for(let i=0;i<uploadfilelist.length;i++)
    {
      htmlstr = htmlstr + "          "+uploadfilelist[i].field+": false, \n"
    }
    htmlstr = htmlstr + "          }, \n"
    htmlstr = htmlstr + "          old_delete: { \n"
    for(let i=0;i<uploadfilelist.length;i++)
    {
      htmlstr = htmlstr + "          "+uploadfilelist[i].field+": false, \n"
    }
    htmlstr = htmlstr + "          }, \n"
    htmlstr = htmlstr + "        }, \n"
  }
  htmlstr = htmlstr + "        rules: {}, \n"
  htmlstr = htmlstr + "        formLabelWidth: '120px', \n"
  htmlstr = htmlstr + "      } \n"
  htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "    created() { this.init() }, \n"
  htmlstr = htmlstr + "    methods: { \n"
  htmlstr = htmlstr + "      async init(formDataS) { \n"
  htmlstr = htmlstr + "        switch (this.type) { \n"
  htmlstr = htmlstr + "          case 0: \n"
  htmlstr = htmlstr + "            this.readonly = false \n"
  htmlstr = htmlstr + "            this.rules = this.rules_temp \n"
  htmlstr = htmlstr + "            break; \n"
  htmlstr = htmlstr + "          case 2: \n"
  htmlstr = htmlstr + "            this.readonly = false \n"
  htmlstr = htmlstr + "            this.rules = this.rules_temp \n"
  htmlstr = htmlstr + "            break; \n"
  htmlstr = htmlstr + "          case 1: \n"
  htmlstr = htmlstr + "            this.readonly = true \n"
  htmlstr = htmlstr + "            this.rules = {} \n"
  htmlstr = htmlstr + "            break; \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "        this.uploadDeault = JSON.parse(JSON.stringify(this.upload)) \n"
  htmlstr = htmlstr + "        this.form.table_type = this.table_type \n"
  htmlstr = htmlstr + "        this.GetGroup() \n"
  htmlstr = htmlstr + "        this.formdefalut = JSON.parse(JSON.stringify(this.form)) \n"
  htmlstr = htmlstr + "        if (this.formData) { \n"
  htmlstr = htmlstr + "          this.form = Object.assign(this.form, this.formData) \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "        this.role_max = await this.$store.dispatch('user/getRoleMax') \n"
  htmlstr = htmlstr + "        if (this.role_max == 'super_admin') { \n"
  htmlstr = htmlstr + "          this.readonlyParentSelect = false \n"
  htmlstr = htmlstr + "          if (this.type == 2 && !(this.form.parent_id && this.form.parent_id > 0)) { \n"
  htmlstr = htmlstr + "            this.form.parent_id = this.current_org_id \n"
  htmlstr = htmlstr + "          } \n"
  htmlstr = htmlstr + "        } else { \n"
  htmlstr = htmlstr + "          await this.GetParentOrg() \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      async GetGroup() {\n "
  htmlstr = htmlstr + "        let list = [\n "
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].group_id && tabledata[i].group_id !== '')
    {
      htmlstr = htmlstr + "          {	data: '"+tabledata[i].field+"', group_id: "+tabledata[i].group_id+" }, \n"
    }
  }
  htmlstr = htmlstr + "        ]; \n"
  htmlstr = htmlstr + "        await GetGroupDataEx(this, list); \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      async GetParentOrg() { \n"
  htmlstr = htmlstr + "        let select_list = [ \n"
  htmlstr = htmlstr + "          { field: 'org_id', type: 3, level: 1},  \n"
  htmlstr = htmlstr + "        ] \n"
  htmlstr = htmlstr + "        let form = { org_id: this.org_id } \n"
  htmlstr = htmlstr + "        let { data } = await this.QueryExec_fob(327, select_list, form) \n"
  htmlstr = htmlstr + "        if (!data) { \n"
  htmlstr = htmlstr + "          return -1 \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "        if (data.length == 0) { \n"
  htmlstr = htmlstr + "          return -1 \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "        this.form.parent_id = data[0].parent_id \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      isReadOnly(text) { \n"
  htmlstr = htmlstr + "        if (this.readonly) { \n"
  htmlstr = htmlstr + "          return '' \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "        return text \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      close() { \n"
  htmlstr = htmlstr + "        let that = this \n"
  htmlstr = htmlstr + "        this.upload = JSON.parse(JSON.stringify(this.uploadDeault)) \n"
  htmlstr = htmlstr + "        this.form = this.$options.data().form \n"
  htmlstr = htmlstr + "        this.form = JSON.parse(JSON.stringify(this.formdefalut)); \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      async QueryExec_fob_custom(list, form, sqlcode) { \n"
  htmlstr = htmlstr + "        return await this.QueryExec_fob(sqlcode, list, form) \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      fileUploadRefs() { \n"
  htmlstr = htmlstr + "        return [ \n"
  for(let i=0;i<uploadfilelist.length;i++)
  {
    htmlstr = htmlstr + "          '"+uploadfilelist[i].field+"', \n"
  }
  htmlstr = htmlstr + "        ]; \n"
  htmlstr = htmlstr + "      }, \n"

  htmlstr = htmlstr + "      fileUpload(callback) {\n"
  htmlstr = htmlstr + "      	try {\n"
  htmlstr = htmlstr + "      		let that = this;\n"
  htmlstr = htmlstr + "      		const refs = that.fileUploadRefs();\n"
  htmlstr = htmlstr + "      		let check_list = [];\n"
  htmlstr = htmlstr + "      		const length = refs.length;\n"
  htmlstr = htmlstr + "      		that.loading = true;\n"
  htmlstr = htmlstr + "      		that.loadingText = '上传文件中';\n"
  htmlstr = htmlstr + "      		for (let i = 0; i < length; i++) {\n"
  htmlstr = htmlstr + "      			try { \n"
  htmlstr = htmlstr + "      				if (that.$refs[refs[i]].submitUpload() === 1) { \n"
  htmlstr = htmlstr + "      					check_list.push(refs[i]); \n"
  htmlstr = htmlstr + "      				} \n"
  htmlstr = htmlstr + "      			} catch (e) { \n"
  htmlstr = htmlstr + "      				console.log(e); \n"
  htmlstr = htmlstr + "      			} \n"
  htmlstr = htmlstr + "      		} \n"
  htmlstr = htmlstr + "      		let index = setInterval(function() { \n"
  htmlstr = htmlstr + "      			let flag = true; \n"
  htmlstr = htmlstr + "      			let length = check_list.length; \n"
  htmlstr = htmlstr + "      			while (--length > -1) { \n"
  htmlstr = htmlstr + "      				if ( \n"
  htmlstr = htmlstr + "      					!that.upload.success[check_list[length]] && \n"
  htmlstr = htmlstr + "      					!that.$refs[check_list[length]].error \n"
  htmlstr = htmlstr + "      				) { \n"
  htmlstr = htmlstr + "      					flag = false; \n"
  htmlstr = htmlstr + "      					break; \n"
  htmlstr = htmlstr + "      				} \n"
  htmlstr = htmlstr + "      			} \n"
  htmlstr = htmlstr + "      			if (flag) { \n"
  htmlstr = htmlstr + "      				clearInterval(index); \n"
  htmlstr = htmlstr + "      				exce(); \n"
  htmlstr = htmlstr + "      			} \n"
  htmlstr = htmlstr + "      		}, 500); \n"
  htmlstr = htmlstr + "      		function exce() { \n"
  htmlstr = htmlstr + "      			let flag = true; \n"
  htmlstr = htmlstr + "      			let length = check_list.length; \n"
  htmlstr = htmlstr + "      			while (--length > -1) { \n"
  htmlstr = htmlstr + "      				if (that.$refs[check_list[length]].error) { \n"
  htmlstr = htmlstr + "      					flag = false; \n"
  htmlstr = htmlstr + "      				} \n"
  htmlstr = htmlstr + "      			} \n"
  htmlstr = htmlstr + "      			if (flag) { \n"
  htmlstr = htmlstr + "      				that.upload.delte_service = true; \n"
  htmlstr = htmlstr + "      			} else { \n"
  htmlstr = htmlstr + "      				that.$baseMessage('文件上传失败', 'error'); \n"
  htmlstr = htmlstr + "      			} \n"
  htmlstr = htmlstr + "      			that.loading = false; \n"
  htmlstr = htmlstr + "      			callback(flag); \n"
  htmlstr = htmlstr + "      		} \n"
  htmlstr = htmlstr + "      	} catch (e) { \n"
  htmlstr = htmlstr + "      		console.log(e); \n"
  htmlstr = htmlstr + "      	} \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "      async save(callback) { \n"
  htmlstr = htmlstr + "        let that = this \n"
  htmlstr = htmlstr + "        async function submit() { \n"
  htmlstr = htmlstr + "          that.loading = true \n"
  htmlstr = htmlstr + "          that.loadingText = '提交表单中...' \n"
  htmlstr = htmlstr + "          let form = JSON.parse(JSON.stringify(that.form)); \n"
  htmlstr = htmlstr + "          let list = [ \n"
  let count = 0
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].isAdd==='1')
    {
      htmlstr = htmlstr + "            { field: '"+tabledata[i].field+"', type: 3, level: "+(count+1).toString()+"}, \n"
      count++;
    }
  }
  htmlstr = htmlstr + "          ] \n"
  htmlstr = htmlstr + "          let fob = ''; \n"
  htmlstr = htmlstr + "          let sqlcode = -1; \n"
  htmlstr = htmlstr + "          let msg = '' \n"
  htmlstr = htmlstr + "          if (form.exId && form.exId > 0) { \n"
  htmlstr = htmlstr + "            sqlcode = "+formdata.updatecode+" \n"
  htmlstr = htmlstr + "            fob = that.update_fob; \n"
  htmlstr = htmlstr + "            msg = '更新' \n"
  htmlstr = htmlstr + "          } else { \n"
  htmlstr = htmlstr + "            msg = '添加' \n"
  htmlstr = htmlstr + "            sqlcode = "+formdata.addcode+" \n"
  htmlstr = htmlstr + "            fob = that.QueryExec_fob_custom; \n"
  htmlstr = htmlstr + "          } \n"
  htmlstr = htmlstr + "          const { code, influence, data } = await fob(list, that.form, sqlcode) \n"
  htmlstr = htmlstr + "          if (code != 200) { \n"
  htmlstr = htmlstr + "            that.$baseMessage(msg + '失败', 'error') \n"
  htmlstr = htmlstr + "            return false \n"
  htmlstr = htmlstr + "          } \n"
  htmlstr = htmlstr + "          if (!data || data.length == 0) { \n"
  htmlstr = htmlstr + "            that.$baseMessage(msg + '失败', 'error') \n"
  htmlstr = htmlstr + "            return \n"
  htmlstr = htmlstr + "          } \n"
  htmlstr = htmlstr + "          let res = data[0].Column1 \n"
  htmlstr = htmlstr + "          if (res > 0) { \n"
  htmlstr = htmlstr + "            that.$baseMessage(msg + '成功', 'success') \n"
  htmlstr = htmlstr + "            that.close() \n"
  htmlstr = htmlstr + "            return true \n"
  htmlstr = htmlstr + "          } else { \n"
  htmlstr = htmlstr + "            that.$baseMessage(msg + '失败', 'error') \n"
  htmlstr = htmlstr + "            return false \n"
  htmlstr = htmlstr + "          } \n"
  htmlstr = htmlstr + "        } \n"
  htmlstr = htmlstr + "        that.$refs['form'].validate((valid) => { \n"
  htmlstr = htmlstr + "          if (valid) { \n"
  htmlstr = htmlstr + "            that.$baseConfirm('确定提交？', null, async () => { \n"
  htmlstr = htmlstr + "              that.fileUpload(async function(status) { \n"
  htmlstr = htmlstr + "                if (status) { \n"
  htmlstr = htmlstr + "                  const flag = await submit() \n"
  htmlstr = htmlstr + "                  callback(flag) \n"
  htmlstr = htmlstr + "                } \n"
  htmlstr = htmlstr + "              }) \n"
  htmlstr = htmlstr + "            }) \n"
  htmlstr = htmlstr + "          } else { \n"
  htmlstr = htmlstr + "            return false \n"
  htmlstr = htmlstr + "          } \n"
  htmlstr = htmlstr + "        }) \n"
  htmlstr = htmlstr + "      }, \n"
  htmlstr = htmlstr + "    }, \n"
  htmlstr = htmlstr + "  } \n"
  htmlstr = htmlstr + "</script> \n"
  return htmlstr;
}



function getPrimayKey(tabledata) {
  let primaryKeyList = []
  for(let i=0;i<tabledata.length;i++)
  {
    if(tabledata[i].mainkey==='1')
    {
      primaryKeyList.push(tabledata[i].field)
    }
  }
  return primaryKeyList
}

function addTabPageCreate(maindata,tabledata,formdata) {
  let htmlstr = ''
  for(let i=0;i<maindata.operate.length;i++)
  {
    if(maindata.operate[i]==='添加')
    {
      if(formdata.isAddInPage)
      {
        htmlstr=htmlstr+'		   <el-tab-pane label="'+formdata.addTabTitle+'" class="center"> \n'
        htmlstr=htmlstr+'		     <div class="usage"> \n'
        htmlstr=htmlstr+'		       <'+formdata.pageNameTitle+'Form ref="'+formdata.pageNameTitle+'Form"></'+formdata.pageNameTitle+'Form> \n'
        htmlstr=htmlstr+'		       <div><el-button class="purchase_btn" type="primary" @click="'+formdata.pageNameTitle+'FormAdd()">确 定</el-button></div> \n'
        htmlstr=htmlstr+'		     </div> \n'
        htmlstr=htmlstr+'		   </el-tab-pane> \n'
      }
    }
  }
  return htmlstr;
}

function tableTabPageCreate(maindata,tabledata,formdata) {
  let htmlstr = ''
  htmlstr=htmlstr+'		   <el-tab-pane label="'+formdata.tableTabTitle+'"> \n'
  htmlstr=htmlstr+'         <el-row> \n'
  htmlstr=htmlstr+searchCodeCreate(maindata,tabledata,formdata)
  htmlstr=htmlstr+tableCodeCreate(maindata,tabledata,formdata)

  htmlstr=htmlstr+'        </el-row> \n'
  htmlstr=htmlstr+'		   </el-tab-pane> \n'
  return htmlstr;
}

function tableTabPageCreateMuti(maindatalist,tabledatalist,formdatalist) {
  let htmlstr = ''
  htmlstr=htmlstr+'		   <el-tab-pane label="'+formdatalist[0].tableTabTitle+'"> \n'
  htmlstr=htmlstr+'         <el-row> \n'
  htmlstr=htmlstr+searchCodeCreate(maindatalist.main,tabledatalist[0],formdatalist[0])
  htmlstr=htmlstr+tableCodeCreate(maindatalist.main,tabledatalist[0],formdatalist[0])
  htmlstr=htmlstr+tabCodeCreateSub(maindatalist,tabledatalist,formdatalist)
  htmlstr=htmlstr+'        </el-row> \n'
  htmlstr=htmlstr+'		   </el-tab-pane> \n'
  return htmlstr;
}


function getSearchData(maindata,tabledata,formdata) {
  let searchdatalist = []
  let searchdatajson = {}
  for(let i=0;i<tabledata.length;i++) {
    if(tabledata[i].issearch==='1')
    {
      searchdatajson = {}
      searchdatajson.searchtype=tabledata[i].searchtype
      searchdatajson.searchfrom=tabledata[i].searchfrom
      searchdatajson.searchlabel=tabledata[i].searchlabel
      searchdatajson.field=tabledata[i].field
      searchdatajson.fieldtype=tabledata[i].fieldtype
      searchdatalist.push(searchdatajson)
    }
  }
  return searchdatalist
}

function searchCodeCreate(maindata,tabledata,formdata) {
  let htmlstr=''
  let searchdatalist = getSearchData(maindata,tabledata,formdata)
  console.log(searchdatalist)
  if(searchdatalist.length>0)
  {

    htmlstr=htmlstr+'          <el-col :span="24"> \n'
    htmlstr=htmlstr+'		         <el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent> \n'
    for(let i=0;i<searchdatalist.length;i++)
    {
      htmlstr=htmlstr+'		           <el-form-item label=""> \n'
      htmlstr=htmlstr+searchDetailCodeCreate(searchdatalist[i])
      htmlstr=htmlstr+'              </el-form-item> \n'
    }
    htmlstr=htmlstr+'		           <el-form-item label=""> \n'
    htmlstr=htmlstr+'                <el-button icon="el-icon-search" type="primary" @click="searchMain"></el-button> \n'
    htmlstr=htmlstr+'              </el-form-item> \n'
    htmlstr=htmlstr+'		         </el-form> \n'
    htmlstr=htmlstr+'          </el-col> \n'

  }
  return htmlstr;
}

function tableCodeCreate(maindata,tabledata,formdata) {
  let htmlstr=''
  htmlstr=htmlstr+'          <el-col :span="24"> \n'
  htmlstr=htmlstr+'            <'+formdata.pageNameTitle+'Table style="height: calc(35vh); min-height: 300px" ref="'+formdata.pageNameTitle
  +'Table" :type="0" :primary_key.sync="primary_key" :permission="permission"></'+formdata.pageNameTitle+'Table> \n'
  htmlstr=htmlstr+'          </el-col> \n'
  return htmlstr;
}

function tabCodeCreateSub(maindatalist,tabledatalist,formdatalist) {
  let htmlstr=''
  if(tabledatalist.length>1)
  {
    htmlstr=htmlstr+'          <el-col :span="24"> \n'
    htmlstr=htmlstr+'            <el-tabs type="border-card" style="height: calc(50%)"> \n'
    for(let i=1;i<tabledatalist.length;i++)
    {

      htmlstr=htmlstr+'		   <el-tab-pane label="'+formdatalist[i].tableTabTitle+'"> \n'
      htmlstr=htmlstr+'         <el-row> \n'
      let searchdata = {}
      searchdata.tablename=maindatalist.side['tablenamesub'+i.toString()]
      searchdata.operate=maindatalist.side['operatesub'+i.toString()]
      htmlstr=htmlstr+tableCodeCreate(searchdata,tabledatalist[i],formdatalist[i])
      htmlstr=htmlstr+'        </el-row> \n'
      htmlstr=htmlstr+'		   </el-tab-pane> \n'
    }
    htmlstr=htmlstr+'            </el-tabs> \n'
    htmlstr=htmlstr+'          </el-col> \n'
  }

  return htmlstr;
}

// <el-tabs type="border-card" style="height: calc(100%)">
// 					<el-tab-pane label="下载申请">
// 						<qualificationCertApplyTable style="height: calc(37vh)" ref="qualificationCertApplyTable"
// 							type="qualificationCert" :primary_key="primary_key" :permission="btnShow">
// 						</qualificationCertApplyTable>
// 					</el-tab-pane>
// 					<el-tab-pane label="下载记录">
// 						<qualificationCertDownloadTable style="height: calc(37vh)" ref="qualificationCertDownloadTable"
// 							type="qualificationCert" :primary_key="primary_key" :permission="btnShow">
// 						</qualificationCertDownloadTable>
// 					</el-tab-pane>
// 				</el-tabs>

function searchDetailCodeCreate(searchdatajson) {
  let htmlstr=''
  //输入
  if(searchdatajson.searchtype==='1') {
    htmlstr='		         <el-input style="border-radius: 30px" v-model="search.main.'+searchdatajson.field+'" placeholder="请输入'+searchdatajson.fieldname+'" clearable></el-input> \n'
  }
  //选择
  else if(searchdatajson.searchtype==='2') {
    htmlstr = htmlstr + '		         <el-select v-model="form.'+searchdatajson.field+'" placeholder="请选择'+searchdatajson.fieldname+'" style="width:100%"></el-input> \n'
    htmlstr = htmlstr + '		           <el-option v-for="data in selectData.'+searchdatajson.field+'" :key="data.item_name" :label="data.item_name" :value="data.item_name"></el-option> \n'
    htmlstr = htmlstr + '		         </el-select> \n'
  }
  return htmlstr;
}

function mainPageCreate(zip,maindata,tabledata,formdata) {
  let htmlstr = ''
  htmlstr = htmlstr + mainHtmlPageCreate(maindata,tabledata,formdata)
  htmlstr = htmlstr + '\n' + mainVuePageCreate(maindata,tabledata,formdata)
  createAndDownloadFile(zip,formdata.pageNameTitle+'.vue',htmlstr)
}

function mainPageCreateMuti(zip,maindatalist,tabledatalist,formdatalist) {
  let htmlstr = ''
  htmlstr = htmlstr + mainHtmlPageCreateMuti(maindatalist,tabledatalist,formdatalist)
  htmlstr = htmlstr + '\n' + mainVuePageCreate(maindatalist.main,tabledatalist[0],formdatalist[0],formdatalist)
  createAndDownloadFile(zip,formdatalist[0].pageNameTitle+'.vue',htmlstr)
}

function tablePageCreate(zip,maindata,tabledata,formdata) {
  let htmlstr = ''
  htmlstr = htmlstr + tableHtmlCreate(maindata,tabledata,formdata)
  htmlstr = htmlstr + '\n' + tableVueCreate(maindata,tabledata,formdata)
  createAndDownloadFile(zip,formdata.pageNameTitle+'Table.vue',htmlstr)
}

function dialogPageCreate(zip,maindata,tabledata,formdata) {
  let htmlstr = ''
  htmlstr = htmlstr + dialogHtmlCreate(maindata,tabledata,formdata)
  htmlstr = htmlstr + '\n' + dialogVueCreate(maindata,tabledata,formdata)
  createAndDownloadFile(zip,formdata.pageNameTitle+'Dialog.vue',htmlstr)
}

function formPageCreate(zip,maindata,tabledata,formdata) {
  let htmlstr = ''
  htmlstr = htmlstr + formHtmlCreate(maindata,tabledata,formdata)
  htmlstr = htmlstr + '\n' + formVueCreate(maindata,tabledata,formdata)
  createAndDownloadFile(zip,formdata.pageNameTitle+'Form.vue',htmlstr)
}

export function autoPageCreate(maindata,tabledata,formdata) {
  mainPageCreate(maindata,tabledata,formdata)
  tablePageCreate(maindata,tabledata,formdata)
  dialogPageCreate(maindata,tabledata,formdata)
  formPageCreate(maindata,tabledata,formdata)
}

export function autoPageCreateMain(maindatalist,tabledatalist,formdatalist) {
  var zip = new JSZip();
  mainPageCreateMuti(zip,maindatalist,tabledatalist,formdatalist)
  console.log(maindatalist,tabledatalist,formdatalist)


  tablePageCreate(zip,maindatalist.main,tabledatalist[0],formdatalist[0])
  dialogPageCreate(zip,maindatalist.main,tabledatalist[0],formdatalist[0])
  formPageCreate(zip,maindatalist.main,tabledatalist[0],formdatalist[0])
  for(let i=1;i<5;i++)
  {
    if(tabledatalist[i])
    {
      let searchdata = {}
      searchdata.tablename=maindatalist.side['tablenamesub'+i.toString()]
      searchdata.operate=maindatalist.side['operatesub'+i.toString()]
      console.log(searchdata,tabledatalist[i],formdatalist[i])
      tablePageCreate(zip,searchdata,tabledatalist[i],formdatalist[i])
      dialogPageCreate(zip,searchdata,tabledatalist[i],formdatalist[i])
      formPageCreate(zip,searchdata,tabledatalist[i],formdatalist[i])
    }
  }
  // //1.创建hello.txt文件，文件内容为Hello World
  // zip.file("hello.txt", "Hello World\n");

  // //2.创建一个demo文件夹，文件里里创建一个hello.txt文件，文件内容为Hello World
  // zip.folder("demo").file("hello.txt", "Hello World\n");

  // // 生成zip文件并下载
  zip.generateAsync({
      type: 'blob',// 压缩类型
      compression: "DEFLATE", // STORE：默认不压缩 DEFLATE：需要压缩
      compressionOptions: {
          level: 9 // 压缩等级1~9 1压缩速度最快，9最优压缩方式
      }
  }).then(function(content) {
      // 下载的文件名
      var filename = 'hello.zip';
      // 创建隐藏的可下载链接
      var eleLink = document.createElement('a');
      eleLink.download = filename;
      eleLink.style.display = 'none';
      // 下载内容转变成blob地址
      eleLink.href = URL.createObjectURL(content);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
  });

}


export async function addSqlToDB(formdata) {
  let sData = '[Q]896{}|^SYS'
  let sqlcode = {}
  let res = await QueryExec(sData)
  console.log(res)
  sData = '[Q]897{'+res.data[0].id+'$`'+formdata.select_sql+'$`'+formdata.person_name+'$`'+formdata.pageNameTitle+'页面查询语句}|^1|^SYS'
  res = await ExecSql(sData)
  sqlcode.selectcode=res

  sData = '[Q]896{}|^SYS'
  res = await QueryExec(sData)
  console.log(res)
  sData = '[Q]897{'+res.data[0].id+'$`'+formdata.insert_sql+'$`'+formdata.person_name+'$`'+formdata.pageNameTitle+'页面添加语句}|^1|^SYS'
  res = await ExecSql(sData)
  sqlcode.addcode=res

  sData = '[Q]896{}|^SYS'
  res = await QueryExec(sData)
  console.log(res)
  sData = '[Q]897{'+res.data[0].id+'$`'+formdata.update_sql+'$`'+formdata.person_name+'$`'+formdata.pageNameTitle+'页面修改语句}|^1|^SYS'
  res = await ExecSql(sData)
  sqlcode.updatecode=res

  sData = '[Q]896{}|^SYS'
  res = await QueryExec(sData)
  console.log(res)
  sData = '[Q]897{'+res.data[0].id+'$`'+formdata.delete_sql+'$`'+formdata.person_name+'$`'+formdata.pageNameTitle+'页面删除语句}|^1|^SYS'
  res = await ExecSql(sData)
  sqlcode.deletecode=res

  return sqlcode
}

export default {}
