import { DragEvent } from 'react';

const onDragStart = (event: DragEvent, nodeType: string, label: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.setData("label", label);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  return (
    <aside className={'rf-aside'}>
      <div className={'rf-description'}>You can drag the state node to the pane on the right.</div>
      <div className="react-flow__node-input" onDragStart={(event: DragEvent) => onDragStart(event, 'input', 'Start')} draggable>
        Start
      </div>
      <div
        className="react-flow__node-default"
        onDragStart={(event: DragEvent) => onDragStart(event, 'custom', 'New State')}
        draggable
      >
        State
      </div>
      <div
        className="react-flow__node-output"
        onDragStart={(event: DragEvent) => onDragStart(event, 'output', 'End')}
        draggable
      >
        End
      </div>
      <br/>
      <h6>Instructions.</h6>
      <div className={'rf-description'}>1. Double click to edit the details of the States (Boxes) and Events (lines).</div>
      <div className={'rf-description'}>2. Right-click to delete the State (Box) or Event (line).</div>
      <div className={'rf-description'}>3. Download as PNG to export as a PNG Image.</div>
    </aside>
  );
};

export default Sidebar;