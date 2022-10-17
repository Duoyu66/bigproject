<template>
	<div class="table-container definition equipment_btn">
<!-- 		<vab-query-form class="voidrecord" style="margin-bottom: 0px">
			<vab-query-form-left-panel style="width: 320px">

			</vab-query-form-left-panel>
			<vab-query-form-right-panel style="width: calc(100% - 320px)">

			</vab-query-form-right-panel>
		</vab-query-form> -->
		<el-container>
		    <div class="baseBox" style="margin-right: 10px;height: calc(87.8vh)">
          <span class="littleT">化学品列表</span>
          <el-form ref="form" :model="queryForm_main" :inline="true" @submit.native.prevent style="width: 100%;">
         	<el-form-item style="float: left;">
         		<el-input v-model="queryForm_main.name" clearable style="width: 100%;" placeholder="化学品名称">
         		</el-input>
            </el-form-item>
            <el-form-item style="float: right;margin-right: 0px;">
              <el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData_main">
              </el-button>
            </el-form-item>
          </el-form>
          <el-aside width="320px">
            <!-- height: calc(73vh) -->
            <chemicalStoreTable ref="chemicalStoreTable" :permission="permission" type="chemicalNullify"
              style="height: 100%" :primary_key.sync="primary_key"></chemicalStoreTable>
          </el-aside>
      </div>

			<el-main >
        <div class="baseBox" style="height: calc(87.8vh)">
          <span class="littleT">作废记录</span>
          <div style="float: right;">
            <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
              <el-form-item style="">
                <el-input v-model="queryForm.nullify_person" clearable style="width: 100%;"
                  placeholder="作废人">
                </el-input>
              </el-form-item>
              <!-- <el-form-item style="">
                <el-input v-model="queryForm.nullify_reason" clearable style="width: 100%;"
                  placeholder="作废原因">
                </el-input>
              </el-form-item> -->
              <el-form-item style="">
                <el-date-picker v-model="queryForm.nullify_date_start" align="right" type="date"
                  placeholder="作废起始时间" :picker-options="pickerOptions.none" style="width:100%"
                  :format='dateFormat' :value-format="dateFormat">
                </el-date-picker>
              </el-form-item>
              <el-form-item style="">
                <el-date-picker v-model="queryForm.nullify_date_end" align="right" type="date"
                  placeholder="作废结束时间" :picker-options="pickerOptions.none" style="width: 100%"
                  :format='dateFormat' :value-format="dateFormat">
                </el-date-picker>
              </el-form-item>
              <el-form-item style="margin-right: -1px;">
                <el-button icon="el-icon-search" type="primary" native-type="submit" @click="selectData">
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <chemicalNullifyTable ref="chemicalNullifyTable" :permission="permission" type="main"
					 style="height:92%" :primary_key="primary_key"></chemicalNullifyTable>
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
	import chemicalNullifyTable from '../table/chemicalNullifyTable'
	// import TableEdit9 from '../components/voidRecord1.vue'
	export default {
		name: 'ComprehensiveTable',
		components: {
			chemicalStoreTable,
			chemicalNullifyTable,
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
					nullify_person: '',
					nullify_date_start: '',
					nullify_date_end: '',
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
				let permissionList = ['voidRecord'];
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
				this.$refs['chemicalNullifyTable'].search(this.queryForm)
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
  .nullifyRTableHigh{height: calc(75%)!important;}
}
</style>
