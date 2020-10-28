const cmdNormalTemplate = {
    call: {uri: '', input_para: ''},
    do: {exec: ''}
}

const codeNormalTemplate = {
    duration: 0,
    call: {uri: '', input_para: ''},
    do: {exec: ''}
}

export const nodeAttributeTemplate = {
    'show': [{'value': {}, 'label': '一般'}],
    'single_choice': [{'value': cmdNormalTemplate, 'label': '一般'}],
    'single_task_choice': [{'value': cmdNormalTemplate, 'label': '一般'}],
    'multi_choice': [{'value': cmdNormalTemplate, 'label': '一般'}],
    'continue': [{'value': {}, 'label': '一般'}],
    'voice_input': [{'value': cmdNormalTemplate, 'label': '一般'}],
    'voice_text_input': [{'value': cmdNormalTemplate, 'label': '一般'}],
    'text_input': [{'value': cmdNormalTemplate, 'label': '一般'}],
    'delayed': [{'value': cmdNormalTemplate, 'label': '一般'}],
    'wheel': [{'value': Object.assign({}, cmdNormalTemplate, {do: {exec: '', set: []}}), 'label': '一般'}],
    'energy': [{'value': cmdNormalTemplate, 'label': '一般'}],
    'condition_edit': [{'value': {}, 'label': '一般'}],
    'condition_design': [{'value': {}, 'label': '一般'}],
    'code_edit': [
        {'value': codeNormalTemplate, 'label': '一般'},
        {'value': Object.assign({}, codeNormalTemplate, {type: 'nowdo'}), 'label': 'NOWDO'},
        {'value': {call: codeNormalTemplate.call}, 'label': 'CALL'},
        {'value': {duration: 1, rpc: {id: '', para: ''}}, 'label': 'RPC'},
    ],
    'code_design': [{'value': codeNormalTemplate, 'label': '一般'}],
    'bunch': [{'value': {}, 'label': '一般'}],
}

export const nodeTemplateList = [
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
]