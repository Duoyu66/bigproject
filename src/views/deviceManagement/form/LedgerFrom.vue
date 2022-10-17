<template>
  <span class="purchasefrom">
      <el-form :model="form">
      	<el-form-item label="设备名称" :label-width="formLabelWidth">
      			<el-select v-model="form.name" style="width: 100%;">
      				<el-option label="电子天平" value="a"></el-option>
      			</el-select>
      		</el-form-item>
      		<el-form-item label="规格型号" :label-width="formLabelWidth">
      			<el-select v-model="form.name1" style="width: 100%;">
      				<el-option label="无" value="a"></el-option>
      			</el-select>
      		</el-form-item>
      	  <el-form-item label="生产厂家" :label-width="formLabelWidth">
      	  	<el-select v-model="form.name2" style="width: 100%;">
      	  		<el-option label="河北厂家" value="a"></el-option>
      	  	</el-select>
      	  </el-form-item>
      	  <el-form-item label="测量范围" :label-width="formLabelWidth">
      	  	<el-input v-model="form.number1" style="width: 100%;" disabled></el-input>
      	  </el-form-item>
      	  <el-form-item label="设备精度" :label-width="formLabelWidth">
      	  	<el-select v-model="form.name3" style="width: 100%;" disabled>
      	  		<el-option label="0.01" value="a"></el-option>
      	  	</el-select>
      	  </el-form-item>
      		<el-form-item :disabled="true" label="出厂日期" :label-width="formLabelWidth">
      			<el-date-picker
      			      v-model="form.value1"
      	          style="width: 100%;"
      			      type="date"
      			      disabled>
      			    </el-date-picker>
      		</el-form-item>
      	  <el-form-item :disabled="true" label="购置日期" :label-width="formLabelWidth">
      	  	<el-date-picker
      	  	      v-model="form.value2"
      	          style="width: 100%;"
      	  	      type="date"
      	  	      disabled>
      	  	    </el-date-picker>
      	  </el-form-item>
      		<el-form-item label="设备类型" :label-width="formLabelWidth">
      			<el-select v-model="form.name3" style="width: 100%;" disabled>
      				<el-option label="力学设备" value="a"></el-option>
      			</el-select>
      		</el-form-item>
      		<el-form-item label="存放位置" :label-width="formLabelWidth">
      			<el-select v-model="form.name4" style="width: 100%;" disabled>
      				<el-option label="力学采集检测室" value="a"></el-option>
      			</el-select>
      		</el-form-item>
      	  <el-form-item label="存放状态" :label-width="formLabelWidth">
      	  	<el-select v-model="form.name5" style="width: 100%;" disabled>
      	  		<el-option label="正常状态" value="a"></el-option>
      	  	</el-select>
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
         name1: 'a',
         name2: 'a',
         name3: 'a',
         name4: 'a',
         name5: 'a',
         region: '',
         date1: '',
         date2: '',
         delivery: false,
         type: [],
         resource: '',
         desc: '',
         number:'',
         value2:'2020-12-12',
         value1:'2020-05-06'
       },
       formLabelWidth: '70px',
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
