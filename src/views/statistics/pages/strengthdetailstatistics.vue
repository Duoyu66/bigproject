<template>
	<div id="app">
		<!-- TODO: Monochrome color picker 서비스단으로 이동 -->
    <div class="definition purchase contract equipment_btn calc">
      <el-tabs type="border-card" class="box_center" style="">
        <el-tab-pane label="总数">
          <el-row>
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button :type="buttontype==1?'primary':'default'" @click="setDay(1)"    >当日</el-button>
                <el-button :type="buttontype==2?'primary':'default'" @click="setWeek(1)"   >当周</el-button>
                <el-button :type="buttontype==3?'primary':'default'" @click="setMonth(1)"  >当月</el-button>
                <el-button :type="buttontype==4?'primary':'default'" @click="setSeason(1)" >当季</el-button>
                <el-button :type="buttontype==5?'primary':'default'" @click="setYear(1)"   >当年</el-button>
              </el-button-group>
            </el-col>

            <el-col :span="24">
              <strengthdetailcharts1 ref="strengthdetailcharts1" :type="1"></strengthdetailcharts1>
            </el-col>
          </el-row>



    	  </el-tab-pane>
    	  <el-tab-pane label="总盘数">
          <el-row>
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button :type="buttontype==1?'primary':'default'" @click="setDay(2)"    >当日</el-button>
                <el-button :type="buttontype==2?'primary':'default'" @click="setWeek(2)"   >当周</el-button>
                <el-button :type="buttontype==3?'primary':'default'" @click="setMonth(2)"  >当月</el-button>
                <el-button :type="buttontype==4?'primary':'default'" @click="setSeason(2)" >当季</el-button>
                <el-button :type="buttontype==5?'primary':'default'" @click="setYear(2)"   >当年</el-button>
              </el-button-group>
            </el-col>

            <el-col :span="24">
              <strengthdetailcharts2 ref="strengthdetailcharts2" :type="2"></strengthdetailcharts2>
            </el-col>
          </el-row>
    	  </el-tab-pane>
        <el-tab-pane label="总车数">
          <el-row>
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button :type="buttontype==1?'primary':'default'" @click="setDay(3)"    >当日</el-button>
                <el-button :type="buttontype==2?'primary':'default'" @click="setWeek(3)"   >当周</el-button>
                <el-button :type="buttontype==3?'primary':'default'" @click="setMonth(3)"  >当月</el-button>
                <el-button :type="buttontype==4?'primary':'default'" @click="setSeason(3)" >当季</el-button>
                <el-button :type="buttontype==5?'primary':'default'" @click="setYear(3)"   >当年</el-button>
              </el-button-group>
            </el-col>

            <el-col :span="24">
              <strengthdetailcharts3 ref="strengthdetailcharts3" :type="3"></strengthdetailcharts3>
            </el-col>
          </el-row>
        </el-tab-pane>
    	</el-tabs>
    </div>
	</div>
</template>

<script>
  import strengthdetailcharts1 from '../charts/strengthdetailcharts.vue'
  import strengthdetailcharts2 from '../charts/strengthdetailcharts.vue'
  import strengthdetailcharts3 from '../charts/strengthdetailcharts.vue'
  import strengthtable from '../table/strengthtable.vue'
	import {
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	import {
		mapActions,
		mapGetters
	} from 'vuex'

	export default {
		components: {
			strengthtable,
      strengthdetailcharts1,
      strengthdetailcharts2,
      strengthdetailcharts3
		},
		name: 'App',
		data() {
			return {
				theme: 'classic',
				darkMode: false,
        activeName: '',
				monochrome: undefined,
				layoutEditable: true,
				colNum: 12,
				datasets: [],
				rowHeight: 30,
        buttontype: 5
			}
		},
		created() {
			this.fetchData();
		},
		computed: {
			...mapGetters({
				current_org: 'org/current_org',
			}),
		},
		methods: {
			async fetchData() {


				console.log(this.datasets)
			},
      setDay(sNum) {
        this.buttontype=1
        let date = new Date()
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        
        
        let datestart = '2022-06-30'
        let dateend = '2022-07-01'
        console.log(datestart,dateend)

        this.$refs['strengthdetailcharts'+sNum.toString()].setDay(datestart,dateend)
      },
      setWeek(sNum) {
        console.log(sNum)
        this.buttontype=2
      },
      setMonth(sNum) {
        this.buttontype=3
        let date = new Date()
        var m = date.getMonth() + 1;
        var m1 = date.getMonth() + 2;
        m = m < 10 ? '0' + m : m;
        m1 = m1 < 10 ? '0' + m1 : m1;
        let datestart = date.getFullYear()+'-'+m+'-01'
        let dateend = date.getFullYear()+'-'+m1+'-01'
        console.log(datestart,dateend)
        this.$refs['strengthdetailcharts'+sNum.toString()].setDay(datestart,dateend)
      },
      setSeason(sNum) {
        this.buttontype=4
      },
      setYear(sNum) {
        this.buttontype=5
        let datestart = new Date().getFullYear()+'-01-01'
        let dateend = (Number(new Date().getFullYear())+1).toString()+'-01-01'
        console.log(datestart,dateend)
        this.$refs['strengthdetailcharts'+sNum.toString()].setDay(datestart,dateend)
      },
      setMonochromeColor(event) {
      	this.monochrome = {
      		enabled: true,
      		color: event.target.value,
      	}
      },
			switchTheme(themeName) {
				this.theme = themeName;
			},
			setMonochromeColor(event) {
				this.monochrome = {
					enabled: true,
					color: event.target.value,
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.theme-swatches {
		display: flex;
		justify-content: space-between;
		align-content: center;
		padding: 0;
	}

	.theme-swatches-item {
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 5px;
		text-align: center;
		transition: transform .2s cubic-bezier(.4, 0, .2, 1);

		&:hover {
			box-shadow: 0 2px 16px rgb(0 0 0 / 15%);
			transform: scale(1.05);
		}

		.theme-swatches-label {
			position: relative;
			display: block;
			width: 100%;
			height: 100%;
			padding: 10px 15px;
			cursor: pointer;
		}

		.theme-swatches-checkbox {
			display: none;
		}

		.theme-swatches-name {
			display: block;
			color: #232323;
			font-size: 14px;
		}

		.hue {
			display: inline-block;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			box-shadow: 0 0 0 2px #fff;
			vertical-align: middle;

			// TODO: 테마별 색상으로 바인딩하기
			&.primary {
				background: #5975fe;
			}

			&.secondary {
				background: #54d2d2;
			}

			&.third {
				background: #ffcb00;
			}

			&.fourth {
				background: #ff6150;
			}

			&.fifth {
				background: #1360bf;
			}

			&+.hue {
				margin-left: -6px;
			}
		}
	}

	.editBtn {
		padding: 7px;
		border: 1px solid #fff;
		border-radius: 5px;
		background: #fff;
		cursor: pointer;
	}
</style>
