/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { CommonLib } from "../../common/libs/commons";
import DnDLayoutFlow from "../../layouts/dnd/DnDLayoutFlow";
import 'reactflow/dist/style.css';
import { CustomConfigCommons } from "../../common/reactflow/configcommons";
import ConfigureUploadModal from "../../common/components/ConfigureUploadModal";
import {
  Node, Edge,
  ReactFlowProvider,
} from 'reactflow';
import SwimlaneFlow from "../../layouts/swim-lanes/SwimlaneFlow";
import CustomSwitch from "../../common/components/CustomSwitch";
import { Grid, ListItemIcon, Menu, MenuItem } from "@mui/material";
import CustomButton from "../../common/components/CustomButton";
import jsYaml from 'js-yaml';
import { CustomConfigType } from "../../common/types/types";
import { ReactflowData } from '../../common/data/reactflowdata'
import "./../../common/styles/Config.css"
import { Constants } from "../../common/libs/Constants";
import CustomModal from "../../common/components/CustomModal";
import { ArrowLeft, FileDownloadOutlined, SaveOutlined, VisibilityRounded } from "@mui/icons-material";
import CustomTabs from "../../common/components/CustomTabs";
import { Controlled as ControlledCodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/yaml/yaml';

function CustomConfig() {

  const [createMode, setCreateMode] = useState<boolean>(true); //true = dnd view, false = swimlane view
  const [configData, setConfigData] = useState<any>({});

  const [dndNodes, setDndNodes] = useState<Node[]>([]);
  const [dndEdges, setDndEdges] = useState<Edge[]>([]);

  const [selectedFlow, setSelectedFlow] = useState<any>(null);//SAMPLE_FLOW[0]
  const [contentChanged, setContentChanged] = useState(false);
  const [configConfigName, setConfigConfigName] = useState('');
  const [configConfigDesc, setConfigConfigDesc] = useState('');
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const [selectedFile, setselectedFile] = useState<string>();
  const [files, setFiles] = useState<any>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [viewModal, setViewModal] = useState(false);
  const [yamlContent, setYamlContent] = useState<any>(null);
  const [jsonContent, setJsonContent] = useState<any>({});

  useEffect(() => {
    // fetchConfigConfigDownloadContent();
    const jsonData: CustomConfigType =  ReactflowData.initConfigData as CustomConfigType;
    setConfigConfigName(jsonData.metadata?.name)
    setConfigConfigDesc(jsonData.metadata?.description)
    setConfigData(jsonData)
  }, [])

  useEffect(() => {
    if (createMode) {
      DNDFlow()
    } else if (Object.keys(configData).length !== 0){
      swimLaneFlow(configData)
    }
  }, [createMode, configData])

  // useEffect(() => {
  //   setConfigData(CustomConfigCommons.getConfigDataByDnd(dndNodes, dndEdges, configConfigName, configConfigDesc));
  // }, [dndNodes, dndEdges])

  const handleDiagramContentChange = (isChanged: boolean) => {
    setContentChanged(isChanged);
  }

  const handleGroupNameChange = async (changedData: any) => {
    // handleNodesEdges(dndNodes, dndEdges);
    let newConfig: any = CustomConfigCommons.groupNameChangeEvent(changedData, configData)
    setConfigData(newConfig);
    setContentChanged(true);
  }

  const handleNodesEdges = (changedNodes: any, changedEdges: any) => {
    console.log('changedNodes = ', changedNodes);
    console.log('changedEdges = ', changedEdges);
    setDndNodes(changedNodes);
    setDndEdges(changedEdges);
    let configData : any = CustomConfigCommons.getConfigDataByDnd(changedNodes, changedEdges, configConfigName, configConfigDesc);
    console.log('changed configData = ', configData)
    setConfigData(configData)
  }

  // const handleNodes = async (changedNodes: any) => {
  //   console.log('changedNodes = ', changedNodes);
  //   setDndNodes(changedNodes);
  //   // let configData : any = await CustomConfigCommons.getConfigDataByDnd(changedNodes, dndEdges, configConfigName, configConfigDesc);
  //   // setConfigData(configData)
  // }

  // const handleEdges = async (changedEdges: any) => {
  //   setDndEdges(changedEdges);
  //   console.log('changedEdges = ', changedEdges);
  //   // let configData : any = await CustomConfigCommons.getConfigDataByDnd(dndNodes, changedEdges, configConfigName, configConfigDesc);
  //   // setConfigData(configData)
  // }

  const DNDFlow = () => {
    let {modifiedNodes, modifiedEdges}: any =  CustomConfigCommons.DndFlow(configData?.spec?.states, configData?.spec?.steps);
    setDndNodes(modifiedNodes);
    setDndEdges(modifiedEdges);
  }

  const swimLaneFlow = (configData: any) => {
    // configData = await CustomConfigCommons.getConfigDataByDnd(dndNodes, dndEdges, configConfigName, configConfigDesc)
    let swimlaneFlow: any = CustomConfigCommons.SwimLaneFlow(configData)
    if (!swimlaneFlow) {
      setSelectedFlow(null)
      CommonLib.warnToast('Please switch to create mode and provide group info for each state to enable this view.');
      return false;
    } else {
      setSelectedFlow(swimlaneFlow)
    }
  }

  const getConfigConfigJson = () => {
    let configJson: any = {};
    let confName = configConfigName?.trim();
    configJson = {
      metadata: {
        name: confName,
        description: configConfigDesc,
      },
      spec: {
        states :{},
        steps: [],
      }
    };

    let statesJson: any = {}
    dndNodes?.map((node: any) => {
      statesJson[node.data.name] = {
        groupName: node?.data?.groupName === Constants.DEFAULT_PARENT_NODE ? '' : node?.data?.groupName
      }
    })
    configJson.spec.states = statesJson

    let stepsJson: any = []
    dndEdges?.map((edge: any) => {
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
    return configJson;
  }

  const handleSave = async () => {
    // handle save
  }

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
        if(files){
            setselectedFile(files[0].name)
            setFiles(files)
        } else {
          CommonLib.errorToast('Please upload a valid yaml file.');
          return;
        }
  }

  const showDiagramByConfigFile = () => {
    try {
      if (files[0]) {
        setDndNodes([])
        setDndEdges([])
        setSelectedFlow(null)
        // setCreateMode(false);

        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result as string;
          console.log('File content:', fileContent);
          // let decodedString = atob(fileContent);
          const jsonData: CustomConfigType =  jsYaml.load(fileContent) as CustomConfigType;
          setConfigConfigName(jsonData.metadata?.name)
          setConfigConfigDesc(jsonData.metadata?.description)
          setConfigData(jsonData)
          setUploadModal(false);
          // Do something with the file content, such as displaying it or sending it to a server
        };
        reader.readAsText(files[0]);
      } else {
        CommonLib.errorToast('Please upload a valid yaml file.');
        return;
      }
    } catch(e) {
      console.error(e);
    }
  }

  const uploadModalContent = () => {
    return (
      ConfigureUploadModal({files: files, handleUploadFile: handleUploadFile, selectedFile: selectedFile})
    )
  }

  const openUploadModal = () => {
    setUploadModal(true);
  }

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  }

  const handleOpenViewModal = () => {
    handleCloseMenu()
    setYamlContent(jsYaml.dump(getConfigConfigJson()))
    setJsonContent(JSON.stringify(jsYaml.load(jsYaml.dump(getConfigConfigJson())), null, 2))
    setViewModal(true);
  }

  const getYamlContent = () => {
    return (
      <div className="">
        <ControlledCodeMirror
          value={yamlContent !== null ? jsYaml.dump(yamlContent) : ''}
          options={{
            mode: 'yaml',
            theme: 'material',
            lineNumbers: true,
            readOnly: true,
          }}
          onBeforeChange={(editor, data, value) => {
            // Handle change
          }}
        />
      </div>
    )
  }
  const getJsonContent = () => {
    return (
      <div className="">
        <ControlledCodeMirror
          value={jsonContent !== null ? jsonContent : ''}
          options={{
            mode: 'json',
            theme: 'material',
            lineNumbers: true,
            readOnly: true,
          }}
          onBeforeChange={(editor, data, value) => {
            // Handle change
          }}
        />
      </div>
    )
  }
  const downloadYamlFile = (content: string, filename: string) => {
    // Convert YAML content to Blob
    const blob = new Blob([content], { type: 'application/yaml' });
  
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
  
    // Trigger the download
    document.body.appendChild(link);
    link.click();
  
    // Clean up
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  };

  const handleDownloadYaml = () => {

    const yamlData = jsYaml.dump(getConfigConfigJson());
    const yamlString = jsYaml.dump(yamlData);
    downloadYamlFile(yamlString, 'config_config.yaml');
    handleCloseMenu();
  }
  const renderViewModalContent = () => {
    return (
      <div className="">
        <CustomTabs
          content={{
            'YAML View': getYamlContent(),
            'JSON View': getJsonContent()
          }}
          isVertical={false}
        />
      </div>
    )
  }

  return (
    <>
      <Grid container spacing={5}>
        <Grid p={1} className={'pl-5 ml-5'} xs={12} md={2}>
          <h5>Create Mode</h5>
          <Grid className={'float-none'}>
            <CustomSwitch
              id="crete_switch"
              checked={createMode}
              onChange={() => setCreateMode(!createMode)}
              name="DNDMode"
              label={createMode ? "Yes" : "No"}
              labelPlacement="end"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={5} m={2}>
        <Grid p={1} my={1} xs={12} md={2} mt={2} justifyContent="flex-start">
          {createMode &&
            <CustomButton floatType={'float-left'} label="Upload YAML file" onClick={openUploadModal}/>
          }
        </Grid>
        {createMode && 
        <><Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleSave}>
            <ListItemIcon>
              <SaveOutlined />
            </ListItemIcon>
            <p>Save and Submit</p>
          </MenuItem>
          <MenuItem onClick={handleDownloadYaml}>
            <ListItemIcon>
              <FileDownloadOutlined />
            </ListItemIcon>
            <p>Download</p>
          </MenuItem>
          <MenuItem onClick={handleOpenViewModal}>
            <ListItemIcon>
              <VisibilityRounded />
            </ListItemIcon>
            <p>View</p>
          </MenuItem>
        </Menu>
        <Grid p={1} my={1} xs={12} md={2} mt={2}  display={'flex'}  justifyContent={'start'} alignItems={'center'}>
          <CustomButton type='contained' label='Actions' startIcon={<ArrowLeft />} onClick={handleActionClick} />
        </Grid></>}
        {/* <Grid p={1} mt={2}>
           <CustomButton floatType={'right'} label="Save" onClick={handleSave} loading={fileBtnLoading}/>
         </Grid>}*/}
      </Grid>
      <Grid p={1} xs={12} md={12}>
      {createMode ?
          <>
          {dndNodes?.length > 0 &&
            <DnDLayoutFlow
              nodes={dndNodes}
              edges={dndEdges}
              // handleNodes={handleNodes}
              handleNodesEdges={handleNodesEdges}
              diagramName={configConfigName}
              // handleEdges={handleEdges}
              handleDiagramContentChange={handleDiagramContentChange}
              handleGroupNameChange={handleGroupNameChange}
            />
          }
          </>
      :
        <>
          {selectedFlow?.id &&<ReactFlowProvider><SwimlaneFlow selectedFlow={selectedFlow} rankDirection="LR" /></ReactFlowProvider>}
        </>
      }
        <CustomModal
          open={uploadModal}
          onClose={() => setUploadModal(false)}
          title={"Upload File"}
          content={uploadModalContent()}
          needCancelBtn={true}
          needConfirmBtn={true}
          handler={showDiagramByConfigFile}
          // readOnlyConfirmBtn={disableConfirmBtn}
          confirmBtnLabel={'Submit'}
          maxWidth={"md"}
        />
        <CustomModal
          onClose={() => {
            setViewModal(false)
          }}
          title={'View'}
          open={viewModal}
          content={renderViewModalContent()}
          maxWidth={'md'}
          needCancelBtn={true}
        />
      </Grid>
    </>
  );
}

export default CustomConfig;