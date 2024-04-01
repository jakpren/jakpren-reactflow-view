import { CircularProgress, Button } from '@mui/material';
interface CustomButtonProps {
  id?: string,
  label?: string,
  customclass?: string,
  type?: string, //undefined or primary or secondary
  floatType?: any, //float-right or float-left or float-none
  variant?: "text" | "contained" | "outlined" | undefined, //contained (default)
  onClick?: any
  disable?: boolean
  startIcon?: any
  endIcon?: any
  loading?: boolean
};

const CustomButton = (props: CustomButtonProps) => {
  let className = "";
  if (props.customclass) {
    className = props.customclass + " ";
  }
  if (props.variant == 'text') {
    className += "initial-case float-left";
  } else if(props.variant == 'outlined'){
    switch (props?.type) {
      case "secondary": className += "custom-react-btn-outlined-secondary"; break;
      default: className += "custom-react-btn-outlined"; break;
    }
  } else{
    switch (props.type) {
      case undefined: className += "custom-react-btn"; break;
      case "primary": className += "custom-react-btn-primary"; break;
      case "secondary": className += "custom-react-btn-secondary"; break;
      case "error": className += "custom-react-btn-error"; break;
      case "delete": className += "custom-react-btn-delete"; break;
      default: className += "custom-react-btn"; break;
    }
    switch (props.floatType) {
      case "float-none": className += " initial-case float-none"; break;
      case "float-left": className += " initial-case float-left"; break;
      default: className += " initial-case float-right"; break;
    }
    // className = className + " initial-case";

  }
  return (
    <Button
      id={props.id}
      disabled={props.disable}
      onClick={props.onClick}
      className={className}
      startIcon={props.startIcon}
      endIcon={props.endIcon}
      variant={props.variant ?? "contained"}
    >
      {props.loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : props.label}
      {/* {props.label} */}
    </Button>
  );
};

export default CustomButton;