<template>
	<el-dialog width="500px" title="添加证书" :visible.sync="dialogFormVisible">
		<el-form :model="form" style="margin-right:15px;">
			<el-form-item label="人员名称" :label-width="formLabelWidth">
				<el-input v-model="form.number1" placeholder="请输入" style="width:300px"></el-input>
			</el-form-item>
			<el-form-item label="证书名称" :label-width="formLabelWidth">
				<el-input v-model="form.number2" placeholder="请输入" style="width:300px"></el-input>
			</el-form-item>
			<el-form-item label="证书编号" :label-width="formLabelWidth" style="margin-top:10px">
				<el-input v-model="form.number3" placeholder="请输入" style="width:300px"></el-input>
			</el-form-item>
			<el-form-item label="有效日期" :label-width="formLabelWidth" style="margin-top:10px">
				<el-date-picker v-model="form.date1" type="daterange" range-separator="至" start-placeholder="开始日期"
					end-placeholder="结束日期" style="width:300px"></el-date-picker>
			</el-form-item>
			<el-form-item label="扫描件" :label-width="formLabelWidth" style="margin-top:10px">
				<el-upload action="#" list-type="picture-card" :auto-upload="false">
					<i slot="default" class="el-icon-plus"></i>
					<div slot="file" slot-scope="{file}">
						<img class="el-upload-list__item-thumbnail" :src="file.url" alt />
						<span class="el-upload-list__item-actions">
							<span class="el-upload-list__item-preview" @click="handlePictureCardPreview1(file)">
								<i class="el-icon-zoom-in"></i>
							</span>
							<span v-if="!disabled1" class="el-upload-list__item-delete" @click="handleDownload1(file)">
								<i class="el-icon-download"></i>
							</span>
							<span v-if="!disabled1" class="el-upload-list__item-delete" @click="handleRemove1(file)">
								<i class="el-icon-delete"></i>
							</span>
						</span>
					</div>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible1" :modal="false">
					<img width="100%" :src="dialogImageUrl1" alt />
				</el-dialog>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="dialogFormVisible = false" style="margin-left:100px;width:100px">确 定
			</el-button>
			<el-button @click="dialogFormVisible = false" style="margin-left:100px;width:100px">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		doEdit
	} from '@/api/table'
	export default {
		name: 'TableEdit',
		data() {
			return {
				dialogFormVisible: false,
				form: {
					name: 'xst',
					region: '',
					date1: '2020 12 30',
					date2: '2020 12 31',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: ''
				},
				formLabelWidth: '120px',
				title: '',
				dialogFormVisible: false,
				dialogImageUrl1: '',
				dialogVisible1: false,
				disabled1: false
			}
		},
		created() {},
		methods: {
			showEdit(row) {
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					this.form = Object.assign({}, row)
				}
				this.dialogFormVisible = true
			},
			handleRemove1(file) {
				console.log(file);
			},
			handlePictureCardPreview1(file) {
				this.dialogImageUrl1 = file.url;
				this.dialogVisible1 = true;
			},
			handleDownload1(file) {
				console.log(file);
			}
		},
	}
</script>
