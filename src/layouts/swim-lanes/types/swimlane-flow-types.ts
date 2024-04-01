export interface BasicObject {
  id: string;
  name?: string;
}

export interface SwimlaneNode extends BasicObject {
  defaultColor?: string;
  code?: string;
  label: string;
  nodeType?: string;
  parentNode?: string;
  position?: any
}
export interface Swimlane extends SwimlaneNode {
  nodes: SwimlaneNode[] | [];
  layer: number;
}

export interface FlowEdge extends BasicObject {
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  parentNode?: string;
  defaultColor?: string;
  data?: any;
}

export interface SwimlaneFlowInput extends BasicObject {
  swimlanes: Swimlane[] | [];
  edges: FlowEdge[] | [];
  outerNodes: SwimlaneNode[] | [];
}

export type SpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  offset: number;
};
