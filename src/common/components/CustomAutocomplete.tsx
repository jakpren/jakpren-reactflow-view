import { Box, Autocomplete, TextField } from '@mui/material';

interface CustomAutocompleteProps {
  id?: string,
  name?: string,
  options: any[],
  optionLabelGetter?: any,
  value?: string | string[],
  label?: string,
  disableClearable?: boolean,
  onChange?: any,
  onInputChange?: any,
  width?: number,
  multiSelect?: boolean,
  freeSolo?: boolean,
  renderOption?: any,
  defaultValue?: any,
  disable?: boolean,
  error?: any,
  size?: any,
  selectOnFocus?: boolean,
  clearOnBlur?: boolean,
  limitTags?:number
};

const CustomAutocomplete = (props: CustomAutocompleteProps) => {
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderWidth: 1     
      },
    },
  };

  return (
   <Box sx={inputStyles}>
      <Autocomplete
        id={props.id}
        disableClearable={props.disableClearable ?? true}
        options={props.options}
        getOptionDisabled={option => props.disable ? true : false}
        getOptionLabel={props.optionLabelGetter}
        style={{ width: props.width ?? 300, border: '0px' }}
        // ListboxProps={
        //   {
        //     style: {
        //       fontSize: '14px',
        //       fontFamily: 'Lato'
        //     }
        //   }
        // }    
        clearOnBlur={props.clearOnBlur}
        defaultValue={props.defaultValue}
        value={props.value}
        renderOption={props.renderOption ?? undefined}
        renderInput={(params: any) =>{
          return (
            <TextField
            {...params}
            error={!!props.error}
            helperText={props.error ? props.error.message : null}
            label={props.label ? props.label : ""}
            variant="outlined"
            size="small"
            className='text-display'
          // InputLabelProps={{
          //   style: {
          //     fontSize: '14px',
          //     fontFamily: 'Lato'
          //   },
          // }} 
          />
          ) }         
        }
        onChange={props.onChange}
        onInputChange={props.onInputChange}
        multiple={props.multiSelect ?? false}
        freeSolo={props.multiSelect ?? props.freeSolo ?? false}
        disableCloseOnSelect={props.multiSelect ?? false}
        size={props.size}
        forcePopupIcon
        limitTags={props.limitTags}
      />
      </Box>
  );
};

export default CustomAutocomplete;