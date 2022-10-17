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
		<el-form-item label="测量范围" :label-width="formLabelWidth">
			<el-input v-model="form.number3" style="width: 100%;" disabled></el-input>
		</el-form-item>
		<el-form-item label="精度" :label-width="formLabelWidth">
			<el-input v-model="form.number4" style="width: 100%;" disabled></el-input>
		</el-form-item>
		<el-form-item label="生产日期" :label-width="formLabelWidth">
			<el-date-picker
			      v-model="form.value1"
		        style="width: 100%;"
			      type="date"
			      placeholder="选择日期">
			    </el-date-picker>
		</el-form-item>
        <el-form-item label="核查方式" :label-width="formLabelWidth">
        	<el-select v-model="form.name4" style="width: 100%;">
        		<el-option label="普通核查" value="a"></el-option>
        	</el-select>
        </el-form-item>
        <el-form-item label="核查实施人" :label-width="formLabelWidth">
        	<el-input v-model="form.mill2" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="核查结果" :label-width="formLabelWidth">
        	<el-select v-model="form.name3" style="width: 100%;">
        		<el-option label="核查合格" value="a"></el-option>
            <el-option label="核查不合格" value="b"></el-option>
        	</el-select>
        </el-form-item>
      	<el-form-item label="经手人" :label-width="formLabelWidth">
      		<el-input v-model="form.mill4" style="width: 100%;"></el-input>
      	</el-form-item>
      </el-form>
    </span>
</template>

<script>
  import { doEdit } from '@/api/table'
  export default {
    name: 'TableEdit',
    data() {
      return {
        dialogFormVisible: false,
       form: {
         name: 'a',
         name1:'a',
         name2:'a',
         name3:'a',
         name4:'a',
         norms:'rygz',
         region: '',
         date1: '',
         date2: '',
         delivery: false,
         type: [],
         resource: '',
         desc: '',
         number:'',
         value1:''
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

   },
   }
</script>
