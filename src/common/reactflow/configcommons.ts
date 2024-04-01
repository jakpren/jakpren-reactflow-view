/* eslint-disable array-callback-return */
import { SmartStepEdge, SmartStraightEdge, SmartBezierEdge } from '@tisoap/react-flow-smart-edge'
import { DragEvent } from 'react';
import Dagre from '@dagrejs/dagre';
import { XYPosition, MarkerType } from 'reactflow';
import {DndSmartEdge} from '../../layouts/dnd/components/DndSmartEdge';
import {SLSmartEdge} from '../../layouts/swim-lanes/components/SLSmartEdge';
import { Constants } from "../libs/Constants";
import {ReactflowData} from '../data/reactflowdata'
import randomColor from 'randomcolor';

const position: XYPosition = { x: 0, y: 0 };
const nodeWidth = 172;
const nodeHeight = 36;
const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
dagreGraph.setDefaultEdgeLabel(() => ({}));

let nodeColors: any = {};
let edgeColors: any = {};

let SwimlaneColors = ReactflowData.COLOR_PALETTES;
export class CustomConfigCommons {

    public static edgeTypes = {
        smartStep: SmartStepEdge,
        smartStraightEdge: SmartStraightEdge,
        smartBezierEdge: SmartBezierEdge,
        DndSmartEdge: DndSmartEdge,
        SLSmartEdge: SLSmartEdge,
    }

