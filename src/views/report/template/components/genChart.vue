<template>
  <div class="gen-chart" ref="genChart"></div>
</template>

<script>
import genChartData from '../resource/genChartData'
import * as echarts from 'echarts';
export default {
  name: 'genChart',
  props: {
    score: {
      type: Number,
      require: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.renderChart(this.score)
    },
    renderChart (score) {
      const size = 6
      const option = {
        grid: {
          left: 0,
          right: '20%',
          bottom: '7%',
          containLabel: true
        },
        color: ['#fa041b','#91cc75', '#5470c6'],
        tooltip: {
          // trigger: 'axis',
          showDelay: 0,
          formatter: function(params) {
            const seriesName =  params.seriesName || params.data.seriesName
            if (params.value.length > 1) {
              return (
                seriesName +
                ' :<br/>' +
                params.value[0]
              )
            } else {
              return (
                params.name +
                ' : ' +
                params.value
              )
            }
          },
          axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
              type: 'dashed',
              width: 1
            }
          }
        },
        toolbox: {
          show: false
        },
        brush: {},
        legend: {
          data: ['恶性', '良性', '待检测'],
          right: '5%',
          top: '50%',
          orient: 'vertical'
        },
        xAxis: [
          {
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: false,
            axisLabel: {
              formatter: '{value}'
            },
            show: false,
          }
        ],
        series: [
          {
            name: '恶性',
            type: 'scatter',
            symbolSize: size,
            // prettier-ignore
            data: this.getData('恶性')
          },
          {
            name: '良性',
            type: 'scatter',
            symbolSize: size,
            // prettier-ignore
            data: this.getData('良性')
          },
          {
            name: '待检测',
            type: 'scatter',
            emphasis: {
              focus: 'series'
            },
            symbolSize: size,
            // prettier-ignore
            data: [[score, 0.5]],
            markPoint: {
              data: [
                {
                  name: '风险系数',
                  xAxis: score,
                  yAxis: 0.5,
                  value: score,
                  seriesName: '待检测'
                }
              ]
            },
            markLine: {
              symbol: 'none',
              lineStyle: {
                width: 2,
                type: 'dashed'
              },
              data: [{ name: 'cut-off',xAxis: 60, seriesName: 'cut-off' }]
            }
          }
        ]
      }
      const myChart = echarts.init(this.$refs.genChart, null, { renderer: 'svg' })
      myChart.setOption(option)
    },
    getData(type) {
      let arr = []
      for (let i = 0; i < genChartData.length; i++) {
        const item = genChartData[i]
        if (item[0] === type) {
          arr.push([item[1], item[2]])
        }
      }
      return arr
    }
  }
}
</script>
