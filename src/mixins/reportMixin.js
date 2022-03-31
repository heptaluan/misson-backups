/**
 * Created by 9I
 * @Date 2022/2/14
 * @description
 */
export const reportMixin = {
  data() {
    return {}
  },
  created() {
  },
  methods: {
    calcStyle (text) {
      let bgColor = '#fff'
      let Color = '#000'
      const sore = parseFloat(text)
      if (sore >= 50 && sore < 70) {
        Color = '#fff'
        bgColor = '#faad14'
      }
      if (sore >= 70) {
        Color = '#fff'
        bgColor = '#f5222d'
      }
      return `background-color: ${bgColor}; color: ${Color}`
    },
    calcStyleImage (text) {
      let bgColor = '#fff'
      let Color = '#000'
      const sore = parseFloat(text)
      if (sore >= 60) {
        Color = '#fff'
        bgColor = '#f5222d'
      }
      return `background-color: ${bgColor}; color: ${Color}`
    },
    geneText (text, r) {
      let t = text
      if (r.choseProduct === 'FA') {
        t = '--'
      } else {
        t = t * 1 ? t : ' '
      }
      return t
    }
  }
}