import { Button, Grid } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { styled } from '@mui/material/styles';

import CustomGrid from './CustomGrid';

const FileInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ConfigureUploadModal = (props: any) => {
    return (
        <Grid pt={2}>
            <i><span className="red">*</span> <span>Supported files (.yaml only) and should be less than 40 MB</span></i> <br />
            <CustomGrid distributeColsEvenly={true}>{[[
                <Grid>
                    <Button className="text-button initial-case" component="label" variant="text" startIcon={<CloudUploadIcon />}>
                        {props?.files?.length > 0 ? "Change file" : "Upload file"}
                        <FileInput id="specfile" type="file" accept=".yaml" name="fileupload" onChange={props?.handleUploadFile}/>
                    </Button>
                    <span><b>{props?.selectedFile}</b></span>
                </Grid>,
            ]]}
            </CustomGrid>
        </Grid>
      )
}

export default ConfigureUploadModal
