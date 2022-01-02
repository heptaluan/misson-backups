<template>
  <div class="edit-box">
    <div ref="editor"></div>
  </div>
</template>

<script>
// import E from 'wangeditor'
export default {
  name: 'editor',
  props: {
    // 增加content，有内容的时候直接传进来
    content: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      editorContent: ''
    }
  },
  watch: {
    content(val) {
      this._setInitContent(val)
    }
  },
  mounted() {
    this.editorContent = this.content
    this.createEditor()
    this._setInitContent(this.editorContent)
  },
  methods: {
    createEditor() {
      // let editor = new E(this.$refs.editor)
      // this.editor = editor
      // this._syncContent()
      // editor.create()
    },
    _syncContent() {
      this.editor.config.onchange = html => {
        this.editorContent = html
        this.$emit('update:content', html)
      }
    },
    _setInitContent(content) {
      this.editor.txt.html(content)
    },
    beforeDestroy() {
      this.editor.destroy()
      this.editor = null
    }
  }
}
</script>
