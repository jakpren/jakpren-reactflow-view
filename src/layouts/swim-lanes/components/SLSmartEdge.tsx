import React from 'react'
import { useNodes, BezierEdge } from 'reactflow'
import { getSmartEdge, SmartStraightEdge, SmartStepEdge } from '@tisoap/react-flow-smart-edge'

export function SLSmartEdge(props: any) {
	const {
		id,
		sourcePosition,
		targetPosition,
		sourceX,
		sourceY,
		targetX,
		targetY,
		style,
		markerStart,
		markerEnd
	} = props

	let nodesSl = useNodes()
  let nodes = nodesSl.filter((nd:any) => nd.extent === 'parent')

	const getSmartEdgeResponse = getSmartEdge({
		sourcePosition,
		targetPosition,
		sourceX,
		sourceY,
		targetX,
		targetY,
		nodes
	})

	// If the value returned is null, it means "getSmartEdge" was unable to find
	// a valid path, and you should do something else instead
	if (getSmartEdgeResponse === null) {
		return <SmartStepEdge {...props} />
	}

	const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse

	// Get the width of the text content
	const textWidth = getTextWidth(props.data.event);

	function getTextWidth(text:any) {
		const canvas = document.createElement('canvas');
		const context: any = canvas.getContext('2d');
		context.font = getComputedStyle(document.body).font;
		const metrics = context.measureText(text);
		return metrics.width + 20;
	}

	// function getZIndex() {
	// 	var highestZIndex = Math.max.apply(null, Array.from(document.querySelectorAll('*')).map(function(element) {
	// 		return parseFloat(window.getComputedStyle(element).zIndex);
	// 	})) || 0;

	// 	// Set the clicked element's z-index to be one more than the highest z-index
	// 	return highestZIndex + 1;
	// }

	return (
		<>
			<path
				style={style}
				className='react-flow__edge-path'
				d={svgPathString}
				markerEnd={markerEnd}
				markerStart={markerStart}
			/>
			<foreignObject
				width={textWidth}
				height={20}
        data-y={edgeCenterY}
				// z-index={getZIndex}
				x={edgeCenterX}
				y={edgeCenterY - 20}
				requiredExtensions='http://www.w3.org/1999/xhtml'
			>
				<div className="foreignObjectContent">{props.data.event}</div>
			</foreignObject>
		</>
	)
}