<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" width="80%" @close="close" top="3vh" append-to-body>
		<div style="max-height: calc(100vh - 250px); overflow-y: auto">
			<obejctParamRelationship ref="obejctParamRelationship" :object_id="object_id" :type="formType" v-if="show">
			</obejctParamRelationship>
		</div>

	</el-dialog>
</template>

<script>
	import obejctParamRelationship from '../component/obejctParamRelationship'
	export default {
		name: 'obejctParamRelationshipDialog',
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

		},
		components: {
			obejctParamRelationship
		},
		data() {
			let that = this
			return {
				formType: 0,
				object_id: -1,
				form: {

				},
				title: '',
				dialogFormVisible: false,
				formLabelWidth: '120px',
				show: false,
			}

		},
		created() {},
		methods: {
			showEdit(row, info) {
				let form = {}
				this.form = {}
				if (!row) {
					this.title = '添加'
					this.formType = 10;
				} else {
					let object_name = row.object_name
					this.object_id = parseFloat(row.object_id)
					let formType = info.formType
					if (typeof formType == 'undefined') {
						formType = 10
					}
					this.title = object_name + ''
					switch (formType) {
						case 10:
							this.title = this.title + '常用试验参数管理'
							break
						case 20:
							this.title = this.title + '试验参数管理'
							break
					}
					this.formType = formType;
					form = Object.assign(form, row)
				}
				this.$set(this, 'show', true)
				this.form = Object.assign(this.form, form)
				this.dialogFormVisible = true
			},
			close(event, status) {
				if (status) {
					this.$emit('update:isUpData', !this.isUpData);
					this.$emit('on-change', !this.isUpData);

				}
				this.$refs['obejctParamRelationship'].close();
				this.$emit('reloadChildren', this.form);
				this.dialogFormVisible = false
				this.$set(this, 'show', false)
			},

		},
	}
</script>
