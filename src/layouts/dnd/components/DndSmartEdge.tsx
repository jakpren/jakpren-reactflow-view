import React from 'react'
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow'
import { getSmartEdge, SmartStepEdge, SmartStraightEdge, SmartBezierEdge } from '@tisoap/react-flow-smart-edge'

export function DndSmartEdge(props:any) {

  if (props.source !== props.target) {
    return <SmartStepEdge {...props} />;
  }

	const { sourceX, sourceY, targetX, targetY, id, markerEnd } = props;
  const radiusX = (sourceX - targetX) * 0.6;
  const radiusY = 50;
  const edgePath = `M ${sourceX - 5} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
    targetX + 2
  } ${targetY}`;

  return (
    <>
      <BaseEdge path={edgePath} id={id} markerEnd={markerEnd} {...props} />
      <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${sourceX - 80}px,${sourceY - 80}px)`,
              // background: data.backgroundColor,
              background: 'white',
              // color: 'black',
              padding: 2,
              // borderRadius: 5,
              // fontSize: 12,
              // fontWeight: 700,
            }}
            className="nodrag nopan"
          >
            {props?.data?.event}
          </div>
        </EdgeLabelRenderer>
      </>);
}