import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = (props: any) => {
  
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
           width: `calc(100% - "300px")`,
        }}
      >
        <Outlet />
          <ToastContainer containerId={"form-toast-type"}/>
      </Box>
    </Box>
  );
};

export default MainLayout;