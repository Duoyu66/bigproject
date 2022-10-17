<template>
    <!-- 化学品消耗记录 -->
	<div class=" definition equipment_btn" style="overflow: auto;">
<!-- 		<vab-query-form class="voidrecord" style="margin-bottom: 0px;margin-left: -5px;">

			<vab-query-form-right-panel style="width: calc(100% - 320px);margin-left: 5px;">

			</vab-query-form-right-panel>
		</vab-query-form> -->
		<el-container  style="overflow: auto;">
      <!-- 左边部分 -->
      <div class="baseBox baseBoxHeigh" style="margin-right: 10px;height: calc(88vh)">
        <el-aside width="320px">
          <span class="littleT">化学品列表</span>
          <el-form ref="form" :model="queryForm_main" :inline="true" @submit.native.prevent style="width: 100%;">
            <el-form-item style="float: left;">
              <el-input v-model="queryForm_main.name" clearable style="width: 100%;" placeholder="化学品名称">
              </el-input>
            </el-form-item>
            <el-form-item style="float: right;margin-right:0px;">
              <el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData_main">
              </el-button>
            </el-form-item>
          </el-form>
          <chemicalStoreTable ref="chemicalStoreTable" :permission="permission" type="chemical_consumption"
            style="height: calc(82vh)" :primary_key.sync="primary_key"></chemicalStoreTable>
        </el-aside>
      </div>
      <!-- 右边部分 -->
			<el-main style="margin-right:10px;">
        <div class="baseBox baseBoxHeigh" style="height: calc(88vh)">
          <span class="littleT">消耗记录</span>
          <div style="float: right;">
            <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
              <!-- <el-form-item style="">
                <el-input v-model="queryForm.nullify_reason" clearable style="width: 100%;"
                  placeholder="作废原因">
                </el-input>
              </el-form-item> -->
              <el-form-item label="" label-width="0px">
                <el-date-picker v-model="queryForm.use_date_start" type="date" placeholder="使用时间"
                  style="width: 47%" :format='dateFormat' :value-format="dateFormat" clearable>
                </el-date-picker>
                -
                <el-date-picker v-model="queryForm.use_date_end" type="date" placeholder="使用时间"
                  style="width: 47%" :format='dateFormat' :value-format="dateFormat" clearable>
                </el-date-picker>
              </el-form-item>
              <el-form-item style="">
                <el-input v-model="queryForm.use_person" clearable style="width: 100%;" placeholder="使用人">
                </el-input>
              </el-form-item>
              <el-form-item style="margin-right: 0;">
                <el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData">
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <chemicalConsumeTable ref="chemicalConsumeTable" :permission="permission" type="main"
            style="height: calc(75vh)" :primary_key="primary_key"></chemicalConsumeTable>
        </div>
			</el-main>

		</el-container>


	</div>
</template>

<script>
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
	} from '@/utils/dateHelp'


	import chemicalStoreTable from '../table/chemicalStoreTable'
	import chemicalConsumeTable from '../table/chemicalConsumeTable'
	// import TableEdit9 from '../components/voidRecord1.vue'
	export default {
		name: 'chemicalConsumption',
		components: {
			chemicalStoreTable,
			chemicalConsumeTable,
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
				permission: {

				},
				primary_key: -1,
				queryForm_main: {
					name: '',
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
					check_person: '',
					check_date_start: '',
					check_date_end: '',
				},
			}
		},
		computed: {

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
				let permissionList = ['chemicalConsumption'];
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
			selectData_main() {
				this.$refs['chemicalStoreTable'].search(this.queryForm_main)
			},
			selectData() {
				this.$refs['chemicalConsumeTable'].search(this.queryForm)
			}

		},
	}
</script>
<style>
.baseBox{background:#fff;border-radius:5px;border: 1px solid #dbe0e6;padding: 10px;box-sizing: border-box;
box-shadow: 0 1px 4px rgb(0 21 41 / 8%);}
.littleT{font-size:16px;display: inline-block;margin-bottom: 10px;line-height: 32px;}
.el-form-item--small.el-form-item{margin-bottom: 10px;}

@media only screen and (max-width: 1366px) {
/* .heightControl{height:calc(69vh)!important;} */
/* .consumtabHight{height: calc(75.5%);} */
.consumLeftBox{height: calc(72vh)!important;}
.consumeleftHigh{height: calc(80%)!important;}
.consumRightHigh{height: calc(54vh)!important;}
.baseBoxHeigh{height: calc(81vh)!important;}
  }
</style>
