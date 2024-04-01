import { useEffect, useState, useCallback } from "react";
import getGraphNodesEdges from "./include/SwimlaneLayout";
import ReactFlow, {
  Background,
  ConnectionMode,
  Controls,
  Panel,
  useEdgesState,
  useNodesState,
  ReactFlowInstance,
  
} from "reactflow";
import { SwimlaneFlowInput } from "./types/swimlane-flow-types";

import {CustomConfigCommons} from '../../common/reactflow/configcommons'

import CustomButton from "./../../common/components/CustomButton";
import CustomGrid from "./../../common/components/CustomGrid";

import DownloadButton from '../../common/components/DownloadButton';

import "./Swimlanes.css"

// const proOptions = { hideAttribution: true };

const SwimlaneFlow = (props: {
  rankDirection: string;
  selectedFlow: SwimlaneFlowInput | null | undefined;
}) => {
  const { rankDirection, selectedFlow } = props;
  // const { fitView } = useReactFlow();

  const [rankDir, setRankDir] = useState(rankDirection);
  const [reactflowNodes, setReactflowNodes, onNodesChange] = useNodesState([]);
  const [reactflowEdges, setReactflowEdges, onEdgesChange] = useEdgesState([]);

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

  const onInit = (rfi: ReactFlowInstance) => setReactFlowInstance(rfi);

  useEffect(() => {
    const setReactflowNodesEdges = (direction: string) => {
      let { nodes, edges} = getGraphNodesEdges(direction, selectedFlow!);
      if (reactFlowInstance && nodes.length) {
        reactFlowInstance.fitView();
      }
    };
  }, [reactFlowInstance]);

  useEffect(() => {
    const setReactflowNodesEdges = (direction: string) => {
      let { nodes, edges} = getGraphNodesEdges(direction, selectedFlow!);
      setReactflowNodes(nodes);
      setReactflowEdges(edges);
    };
    setReactflowNodesEdges(rankDir);
  }, [selectedFlow, rankDir, setReactflowNodes, setReactflowEdges]);

  const onKeyDown = useCallback((event: any) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  return (
    <div className={'rf-swimlane download-png-block'} onKeyDown={onKeyDown} tabIndex={0}>
      <div className={'rf-wrapper'}>
        <span className={'rf-snap'}> </span>
        <span className={'rf-snap'}> </span>
        <span className={'rf-snap'}> </span>
        <span className={'rf-snap'}> </span>
        <ReactFlow
        nodes={reactflowNodes}
        edges={reactflowEdges}
        edgeTypes={CustomConfigCommons.edgeTypes}
        onInit={onInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        connectionMode={ConnectionMode.Loose}
        className="download-image"
        // proOptions={proOptions}
        >
          <Panel position="top-right">
            <CustomGrid>{[[
                <CustomButton label="Vertical Layout" type={"primary"} onClick={() => {setRankDir('TB')}}/>,
                <CustomButton label="Horizontal Layout" type={"primary"} onClick={() => {setRankDir('LR')}}/>
            ]]}
            </CustomGrid>
          </Panel>
          <Background />
          {/* <MiniMap /> */}
          <Controls />
          <DownloadButton handler={() => reactFlowInstance?.fitView()} onLayout={() => setRankDir('TB')}/>
        </ReactFlow>
      </div>
    </div>
  );
};

export default SwimlaneFlow;
