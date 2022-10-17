<template>
  <!-- 资质证书 -->
	<!-- definition -->
	<div class="definition purchase contract equipment_btn calc" style="overflow: auto;">
		<el-tabs type="border-card"  class="box_center" style="height:1500px"	lazy>
		  <el-tab-pane label="主表">
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="search.main" :inline="true" @submit.native.prevent>
            	<el-form-item label="主表:" :label-width="formLabelWidth">
            		<el-select v-model="search.main.tablename" filterable placeholder="请选择" style="width: 100%;" @change="searchMain">
            		  <el-option
            		    v-for="item in tabledata"
            		    :key="item.qid"
            		    :label="item.qname"
            		    :value="item.qid">
            		  </el-option>
            		</el-select>
            	</el-form-item>
              <el-form-item label="操作:" :label-width="formLabelWidth">
                  <el-checkbox-group v-model="search.main.operate">
                    <el-checkbox label="添加" name="operate"></el-checkbox>
                    <el-checkbox label="修改" name="operate"></el-checkbox>
                    <el-checkbox label="删除" name="operate"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                <el-button
                  type="primary"
                  @click="createSqlCode()"
                >
                  生成语句
                </el-button>
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                <el-button
                  type="primary"
                  @click="addSqlCode()"
                >
                  添加语句
                </el-button>
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                <el-button
                  type="primary"
                  @click="createWebCode()"
                >
                  生成文件
                </el-button>
              </el-form-item>
            </el-form>

          </el-col>
          <el-col :span="24">
            <pageCreateTable style="height: 500px" ref="pageCreateTable" type="main_table"
            	:primary_key.sync="primary_key" :permission="permission"></pageCreateTable>
          </el-col>
          <el-col :span="24">
            <pageCreateForm ref="pageCreateForm" :type="0"></pageCreateForm>
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="从表1">
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="search.side" :inline="true" @submit.native.prevent>
            	<el-form-item label="从表:" :label-width="formLabelWidth">
            		<el-select v-model="search.side.tablenamesub1" filterable placeholder="请选择" style="width: 100%;" @change="searchSide1">
            		  <el-option
            		    v-for="item in tabledata"
            		    :key="item.qid"
            		    :label="item.qname"
            		    :value="item.qid">
            		  </el-option>
            		</el-select>
            	</el-form-item>
              <el-form-item label="操作:" :label-width="formLabelWidth">
                  <el-checkbox-group v-model="search.side.operatesub1">
                    <el-checkbox label="添加" name="operatesub1"></el-checkbox>
                    <el-checkbox label="修改" name="operatesub1"></el-checkbox>
                    <el-checkbox label="删除" name="operatesub1"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </el-form>

          </el-col>
          <el-col :span="24">
            <pageCreateTableSub1 style="height: 500px" ref="pageCreateTableSub1" type="main_table"
            	:primary_key.sync="primary_key" :permission="permission"></pageCreateTableSub1>
          </el-col>
          <el-col :span="24">
            <pageCreateFormSub1 ref="pageCreateFormSub1" table_type="1" :type="0"></pageCreateFormSub1>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="从表2">
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="search.side" :inline="true" @submit.native.prevent>
            	<el-form-item label="从表:" :label-width="formLabelWidth">
            		<el-select v-model="search.side.tablenamesub2" filterable placeholder="请选择" style="width: 100%;" @change="searchSide2">
            		  <el-option
            		    v-for="item in tabledata"
            		    :key="item.qid"
            		    :label="item.qname"
            		    :value="item.qid">
            		  </el-option>
            		</el-select>
            	</el-form-item>
              <el-form-item label="操作:" :label-width="formLabelWidth">
                  <el-checkbox-group v-model="search.side.operatesub2">
                    <el-checkbox label="添加" name="operatesub2"></el-checkbox>
                    <el-checkbox label="修改" name="operatesub2"></el-checkbox>
                    <el-checkbox label="删除" name="operatesub2"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </el-form>

          </el-col>
          <el-col :span="24">
            <pageCreateTableSub2 style="height: 500px" ref="pageCreateTableSub2" type="main_table"
            	:primary_key.sync="primary_key" :permission="permission"></pageCreateTableSub2>
          </el-col>
          <el-col :span="24">
            <pageCreateFormSub2 ref="pageCreateFormSub2" table_type="1" :tablename="search.main.tablename" :type="0"></pageCreateFormSub2>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="从表3">
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="search.side" :inline="true" @submit.native.prevent>
            	<el-form-item label="从表:" :label-width="formLabelWidth">
            		<el-select v-model="search.side.tablenamesub3" filterable placeholder="请选择" style="width: 100%;" @change="searchSide3">
            		  <el-option
            		    v-for="item in tabledata"
            		    :key="item.qid"
            		    :label="item.qname"
            		    :value="item.qid">
            		  </el-option>
            		</el-select>
            	</el-form-item>
              <el-form-item label="操作:" :label-width="formLabelWidth">
                  <el-checkbox-group v-model="search.side.operatesub3">
                    <el-checkbox label="添加" name="operatesub3"></el-checkbox>
                    <el-checkbox label="修改" name="operatesub3"></el-checkbox>
                    <el-checkbox label="删除" name="operatesub3"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </el-form>

          </el-col>
          <el-col :span="24">
            <pageCreateTableSub3 style="height: 500px" ref="pageCreateTableSub3" type="main_table"
            	:primary_key.sync="primary_key" :permission="permission"></pageCreateTableSub3>
          </el-col>
          <el-col :span="24">
            <pageCreateFormSub3 ref="pageCreateFormSub3" table_type="1" :tablename="search.main.tablename" :type="0"></pageCreateFormSub3>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="从表4">
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="search.side" :inline="true" @submit.native.prevent>
            	<el-form-item label="从表:" :label-width="formLabelWidth">
            		<el-select v-model="search.side.tablenamesub4" filterable placeholder="请选择" style="width: 100%;" @change="searchSide4">
            		  <el-option
            		    v-for="item in tabledata"
            		    :key="item.qid"
            		    :label="item.qname"
            		    :value="item.qid">
            		  </el-option>
            		</el-select>
            	</el-form-item>
              <el-form-item label="操作:" :label-width="formLabelWidth">
                  <el-checkbox-group v-model="search.side.operatesub4">
                    <el-checkbox label="添加" name="operatesub4"></el-checkbox>
                    <el-checkbox label="修改" name="operatesub4"></el-checkbox>
                    <el-checkbox label="删除" name="operatesub4"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </el-form>

          </el-col>
          <el-col :span="24">
            <pageCreateTableSub4 style="height: 500px" ref="pageCreateTableSub4" type="main_table"
            	:primary_key.sync="primary_key" :permission="permission"></pageCreateTableSub4>
          </el-col>
          <el-col :span="24">
            <pageCreateFormSub4 ref="pageCreateFormSub4" table_type="1" :tablename="search.main.tablename" :type="0"></pageCreateFormSub4>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="从表5">
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="search.side" :inline="true" @submit.native.prevent>
            	<el-form-item label="从表:" :label-width="formLabelWidth">
            		<el-select v-model="search.side.tablenamesub5" filterable placeholder="请选择" style="width: 100%;" @change="searchSide5">
            		  <el-option
            		    v-for="item in tabledata"
            		    :key="item.qid"
            		    :label="item.qname"
            		    :value="item.qid">
            		  </el-option>
            		</el-select>
            	</el-form-item>
              <el-form-item label="操作:" :label-width="formLabelWidth">
                  <el-checkbox-group v-model="search.side.operatesub5">
                    <el-checkbox label="添加" name="operatesub5"></el-checkbox>
                    <el-checkbox label="修改" name="operatesub5"></el-checkbox>
                    <el-checkbox label="删除" name="operatesub5"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </el-form>
      
          </el-col>
          <el-col :span="24">
            <pageCreateTableSub5 style="height: 500px" ref="pageCreateTableSub5" type="main_table"
            	:primary_key.sync="primary_key" :permission="permission"></pageCreateTableSub5>
          </el-col>
          <el-col :span="24">
            <pageCreateFormSub5 ref="pageCreateFormSub5" table_type="1" :tablename="search.main.tablename" :type="0"></pageCreateFormSub5>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

	</div>
