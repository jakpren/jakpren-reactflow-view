import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from "@mui/material/styles";

interface CustomTabsProps {
  content: any,
  isVertical?: boolean
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  isVertical?: boolean;
}

const StyledTab = styled(Tab)({
  fontSize: "12px",
  "&.Mui-selected": {
    color: "#7801ff"
  }
});

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, isVertical, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={isVertical == true? `vertical-tabpanel-${index}` : `simple-tabpanel-${index}`}
      aria-labelledby={isVertical == true? `vertical-tab-${index}` : `simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const a11yProps = (index: number, isVertical: boolean|undefined) => {
  if (isVertical) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`
    };
  }
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const CustomTabs = (props: CustomTabsProps) => {
  
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const isVertical = props.isVertical != undefined ? props.isVertical : false;

  const tabs = () => {
    return (
      <Tabs
        orientation={ isVertical ? "vertical": undefined }
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Preferences"
        sx={{ bgcolor: '#fbfafe', borderRight: isVertical ? 1 : undefined, borderColor: isVertical ? '#7801ff' : undefined }}
      >
        {
          Object.keys(props.content).map((key,i)=>{
            return (
              <StyledTab label={key} {...a11yProps(i, props.isVertical)} />
              )
          })
        }
      </Tabs>
    );
  }
  const tabPanels = () => {
    return Object.keys(props.content).map((key,i)=>{
      return (
        <TabPanel value={value} index={i} isVertical={props.isVertical}>
            {props.content[key]}
        </TabPanel>
        )
    })
  }

  if (isVertical) {
    return (
      <Box
        sx={{ flexGrow: 1, display: 'flex' }}
      >
        { tabs() }
        { tabPanels() }
      </Box>
    );
  } else {
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: '#7801ff' }}>
          { tabs() }
        </Box>
        { tabPanels() }
      </Box>
    );
  }

  
};

export default CustomTabs;