    public static getLayoutedElements = (nodes: any, edges: any, direction: any = 'TB') => {
        dagreGraph.setGraph({ rankdir: direction })
        nodes.forEach((node: any) => {
          dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        });
        edges.forEach((edge: any) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });
        Dagre.layout(dagreGraph);
        nodes.forEach((node: any) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            node.targetPosition = 'left';
            node.sourcePosition = 'right';
            node.position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            };
            return node;
        });
        console.log('edges =', edges);
        return { nodes, edges };
    }
    public static onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    public static getNodes = (states: any[]) => {
      let stateData: any = [];
      let nodes: any = [];

      if (!states || states?.length === 0) return [];

      Object.entries(states).map((key: any, value: any) => {
        if (key.length === 0) return;
        stateData.push({'state':key[0], 'parentNode': key[1]?.groupName});
      })
      stateData.map((stateNode: any, index: any) => {
        if (!stateNode.state) return;
        nodes.push({
          "id": stateNode.state,
          "label": stateNode.state,
          "data": { 
            label: stateNode.state,
            name: stateNode.state,
            groupName: stateNode.parentNode || Constants.DEFAULT_PARENT_NODE,
            // isNewState: false,
          },
          "parentNode": stateNode.parentNode || Constants.DEFAULT_PARENT_NODE,
          defaultColor: nodeColors[stateNode.parentNode] || '',
          "type": stateNode?.state?.toLowerCase() === 'start' ? 'input' : stateNode?.state?.toLowerCase() === 'end' ? 'output' : 'custom',
          "nodeType": 'child',
          style: {
            width: 'auto',
            height: 'auto',
            cursor: 'pointer',
            backgroundColor: stateNode.state?.toLowerCase() === 'start' || stateNode.state?.toLowerCase() === 'end' ? ReactflowData.StartEndNodesColors.backgroundColor : nodeColors[stateNode.parentNode] ? nodeColors[stateNode.parentNode] : '',
            color: stateNode.state?.toLowerCase() === 'start' || stateNode.state?.toLowerCase() === 'end' ? ReactflowData.StartEndNodesColors.color: '',
            // boxShadow: '0 2px 15px 2px #4ea9ff',
            textAlign: "center",
            fontWeight: 700,
            borderColor: 'black',
          },
          position,
        })
      })
      console.log('nodes = ', nodes);
      return nodes;
    }

    public static getEdges = (steps: any[]) => {
        let edges: any = [];

        steps?.map((step: any, index: any) => {
          if (!edgeColors[step.event]) {
            let color = randomColor({
              luminosity: 'light',
              hue: 'random'
           });
           edgeColors[step.event] = color;
          }
          edges.push({
            id: "edge-"+index,
            sourceNodeId: step.fromState,
            targetNodeId: step.toState,
            defaultColor: edgeColors[step.event],
            label: step.event,
            data: {
              event: step?.event || '',
              actionType: step?.actions && step?.actions.length > 0 && step?.actions[0]?.type ? step?.actions[0]?.type: '',
              actionNameReference: step?.actions && step?.actions.length > 0 && step?.actions[0]?.reference ? step?.actions[0]?.reference: '',
              userBlock: step?.actions && step?.actions.length > 0 && step?.actions[0]?.userBlock && step?.actions[0]?.userBlock?.reference ? step?.actions[0]?.userBlock?.reference: '',
              autoTriggeringEvent: step?.autoTriggeringEvent || '',

              policyConfirmationPromptLabel: step?.policy?.confirmationPrompt?.label || '',
              policyAllowedRoles: step?.policy?.eventTriggerPolicy?.roles || [],
              policyAllowedUserBlocks: step?.policy?.eventTriggerPolicy?.userBlocks || [],

              inputAllowedUserBlock: step?.input?.userBlock || '',
              inputStage: step?.input?.stage || '',
              inputVerified: step?.input?.verified || '',
              inputOnFailTriggerEvent: step?.input?.onFailTriggerEvent || '',
              inputOnPassTriggerEvent: step?.input?.onPassTriggerEvent || '',
              // inputAllowedRole: step?.input?.allowedRole,
              sendValidateNotification: step?.input?.sendValidateNotification || '',
              doNotSendAssignmentNotification: step?.input?.doNotSendAssignmentNotification || '',
              checkUserBlockRolesOnly: step?.input?.checkUserBlockRolesOnly || '',
            },
          })
        })
        return edges;
    }

    public static getSwimlanes = (states: any[]) => {
      let swimlanes: any = []
      if (!states || !Object.entries(states) || Object.entries(states)?.length === 0) return [];
      swimlanes.push(Constants.DEFAULT_PARENT_NODE);
      Object.entries(states).map((key: any, value: any) => {
        if (key.length === 0) return;

        if (!nodeColors[key[1]?.groupName]) {
          // let color = randomColor({
          //   luminosity: 'light',
          //   hue: 'random'
          // });
          let color: any = '';
          if (SwimlaneColors.length > 0) {
            color = SwimlaneColors.shift();
          } else {
            SwimlaneColors = ReactflowData.COLOR_PALETTES;
            color = SwimlaneColors.shift();
          }
          console.log('SwimlaneColors = ', SwimlaneColors);
         nodeColors[key[1]?.groupName] = color;
        }
        swimlanes.push(key[1]?.groupName && key[1]?.groupName ? key[1]?.groupName : Constants.DEFAULT_PARENT_NODE);
      })
      swimlanes = [...new Set(swimlanes)];
      let swimlaneData: any = [];

      console.log('swimlanes = ',swimlanes );
      swimlanes.map((swimlane: any, index: any) => {
          let sName = swimlane !== Constants.DEFAULT_PARENT_NODE ? swimlane : '';
          swimlaneData.push({
            "id": swimlane,
            "label": sName,
            "layer": index,
            "defaultColor": nodeColors[swimlane] || '',
            "nodes": [],
            "nodeType": 'parent'
          });
      })
      return swimlaneData;
    }

    public static DndFlow = (states: any, steps: any) => {
      try {
        CustomConfigCommons.getSwimlanes(states);
        let nodes = CustomConfigCommons.getNodes(states);
        let edges  = CustomConfigCommons.getEdges(steps);

        if (nodes?.length === 0) {
          let nodeSet = new Set();
          edges?.map((edge: any) => {
            nodeSet.add(edge.sourceNodeId);
            nodeSet.add(edge.targetNodeId);
          })
          let nodeArr = [...nodeSet];
          nodeArr.map((node: any) => {
            nodes.push({
              "id": node,
              "label": node,
              "data": {
                label: node,
                name: node,
                groupName:'',
                isNewState: false,
              },
              "parentNode": '',
              defaultColor: '',
              "type": node?.toLowerCase() === 'start' ? 'input' : node?.toLowerCase() === 'end' ? 'output' : 'custom',
              "nodeType": 'child',
              style: {
                width: 'auto',
                height: 'auto',
                cursor: 'pointer',
                backgroundColor: node.defaultColor || '',
                // boxShadow: '0 2px 15px 2px #4ea9ff',
                textAlign: "center",
                fontWeight: 700,
                borderColor: 'black',
              },
              position,
            })
          })
        }

        let modifiedNodes: any = []
        let modifiedEdges: any = []

        edges.map((edge: any, i: number) => {
          modifiedEdges.push({
            id: edge.id,
            source: edge.sourceNodeId,
            target: edge.targetNodeId,
            label: edge.label,
            // type: 'beizer', //beizer, smartStraightEdge, smartStep, smartBezierEdge, 'smartStep' buttonedge,
            // type: CustomConfigCommons.edgeTypes.smartStep,
            type: 'DndSmartEdge',
            animated: true,
            defaultColor: edge.defaultColor,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: edge.data,
          })
        })

        nodes.map((node: any, i: number) => {
          modifiedNodes.push({
            id: node.id,
            type: node.id?.toLowerCase() === 'start' ? 'input' : node.id?.toLowerCase() === 'end' ? 'output' : 'custom',
            data: node.data,
            position,
            style: {
              width: 'auto',
              height: 'auto',
              cursor: 'pointer',
              // backgroundColor: node.defaultColor || '',
              backgroundColor: node.id?.toLowerCase() === 'start' || node.id?.toLowerCase() === 'end' ? ReactflowData.StartEndNodesColors.backgroundColor : node.defaultColor ? node.defaultColor : '',

              color: node.id?.toLowerCase() === 'start' || node.id?.toLowerCase() === 'end' ? ReactflowData.StartEndNodesColors.color: '',
              // boxShadow: '0 2px 15px 2px #4ea9ff',
              textAlign: "center",
              fontWeight: 700,
              borderColor: 'black',
              borderRadius: node.id?.toLowerCase() === 'start' || node.id?.toLowerCase() === 'end' ? '25px' : '',
            }
          },
        )
      })
      return {modifiedNodes, modifiedEdges}
    } catch(e) {
      console.warn('e = ', e);
    }
  }

  public static SwimLaneFlow = (configData: any) => {
    if (Object.keys(configData).length !== 0) {
      try {
        console.log('SwimLaneFlow configData = ', configData)
        let swimlaneData = CustomConfigCommons.getSwimlanes(configData?.spec?.states);

        if (swimlaneData?.length <= 1) {
          return null;
        }
        let nodeData = CustomConfigCommons.getNodes(configData?.spec?.states);
        let edgeData  = CustomConfigCommons.getEdges(configData?.spec?.steps);

        swimlaneData?.map((sl:any) => {
            if (nodeData.length > 0) {
              let nodeList = nodeData.filter((node:any) => node?.data?.groupName === sl?.id);
              const uniqueNodes = nodeList.filter((obj: any, index: number, self: any) =>
                index === self.findIndex((o: any) => o.id === obj.id)
              );
              nodeData = nodeData.filter((node:any) => node?.data?.groupName !== sl?.id);
              if (uniqueNodes?.length > 0) {
                sl['nodes'] = uniqueNodes
              }
            }
        })

        console.log('after swimlaneData = ', swimlaneData);

        if (swimlaneData[0]?.id === Constants.DEFAULT_PARENT_NODE && swimlaneData[0]?.nodes && swimlaneData[0]?.nodes?.length === 0) {
          console.log('swimlaneData[0]?.nodes = ', swimlaneData[0]?.nodes);
          swimlaneData = swimlaneData.filter((sl: any) => sl?.id !== Constants.DEFAULT_PARENT_NODE)

          swimlaneData = swimlaneData.map((sl:any, i: number) => {
            return {
              ...sl,
              layer : i}
          })
        }

        console.log('swimlane = ', {
          "id":"swimlane",
          "swimlanes": swimlaneData,
          "edges": edgeData,
        });
        return {
          "id": "swimlane",
          "swimlanes": swimlaneData,
          "edges": edgeData,
        }
      } catch(e) {
        console.error(e);
      }
    }
  }

  public static groupNameChangeEvent = (changedData: any, configData: any) => {
    let states: any = {};
    try {
      for (const state in  configData?.spec?.states) {
        if (changedData.node === state) {
          states[changedData.node] = {
            groupName: changedData.groupName
          }
        } else if (changedData.node && !changedData.isDelete){
          states[state] = configData?.spec?.states[state]
        }
      }
      let newConfig = configData;
      newConfig.states = states;

      return newConfig;
    } catch(e) {
      console.error(e);
    }
  }

  public static getConfigDataByDnd = (changedNodes: any, changedEdges: any, configConfigName: any, configConfigDesc: any) => {
    try {
      let configJson: any = {
        metadata: {
          name: configConfigName,
          description: configConfigDesc,
        },
        spec: {
          states :{},
          steps: [],
        }
      };

      let statesJson: any = {}
      changedNodes?.map((node: any) => {
        statesJson[node.data.name] = {
          groupName: node?.data?.groupName === Constants.DEFAULT_PARENT_NODE ? '' : node?.data?.groupName
        }
      })
      configJson.spec.states = statesJson

      let stepsJson: any = []
      changedEdges?.map((edge: any) => {
        stepsJson.push({
          fromState: edge.source,
          toState: edge.target,
          event: edge.data?.event,
          autoTriggeringEvent: edge.data?.autoTriggeringEvent || '',
          input: {
            stage: edge.data?.inputStage || '',
            userBlock: edge.data?.inputAllowedUserBlock || '',
            onFailTriggerEvent: edge.data?.inputOnFailTriggerEvent || '',
            onPassTriggerEvent: edge.data?.inputOnPassTriggerEvent || '',
            allowedRole: edge.data?.inputAllowedRole || '',
            verified: edge.data?.inputVerified,
            checkUserBlockRolesOnly: edge.data?.checkUserBlockRolesOnly,
            sendValidateNotification: edge.data?.sendValidateNotification,
            doNotSendAssignmentNotification: edge.data?.doNotSendAssignmentNotification
            },
            actions: [
              {
                  type: edge.data?.actionType || '',
                  reference: edge.data?.actionNameReference || '',
                  userBlock: {
                      reference: edge.data?.userBlock || ''
                  }
              }
          ],
          policy: {
            confirmationPrompt: {
                label: edge.data?.policyConfirmationPromptLabel || ''
              },
              eventTriggerPolicy: {
                roles: edge.data?.policyAllowedRoles || [],
                userBlocks: edge.data?.policyAllowedUserBlocks || [],
              }
            }
        })
      })
      configJson.spec.steps = stepsJson
      console.log('configJson = ', configJson);
      return configJson;
    } catch(e) {
      console.error(e)
    }
  }
}