import 'echarts'
// import 'echarts/map/js/china.js'
// import 'echarts/map/js/world.js'
//词云
//import 'echarts-wordcloud'

import * as VabChart from 'echarts'
import theme from './vab-echarts-theme.json'

VabChart.registerTheme('vab-echarts-theme', theme)
export default VabChart
