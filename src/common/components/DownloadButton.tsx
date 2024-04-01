import React, { useState } from 'react';
import { Panel, useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';

import CustomButton from "./CustomButton";
import { Download } from "@mui/icons-material";
import CustomModal from './CustomModal';



// const imageWidth = 2024;
// const imageHeight = 968;


function DownloadButton(props: any) {
  const [screenshotConfirmModal, setScreenshotConfirmModal] = useState(false);

  const scrollToBlock = () => {
    const block = document.querySelector('.download-png-block');
    if (block) {
      block.scrollIntoView({ behavior: 'smooth' });
    }
  };

  function downloadImage(dataUrl: string) {
    const a = document.createElement('a');

    a.setAttribute('download', props.fileName ? props.fileName + '.png' : 'config.png');
    a.setAttribute('href', dataUrl);
    a.click();
  }

  // const { getNodes } = useReactFlow();
  const downloadAsPNG = () => {

    setScreenshotConfirmModal(true);
    scrollToBlock();
    let screenshotBlock = document.querySelector('.rf-wrapper') as HTMLElement;
    // props.handler()
    // props.onLayout();
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    // const nodesBounds = getRectOfNodes(getNodes());
    // const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);
    screenshotBlock.className = 'rf-wrapper rf-a';
  };

  const handleScreenshotConfirm = () => {
    let screenshotBlock = document.querySelector('.rf-wrapper') as HTMLElement;
    screenshotBlock.className = 'rf-wrapper';
    let viewPort = document.querySelector('.react-flow__viewport') as HTMLElement;

    toPng(viewPort, {
      //   backgroundColor: '#1a365d',
        backgroundColor: 'white',
      //   width: imageWidth,
      //   height: imageHeight,
        style: {
          // width: '"'+imageWidth +'"',
          // height: '"'+imageHeight +'"',
          width: '100%',
          height: '100%',
          // transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
        },
      }).then(downloadImage);
      setScreenshotConfirmModal(false);
  }

  return (
    <>
      <CustomModal
        open={screenshotConfirmModal}
        onClose={() => {
            let screenshotBlock = document.querySelector('.rf-wrapper') as HTMLElement;
            screenshotBlock.className = 'rf-wrapper';
            setScreenshotConfirmModal(false)
          }
        }
        title={"Export as PNG"}
        content={<p>The screenshot will only capture the selected area, ensuring that all states and events are contained within the highlighted block.</p>}
        needCancelBtn={true}
        needConfirmBtn={true}
        handler={handleScreenshotConfirm}
        confirmBtnLabel={'Submit'}
        maxWidth={"sm"}
      />

      <Panel position="top-left">
        {/* <button className="download-btn" onClick={onClick}> */}
        <CustomButton floatType="float-none" variant="outlined" type="secondary" label={'PNG'} startIcon={<Download fontSize="small"/>} onClick={downloadAsPNG}/>
        {/* </button> */}
      </Panel>
    </>
  );
}

export default DownloadButton;