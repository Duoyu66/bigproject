<template>
  <span class="purchasefrom">
    <el-form :model="form" style="padding: 40px 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;">
      <el-form-item label="管理编号" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 100%;">
          <el-option label="GX-12" value="a"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称" :label-width="formLabelWidth">
        <el-select v-model="form.name3" style="width: 100%;">
          <el-option label="电子天平" value="a"></el-option>
          <el-option label="透气仪" value="b"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用规范" :label-width="formLabelWidth">
        <el-select v-model="form.name1" style="width: 100%;" disabled>
          <el-option label="无" value="a"></el-option>
          <el-option label="左物右码" value="b"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测量范围" :label-width="formLabelWidth">
      	<el-input v-model="form.number3" style="width: 100%;" disabled></el-input>
      </el-form-item>
      <el-form-item label="精度" :label-width="formLabelWidth">
      	<el-input v-model="form.number4" style="width: 100%;" disabled></el-input>
      </el-form-item>
      <el-form-item label="是否使用" :label-width="formLabelWidth">
        <el-select v-model="form.name2" style="width: 100%;">
          <el-option label="是" value="a"></el-option>
          <el-option label="否" value="b"></el-option>
        </el-select>
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
          name: 'a',
          name1: 'b',
          name2: 'a',
          name3: 'a',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          number: ''
        },
        formLabelWidth: '120px',
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

<style>
</style>
