<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input :disabled="disabled" :value="value" @change="handleChange" @pressEnter="check" @blur="check" /><a-icon
        type="check"
        class="editable-cell-icon-check"
        @click="check"
      />
    </div>
    <div v-else class="editable-cell-text-wrapper" @dblclick="edit">
      {{ value || ' ' }}
      <a-icon :class="{hide: disabled}" type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'editable-cell',
  props: {
    text: String | Number,
    disabled: Boolean
  },
  data() {
    return {
      value: this.text,
      editable: false
    }
  },
  methods: {
    handleChange(e) {
      const value = e.target.value
      this.value = value
    },
    check() {
      if (/^[1-9]\d*$/.test(this.value) && this.value < 1101) {
        this.editable = false
        this.$emit('change', this.value)
      } else {
        this.$message.warning(`请输入正确的耗材数量（不能超过1100份）！`)
      }
    },
    edit() {
      // the edit function should be forbidden if the input is disabled
      if (!this.disabled) {
        this.editable = true
        this.$nextTick(() => {
          this.$el.querySelector('.ant-input').focus()
        })
      }
    }
  }
}
</script>
<style lang="css">
.editable-cell {
  display: block;
  position: relative;
  width: 100%;
}
.editable-cell .ant-input {
  width: 90%;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.hide {
  display: none !important;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
