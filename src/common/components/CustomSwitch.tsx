import { FormControl, FormControlLabel, Switch } from '@mui/material';

interface CustomSwitchProps {
  id: any,
  checked: boolean,
  onChange: any,
  name?: string,
  label?: string,
  labelPlacement?: "start" | "end" | "top" | "bottom" | undefined
  disabled?: boolean
  size?: "small" | "medium" | undefined
  class?: string
};

const CustomSwitch = (props: CustomSwitchProps) => {
  return (
    <FormControl  className={props.class}>
        <FormControlLabel
          control={
            <Switch 
              size={props.size}
              id={props.id}
              checked={props.checked} 
              onChange={props.onChange} 
              disabled={props.disabled ?? false}
              name={props.name ?? ""} 
            />
          }
          label={props.label ?? ""}
          labelPlacement={props.labelPlacement ?? "end"}
        />
    </FormControl>
  );
};

export default CustomSwitch;