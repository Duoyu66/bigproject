<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="650px" @close="close" top="5vh" center
 >
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<sysDataGroupForm ref="sysDataGroupForm" :formData.sync="form" :table_type="option.table_type" :type="type"
				:outOrgStatus="option.outOrgStatus">
			</sysDataGroupForm>
		</div>
		<div slot="footer" class="dialog-footer dialog-footer-center-custom">
			<el-button type="primary" @click="save">确 定</el-button>
			<el-button @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import sysDataGroupForm from '../form/sysDataGroupForm'
	export default {
		name: 'sysDataGroupDialog',
		//inject: ['reload'],
		model: {
			prop: 'isUpData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			isUpData: {
				type: Boolean,
				default: false
				//required: true,
			},
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			},
		},
		watch: {

		},
		components: {
			sysDataGroupForm
		},
		data() {
			let that = this
			return {
				form: {

				},
				info: {

				},
				option: {
					table_type: "0",
					outOrgStatus: false,
				},
				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px',
			}

		},
		created() {},
		methods: {
			showEdit(row, formInfo, option) {
				let form = {};
        this.form={};
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					form = Object.assign(form, row)
				}
				if (formInfo) {
					form = Object.assign(form, formInfo)
				}
				if (option) {
					this.option = Object.assign(this.option, option)
				}
        
				this.form = Object.assign({},this.form, form)
				this.info = Object.assign(this.info, form);
        console.log('form',form)
				this.title += '字典分组'
        this.dialogFormVisible = true
        if(this.$refs['sysDataGroupForm']){
            this.$refs['sysDataGroupForm'].init(this.form);
        }
				
			},
			async close(event, status) {
				if (status) {
					await this.reload_table()
				}
				this.$refs['sysDataGroupForm'].close()
				this.dialogFormVisible = false
			},
			async reload_table() {
				this.$emit('fencthRelod');
				this.$emit('fencthRelodChildren');
			},
			save() {
				let that = this
				this.$refs['sysDataGroupForm'].save(async (valid) => {
					if (valid) {
						await that.close(undefined, true)
					}
				})
			},
		},


	}
</script>
