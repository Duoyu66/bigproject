<template>
  <!-- 标准物质消耗定义 -->
	<div class="table-container definition equipment_btn ">
    <!-- 原来的结构划分 区域划分修改 -->
<!-- 		<vab-query-form class="voidrecord" style="margin-bottom: 0px">
			<vab-query-form-left-panel style="width: 320px;">
				<el-form ref="form" :model="queryForm_main" :inline="true" @submit.native.prevent style="width: 100%;">
					<el-form-item style="float: left">
						<el-input v-model="queryForm_main.param" clearable style="width: 100%;" placeholder="参数名称">
						</el-input>
					</el-form-item>
					<el-form-item style="float: right;margin-right: -5px;">
						<el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData_main">
						</el-button>
					</el-form-item>
				</el-form>
			</vab-query-form-left-panel>

      <vab-query-form-right-panel style="width: calc(100% - 320px)" v-if="primary_key>0">
				<div style="float: right;">
					<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent >
						<el-form-item style="">
							<el-input v-model="queryForm.rm_name" clearable style="width: 100%;" placeholder="标准物质名称">
							</el-input>
						</el-form-item>

						<el-form-item style="">
							<el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData">
							</el-button>
						</el-form-item>
						<el-form-item style="">
							<el-button icon="el-icon-plus" type="primary" native-type="submit"
								@click="handAddParamChemical" v-if="permission.materialConsumptionAdd">
							</el-button>
						</el-form-item>
					</el-form>
				</div>
			</vab-query-form-right-panel>
		</vab-query-form> -->
		<el-container>
			<el-aside width="320px" class="baseBox">
        <vab-query-form-left-panel style="width:100%;">
        	<el-form ref="form" :model="queryForm_main" :inline="true" @submit.native.prevent style="width: 100%;">
        		<el-form-item style="float: left">
        			<el-input v-model="queryForm_main.param" clearable style="width: 100%;" placeholder="参数名称">
        			</el-input>
        		</el-form-item>
        		<el-form-item style="float: right; margin-right:0px;">
        			<el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData_main">
        			</el-button>
        		</el-form-item>
        	</el-form>
        </vab-query-form-left-panel>

				<!-- height: calc(77vh) -->
				<parameterTable ref="parameterTable" :permission="permission" :type="30" style="height:calc(85.5vh)"
					:primary_key.sync="primary_key"></parameterTable>
			</el-aside>

      <el-main style="margin-left:10px;">
        <div class="baseBox" >
          <vab-query-form-right-panel style="float:right;" v-if="primary_key>0">
            <div style="float: right;">
              <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent >
                <el-form-item style="">
                  <el-input v-model="queryForm.rm_name" clearable style="width: 100%;" placeholder="标准物质名称">
                  </el-input>
                </el-form-item>

                <el-form-item style="">
                  <el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData">
                  </el-button>
                </el-form-item>
                <el-form-item style="margin-right:0;">
                  <el-button icon="el-icon-plus" type="primary" native-type="submit"
                    @click="handAddParamChemical" v-if="permission.materialConsumptionAdd">
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </vab-query-form-right-panel>
          <paramRmTable ref="paramRmTable" style="height: calc(85.5vh)" :primary_key.sync="primary_key"
            :permission="permission" :type="10" v-if="primary_key>0">
          </paramRmTable>
          <el-empty v-else :description="emptyConfigDescript"></el-empty>
         </div>
			</el-main>
		</el-container>
		<paramRmDialog ref="paramRmDialog" :isUpData.sync="tableReload"></paramRmDialog>

	</div>
</template>

<script>
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
	} from '@/utils/dateHelp'

	import paramRmDialog from '../../testDevelopment/component/paramRmDialog'
	import parameterTable from '../../testDevelopment/table/parameterTable'
	import paramRmTable from '../../testDevelopment/table/paramRmTable'
	// import TableEdit9 from '../components/voidRecord1.vue'
	export default {
		name: 'materialConsumption',
		components: {
			parameterTable,
			paramRmTable,
			paramRmDialog,
		},
		watch: {
			tableReload(newVal, oldVal) {
				this.selectData()
			},
		},
		data() {
			return {
				emptyConfig: {
					description: ''
				},

				permission: {

				},
				tableReload: false,
				primary_key: -1,
				queryForm_main: {
					param: '',
				},
				pickerOptions: {
					before: pickerOptions({
						disabledDate: true,
						type_disable: 2
					}),
					after: pickerOptions({
						disabledDate: true,
						type_disable: 3,
						shortcuts_type: 'after'
					}),
					none: pickerOptions()
				},
				dateFormat: dateFormat(),
				queryForm: {
					rm_name: '',
				},



			}
		},
		computed: {
			emptyConfigDescript() {
				switch (this.type) {
					default:
						this.emptyConfig.description = '请先选择左侧参数'
						break
				}
				return this.emptyConfig.description
			},
			height() {
				return this.$baseTableHeight()
			},
		},
		created() {
			this.init()
		},
		beforeDestroy() {},
		mounted: function() {

		},
		methods: {
			async init() {
				let permissionList = ['materialConsumption'];
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
			},
			handAddParamChemical() {
				let info = {
					param_id: this.primary_key.toString(),
					//param: row.param
				}
				this.$refs['paramRmDialog'].showEdit(undefined, info)
			},
			selectData_main() {
				this.$refs['parameterTable'].search(this.queryForm_main)
			},
			selectData() {
				this.$refs['paramRmTable'].search(this.queryForm)
			}

		},
	}
</script>
<style type="text/css">
  .el-form-item--small.el-form-item{margin-bottom:10px;}
</style>
