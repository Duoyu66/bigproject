<template>
	<div id="app">
		<!-- TODO: Monochrome color picker 서비스단으로 이동 -->
    <div class="definition purchase contract equipment_btn calc">
      <el-tabs type="border-card" class="box_center" style="">
        <el-tab-pane label="全部">
          <el-row>
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button  :type="buttontype==1?'primary':'default'" @click="setDay(1)"    >当日</el-button>
                <el-button  :type="buttontype==2?'primary':'default'" @click="setWeek(1)"   >当周</el-button>
                <el-button  :type="buttontype==3?'primary':'default'" @click="setMonth(1)"  >当月</el-button>
                <el-button  :type="buttontype==4?'primary':'default'" @click="setSeason(1)" >当季</el-button>
                <el-button  :type="buttontype==5?'primary':'default'" @click="setYear(1)"   >当年</el-button>
              </el-button-group>
            </el-col>

            <el-col :span="24">
              <riskcharts1 ref="riskcharts1" :type="1"></riskcharts1>
            </el-col>
          </el-row>



        </el-tab-pane>
        <el-tab-pane label="高超标">
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
              <riskcharts2 ref="riskcharts2" :type="2"></riskcharts2>
            </el-col>
          </el-row>



    	  </el-tab-pane>
    	  <el-tab-pane label="中超标">
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
              <riskcharts3 ref="riskcharts3" :type="3"></riskcharts3>
            </el-col>
          </el-row>
    	  </el-tab-pane>
        <el-tab-pane label="低超标">
          <el-row>
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button :type="buttontype==1?'primary':'default'" @click="setDay(4)"    >当日</el-button>
                <el-button :type="buttontype==2?'primary':'default'" @click="setWeek(4)"   >当周</el-button>
                <el-button :type="buttontype==3?'primary':'default'" @click="setMonth(4)"  >当月</el-button>
                <el-button :type="buttontype==4?'primary':'default'" @click="setSeason(4)" >当季</el-button>
                <el-button :type="buttontype==5?'primary':'default'" @click="setYear(4)"   >当年</el-button>
              </el-button-group>
            </el-col>

            <el-col :span="24">
              <riskcharts4 ref="riskcharts4" :type="4"></riskcharts4>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="拌和超时">
          <el-row>
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button :type="buttontype==1?'primary':'default'" @click="setDay(5)"    >当日</el-button>
                <el-button :type="buttontype==2?'primary':'default'" @click="setWeek(5)"   >当周</el-button>
                <el-button :type="buttontype==3?'primary':'default'" @click="setMonth(5)"  >当月</el-button>
                <el-button :type="buttontype==4?'primary':'default'" @click="setSeason(5)" >当季</el-button>
                <el-button :type="buttontype==5?'primary':'default'" @click="setYear(5)"   >当年</el-button>
              </el-button-group>
            </el-col>

            <el-col :span="24">
              <riskcharts5 ref="riskcharts5" :type="5"></riskcharts5>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="上传超时">
          <el-row>
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button :type="buttontype==1?'primary':'default'" @click="setDay(6)"    >当日</el-button>
                <el-button :type="buttontype==2?'primary':'default'" @click="setWeek(6)"   >当周</el-button>
                <el-button :type="buttontype==3?'primary':'default'" @click="setMonth(6)"  >当月</el-button>
                <el-button :type="buttontype==4?'primary':'default'" @click="setSeason(6)" >当季</el-button>
                <el-button :type="buttontype==5?'primary':'default'" @click="setYear(6)"   >当年</el-button>
              </el-button-group>
            </el-col>

            <el-col :span="24">
              <riskcharts6 ref="riskcharts6" :type="6"></riskcharts6>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="运输超时">
          <el-row>
            <el-col :span="24" style="text-align: right;">
              <el-button-group>
                <el-button :type="buttontype==1?'primary':'default'" @click="setDay(7)"    >当日</el-button>
                <el-button :type="buttontype==2?'primary':'default'" @click="setWeek(7)"   >当周</el-button>
                <el-button :type="buttontype==3?'primary':'default'" @click="setMonth(7)"  >当月</el-button>
                <el-button :type="buttontype==4?'primary':'default'" @click="setSeason(7)" >当季</el-button>
                <el-button :type="buttontype==5?'primary':'default'" @click="setYear(7)"   >当年</el-button>
              </el-button-group>
            </el-col>

            <el-col :span="24">
              <riskcharts7 ref="riskcharts7" :type="7"></riskcharts7>
            </el-col>
          </el-row>
        </el-tab-pane>
    	</el-tabs>
    </div>
	</div>
</template>

<script>
  import riskcharts1 from '../charts/riskcharts.vue'
  import riskcharts2 from '../charts/riskcharts.vue'
  import riskcharts3 from '../charts/riskcharts.vue'
  import riskcharts4 from '../charts/riskcharts.vue'
  import riskcharts5 from '../charts/riskcharts.vue'
  import riskcharts6 from '../charts/riskcharts.vue'
  import riskcharts7 from '../charts/riskcharts.vue'
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
      riskcharts1,
      riskcharts2,
      riskcharts3,
      riskcharts4,
      riskcharts5,
      riskcharts6,
      riskcharts7,
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
      
        this.$refs['riskcharts'+sNum.toString()].setDay(datestart,dateend)
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
        this.$refs['riskcharts'+sNum.toString()].setDay(datestart,dateend)
      },
      setSeason(sNum) {
        this.buttontype=4
      },
      setYear(sNum) {
        this.buttontype=5
        let datestart = new Date().getFullYear()+'-01-01'
        let dateend = (Number(new Date().getFullYear())+1).toString()+'-01-01'
        console.log(datestart,dateend)
        this.$refs['riskcharts'+sNum.toString()].setDay(datestart,dateend)
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
