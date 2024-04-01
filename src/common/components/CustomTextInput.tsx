import TextField from '@mui/material/TextField';
import { FormControl, FormLabel } from '@mui/material';
import { Controller } from "react-hook-form";
import { useState, useEffect } from 'react';



interface CustomTextInputProps {
  id?: string,
  name?: string,
  label?: string,
  value?: string,
  rules?: any,
  control?: any
  onChange?: any,
  width?: any,
  multiline?: boolean,
  minRows?: number,
  key?: number,
  placeholder?: string,
  defaultValue?: string,
  disable?: boolean,
  fullwidth?: boolean,
  variant?: any,
  required?: boolean,
  size?: "small" | "medium" | undefined,
  type?: "integer" | "float" | "text" | undefined,
  maxValue?: any,
  onBlur?: any,
  error?: boolean,
  helperText?: string,
  InputProps?: any,
  readOnly? : boolean,
  InputLabelProps?: any

};

const CustomTextInput = (props: CustomTextInputProps) => {
  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    setValue(props.value || props.defaultValue || '');
  }, [props.value, props.defaultValue]);

  if (props.control !== undefined) {
    return (
      <Controller
        name={props.name ?? props.label ?? ""}
        control={props.control}
        defaultValue={props.defaultValue ?? props.value}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <TextField
            id={props.id}
            disabled={props.disable}
            key={props.key}
            placeholder={props.placeholder}
            label={props.label ?? ""}
            type="text"
            value={value}
            multiline={props.multiline}
            minRows={props.minRows ?? 1}
            onChange={(e: any) => {
              onChange(e);
              if (props.readOnly) {
                onChange(value)
              }
              setValue(e.target.value);
              props.onChange(e);
            }}
            error={!!error}
            helperText={error?.message ||  null} // change null to text if required
            className='custom-text-display'
            variant={props.variant || 'outlined'}
            size={props.size || "small"}
            style={{ width: props.width ?? "100%" }}
            InputLabelProps={props.InputLabelProps}
            InputProps={props.InputProps}
          />
        )}
        rules={props.rules ?? {}}
      />
    );
  }

  return (
    <FormControl sx={{ width: props.width ?? "100%" }}>
      {!props.label &&
        <FormLabel title={props.name}>{props.name && props.name.length > 600 ? props.name.slice(0, 600) + "..." : props.name}</FormLabel>
      }
      <TextField
        disabled={props.disable}
        key={props.key}
        placeholder={props.placeholder}
        label={props.label ?? ""}
        type={props.type === "integer" || props.type === "float" ? "number" : "text"}
        value={props.value}
        multiline={props.multiline}
        minRows={props.minRows ?? 1}
        onChange={(e: any) => {
          if (props.type === "integer") {
            const regex = /^\d+$/;
            console.log(regex.test(e.target.value), e.target.value);
            if (regex.test(e.target.value) || e.target.value === "") {
              props.onChange(e);
            }
          }
          else {
            props.onChange(e);
          }
        }}
        size={props.size || "small"}
        className='custom-text-display'
        style={{ width: props.width ?? "100%" }}
        InputLabelProps={{
          // style: {
          //   fontSize: '14px',
          //   fontFamily: 'Lato',
          // },
        }}
        inputProps={
          props.type === "integer" || props.type === "float" ? {
            inputMode: 'numeric',
            pattern: props.type === "float" ? '[0-9]*' : '/^\d+$/',
            step: props.type === "float" ? 0.1 : 1,
            min: 0,
            max: props.maxValue,
            className: "number-input"
          } : {
            maxLength: props?.maxValue
          }
        }
        name={props.name}
        variant={props.variant || "outlined"}
        required={props.required}
        onBlur={props.onBlur}
        error={props.error || false}
        helperText={props.helperText}

      />
    </FormControl>
  );
};

export default CustomTextInput;