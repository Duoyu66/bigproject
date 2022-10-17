<template>
	<span class="purchasefrom">
		<el-form :model="form">
			<el-form-item label="管理编号" :label-width="formLabelWidth">
				<el-select v-model="form.name" style="width: 100%;">
					<el-option label="GX-12" value="a"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="设备名称" :label-width="formLabelWidth">
				<el-select v-model="form.name1" style="width: 100%;">
					<el-option label="电子天平" value="a"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="规格型号" :label-width="formLabelWidth">
				<el-select v-model="form.name2" style="width: 100%;" disabled>
					<el-option label="无" value="a"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="校检单位" :label-width="formLabelWidth">
				<el-input v-model="form.mill" style="width: 100%;"></el-input>
			</el-form-item>
			<el-form-item label="测量范围" :label-width="formLabelWidth">
				<el-input v-model="form.mill2" style="width: 100%;" disabled></el-input>
			</el-form-item>
			<el-form-item label="精度" :label-width="formLabelWidth">
				<el-select v-model="form.name3" style="width: 100%;" disabled>
					<el-option label="0.01" value="a"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :disabled="true" label="校检日期" :label-width="formLabelWidth">
				<el-date-picker v-model="form.value1" style="width: 100%;" type="date">
				</el-date-picker>
			</el-form-item>

			<el-form-item label="校检人" :label-width="formLabelWidth">
				<el-input v-model="form.mill3" style="width: 100%;"></el-input>
			</el-form-item>
			<el-form-item label="校检意见" :label-width="formLabelWidth">
				<el-input v-model="form.mill4" style="width: 100%;"></el-input>
			</el-form-item>
			<el-form-item label="数据确认" :label-width="formLabelWidth">
				<el-table :data="form.confirmData" @row-dblclick="ConfirmTableDbclick">

					<el-table-column prop="project" label="项目">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isOK" v-model="scope.row.project"></el-input>
							<span v-else>{{scope.row.project}}</span>

						</template>
					</el-table-column>
					<el-table-column prop="result" label="测得结果">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isOK" v-model="scope.row.result">
							</el-input>
							<span v-else>{{scope.row.result}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="标准要求">
						<template slot-scope="scope">
							<el-input v-if="scope.row.isOK" v-model="scope.row.require">
							</el-input>
							<span v-else>{{scope.row.require}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="是否满足要求">
						<template slot-scope="scope">
							<el-select v-if="scope.row.isOK" placeholder="请选择" v-model="scope.row.qualified"
								style="width: 100%;">

								<el-option label="是" value="是"></el-option>
								<el-option label="否" value="否"></el-option>
							</el-select>
							<span v-else>{{scope.row.qualified}}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item label="校检结果" :label-width="formLabelWidth">
				<el-select v-model="form.name4" style="width: 100%;">
					<el-option label="校检正常" value="a"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="证书编号" :label-width="formLabelWidth">
				<el-input v-model="form.mill5" style="width: 100%;"></el-input>
			</el-form-item>
			<el-form-item label="证书扫描件" :label-width="formLabelWidth">
				<el-input v-model="form.mill6" style="width: calc(100% - 57px);"></el-input>
				<el-button type="primary">上传</el-button>
			</el-form-item>
		</el-form>
	</span>
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
					maxid: -1,
					confirmData: [{
						id: 1,
						isOK: false,
						project: '激光波长',
						result: '808nm',
						require: '807nm-810nm',
						qualified: '是'
					}, {
						id: 2,
						isOK: false,
						project: '激光波长',
						result: '1mm'
					}, {
						isOK: false,
						project: '',
						result: ''
					}],
					name: 'a',
					name1: 'a',
					name2: 'a',
					name3: 'a',
					name4: 'a',
					norms: 'rygz',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: '',
					value1: '2019-02-02',
					value2: '2020-11-08',
          certificate_image: '',
          plan_id: ''
				},
				formLabelWidth: '120px',
				title: '',
				dialogFormVisible: false,
			}
		},
		created() {
			if (this.father) {
				this.form = Object.assign({}, this.father)
			}
		},
		methods: {
			GetMaxId() {
				let maxId = -1;
				let length = this.confirmData.length
				while (length > -1) {

				}
			},
			ConfirmTableDbclick(row, event, column) {
				row.isOK = !row.isOK
				if (!row.isOK) {
					let falg = false
					for (let key in row) {
						if (key) {
							falg = true
						} else {
							falg = false
						}
					}
					if (falg) {
						if (maxid == -1) {

						}
					}
				}
			},
		},
	}
</script>
