<template>
  <div class="center">
    <div class="center-main">
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
    <div class="right-aside">
      <el-tabs style="height: 100%;border: none;" v-model="activeRightAside" type="border-card" :stretch="true"
               @tab-click="handleClickRightAsideTab">
        <el-tab-pane label="节点样式" name="style">
          <div style="padding: 15px;">
            <el-form :disabled="styleFormState" label-position="top" label-width="80px" size="mini">
              <el-form-item label="通用设置">
                <el-form :disabled="styleFormState" :inline="true" class="aside-form-inline" size="mini">
                  <el-form-item label="字体">
                    <div style="margin-left: 10px">
                      <el-input-number @change="updateNodeStyle('fontSize')" size="mini" style="width: 100px" v-model="selectFontSize"></el-input-number>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-color-picker @change="updateNodeStyle('color')" v-model="selectColor" :predefine="predefineColors" size="mini"></el-color-picker>
                  </el-form-item>
                </el-form>
                <el-form :disabled="styleFormState" :inline="true" class="aside-form-inline" size="mini">
                  <el-form-item label="背景">
                    <div style="margin-left: 10px">
                      <el-color-picker @change="updateNodeStyle('background')" v-model="selectBackground" :predefine="predefineColors"
                                       size="mini"></el-color-picker>
                    </div>
                  </el-form-item>
                </el-form>
              </el-form-item>
              <el-form-item label="节点模板">
                <div class="aside-template-group">
                  <div v-for="template in allNodeTemplate()" :class="'aside-template-node ' + templateClass"
                       @click="updateNodeTemplate"
                       :key="template.id"
                       :data-id = "template.id"
                       :style="`color: ${template.style.color};
                            background: ${template.style.background};
                            border: ${template.style.border ? template.style.border : template.style.background ? 'none' : ''};
                            border-radius: ${template.style.borderRadius || '0px'}`">
                    <span v-html="template.icons ? template.icons[template.icons.length-1] : ''"></span>
                    {{ template.text }}
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="代码编辑" name="code" :disabled="asideCodeTabDisableState">
          <editor
              height="100%"
              ref="codeEditor"
              :options="{
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
                tabSize: 2
              }"
              :content="asideCode"
              :fontSize='14'
              :lang="'python'"
              :theme="'monokai'"
              @onChange="codeEditorChange"
              @init="codeEditorInit">
          </editor>
        </el-tab-pane>
        <el-tab-pane label="属性设置" name="attribute">
          <div style="padding: 15px;"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import MindElixir, {E} from "@/plugins/mind-elixir"
import Editor from 'vue2x-ace-editor'

export default {
  name: "MindMapIndex",
  components: {
    editor: Editor
  },
  data() {
    return {
      ME: null,
      textTarget: false,
      asideCodeTabDisableState: true,
      inputTextTarget: [],
      selectedText: '',
      optionsTextTarget: [],
      cursor: {x: 0, y: 0},
      selection: {node: null, offset: 0},
      updatedCursorIndex: {node: 0, offset: 0},
      editMindMap: {node: null, div: null},
      selectedMindMap: {node: null, div: null, obj: null},
      activeRightAside: 'style',
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
              text: '动画单选',
              icons: ['🔮'],
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
              icons: ['🔉'],
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
              icons: ['✏️'],
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
      selectTemplate: '',
      selectColor: '#FFFFF8',
      selectBackground: '#FFFFFF',
      selectFontSize: '15',
      predefineColors: [
        '#2c3e50',
        '#34495e',
        '#7f8c8d',
        '#94a5a6',
        '#bdc3c7',
        '#ecf0f1',
        '#8e44ad',
        '#9b59b6',
        '#2980b9',
        '#3298db',
        '#c0392c',
        '#e74c3c',
        '#d35400',
        '#f39c11',
        '#f1c40e',
        '#17a085',
        '#27ae61',
        '#2ecc71',
      ],
      templateClass: 'aside-template-disabled',
      styleFormState: true,
      keySelecting: {e: null, i: null},
      asideCode: ''
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
    codeEditorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/python')
      require('brace/theme/monokai')
      require('brace/snippets/python') //snippet
    },
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
        nodeMenuDefaultState: 'close',
        nodeTemplate: this.nodeTemplate,
        contextMenuOption: {
          focus: true,
          link: true,
        },
        toolBar: true,
        nodeMenu: false,
        keypress: true,
      })
      this.ME.init()
      this.ME.bus.addListener('operation', op => {
        if (op.name === "finishEdit") {
          // update code
          if (this.ME.currentNode) {
            if (this.ME.currentNode.nodeObj.templateID === 'code_design') {
              this.asideCode = this.htmlToCode(this.ME.currentNode.nodeObj.topic)
            }
          }
        }
        if (op.name === "beginEdit") {
          this.editMindMap.node = E(op.obj.id)
        }
        if (op.name === "inputKeypress" && ((navigator.platform === 'Win32' || navigator.platform === "Windows") ? op.obj.ctrlKey : op.obj.metaKey) && op.obj.key === "/") {
          this.handleTextTarget()
        }
        if (op.name === "mapKeypress") {
          if (((navigator.platform === 'Win32' || navigator.platform === "Windows") ? op.obj.ctrlKey : op.obj.metaKey) && (op.obj.key === "/") && (!op.obj.shiftKey)) {
            this.selectNodeTemplate('down')
          }
          if (((navigator.platform === 'Win32' || navigator.platform === "Windows") ? op.obj.ctrlKey : op.obj.metaKey) && (op.obj.keyCode === 191) && (op.obj.shiftKey)) {
            this.selectNodeTemplate('up')
          }
        }
        if (op.name === "mapKeypressUp") {
          if (this.keySelecting.e && ((navigator.platform === 'Win32' || navigator.platform === "Windows") ? op.obj.keyCode === 17 : op.obj.keyCode === 91)) {
            console.log(this.keySelecting.e.getAttribute('data-id'))
            this.updateNodeTemplateByKey()
          }
        }
      })
      this.ME.bus.addListener('selectNode', op => {
        this.selectedNode(op)
      })
      this.ME.bus.addListener('selectNewNode', op => {
        this.selectedNode(op)
      })
      this.ME.bus.addListener('unselectNode', () => {
        this.unSelectedNode()
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
        childNodeIndex++
      }
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
      if (editDiv.innerHTML.length > 0) {
        range.setStart(editDiv.childNodes[this.updatedCursorIndex.node], this.updatedCursorIndex.offset)
      }
      range.collapse(true)
      let selection = document.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    },
    handleClickRightAsideTab(tab, event) {
      console.log(tab, event)
    },
    selectedNode(nodeObj) {
      if (nodeObj.root) return
      this.selectedMindMap.node = E(nodeObj.id)
      this.selectedMindMap.obj = Object.assign({}, nodeObj)
      this.styleFormState = false
      if (nodeObj.style) {
        if (nodeObj.style.color) this.selectColor = nodeObj.style.color
        if (nodeObj.style.background) this.selectBackground = nodeObj.style.background
        if (nodeObj.style.fontSize) this.selectFontSize = nodeObj.style.fontSize
      }
      if (nodeObj.templateID) {
        // let asideTemplate = document.getElementsByClassName('aside-template-node')
        // for (const atkey in asideTemplate) {
        //   let at = asideTemplate[atkey]
        //   if (at.getAttribute('data-id') === nodeObj.templateID) {
        //     at.className = 'aside-template-node aside-template-selected'
        //     break
        //   }
        // }
        if (nodeObj.templateID === 'code_design') {
          this.activeRightAside = 'code'
          this.asideCodeTabDisableState = false
          this.asideCode = this.htmlToCode(nodeObj.topic)
        } else {
          this.activeRightAside = 'style'
          this.asideCodeTabDisableState = true
          this.asideCode = ''
        }
      }
      this.templateClass = ''
    },
    unSelectedNode() {
      this.templateClass = 'aside-template-disabled'
      this.styleFormState = true
      this.selectedMindMap = {node: null, div: null, obj: null}
      this.selectColor = '#FFFFF8'
      this.selectBackground = '#FFFFFF'
      this.selectFontSize = '15'
      if (this.selectTemplate) this.selectTemplate.className = this.selectTemplate.className.replace(/ aside-template-selected/g, '')
      this.activeRightAside = 'style'
      this.asideCodeTabDisableState = true
      this.asideCode = ''
    },
    getAllNodeTemplate(t, r, l = []) {
      for (const tElement of t) {
        if (l.indexOf(tElement.id) === -1) {
          r.push(tElement)
          l.push(tElement.id)
        }
        this.getAllNodeTemplate(tElement.children || [], r, l)
      }
      return r
    },
    allNodeTemplate() {
      return this.getAllNodeTemplate(this.nodeTemplate, [{
        id: 'normal', style: {color: 'rgb(102, 102, 102)', background: ''}, text: '初始节点'
      }])
    },
    updateNodeStyle(type) {
      if (type === 'fontSize') {
        if (this.selectedMindMap.obj.style) this.selectedMindMap.obj.style.fontSize = String(this.selectFontSize)
        else this.selectedMindMap.obj.style = {fontSize: String(this.selectFontSize)}
      }
      if (type === 'color') {
        if (this.selectedMindMap.obj.style) this.selectedMindMap.obj.style.color = this.selectColor
        else this.selectedMindMap.obj.style = {color: this.selectColor}
      }
      if (type === 'background') {
        if (this.selectedMindMap.obj.style) this.selectedMindMap.obj.style.background = this.selectBackground
        else this.selectedMindMap.obj.style = {background: this.selectBackground}
      }
      this.ME.updateNodeStyle(this.selectedMindMap.obj)
    },
    findNodeTemplate(id) {
      if (id === 'normal') return {
        id: 'normal', style: {color: 'rgb(102, 102, 102)', background: ''}, text: '', icons: []
      }
      for (const nt of this.nodeTemplate) {
        if (nt.id === id) return nt
        for (const x of nt.children || []) {
          if (x.id === id) return x
        }
      }
    },
    selectNodeTemplate(direction='down') {
      if (!this.ME.currentNode.nodeObj) return
      if (this.keySelecting.e) this.keySelecting.e.className = this.keySelecting.e.className.replace(/ aside-template-selected/g, '')
      let asideTemplate = document.getElementsByClassName('aside-template-node')
      if (!asideTemplate) return
      let templateID = this.ME.currentNode.nodeObj.templateID
      if (!templateID) templateID = 'normal'
      // let findTemplate = '0'
      // for (const atkey in asideTemplate) {
      //   const at = asideTemplate[atkey]
      //   console.log(at.className)
      //   if (at.className && at.className.indexOf('aside-template-selected') !== -1) {
      //     findTemplate = atkey
      //     at.className = at.className.replace(/ aside-template-selected/g, '')
      //     // console.log(at)
      //     break
      //   }
      // }
      if (this.keySelecting.i === null) {
        for (const atkey in asideTemplate) {
          const at = asideTemplate[atkey]
          if (at.getAttribute('data-id') === templateID) {
            this.keySelecting.i = atkey
            this.keySelecting.e = at
            break
          }
        }
      }
      if (direction === 'down') {
        if (Number(this.keySelecting.i) === asideTemplate.length - 1) {
          this.keySelecting.i = '0'
        } else {
          this.keySelecting.i = String(Number(this.keySelecting.i) + 1)
        }
      } else if (direction === 'up') {
        if (Number(this.keySelecting.i) === 0) {
          this.keySelecting.i = asideTemplate.length - 1
        } else {
          this.keySelecting.i = String(Number(this.keySelecting.i) - 1)
        }
      }
      this.keySelecting.e = asideTemplate[this.keySelecting.i]
      this.keySelecting.e.className += ' aside-template-selected'
      console.log(this.keySelecting)
    },
    updateNodeTemplate(e) {
      if (this.selectTemplate) this.selectTemplate.className = this.selectTemplate.className.replace(/ aside-template-selected/g, '')
      this.selectTemplate = e.target
      let nodeTemplate = this.findNodeTemplate(this.selectTemplate.getAttribute('data-id'))
      if (!nodeTemplate) return
      nodeTemplate.templateID = nodeTemplate.id
      let nodeObj = this.ME.currentNode.nodeObj
      this.ME.updateNodeObjStyle(nodeObj, nodeTemplate)
      this.ME.updateNodeStyle(nodeObj)
      this.selectTemplate.className += ' aside-template-selected'
      if (nodeTemplate.templateID === 'code_design') {
        this.activeRightAside = 'code'
        this.asideCodeTabDisableState = false
        this.asideCode = nodeObj.topic
      }
    },
    updateNodeTemplateByKey() {
      let nodeTemplate = this.findNodeTemplate(this.keySelecting.e.getAttribute('data-id'))
      if (!nodeTemplate) return
      nodeTemplate.templateID = nodeTemplate.id
      let nodeObj = this.ME.currentNode.nodeObj
      this.ME.updateNodeObjStyle(nodeObj, nodeTemplate)
      this.ME.updateNodeStyle(nodeObj)
      if (this.keySelecting.e) this.keySelecting.e.className = this.keySelecting.e.className.replace(/ aside-template-selected/g, '')
      this.keySelecting = {e: null, i: null}
    },
    codeEditorChange(e) {
      if (!this.ME.currentNode) return
      let value = this.codeToHtml(e.getValue())
      this.ME.setNodeTopic(E(this.ME.currentNode.nodeObj.id), value)
    },
    codeToHtml(code) {
      return code.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
    },
    htmlToCode(html) {
      return html.replace(/<br>/g, '\n').replace(/&nbsp;/g, ' ')
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
  background: rgba(0, 0, 0, 0.1);
  height: auto;
}

.center {
  flex: 1;
  width: calc(100% - 300px);
  height: 100%;
  display: flex;
}

.center-main {
  flex: 1;
  width: calc(100% - 300px);
}

.right-aside {
  flex: 0 0 300px;
  text-align: start;
}

.right-aside >>> .el-tabs__content {
  padding: 0;
  height: calc(100% - 40px);
}

.right-aside >>> .el-tab-pane {
  height: 100%;
}

.aside-form-inline {
  width: auto;
  height: 35px;
  margin-left: 6px;
}

.aside-template-group {
  text-align: center;
}

.aside-template-node {
  text-align: center;
  display: inline-block;
  margin: 5px 8px;
  width: 100px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #888;
  cursor: pointer;
}

.aside-template-selected {
  outline: 2px solid #0088FF;
}

.aside-template-disabled {
  cursor: not-allowed;
  filter: blur(0.6px);
}

.editor-container {
  margin: 0;
  padding: 0;
}

</style>
