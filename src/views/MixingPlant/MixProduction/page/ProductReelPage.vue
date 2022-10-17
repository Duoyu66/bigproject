<template>
	<!-- 试验配置-参数管理 -->
	<div class="table-container purchase equipment_btn">
		<div class="baseBox" style="margin-bottom: 10px;">
			<vab-query-form>
				<vab-query-form-left-panel style="width: 20%" v-if="false">
					<el-button type="primary" @click="handleAddd">添加根节点参数</el-button>
				</vab-query-form-left-panel>
				<vab-query-form-right-panel style="width: 100%">
					<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
						<el-form-item style="padding-right: 10px;">
							<el-date-picker v-model="queryForm.start_output_time" align="right" type="datetime"
								placeholder="选择出料开始时间" :picker-options="pickerOptions" style="width: 100%"
								:format='dateFormat' :value-format="dateFormat">
							</el-date-picker>
						</el-form-item>
						<el-form-item style="padding-right: 10px;">
							<el-date-picker v-model="queryForm.end_output_time" align="right" type="datetime"
								placeholder="选择出料结束时间" :picker-options="pickerOptions" style="width: 100%"
								:format='dateFormat' :value-format="dateFormat">
							</el-date-picker>
						</el-form-item>
						<el-form-item style="padding-right: 10px;">
							<el-input v-model="queryForm.project_name" placeholder="项目名称" clearable />
						</el-form-item>
						<el-form-item style="padding-right: 10px;">
							<el-input v-model="queryForm.strength" placeholder="强度等级" clearable />
						</el-form-item>
						<el-form-item style="padding-right: 10px;">
							<el-input v-model="queryForm.mileage" placeholder="里程" clearable />
						</el-form-item>
						<el-form-item style="padding-right: 10px;">
							<el-input v-model="queryForm.pour_place" placeholder="施工部位" clearable />
						</el-form-item>
						<el-form-item>
							<el-button icon="el-icon-search" type="primary" native-type="submit"
								@click="search_main_fob">
								查询
							</el-button>
						</el-form-item>
					</el-form>
				</vab-query-form-right-panel>
			</vab-query-form>

			<el-container>
				<el-main style="height: calc(37vh); min-height: 275px;" class="box1">
					<!-- productReelTable -->
					<productReelTable ref="productReelTable" style="height: calc(100%);min-height: 300px" :type="1"
						:selectForm.sync="queryForm" :primary_key.sync="primary_key" :permission="permission"
						:isOnlyShowQualified="isOnlyShowQualified" :isOnlyShowError="isOnlyShowError">
					</productReelTable>
					<!-- 				<el-dialog title="删除参数" :visible.sync="dialogFormVisible">
            <div style="font-size: 22px">
              您的删除将删除本条参数及相关的所有数据包括(参数名称、参数版本、龄期、启用时间）
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogFormVisible = false">
                确 定
              </el-button>
              <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
          </el-dialog> -->
					<!-- <table-edit1 ref="edit1"></table-edit1> -->
				</el-main>

			</el-container>
		</div>
		<!-- 第二个表格 -->
		<el-footer class="table_auto">
			<el-tabs type="border-card" style="height: calc(42.5164vh)" @tab-click="handleClick" v-model="activeName">

				<el-tab-pane label="用料明细" name="ProductMaterialCarTable">
					<ProductMaterialCarTable ref="ProductMaterialCarTable" style="height: calc(34vh)"
						v-if="ifShow.ProductMaterialCarTable" :primary_key.sync="primary_key" :permission="permission"
						:type="10">
					</ProductMaterialCarTable>
				</el-tab-pane>
				<el-tab-pane label="建材质量" name="RatioDetailTable" v-if="false">
					<RatioDetailTable ref="RatioDetailTable" style="height: calc(34vh)" v-if="ifShow.RatioDetailTable"
						:primary_key.sync="primary_key" :permission="permission" :type="11">
					</RatioDetailTable>
				</el-tab-pane>
				<el-tab-pane label="试块记录" name="LbStrengthTable" v-if="false">
					<LbStrengthTable ref="LbStrengthTable" style="height: calc(34vh)" :primary_key.sync="primary_key"
						:permission="permission" :type="11" v-if="ifShow.LbStrengthTable">
					</LbStrengthTable>
				</el-tab-pane>
				<el-tab-pane label="相关问题" name="riskTable">
					<riskTable ref="riskTable" style="height: calc(34vh)" :primary_key.sync="primary_key"
						:permission="permission" :type="11" v-if="ifShow.riskTable">
					</riskTable>
				</el-tab-pane>
				<el-tab-pane label="短信" name="SmsTable">
					<SmsTable ref="SmsTable" style="height: calc(34vh)" :primary_key.sync="primary_key"
						:permission="permission" :type="11" v-if="ifShow.SmsTable">
					</SmsTable>
				</el-tab-pane>
				<el-tab-pane label="运输轨迹" name="truckTravel" v-if="false">
					<truckTravel ref="truckTravel" style="height: calc(34vh)" :primary_key.sync="primary_key"
						:permission="permission" :type="0" v-if="ifShow.truckTravel">
					</truckTravel>
				</el-tab-pane>
			</el-tabs>


			<!-- <table-edit ref="edit"></table-edit> -->

		</el-footer>
	</div>
</template>

<script>
	import {
		getList,
		doDelete
	} from '@/api/table'
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
		getdayEx,
		mGetDate
	} from '@/utils/dateHelp';
	// import TableEdit1 from '../components/parameterManagement1.vue'

	import productReelTable from '../table/productReelTable'
	import riskTable from '../table/riskTable'
	import RatioDetailTable from '../table/ratioDetailTable.vue'
	import LbStrengthTable from '../table/LbStrengthTable'
	import ProductMaterialCarTable from '../table/ProductMaterialCarTable'
	import SmsTable from '../table/SmsTable'
	import truckTravel from '../../../truckManage/page/truckTravel'

	//import TableEdit from '../components/parameterManagement'

	export default {
		name: 'ProductCarPage',
		components: {
			productReelTable,
			riskTable,
			RatioDetailTable,
			LbStrengthTable,
			ProductMaterialCarTable,
			SmsTable,
			truckTravel,
			//TableEdit,
			// TableEdit1,

		},
		props: {
			isOnlyShowQualified: {
				type: Boolean,
				default: false,
			},
			isOnlyShowError: {
				type: Boolean,
				default: false,
			}
		},
		provide() {
			return {
				paramReload: this.reload_min,
				reload: this.reload_min,
			}
		},

		data() {
			return {
				pickerOptions: pickerOptions(),
				dateFormat: dateFormat(1),
				// 使用中
				queryForm: {
					// pageNo: 1,
					// pageSize: 20,
					param: '',
					class_name: '',
					start_output_time: getdayEx('day', -7, dateFormat(1))
				},
				primary_key: 0,
				permission: {},
				ifShow: {
					productReelTable: false,
					RatioDetailTable: false,
					LbStrengthTable: false,
					riskTable: false,
					truckTravel: false,
					SmsTable: false,
					ProductMaterialCarTable: false
				},
				activeName: 'RatioDetailTable',
				table: {
					tableHeight: this.$(window).height()
				}
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
			this.$nextTick(function() {

			});
		},
		methods: {
			init() {
				this.tabShow({
					name: this.activeName
				});
				this.$nextTick(() => {
					this.search_main_fob();
				})

			},
			search_main_fob() {
				this.$refs['productReelTable'].search(this.queryForm)
			},
			reload_min(row) {
				this.$refs['productReelTable'].fetchData(row)
			},
			handleAddd() {
				this.$refs['edit'].showEdit()
			},
			tabShowSwitch(tabName) {
				if (this.ifShow[tabName]) {
					return
				}
				this.$nextTick(() => {
					this.ifShow[tabName] = true;
				});
			},
			tabShow(tab, event) {
				// 切换tab栏时,在进行一次子组件刷新
				// console.log(tab, event);
				for (let key in this.ifShow) {
					this.ifShow[key] = false
				}
				//el-tabs栏数据缓存问题(数据过多渲染时长不够问题)
				// 点击后在进行初始化
				this.tabShowSwitch(tab.name);
			},
			handleClick(VueComponent, MouseEvent) {
				//console.log(tab, event);
				this.activeName = VueComponent.name
				this.tabShow(VueComponent, MouseEvent);
			},
		},
	}
</script>
<style lang="scss" scoped>
	// 第二个表格高度设置  全高-第一个表格高度529px -底部边距10px-底部滚动条10px
	.table_auto {
		box-sizing: border-box;
		height: calc(#{$base-app-main-height} - 529px - 20px) !important;
	}
</style>
