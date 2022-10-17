<template>
  <div class="Echarts">
    <div id="myChart" :style="{width: width, height: height}"></div>
  </div>
</template>

<script>
import palette from './../../assets/palette.json';

export default {
  props: {
    width: {
      type: String,
      default: 600,
    },
    height: {
      type: String,
      default: 400,
    },
  },
  data() {
    return {
      gridInfos: [],
      palette,
      layoutReady: false,
      isFirstMount: true,
      darkModeColorOptions: {
        background: 'transparent',
        foreColor: '#fff',
      },
      lightModeColorOptions: {
        background: '#fff',
        foreColor: '#232323',
      },
      previousThemeColors: [],
    };
  },
  computed: {

  },
  watch: {

  },
  created() {
    // this.validateProps();
    // this.bindGridInfos();
  },
  mounted() {
    // this.addUniqueId();
    this.drawLine();
  },
  methods: {
    drawLine(){
      console.log(1)
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            title: { text: '在Vue中使用echarts' },
            tooltip: {},
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
    },
  },
};
</script>

<style lang="scss">

.vue-grid-item {
  padding: 20px;
  touch-action: none;
  background-color: #ffffff;

  &:not(.vue-grid-placeholder) {
    border-radius: 5px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    border: 1px solid #dbe0e6;
  }

  @media screen and (max-width: 768px) {
    // 모바일 환경을 고려한 설정
    padding: 5px;
  }
}

.apexcharts-svg {
  border-radius: 13px;
}
</style>
