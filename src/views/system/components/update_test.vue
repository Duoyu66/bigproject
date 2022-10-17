<template>
	<el-dialog top="10vh" :title="title" :visible.sync="dialogFormVisible" width="500px">
		<upload ref="upload" :upload_type="upload_type" :original_name="original_name" :type_str="type_str"
			:type_array="type_array" :success_status.sync="success_status" v-model="upload_url" :disabled_upload='disabled_upload'></upload>
		<el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload"
			>
			上传到服务器
		</el-button>
		<el-button style="margin-left: 10px" size="small" type="success" @click="update">
			更新value
		</el-button>
	</el-dialog>

</template>

<script>
	import upload from '@/components/Upload/upload'
	export default {
		name: 'UpdateEdit',
		components: {
			upload,
		},
		data() {
			return {
				title: '',
				dialogFormVisible: false,
				upload_type: 1,
				original_name: [],
				type_str: "jpg",
				type_array: ['image/jpeg'],
				success_status: false,
				upload_url: '',
				disabled_upload: false,
			}
		},

		methods: {
			async submitUpload() {
				const result = await this.$refs['upload'].submitUpload()
				console.log(result, this.$refs['upload'].success)
				console.log(this.upload_url)
			},
			showEditEx(row) {
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					this.form = Object.assign({}, row)
				}
				this.dialogFormVisible = true
			},
			update() {
				this.upload_url = '/20210401/92841351a641478db445aebb3e52e728.jpg'
			}
		}
	}
</script>

<style>
</style>
