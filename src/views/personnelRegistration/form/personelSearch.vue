<template>
	<el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>
		<el-row class="">
			<el-col style="overflow: hidden;">
				<el-row style="width: auto;">

					<el-form-item style="">
						<el-select v-model="queryForm.org_type">
							<el-option v-for="data in selectData.org_type" :key="data.value" :label="data.label"
								:value="data.value">
							</el-option>
						</el-select>
					</el-form-item>


					<el-form-item style="">
						<el-input v-model="queryForm.name" placeholder="人员名称">
						</el-input>
					</el-form-item>


					<el-form-item>
						<!-- 	<el-input v-model="queryForm.title">
						</el-input> -->
						<el-select v-model="queryForm.title" placeholder="职称" style="width: 100%" clearable filterable>
							<el-option v-for="data in selectData.title" :key="data.item_name" :label="data.item_name"
								:value="data.item_name">
							</el-option>
						</el-select>
					</el-form-item>


					<el-form-item>
						<el-select v-model="queryForm.sex" placeholder="性别" style="width: 100%" clearable filterable>
							<el-option v-for="data in selectData.sex" :key="data.item_name" :label="data.item_name"
								:value="data.item_name">
							</el-option>
						</el-select>
						<!-- 				<el-input v-model="queryForm.sex" placeholder="性别">
						</el-input> -->
					</el-form-item>


					<el-form-item>
						<el-input v-model="queryForm.mobile" placeholder="手机">
						</el-input>
					</el-form-item>


					<el-form-item style="margin-right: 0!important;">
						<el-button icon="el-icon-search" type="primary" @click="search">

						</el-button>
					</el-form-item>

				</el-row>
			</el-col>
			<el-col :span="span3" v-if='false'>
				<el-form-item>
					<el-button icon="el-icon-document-add" type="primary" @click="handlExport">
						导出
					</el-button>
				</el-form-item>

			</el-col>

		</el-row>
	</el-form>
</template>

<script>
	import {
		GetGroupData,
		GetGroupDataEx
	} from "@/utils/htmlDataGroup";
	export default {
		name: 'personnelSearch',
		model: {
			prop: 'value',
			event: 'on-change'
		},
		props: {
			//.sync同步
			value: {
				type: Object,
				default: function() {
					return undefined
				},
				//required: true,
			},
			search_fob: {
				type: Function,
				default: function() {

				}
			}
		},
		data() {
			return {
				span: 24 - 3,
				span3: 3,
				span2: 4,
				selectData: {
					org_type: [{
						value: 1,
						label: '原机构'
					}, {
						value: 2,
						label: '调拨机构'

					}],
					title: [],
					sex: [{
						item_name: '男'
					}, {
						item_name: '女'
					}]
				},
				queryForm: {
					name: '',
					title: '',
					sex: '',
					mobile: '',
					org_type: 2,
				}
			}
		},
		created() {
			this.groupGet();
		},
		methods: {
			async groupGet() {
				let list = [{
					data: "title",
					group_id: 1025,
				}, ];
				await GetGroupDataEx(this, list);
			},
			handlExport() {

			},
			search() {
				this.$emit('update:value', this.queryForm);
				this.$emit('on-change', this.queryForm);
				if (this.search_fob) {
					this.search_fob(this.queryForm)
				}
			}
		},
	}
</script>

<style>

</style>
