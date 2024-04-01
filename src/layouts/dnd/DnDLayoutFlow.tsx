/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { useCallback, useState, DragEvent, useEffect} from 'react';
import ReactFlow, {
  Controls,
  ReactFlowProvider,
  Connection,
  useNodesState,
  useEdgesState,
  Panel,
  Node,
  NodeOrigin,
  Background,
  ReactFlowInstance,
  Position,
} from 'reactflow';
import {Constants} from "./../../common/libs/Constants";
// import { ApiLib } from "./../../common/libs";
import { CommonLib } from "./../../common/libs/commons";

import CustomAutocomplete from "./../../common/components/CustomAutocomplete";
import CustomModal from "./../../common/components/CustomModal";
import CustomTextInput from "../../common/components/CustomTextInput";
import {CustomConfigCommons} from '../../common/reactflow/configcommons'
import {ReactflowData} from '../../common/data/reactflowdata'
import './DnD.css';
import CustomButton from './../../common/components/CustomButton';
import CustomGrid from './../../common/components/CustomGrid';
import Sidebar from './Sidebar';
import { Box, Grid } from '@mui/material';
import DownloadButton from '../../common/components/DownloadButton';

let id = 1;
const getId = () => `${id++}`;
const nodeOrigin: NodeOrigin = [0.5, 0.5];

