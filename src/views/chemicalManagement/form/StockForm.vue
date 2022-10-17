<template>
	<div class="purchasefrom">
		<el-form :model="form">
			<el-form-item label="名称" :label-width="formLabelWidth">
				<el-input v-model="form.name" readonly="readonly" disabled></el-input>
			</el-form-item>
			<el-form-item label="管理编号" maxlength="32" :label-width="formLabelWidth">
				<el-input v-model="form.manage_id"></el-input>
			</el-form-item>
			<el-form-item label="保管者" maxlength="16" :label-width="formLabelWidth">
				<el-input v-model="form.keeper"></el-input>
			</el-form-item>
			<el-form-item label="用途" maxlength="64" :label-width="formLabelWidth">
				<el-input v-model="form.usage" style="width: 100%"></el-input>
			</el-form-item>
			<el-form-item label="存放地址" maxlength="32" :label-width="formLabelWidth">
				<el-input v-model="form.storage_place" style="width: 100%"></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	export default {
		name: 'StockForm', //fenpei-form
		props: {
			//props列表
			father: {
				type: Object,
				required: false,
			},
		},
		data() {
			return {
				form: {},
				formLabelWidth: '85px',
				title: '',
			}
		},
		watch: {
			form: {
				handler: function(a, b) {
					this.$parent.$parent.update(a)
				},
				deep: true,
			},
		},
		created() {
			if (this.father) {
				console.log(this.father)
				this.form = Object.assign({}, this.father)
			}
		},
		methods: {
			updateFather(father) {
				this.form = Object.assign({}, father)
				this.$forceUpdate()
			},
		},
	}
</script>
