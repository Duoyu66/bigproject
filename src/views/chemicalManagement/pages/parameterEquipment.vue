<template>
  <!-- 参数化学品消耗定义 -->
	<div class="table-container definition equipment_btn" style="overflow: auto;">
	<!-- 	<vab-query-form class="voidrecord" style="margin-bottom: 16px">

			<vab-query-form-right-panel style="width: calc(100% - 320px)" v-if="primary_key>0">
				<div style="width: 100%;float: right;">
					 <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
						<el-form-item style="">
							<el-input v-model="queryForm.chemical_name" clearable style="width: 100%;"
								placeholder="化学品名称">
							</el-input>
						</el-form-item>

						<el-form-item style="">
							<el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData">
							</el-button>
						</el-form-item>
						<el-form-item style="">
							<el-button icon="el-icon-plus" type="primary" native-type="submit"
								@click="handAddParamChemical" v-if="permission.parameterEquipmentAdd">
							</el-button>
						</el-form-item>
					</el-form>
				</div>
			</vab-query-form-right-panel>
		</vab-query-form>-->
		<el-container style="height: calc(88vh);overflow: auto;">
      <!-- 左半部分 -->
      <div class="baseBox" style="margin-right: 10px;">
        <!-- <vab-query-form-left-panel style="width: 320px;float: left;"> -->
        <el-form ref="form" :model="queryForm_main" :inline="true" @submit.native.prevent style="width: 100%;">
          <el-form-item style="">
            <el-input v-model="queryForm_main.param" clearable style="width: 100%;" placeholder="参数名称">
            </el-input>
          </el-form-item>
          <el-form-item style="">
            <el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData_main">
            </el-button>
          </el-form-item>
        </el-form>

        <el-aside width="320px">
          <parameterTable ref="parameterTable" :permission="permission" :type="30" style="height: 100%"
            :primary_key.sync="primary_key"></parameterTable>
        </el-aside>
      </div>
      <!-- 右半部分 -->
			<el-main style="margin-right:10px;">
        <div class="baseBox" style="height: calc(88vh);">
          <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
            <el-form-item style="">
              <el-input v-model="queryForm.chemical_name" clearable style="width: 100%;"
                placeholder="化学品名称">
              </el-input>
            </el-form-item>

            <el-form-item style="">
              <el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData">
              </el-button>
            </el-form-item>
            <el-form-item style="">
              <el-button icon="el-icon-plus" type="primary" native-type="submit"
                @click="handAddParamChemical" v-if="permission.parameterEquipmentAdd">
              </el-button>
            </el-form-item>
          </el-form>
          <!-- height: calc(77vh) -->
          <paramChemicalTable ref="paramChemicalTable" style="height: 100%" :primary_key.sync="primary_key"
            :permission="permission" :type="10" v-if="primary_key>0">
          </paramChemicalTable>
          <el-empty v-else :description="emptyConfigDescript"></el-empty>
        </div>
			</el-main>

		</el-container>
		<paramChemicalDialog ref="paramChemicalDialog" :isUpData.sync="tableReload"></paramChemicalDialog>

	</div>
</template>

<script>
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
	} from '@/utils/dateHelp'

	import paramChemicalDialog from '../../testDevelopment/component/paramChemicalDialog'
	import parameterTable from '../../testDevelopment/table/parameterTable'
	import paramChemicalTable from '../../testDevelopment/table/paramChemicalTable'
	// import TableEdit9 from '../components/voidRecord1.vue'
	export default {
		name: 'parameterEquipment',
		components: {
			parameterTable,
			paramChemicalTable,
			paramChemicalDialog,
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
				tableReload:false,
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
					chemical_name: '',
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
				let permissionList = ['parameterEquipment'];
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
				console.log(this.permission)
			},
			handAddParamChemical() {
				let info = {
					param_id: this.primary_key.toString(),
					//param: row.param
				}
				this.$refs['paramChemicalDialog'].showEdit(undefined, info)
			},
			selectData_main() {
				this.$refs['parameterTable'].search(this.queryForm_main)
			},
			selectData() {
				this.$refs['paramChemicalTable'].search(this.queryForm)
			}

		},
	}
</script>
<style type="text/css">
  .el-form-item--small.el-form-item{margin-bottom:10px;}
  .parameterRtableBox{height:96%!important;}
  .parameterLtableHigh{height: calc(76vh)!important;}
  @media only screen and (max-width: 1366px) {
  section.el-container{height: calc(83vh)!important;}
  .parameterLtableHigh{height: calc(66vh)!important;}
  .el-main .baseBox{height: calc(83vh - 10px)!important;}
  .parameterRtableBox{height:91%!important;}
  .parameterRtableBox .el-table{height: calc(66vh)!important;}
  .el-main{overflow:hidden;}
  }
</style>
