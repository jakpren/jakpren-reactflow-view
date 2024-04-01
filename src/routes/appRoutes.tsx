import HomePage from "../pages/home/HomePage";
import { RouteType } from "./config";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CustomFlowConfigCreate from "../pages/create/CustomFlowConfigCreate";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home"
  },
  {
    path: "/",
    element: <CustomFlowConfigCreate />,
    state: "configuration create",
    sidebarProps: {
      displayText: "Configuration Create",
      icon: <ArticleOutlinedIcon />
    }
  }
];

export default appRoutes;