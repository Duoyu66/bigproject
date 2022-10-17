<template>
	<span class="purchasefrom">
    <el-row :gutter="10" style="width: 100%;">
      <el-form :model="form">
      <el-col :span="8">
        <el-form-item label="指标标识" :label-width="formLabelWidth">
        	<el-input v-model="form.number1" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="属记录单" :label-width="formLabelWidth">
            <el-switch v-model="form.delivery" style="width: 100%;"></el-switch>
          </el-form-item>
          <el-form-item label="自动采集" :label-width="formLabelWidth">
              <el-switch v-model="form.delivery1" style="width: 100%;"></el-switch>
            </el-form-item>
          <el-form-item label="数据类型" :label-width="formLabelWidth">
          	<el-select v-model="form.name" style="width: 100%;">
          		<el-option label="无" value="a"></el-option>
          	</el-select>
          </el-form-item>
          <el-form-item label="度量单位" :label-width="formLabelWidth">
          	<el-select v-model="form.name3" style="width: 100%;">
          		<el-option label="未选择" value="a"></el-option>
          	</el-select>
          </el-form-item>
        <el-form-item label="所属组" :label-width="formLabelWidth">
        	<el-select v-model="form.norms" style="width: 100%;">
        		<el-option label="试验A组" value="rygz"></el-option>
        	</el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="指标名称" :label-width="formLabelWidth">
        	<el-input v-model="form.number2" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="属报告" :label-width="formLabelWidth">
            <el-switch v-model="form.delivery2" style="width: 100%;"></el-switch>
          </el-form-item>
        <el-form-item label="自动计算" :label-width="formLabelWidth">
            <el-switch v-model="form.delivery3" style="width: 100%;"></el-switch>
        </el-form-item>
        <el-form-item label="源于数据组" :label-width="formLabelWidth">
        	<el-select v-model="form.name1" style="width: 100%;">
        		<el-option label="请选择源于数据组" value="a"></el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="最大平行数" :label-width="formLabelWidth">
        	<el-select v-model="form.name4" style="width: 100%;">
        		<el-option label="请输入" value="a"></el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="实际样本数" :label-width="formLabelWidth">
        	<el-input v-model="form.number7" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="数据项描述" :label-width="formLabelWidth">
        	<el-select v-model="form.name7" style="width: 100%;">
        		<el-option label="请选择" value="a"></el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="自动采集" :label-width="formLabelWidth">
            <el-switch v-model="form.delivery4" style="width: 100%;"></el-switch>
          </el-form-item>
          <el-form-item label="指标项" :label-width="formLabelWidth">
              <el-switch v-model="form.delivery5" style="width: 100%;"></el-switch>
          </el-form-item>
        <el-form-item label="输入方式" :label-width="formLabelWidth">
        	<el-select v-model="form.name2" style="width: 100%;">
        		<el-option label="未选择" value="a"></el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="实际平行数" :label-width="formLabelWidth">
        	<el-select v-model="form.name5" style="width: 100%;">
        		<el-option label="请选择" value="a"></el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="最大样本数" :label-width="formLabelWidth">
        	<el-input v-model="form.number8" style="width: 100%;"></el-input>
        </el-form-item>
      </el-col>
      <el-form-item label="指标描述" :label-width="formLabelWidth" style="width: 100%;">
      	<el-input v-model="form.number3" style="width: 100%;" type="textarea" placeholder="指标描述"></el-input>
      </el-form-item>
      <el-form-item label="平行数插件" :label-width="formLabelWidth" style="width: 100%;">
      	<el-input v-model="form.number4" style="width: 100%;" type="textarea" placeholder="请输入平行数插件公式"></el-input>
      </el-form-item>
      </el-form>
    </el-row>
    </span>
</template>
<script>
	import {
		doEdit
	} from '@/api/table'
	export default {
		name: 'TableEdit',
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
		data() {
			return {
				form: {
					name: 'a',
					norms: 'rygz',
          name1:'a',
          name2:'a',
          name3:'a',
          name4:'a',
          name5:'a',
          name6:'a',
          name7:'a',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '是',
          resource1:'是',
					desc: '',
					number: '',
					mill:'',
          value1:''
				},
				formLabelWidth: '85px',
				title: '',
			}
		},
		created() {
			if (this.father) {
				this.form = Object.assign({}, this.father)
			}
		},
		methods: {

		},
	}
</script>
