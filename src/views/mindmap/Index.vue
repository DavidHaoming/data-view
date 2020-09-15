<template>
  <div class="mindmap-container">
    <div id="mindmap"></div>
    <div v-if="textTarget" class="text-target"
         :style="`top: ${cursor.y-25}px;left: ${cursor.x}px;`">
      <el-select
          v-model="inputTextTarget"
          ref="textTargetSelect"
          v-on:change="changeTextTarget"
          v-on:blur="updateMindMapText"
          filterable
          placeholder="输入关键词">
        <el-option
            v-for="item in optionsTextTarget"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>

  </div>
</template>

<script>
import MindElixir, {E} from "@/plugins/mind-elixir"

export default {
  name: "MindMapIndex",
  data() {
    return {
      ME: null,
      textTarget: false,
      inputTextTarget: [],
      selectedText: '',
      optionsTextTarget: [],
      cursor: {x: 0, y: 0},
      selection: {node: null, offset: 0},
      updatedCursorIndex: {node: 0, offset: 0},
      editMindMap: {node: null, div: null}
    }
  },
  mounted() {
    this.init()
    for (const n of [1, 2, 3, 4, 5]) {
      this.optionsTextTarget.push({label: '我是打招呼' + n, value: '我是打招呼' + n})
    }
  },
  watch: {
    textTarget(val) {
      if (!val) this.fixCursorPosition()
      else this.$nextTick(() => {
        this.$refs.textTargetSelect.focus()
      })
    }
  },
  methods: {
    init() {
      this.ME = new MindElixir({
        el: '#mindmap',
        newTopicName: '子节点',
        direction: MindElixir.RIGHT,
        locale: 'cn',
        data: MindElixir.new('新互动'),
        draggable: true,
        editable: true,
        contextMenu: true,
        nodeTemplate: [
          {
            style: {
              background: 'rgb(80, 194, 139)',
              color: '#fff',
              border: '',
              borderRadius: '5px'
            },
            children: [
              {
                style: {
                  background: 'rgb(80, 194, 139)',
                  color: '#fff',
                  border: '',
                  borderRadius: '5px'
                },
                text: '文字节点',
                id: 'show',
              },
              {
                style: {
                  background: '',
                  color: 'rgb(102, 102, 102)',
                  border: '',
                },
                children: [],
                text: '单选节点',
                icons: ['➊'],
                id: 'single_choice'
              },
              {
                style: {
                  background: '',
                  color: 'rgb(102, 102, 102)',
                  border: '',
                },
                children: [],
                text: '单选任务',
                icons: ['➊', '🕑', '🌲️'],
                id: 'single_task_choice'
              },
              {
                style: {
                  background: '',
                  color: 'rgb(102, 102, 102)',
                  border: '',
                },
                children: [],
                text: '多选节点',
                icons: ['☑'],
                id: 'multi_choice'
              },
              {
                style: {
                  background: '',
                  color: 'rgb(102, 102, 102)',
                  border: '',
                },
                children: [],
                text: '继续节点',
                icons: ['►'],
                id: 'continue'
              },
              {
                style: {
                  background: '',
                  color: 'rgb(102, 102, 102)',
                  border: '',
                },
                children: [],
                text: '语音输入',
                icons: ['🔊'],
                id: 'voice_input'
              },
              {
                style: {
                  background: '',
                  color: 'rgb(102, 102, 102)',
                  border: '',
                },
                children: [],
                text: '语音文字',
                icons: ['📝'],
                id: 'voice_text_input'
              },
              {
                style: {
                  background: '',
                  color: 'rgb(102, 102, 102)',
                  border: '',
                },
                children: [],
                text: '文字输入',
                icons: ['🖌'],
                id: 'text_input'
              },
              {
                style: {
                  background: '',
                  color: 'rgb(102, 102, 102)',
                  border: '',
                },
                children: [],
                text: '延时节点',
                icons: ['⏱️'],
                id: 'delayed'
              },
              {
                style: {
                  background: '',
                  color: 'rgb(102, 102, 102)',
                  border: '',
                },
                children: [],
                text: '拨轮节点',
                icons: ['📅'],
                id: 'wheel'
              },
              {
                style: {
                  background: '',
                  color: 'rgb(102, 102, 102)',
                  border: '',
                },
                children: [],
                text: '能量节点',
                icons: ['🔆'],
                id: 'energy'
              }
            ],
            text: '文字节点',
            id: 'show'
          },
          {
            style: {
              background: '#fff',
              color: '#666',
              border: '1px dashed #888',
              borderRadius: '0px'
            },
            text: '条件节点(E)',
            id: 'condition_edit'
          },
          {
            style: {
              background: '#fff',
              color: '#666',
              border: '1px solid #888',
              borderRadius: '0px'
            },
            text: '条件节点(D)',
            id: 'condition_design'
          },
          {
            style: {
              background: '#fff',
              color: '#4b4b4b',
              border: '2px solid #b8d7fb',
              borderRadius: '20px'
            },
            text: '业务节点(E)',
            id: 'code_edit'
          },
          {
            style: {
              background: '#dbe2e3',
              color: '#434b54',
              borderRadius: '6px'
            },
            text: '代码节点(D)',
            id: 'code_design'
          },
          {
            style: {
              background: '#fff',
              color: '#f29a66',
              border: '2px solid #f29a66',
              borderRadius: '20px'
            },
            text: '步骤节点',
            id: 'bunch'
          }
        ],
        contextMenuOption: {
          focus: true,
          link: true,
        },
        toolBar: true,
        nodeMenu: true,
        keypress: true,
      })
      this.ME.init()
      this.ME.bus.addListener('operation', op => {
        console.log(op)
        if (op.name === "finishEdit") {
        //
        }
        if (op.name === "beginEdit") {
          this.editMindMap.node = E(op.obj.id)
        }
        if (op.name === "inputKeypress" && ((navigator.platform === 'Win32' || navigator.platform === "Windows") ? op.obj.ctrlKey : op.obj.metaKey) && op.obj.key === "/") {
          this.handleTextTarget()
        }
      })
    },
    handleTextTarget() {
      this.handleCursorLocation()
      this.textTarget = true // 之后 watch 会聚焦 select
    },
    handleCursorLocation() {
      let sel = document.selection, range, rects, rect
      let x = 0, y = 0
      if (sel) {
        if (sel.type !== "Control") {
          range = sel.createRange()
          range.collapse(true)
          x = range.boundingLeft
          y = range.boundingTop
        }
      } else if (document.getSelection) {
        sel = document.getSelection()
        if (sel.rangeCount) {
          range = sel.getRangeAt(0).cloneRange()
          if (range.getClientRects) {
            range.collapse(true)
            rects = range.getClientRects()
            if (rects.length > 0) {
              rect = rects[0]
            }
            // 光标在行首时，rect为undefined
            if (rect) {
              x = rect.left
              y = rect.top
            }
          }
          // Fall back to inserting a temporary element
          if ((x === 0 && y === 0) || rect === undefined) {
            let span = document.createElement("span")
            if (span.getClientRects) {
              // Ensure span has dimensions and position by
              // adding a zero-width space character
              span.appendChild(document.createTextNode("\u200b"))
              range.insertNode(span)
              rect = span.getClientRects()[0]
              x = rect.left
              y = rect.top
              let spanParent = span.parentNode
              spanParent.removeChild(span)
              // Glue any broken text nodes back together
              spanParent.normalize()
            }
          }
        }
      }
      // 获取光标坐标
      this.cursor = {x, y}
      // 获取光标之前的 node 和 offset
      this.editMindMap.div = this.getMindMapInputDiv(this.editMindMap.node)
      this.selection = {node: sel.focusNode, offset: sel.focusOffset}
    },
    cleanTextTarget() {
      this.textTarget = false
      this.inputTextTarget = ''
      this.selectedText = ''
    },
    changeTextTarget(val) {
      this.selectedText = val
      this.updateMindMapText()
    },
    updateMindMapText() {
      // 查找光标之前的文字位置, 打开节点 edit , 并将 val 插入进去
      let childNodeIndex = 0
      for (let childNode of this.editMindMap.div.childNodes) {
        if (childNode.nodeName !== '#text' && childNode.childNodes.length > 0) {
          childNode = childNode.childNodes[0]
          if (childNode.nodeName !== '#text') console.error('data tag error')
        }
        if (childNode === this.selection.node) {
          let preText = childNode.textContent
          childNode.textContent = preText.slice(0, this.selection.offset) + this.selectedText + preText.slice(this.selection.offset)
          this.updatedCursorIndex = {
            node: childNodeIndex, offset: this.selection.offset + this.selectedText.length
          }
        }
        childNodeIndex ++
      }
      console.dir(this.updatedCursorIndex)
      this.ME.getTopicDiv(this.editMindMap.node).innerHTML = this.editMindMap.div.innerHTML
      this.cleanTextTarget()
    },
    getMindMapInputDiv(node) {
      if (node.getElementsByClassName('me-inputdiv').length > 0) {
        return node.getElementsByClassName('me-inputdiv')[0]
      }
    },
    fixCursorPosition() {
      this.ME.beginEdit(this.editMindMap.node)
      let editDiv = this.getMindMapInputDiv(this.editMindMap.node)
      let range = document.createRange()
      range.selectNodeContents(editDiv)
      if(editDiv.innerHTML.length > 0) {
        range.setStart(editDiv.childNodes[this.updatedCursorIndex.node], this.updatedCursorIndex.offset)
      }
      range.collapse(true)
      let selection = document.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}
</script>

<style scoped>
.mindmap-container {
  width: 100%;
  height: 100%;
}

#mindmap {
  width: 100%;
  height: 100%;
  text-align: start;
  background: #F6F6F6;
}

.text-target {
  display: block;
  position: absolute;
  background: rgba(0,0,0,0.1);
  height: auto;
}
</style>