const DnDLayoutFlow = (props: any) => {

  const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);

  const [nodeDeleteWarnModal, setNodeDeleteWarnModal] = useState(false);
  const [edgeDeleteWarnModal, setEdgeDeleteWarnModal] = useState(false);
  const [nodeToBeDeleted, setNodeToBeDeleted] = useState(ReactflowData.emptyNode);
  const [edgeToBeDeleted, setEdgeToBeDeleted] = useState(ReactflowData.emptyEdge);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  const [roles, setRoles] = useState([]);
  const [userBlocks, setUserBlocks] = useState([]);
  const [nodeModal, setNodeModal] = useState(false);
  const [edgeModal, setEdgeModal] = useState(false);
  const [currentNode, setCurrentNode] = useState({data:{name: ''}, style: {}});
  const [currentNodeID, setCurrentNodeID] = useState('');
  const [currentNodeName, setCurrentNodeName] = useState('');
  const [currentSelectedNodeName, setCurrentSelectedNodeName] = useState('');
  const [currentNodeGroup, setCurrentNodeGroup] = useState('');
  const [currentSelectedNodeGroup, setCurrentSelectedNodeGroup] = useState('');
  const [disableConfirmBtn, setDisableConfirmBtn] = useState(false);
  const [nodeNameDisabled, setNodeNameDisabled] = useState(true); 

  const [currentSelectedEvent, setCurrentSelectedEvent] = useState('');
  const [currentSelectedEventID, setCurrentSelectedEvenID] = useState('');
  const [currentChangedEvent, setCurrentChangedEvent] = useState('');
  const [currentActionType, setCurrentActionType] = useState('');
  const [currentActionName, setCurrentActionName] = useState('');
  const [currentEventUserBlock, setCurrentEventUserBlock] = useState('');
  const [currentAutoTriggerEvent, setCurrentAutoTriggerEvent] = useState('');
  const [currentPromptLabel, setCurrentPromptLabel] = useState('');
  const [currentAllowedRoles, setCurrentAllowedRoles] = useState([]);
  const [currentAllowedUserBlocks, setCurrentAllowedUserBlocks] = useState([]);
  const [currentStage, setCurrentStage] = useState('');
  const [currentInputVerified, setCurrentInputVerified] = useState({label:'',value:false});
  const [currentOnPassTriggerEvent, setCurrentOnPassTriggerEvent] = useState('');
  const [currentOnFailTriggerEvent, setCurrentOnFailTriggerEvent] = useState('');
  const [currentInputAllowedUserBlock, setCurrentInputAllowedUserBlock] = useState('');
  const [currentCheckUserBlockRolesOnly, setCurrentCheckUserBlockRolesOnly] = useState({label:'',value:false});
  const [currentSendValidateNotification, setCurrentSendValidateNotification] = useState({label:'',value:false});
  const [currentDoNotSendAssignmentNotification, setCurrentDoNotSendAssignmentNotification] = useState({label:'',value:false});
  const [currentInputAllowedRole, setCurrentInputAllowedRole] = useState('');

  const onConnect = ((connection: Connection) => {
      console.log('connection = ', connection);
      let newEdgeIndex = edges?.length
      let newEvent: any = {
        id: "edge-" + newEdgeIndex,
        label: '',
        type: 'dndSmartEdge',
        source: connection?.source || '',
        target: connection?.target || '',
        markerEnd: {type: 'arrowclosed'},
        data: {
          event: '',
          actionNameReference: '',
          actionType: '',
          userBlock: '',
          autoTriggeringEvent: '',
          policyConfirmationPromptLabel: '',
          policyAllowedRoles: [],
          policyAllowedUserBlocks: [],
          inputStage: '',
          inputVerified: currentInputVerified?.value,
          inputOnPassTriggerEvent: '',
          inputOnFailTriggerEvent: '',
          sendValidateNotification: currentSendValidateNotification?.value,
          inputAllowedUserBlock: '',
          inputAllowedRole: '',
          checkUserBlockRolesOnly: currentCheckUserBlockRolesOnly?.value,
          doNotSendAssignmentNotification: currentDoNotSendAssignmentNotification?.value,
        },
      }

      console.log('newEvent = ', newEvent);
      // setEdges((eds: any) => eds.concat(newEvent));
      setEdges((previousEdges) => {
        const updatedEdges = previousEdges.concat(newEvent);
        // props.handleEdges(updatedEdges);
        props.handleNodesEdges(nodes, updatedEdges)
        return updatedEdges;
      });
      // props.handleEdges(edges.concat(newEvent));
    });


  useEffect(() => {
    onLayout('TB');

    const handleContextmenu = (e:any) => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextmenu)
  }, [])

  useEffect(() => {
    if (reactFlowInstance && nodes.length) {
      reactFlowInstance.fitView();
    }
  }, [reactFlowInstance]);

  const onLayout = useCallback(
    (direction: any) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = CustomConfigCommons.getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  const onInit = (rfi: ReactFlowInstance) => setReactFlowInstance(rfi);

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    if (reactFlowInstance) {
      let duplicateNode = '';
      const type = event.dataTransfer.getData('application/reactflow');
      let label = event.dataTransfer.getData("label");
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      nodes?.map((nd: any) => {
        if (nd.data.name === 'Start' && label === nd.data.name) {
          duplicateNode = 'Start';
          return false;
        }
        if (nd.data.name === 'End' && label === nd.data.name) {
          duplicateNode = 'End';
          return false;
        }
      })
      if (duplicateNode) {
        CommonLib.errorToast('Only one "'+duplicateNode+'" Node allowed');
        return false;
      }

      if (label !== 'Start' && label !== 'End') {
        label = 'State '+ getId()
      }
      let newStateID = label;
      const newNode: Node = {
        id: newStateID,
        type,
        position,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: { label: newStateID.trim(), name: newStateID.trim(), groupName: ''},
        style: {
          width: 'auto',
          height: 'auto',
          cursor: 'pointer',
          backgroundColor: label === 'Start' || label === 'End' ? ReactflowData.StartEndNodesColors.backgroundColor : '',
          color: label === 'Start' || label === 'End' ? ReactflowData.StartEndNodesColors.color : '',
          // boxShadow: '0 2px 15px 2px #4ea9ff',
          textAlign: "center",
          fontWeight: 700,
          borderColor: 'black',
          borderRadius: label === 'Start' || label === 'End' ? '25px' : '',
        }
      };

      console.log('newNode = ', newNode)

      props.handleDiagramContentChange(true);
      // setNodes((nds: any) => nds.concat(newNode));
      setNodes((previousNodes) => {
        const updatedNodes = previousNodes.concat(newNode);
        // props.handleNodes(updatedNodes);
        props.handleNodesEdges(updatedNodes, edges)
        return updatedNodes;
      });
      // props.handleNodes(nodes.concat(newNode))
    }
  };

  const onNodeClick = (event:any, node:any) => {
    console.log('click node', node)
    setCurrentNodeName(node.data?.name);
    setCurrentSelectedNodeName(node.data?.name);
    setCurrentNodeGroup(node.data?.groupName)
    setCurrentSelectedNodeGroup(node.data?.groupName)
    setNodeNameDisabled(node.data?.name === 'Start' || node.data?.name === 'End');
    setCurrentNode(node)
    setCurrentNodeID(node.id);
    setNodeModal(true)
  }

  const handleEdgeSubmit = async () => {
    console.log('currentEvent = ', currentChangedEvent)
    if (!currentChangedEvent) {
      CommonLib.warnToast('Event name cannot be empty');
      return false;
    }
    try {
      let isNewEvent = true;
      await setEdges((edges: any) => edges.map((edge: any) => {
        if (edge?.id === currentSelectedEventID) {
          isNewEvent = false;
          // let newEdge: any = {...edge}
          edge['label'] = currentChangedEvent;
          edge['type'] = 'dndSmartEdge';
          edge['data'] = {
            event: currentChangedEvent,
            actionNameReference: currentActionName || '',
            actionType: currentActionType || '',
            userBlock: currentEventUserBlock || '',
            autoTriggeringEvent: currentAutoTriggerEvent || '',
            policyConfirmationPromptLabel: currentPromptLabel || '',
            policyAllowedRoles: currentAllowedRoles?.length > 0 ? currentAllowedRoles : [],
            policyAllowedUserBlocks: currentAllowedUserBlocks?.length > 0 ? currentAllowedUserBlocks : [],
            inputStage: currentStage || '',
            inputVerified: currentInputVerified?.value,
            inputOnPassTriggerEvent: currentOnPassTriggerEvent || '',
            inputOnFailTriggerEvent: currentOnFailTriggerEvent || '',
            sendValidateNotification: currentSendValidateNotification?.value,
            inputAllowedUserBlock: currentInputAllowedUserBlock || '',
            inputAllowedRole: currentInputAllowedRole || '',
            checkUserBlockRolesOnly: currentCheckUserBlockRolesOnly?.value,
            doNotSendAssignmentNotification: currentDoNotSendAssignmentNotification?.value,
          };
          console.log('new Edge = ', edge);
          return edge;
        } else {
          return edge;
        }
      }));

      if (isNewEvent) {
        let newEvent: any = {}
        console.log('new edge = ', currentChangedEvent);
        newEvent['label'] = currentChangedEvent;
        newEvent['type'] = 'dndSmartEdge';

        newEvent['data'] = {
          event: currentChangedEvent,
          actionNameReference: currentActionName || '',
          actionType: currentActionType || '',
          userBlock: currentEventUserBlock || '',
          autoTriggeringEvent: currentAutoTriggerEvent || '',
          policyConfirmationPromptLabel: currentPromptLabel || '',
          policyAllowedRoles: currentAllowedRoles ? currentAllowedRoles : [],
          policyAllowedUserBlocks: currentAllowedUserBlocks ? currentAllowedUserBlocks : [],
          inputStage: currentStage || '',
          inputVerified: currentInputVerified?.value,
          inputOnPassTriggerEvent: currentOnPassTriggerEvent || '',
          inputOnFailTriggerEvent: currentOnFailTriggerEvent || '',
          sendValidateNotification: currentSendValidateNotification?.value,
          inputAllowedUserBlock: currentInputAllowedUserBlock || '',
          inputAllowedRole: currentInputAllowedRole || '',
          checkUserBlockRolesOnly: currentCheckUserBlockRolesOnly?.value,
          doNotSendAssignmentNotification: currentDoNotSendAssignmentNotification?.value,
        };
        console.log('newEvent = ', newEvent);
        setEdges((eds: any) => eds.concat(newEvent));
      }

      props.handleDiagramContentChange(true);
      props.handleNodesEdges(nodes, edges)
      // props.handleEdges(edges)
      setEdgeModal(false);
    } catch(e) {
      console.error(e);
    }
  }

  const handleNodeSubmit = () => {
    if (!currentNodeName) {
      CommonLib.warnToast('State name cannot be empty');
      return false;
    }

    if (currentNodeGroup !== currentSelectedNodeGroup) {
      props.handleGroupNameChange({node: currentNodeName, groupName: currentNodeGroup, isDelete: false})
    }

    setNodes((nds: any) =>
      nds.map((node: any) => {
        if (node.id.trim() === currentNodeID.trim()) {
          node.id = currentNodeName.trim();
          node.data = { label: currentNodeName.trim(), groupName: currentNodeGroup === '' ? Constants.DEFAULT_PARENT_NODE : currentNodeGroup, name: currentNodeName.trim(), isNewState: false };
          node.style = currentNode?.style || {}
        }

        if (currentNodeGroup !== currentSelectedNodeGroup) {
          node.parent = currentNodeGroup
        }
        return node;
      })
    );
    if (currentNodeName !== currentSelectedNodeName) {
      setEdges((eds: any) =>
        eds.map((edge: any) => {
          if (edge.source === currentSelectedNodeName.trim()) {
            edge.source = currentNodeName.trim();
          }
          if (edge.target === currentSelectedNodeName.trim()) {
            edge.target = currentNodeName.trim();
          }
          return edge;
        })
      );
      // props.handleEdges(edges)
    }
    props.handleNodesEdges(nodes.map((node: any) => {
      if (node.id.trim() === currentNodeID.trim()) {
        node.id = currentNodeName.trim();
        node.data = { label: currentNodeName.trim(), groupName: currentNodeGroup === '' ? Constants.DEFAULT_PARENT_NODE : currentNodeGroup, name: currentNodeName.trim(), isNewState: false };
        node.style = currentNode?.style || {}
      }

      if (currentNodeGroup !== currentSelectedNodeGroup) {
        node.parent = currentNodeGroup
      }
      return node;
    }),currentNodeName !== currentSelectedNodeName ? edges.map((edge: any) => {
      if (edge.source === currentSelectedNodeName.trim()) {
        edge.source = currentNodeName.trim();
      }
      if (edge.target === currentSelectedNodeName.trim()) {
        edge.target = currentNodeName.trim();
      }
      return edge;
    }) : edges)

    props.handleDiagramContentChange(true);
    // props.handleNodes(nodes)
    setNodeModal(false);
  }
  const duplicateNodeCheck = (selectedNodeName: any) => {
    let nodeAlreadyAvailable = false;
    props.nodes?.map((node: any) => {

      if (node?.data?.name !== currentNode?.data?.name && selectedNodeName === node?.data?.name) {
        nodeAlreadyAvailable = true;
        CommonLib.warnToast('State name cannot be duplicate');
        return false;
      }
    })
    return nodeAlreadyAvailable;
  }

  const handleEdgeClick = (event: any, element: any) => {
    console.log('Edge clicked:', element);
    setCurrentChangedEvent(element?.data?.event || '');
    setCurrentSelectedEvent(element?.data?.event || '');
    setCurrentSelectedEvenID(element?.id || '');
    setCurrentActionType(element?.data?.actionType || '');
    setCurrentActionName(element?.data?.actionNameReference || '');
    setCurrentEventUserBlock(element?.data?.userBlock || '');
    setCurrentAutoTriggerEvent(element?.data?.autoTriggeringEvent || '');
    setCurrentPromptLabel(element?.data?.policyConfirmationPromptLabel || '');
    setCurrentAllowedRoles(element?.data?.policyAllowedRoles || []);
    setCurrentAllowedUserBlocks(element?.data?.policyAllowedUserBlocks || []);
    setCurrentStage(element?.data?.inputStage || '');
    setCurrentInputVerified(element?.data?.inputVerified === true ? {
      label: 'Yes', value: true
    } : {
      label: 'No', value: false
    });
    setCurrentOnPassTriggerEvent(element?.data?.inputOnPassTriggerEvent || '');
    setCurrentOnFailTriggerEvent(element?.data?.inputOnFailTriggerEvent || '');
    setCurrentSendValidateNotification(element?.data?.sendValidateNotification === true ? {
      label: 'Yes', value: true
    } : {
      label: 'No', value: false
    });;
    setCurrentInputAllowedUserBlock(element?.data?.inputAllowedUserBlock || '');
    setCurrentInputAllowedRole(element?.data?.inputAllowedRole || '');
    setCurrentCheckUserBlockRolesOnly(element?.data?.checkUserBlockRolesOnly === true ? {
      label: 'Yes', value: true
    } : {
      label: 'No', value: false
    });
    setCurrentDoNotSendAssignmentNotification(element?.data?.doNotSendAssignmentNotification === true ? {
      label: 'Yes', value: true
    } : {
      label: 'No', value: false
    });
    setEdgeModal(true);
  };

  const edgeModalContent = () => {
    return (
      <Box mt={3}>
        <Grid container spacing={5}>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
                <CustomTextInput
                    name={'eventname'}
                    label={'Event Name'}
                    // disable={nodeNameDisabled}
                    value={currentChangedEvent}
                    onChange={(e:any, v:any)=> {
                      if (e.target.value === '') {
                        CommonLib.warnToast('Event name cannot be empty')
                      }
                      setCurrentChangedEvent(e.target.value)
                    }}
                />
            </Grid>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
              <CustomAutocomplete
                id={"actiontype"}
                options={ReactflowData.ActionTypes}
                value={currentActionType}
                // optionLabelGetter={(option: any) => option.label}
                label="Action Types"
                onInputChange={(e: any, val: any) => setCurrentActionType(val)}
                // 
                width={255}
                disableClearable={false} />
            </Grid>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
                <CustomTextInput
                    name={'actionname'}
                    label={'Action Name'}
                    // disable={nodeNameDisabled}
                    value={currentActionName}
                    onChange={(e:any, v:any)=> {
                        setCurrentActionName(e.target.value)
                    }}
                />
            </Grid>
        </Grid>
        <Grid container spacing={5}>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
              <CustomAutocomplete
                id={"userblock"}
                options={userBlocks}
                value={currentEventUserBlock}
                // optionLabelGetter={(option: any) => option?.metadata?.name}
                label="UserBlocks"
                onInputChange={(e: any, val: any) => setCurrentEventUserBlock(val)}
                // 
                width={255}
                disableClearable={false} />
            </Grid>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
                <CustomTextInput
                    name={'autotriggerevent'}
                    label={'Auto Trigger Event on Completion'}
                    // disable={nodeNameDisabled}
                    value={currentAutoTriggerEvent}
                    onChange={(e:any, v:any)=> {
                        setCurrentAutoTriggerEvent(e.target.value)
                    }}
                />
            </Grid>
        </Grid>
         <div className={'row py-2 mb-3'}>
           <h4>Policy</h4>
         </div>
        <Grid container spacing={5}>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
                <CustomTextInput
                    name={'promptLabel'}
                    label={'Confirmation Prompt Label'}
                    // disable={nodeNameDisabled}
                    value={currentPromptLabel}
                    onChange={(e:any, v:any)=> {
                        setCurrentPromptLabel(e.target.value)
                    }}
                />
            </Grid>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
              <CustomAutocomplete
                id={"allowedroles"}
                options={roles}
                value={currentAllowedRoles}
                optionLabelGetter={(option: any) => option}
                multiSelect={true}
                label="Allowed Roles"
                onChange={(e: any, vals: any) => {
                    setCurrentAllowedRoles(vals.map((v: any) => v))
                  }
                }
                width={255}
                disableClearable={false} />
            </Grid>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
              <CustomAutocomplete
                id={"alloweduserblocks"}
                options={userBlocks}
                value={currentAllowedUserBlocks}
                optionLabelGetter={(option: any) => option}
                multiSelect={true}
                label="Allowed UserBlocks"
                onChange={(e: any, vals: any) => {
                  console.log('vals = ', vals);
                  setCurrentAllowedUserBlocks(vals.map((v: any) => v))}
                }
                width={255}
                disableClearable={false} />
            </Grid>
        </Grid>
        <div className={'row py-2 mb-3'}>
          <h4>Input</h4>
        </div>
        <Grid container spacing={5}>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
                <CustomTextInput
                    name={'stage'}
                    label={'Stage'}
                    // disable={nodeNameDisabled}
                    value={currentStage}
                    onChange={(e:any, v:any)=> {
                        setCurrentStage(e.target.value)
                    }}
                />
            </Grid>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
              <CustomAutocomplete
                id={"verified"}
                options={ReactflowData.BooleanOptions}
                // optionLabelGetter={(option: any) => option.label}
                value={currentInputVerified?.label}
                label="Verified"
                onChange={(e: any, val: any) => {
                  val?.value === true ? setCurrentInputVerified({label: 'Yes', value: true}) : setCurrentInputVerified({label: 'No', value: false})
                  }
                }
                width={255}
                disableClearable={false} />
            </Grid>
            <Grid p={2} my={1} xs={12} md={4} mt={2}>
              <CustomTextInput
                name={'onpasstriggerevent'}
                label={'On Pass Trigger Event'}
                // disable={nodeNameDisabled}
                value={currentOnPassTriggerEvent}
                onChange={(e:any, v:any)=> {
                    setCurrentOnPassTriggerEvent(e.target.value)
                }}
              />
            </Grid>
        </Grid>

        <Grid container spacing={5}>
          <Grid p={2} my={1} xs={12} md={4} mt={2}>
            <CustomTextInput
                name={'onfailtriggerevent'}
                label={'On Fail Trigger Event'}
                // disable={nodeNameDisabled}
                value={currentOnFailTriggerEvent}
                onChange={(e:any, v:any)=> {
                    setCurrentOnFailTriggerEvent(e.target.value)
                }}
              />
          </Grid>
          <Grid p={2} my={1} xs={12} md={4} mt={2}>
            <CustomAutocomplete
              id={"inputallowedroles"}
              options={roles}
              value={currentInputAllowedRole}
              optionLabelGetter={(option: any) => option}
              label="Allowed Roles"
              onChange={(e: any, val: any) => {
                  setCurrentInputAllowedRole(val)
                }
              }
              width={255}
              disableClearable={false} />
          </Grid>
          <Grid p={2} my={1} xs={12} md={4} mt={2}>
            <CustomAutocomplete
              id={"inputuserblock"}
              options={userBlocks}
              value={currentInputAllowedUserBlock}
              // optionLabelGetter={(option: any) => option?.metadata?.name}
              label="UserBlocks"
              onChange={(e: any, val: any) => setCurrentInputAllowedUserBlock(val)}
              width={255}
              disableClearable={false} />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid p={2} my={1} xs={12} md={4} mt={2}>
        <CustomAutocomplete
          id={"checkUserBlockRolesOnly"}
          options={ReactflowData.BooleanOptions}
          value={currentCheckUserBlockRolesOnly?.label}
          // optionLabelGetter={(option: any) => option.label}
          label="Check UserBlock Roles Only"
          onChange={(e: any, val: any) => {
              val.value === true ? setCurrentCheckUserBlockRolesOnly({label: 'Yes', value: true}) : setCurrentCheckUserBlockRolesOnly({label: 'No', value: false})
            }
          }
          width={255}
          disableClearable={false} />
      </Grid>
      <Grid p={2} my={1} xs={12} md={4} mt={2}>
        <CustomAutocomplete
          id={"sendValidateNotification"}
          options={ReactflowData.BooleanOptions}
          value={currentSendValidateNotification?.label}
          // optionLabelGetter={(option: any) => option.label}
          label="Send Validate Notification"
          onChange={(e: any, val: any) => {
              val.value === true ? setCurrentSendValidateNotification({label: 'Yes', value: true}) : setCurrentSendValidateNotification({label: 'No', value: false})
            }
          }
          width={255}
          disableClearable={false} />
      </Grid>
      <Grid p={2} my={1} xs={12} md={4} mt={2}>
        <CustomAutocomplete
          id={"doNotSendAssignmentNotification"}
          options={ReactflowData.BooleanOptions}
          value={currentDoNotSendAssignmentNotification?.label}
          // optionLabelGetter={(option: any) => option.label}
          label="Do Not Send Assignemnt Notification"
          onChange={(e: any, val: any) => {
              val.value === true ? setCurrentDoNotSendAssignmentNotification({label: 'Yes', value: true}) : setCurrentDoNotSendAssignmentNotification({label: 'No', value: false})
            }
          }
          width={255}
          disableClearable={false} />
        </Grid>
      </Grid>
    </Box>
    )
  }
  const nodeModalContent = () => {
    return (
      <Box mt={3}>
        <Grid container spacing={5}>
            <Grid p={2} xs={12} md={6} mt={1}>
                <CustomTextInput
                    name={'nodename'}
                    label={'State'}
                    disable={nodeNameDisabled}
                    value={currentNodeName}
                    onChange={(e:any, v:any)=> {
                        console.log('e.target.value = ', e.target.value)
                        duplicateNodeCheck(e.target.value) ? setDisableConfirmBtn(true) : setDisableConfirmBtn(false);
                        if (e.target.value === '') {
                          CommonLib.warnToast('State name cannot be empty')
                        }
                        setCurrentNodeName(e.target.value);
                    }}
                />
            </Grid>
            <Grid p={2} xs={12} md={6} mt={1}>
              <CustomTextInput
                    name={'nodegroup'}
                    label={'Group Name'}
                    value={currentNodeGroup !== Constants.DEFAULT_PARENT_NODE ? currentNodeGroup : ''}
                    onChange={(e:any, v:any)=> {
                      setCurrentNodeGroup(e.target.value)
                    }}
                />
            </Grid>
        </Grid>
    </Box>
    )
  }

  const handleNodeDeleteConfirm = () => {
    console.log('before delete nodes = ', nodes);
    console.log('nodeToBeDeleted = ', nodeToBeDeleted);

      if (nodeToBeDeleted.id) {
        setNodes((previousNodes) => {
          const updatedNodes = previousNodes.filter((nd: any) => nodeToBeDeleted?.id !== nd?.id);
          return updatedNodes;
        });

        setEdges((previousEdges) => {
          const updatedEdges = previousEdges.filter((ed:any) => ed?.source !== nodeToBeDeleted.id && ed?.target !== nodeToBeDeleted.id);
          return updatedEdges;
        });

        let updatedNodes = nodes.filter((nd: any) => nodeToBeDeleted?.id !== nd?.id);
        let updatedEdges = edges.filter((ed:any) => ed?.source !== nodeToBeDeleted.id && ed?.target !== nodeToBeDeleted.id);

        console.log('updatedNodes = ', updatedNodes);
        console.log('updatedEdges = ', updatedEdges);

        props.handleNodesEdges(updatedNodes, updatedEdges)
        // props.handleGroupNameChange({node: currentNodeName, groupName: currentNodeGroup, isDelete: true})
        CommonLib.warnToast('The state has been deleted');
        setNodeToBeDeleted(ReactflowData.emptyNode);
      }
    setNodeDeleteWarnModal(false);
  }

  const handleEdgeDeleteConfirm = async () => {
    console.log('Event delete confirmation');
    console.log('before delete edges = ', edges);
    if (edgeToBeDeleted.id) {
      let newEdges = await edges.filter((ed: any) => edgeToBeDeleted?.id !== ed?.id)
      console.log('newEdges = ', newEdges);
      // setEdges(newEdges)
      setEdges((previousEdges) => {
        const updatedEdges = previousEdges.filter((ed: any) => edgeToBeDeleted?.id !== ed?.id);
        // props.handleEdges(updatedEdges);
        props.handleNodesEdges(nodes, updatedEdges)
        return updatedEdges;
      });
      // props.handleEdges(edges)
      CommonLib.warnToast('The event has been deleted');
      setEdgeToBeDeleted(ReactflowData.emptyEdge);
    }
    setEdgeDeleteWarnModal(false);
  }

  const onNodeContextMenu = (event: any, node : any) => {
    console.log('NODE right click happend obj = ', node);
    setNodeDeleteWarnModal(true);
    setNodeToBeDeleted(node)
  }

  const onEdgeContextMenu = (event: any, edge : any) => {
    console.log('EDGE right click = ', edge);
    setEdgeDeleteWarnModal(true);
    setEdgeToBeDeleted(edge)
    event.preventDefault();
  }

  const onKeyDown = useCallback((event: any) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  return (
    <>
      <ReactFlowProvider>
      <div className={'layoutflow'} onKeyDown={onKeyDown}>
        <div className={'dndflow download-png-block'}>
          <Sidebar />
          <div className={'rf-wrapper'}>
            <span className={'rf-snap'}> </span>
            <span className={'rf-snap'}> </span>
            <span className={'rf-snap'}> </span>
            <span className={'rf-snap'}> </span>
            <ReactFlow snapToGrid={true} snapGrid={[15, 15]}
              // ref={ref}
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              fitView
              // nodeExtent={nodeExtent}
              // onInit={() => onLayout('TB')}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              // onEdgeUpdate={onEdgeUpdate}
              // onEdgeUpdateStart={onEdgeUpdateStart}
              // onEdgeUpdateEnd={onEdgeUpdateEnd}
              onNodeDoubleClick={onNodeClick}
              onDrop={onDrop}
              onInit={onInit}
              // nodeTypes={nodeTypes}
              onDragOver={CustomConfigCommons.onDragOver}
              edgeTypes={CustomConfigCommons.edgeTypes}
              nodeOrigin={nodeOrigin}
              onEdgeDoubleClick={(e: any, element: any) => handleEdgeClick(e, element)}
              // proOptions={proOptions}
              className="download-image"
              // onNodesDelete={onNodesDelete}
              // onEdgesDelete={onEdgesDelete}
              onEdgeContextMenu={onEdgeContextMenu}
              onNodeContextMenu={onNodeContextMenu}
              >
                <Controls />
                <Background />
                <DownloadButton handler={() => reactFlowInstance?.fitView()} onLayout={() => onLayout('TB')} fileName={props.diagramName}/>
              </ReactFlow>
            </div>
            <Panel position="top-right">
              <CustomGrid>
                {[[
                  <CustomButton label="Vertical Layout" type={"primary"} onClick={() => {onLayout('TB')}}/>,
                  <CustomButton label="Horizontal Layout" type={"primary"} onClick={() => {onLayout('LR')}}/>
                ]]}
              </CustomGrid>
            </Panel>
          </div>
        </div>
        <CustomModal
          open={nodeModal}
          onClose={() => setNodeModal(false)}
          title={"Edit State"}
          content={nodeModalContent()}
          needCancelBtn={false}
          needConfirmBtn={true}
          handler={handleNodeSubmit}
          readOnlyConfirmBtn={disableConfirmBtn}
          confirmBtnLabel={'Submit'}
          maxWidth={"sm"}
        />
        <CustomModal
          open={edgeModal}
          onClose={() => setEdgeModal(false)}
          title={"Edit Event"}
          content={edgeModalContent()}
          needCancelBtn={false}
          needConfirmBtn={true}
          handler={handleEdgeSubmit}
          readOnlyConfirmBtn={disableConfirmBtn}
          confirmBtnLabel={'Update'}
          maxWidth={"md"}
        />
        <CustomModal
          open={nodeDeleteWarnModal}
          onClose={() => {
              setNodeDeleteWarnModal(false)
            }
          }
          title={"Confirmation"}
          content={
            <h4>{"Are you sure you want to delete the stage '"+nodeToBeDeleted.data.name+"'?"}</h4>
          }
          needCancelBtn={true}
          needConfirmBtn={true}
          handler={handleNodeDeleteConfirm}
          maxWidth={"sm"}
        />
        <CustomModal
          open={edgeDeleteWarnModal}
          onClose={() => {
              setEdgeDeleteWarnModal(false)
            }
          }
          title={"Confirmation"}
          content={
            <h4>{`Are you sure you want to delete the event `+(edgeToBeDeleted?.data?.event || "")+`?`}</h4>
          }
          needCancelBtn={true}
          needConfirmBtn={true}
          handler={handleEdgeDeleteConfirm}
          maxWidth={"sm"}
        />
      </ReactFlowProvider>
    </>
  );
};

export default DnDLayoutFlow;