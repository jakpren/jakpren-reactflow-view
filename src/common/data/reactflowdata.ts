import { XYPosition, Node, Edge } from 'reactflow';
const position: XYPosition = { x: 0, y: 0 };

export class ReactflowData {
  
    public static COLOR_PALETTES = ['#decbe4', '#b3cde3', '#ccebc5', '#fed9a6', '#ffffcc', '#fddaec', '#f2f2f2', '#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc', '#fbb4ae'];
    
    public static StartEndNodesColors = {
      "backgroundColor": 'black',
      "color": 'white',
    };

    public static ActionTypes = [
        {label: 'Task', value: 'task'},
        {label: 'Func', value: 'func'},
        {label: 'Rule', value: 'rule'},
      ]

    public static BooleanOptions = [
      { label: 'Yes', value: true},
      { label: 'No', value: false},
    ]

    public static emptyNode = {
      id: '',
      type: '',
      position,
      data: {name: ''},
      style: {}
    }

    public static emptyEdge = {
      id: '',
      type: '',
      source: '',
      target: '',
      markerEnd: '',
      label: '',
      data: {event: ''},
      style: {},
      animated: false,
    }

    public static initNodes: Node[] = [{
      id: 'start',
      type: 'input',
      data: {label:'start', name: 'start'},
      position,
      style: {
        width: 'auto',
        height: 'auto',
        cursor: 'pointer',
        backgroundColor: '',
        boxShadow: '0 2px 15px 2px #4ea9ff',
        textAlign: "center",
        fontWeight: 700,
        borderColor: 'black',
      }
    },{
      id: 'end',
      type: 'output',
      data: {label:'end', name: 'end'},
      position,
      style: {
        width: 'auto',
        height: 'auto',
        cursor: 'pointer',
        backgroundColor: '',
        boxShadow: '0 2px 15px 2px #4ea9ff',
        textAlign: "center",
        fontWeight: 700,
        borderColor: 'black',
      }
    }]

    public static initEdges: Edge[] = []

    public static initConfigData: any = {
      "metadata": {
        "name": "",
        "description": ""
      },
      "spec": {
        "states":{
                "Start": {
                    "groupName": ""
                },
                "End": {
                    "groupName": ""
                }
            },
        "steps": [
        ]
      }
    }
}