</template>

<script>
  import {
    QueryExec
  } from '@/api/table'
  import {
    createAndDownloadFile,
    autoSqlCreate,
    autoPageCreateMain,
    addSqlToDB
  } from '@/utils/autoCreatePage'

  import JSZip from 'jszip'
  import pageCreateTable from '../table/pageCreateTable.vue'
  import pageCreateForm from '../form/pageCreateForm.vue'
  import pageCreateTableSub1 from '../table/pageCreateTable.vue'
  import pageCreateFormSub1 from '../form/pageCreateForm.vue'
  import pageCreateTableSub2 from '../table/pageCreateTable.vue'
  import pageCreateFormSub2 from '../form/pageCreateForm.vue'
  import pageCreateTableSub3 from '../table/pageCreateTable.vue'
  import pageCreateFormSub3 from '../form/pageCreateForm.vue'
  import pageCreateTableSub4 from '../table/pageCreateTable.vue'
  import pageCreateFormSub4 from '../form/pageCreateForm.vue'
  import pageCreateTableSub5 from '../table/pageCreateTable.vue'
  import pageCreateFormSub5 from '../form/pageCreateForm.vue'
	export default {
		name: 'detectionRoomdefinition',
		components: {
      pageCreateTable,
      pageCreateForm,
      pageCreateTableSub1,
      pageCreateFormSub1,
      pageCreateTableSub2,
      pageCreateFormSub2,
      pageCreateTableSub3,
      pageCreateFormSub3,
      pageCreateTableSub4,
      pageCreateFormSub4,
      pageCreateTableSub5,
      pageCreateFormSub5
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					published: 'success',
					draft: 'gray',
					deleted: 'danger',
				}
				return statusMap[status]
			},
		},
		data() {
			return {
				primary_key: -1,
				btnShow: {
					qualificationCertAdd: false,
				},
				list: [],
				listLoading: true,
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				selectRows: '',
				elementLoadingText: '正在加载...',
				queryForm: {
					name: '',
				},
				table: {
					tableHeight: this.$(window).height(),
				},
        search: {
        	main: {
        		tablename: '',
            operate: []
        	},
        	side: {
        		tablenamesub1: '',
            operatesub1: [],
            tablenamesub2: '',
            operatesub2: [],
            tablenamesub3: '',
            operatesub3: [],
            tablenamesub4: '',
            operatesub4: [],
            tablenamesub5: '',
            operatesub5: []
        	}
        },
        tabledata: [],
        formLabelWidth: '85px',
        permission: {

        	person_role: false,
        	// person_role: {
        	// 	person_role_manage: false,
        	// },
        	self: false,
        },
			}
		},
		computed: {
			height() {
				return this.$baseTableHeight()
			},
		}, //,
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			async init() {
				let permissionList = ['sealLedger'];
				let permission = '';
				for (let i = 0; i < permissionList.length; i++) {
					permission = await this.$store.dispatch(
						'permission/GetALLPermissionByModel',
						permissionList[i]
					)
					if (permission) {
						this.permission = Object.assign(this.permission, permission)
					}
				}
				await this.fetchData()
        await this.getTableData()
			},
      searchMain() {
        let that=this
        console.log(that.search.main)
        this.$refs['pageCreateTable'].search(that.search.main)
        this.$refs['pageCreateFormSub1'].GetTableDataForMain(that.search.main.tablename)
        this.$refs['pageCreateFormSub2'].GetTableDataForMain(that.search.main.tablename)
        this.$refs['pageCreateFormSub3'].GetTableDataForMain(that.search.main.tablename)
        this.$refs['pageCreateFormSub4'].GetTableDataForMain(that.search.main.tablename)
        this.$refs['pageCreateFormSub5'].GetTableDataForMain(that.search.main.tablename)
      },
      searchSide1() {
        let that=this
        let searchdata = {}
        searchdata.tablename=that.search.side.tablenamesub1
        searchdata.operate=that.search.side.operatesub1
        this.$refs['pageCreateTableSub1'].search(searchdata)
      },
      searchSide2() {
        let that=this
        let searchdata = {}
        searchdata.tablename=that.search.side.tablenamesub2
        searchdata.operate=that.search.side.operatesub2
        this.$refs['pageCreateTableSub2'].search(searchdata)
      },
      searchSide3() {
        let that=this
        let searchdata = {}
        searchdata.tablename=that.search.side.tablenamesub3
        searchdata.operate=that.search.side.operatesub3
        this.$refs['pageCreateTableSub3'].search(searchdata)
      },
      searchSide4() {
        let that=this
        let searchdata = {}
        searchdata.tablename=that.search.side.tablenamesub4
        searchdata.operate=that.search.side.operatesub4
        this.$refs['pageCreateTableSub4'].search(searchdata)
      },
      searchSide5() {
        let that=this
        let searchdata = {}
        searchdata.tablename=that.search.side.tablenamesub5
        searchdata.operate=that.search.side.operatesub5
        this.$refs['pageCreateTableSub5'].search(searchdata)
      },
      createWebCode() {
        let that = this
        let formdatalist=[]
        let tabledatalist=[]
        let tabledata = this.$refs['pageCreateTable'].getTableDataInMain()
        let formdata = this.$refs['pageCreateForm'].getFormData()
        tabledatalist.push(tabledata)
        formdatalist.push(formdata)
        // autoPageCreate(that.search.main,tabledata,formdata)
        for(let i=1;i<5;i++)
        {
          if(that.search.side['tablenamesub'+i.toString()] !== '')
          {
            let tabledatasub = this.$refs['pageCreateTableSub'+i.toString()].getTableDataInMain()
            let formdatasub = this.$refs['pageCreateFormSub'+i.toString()].getFormData()
            tabledatalist.push(tabledatasub)
            formdatalist.push(formdatasub)
          }
        }
        autoPageCreateMain(that.search,tabledatalist,formdatalist)
      },
      createSqlCode() {
        // var zip = new JSZip();

        // //1.创建hello.txt文件，文件内容为Hello World
        // zip.file("hello.txt", "Hello World\n");

        // //2.创建一个demo文件夹，文件里里创建一个hello.txt文件，文件内容为Hello World
        // zip.file("hello1.txt", "Hello World\n");

        // // 生成zip文件并下载
        // zip.generateAsync({
        //     type: 'blob',// 压缩类型
        //     compression: "DEFLATE", // STORE：默认不压缩 DEFLATE：需要压缩
        //     compressionOptions: {
        //         level: 9 // 压缩等级1~9 1压缩速度最快，9最优压缩方式
        //     }
        // }).then(function(content) {
        //     // 下载的文件名
        //     var filename = 'hello.zip';
        //     // 创建隐藏的可下载链接
        //     var eleLink = document.createElement('a');
        //     eleLink.download = filename;
        //     eleLink.style.display = 'none';
        //     // 下载内容转变成blob地址
        //     eleLink.href = URL.createObjectURL(content);
        //     // 触发点击
        //     document.body.appendChild(eleLink);
        //     eleLink.click();
        //     // 然后移除
        //     document.body.removeChild(eleLink);
        // });

        let that = this
        let tabledata = this.$refs['pageCreateTable'].getTableDataInMain()
        let formdata = this.$refs['pageCreateForm'].getFormData()
        console.log(that.search.main,tabledata,formdata)
        let sql = autoSqlCreate(that.search.main,tabledata,formdata.isPage)
        this.$refs['pageCreateForm'].setFormData(sql)
        for(let i=1;i<5;i++)
        {
          if(that.search.side['tablenamesub'+i.toString()] !== '')
          {
            let tabledatasub = this.$refs['pageCreateTableSub'+i.toString()].getTableDataInMain()
            let formdatasub = this.$refs['pageCreateFormSub'+i.toString()].getFormData()
            let searchdata = {}
            searchdata.tablename=that.search.side['tablenamesub'+i.toString()]
            searchdata.operate=that.search.side['operatesub'+i.toString()]
            let sqlsub = autoSqlCreate(searchdata,tabledatasub,formdatasub.isPage)
            this.$refs['pageCreateFormSub'+i.toString()].setFormData(sqlsub)
          }
        }
      },
      async addSqlCode() {
        let that = this
        let formdata = this.$refs['pageCreateForm'].getFormData()
        let sqlcode = await addSqlToDB(formdata)
        this.$refs['pageCreateForm'].setFormSqlCode(sqlcode)
        for(let i=1;i<5;i++)
        {
          if(that.search.side['tablenamesub'+i.toString()] !== '')
          {
            let formdatasub = this.$refs['pageCreateFormSub'+i.toString()].getFormData()
            let sqlcodesub = await addSqlToDB(formdatasub)
            this.$refs['pageCreateFormSub'+i.toString()].setFormSqlCode(sqlcodesub)
          }
        }
      },
			handleEdit(row) {
				this.$refs['edit'].showEdit(row)
			},
			tableSortChange() {

			},
      async getTableData() {
        let that = this
        let sData = "[Q]893{}|^SYS"
        let res = await QueryExec(sData)
        console.log(sData,res)
        that.tabledata = res.data
      },
			setSelectRows(val) {
				this.selectRows = val
			},
			handleAdd() {
				// this.$refs['edit'].showEdit()
			},
			searchTable() {

			},
      weekReportAdd() {
        // this.$refs['onDutyAddForm'].save()
      },
      async fetchData() {
        let that=this
        console.log(that.search.main)
      	this.$refs['pageCreateTable'].fetchData()
       //  this.$refs['monthReportCostTable'].fetchData()
        // this.$refs['monthReportTestTable'].fetchData()
      },
		},
	}
</script>
<style type="text/css">
  .el-form-item--small.el-form-item{margin-bottom:10px;}


</style>
