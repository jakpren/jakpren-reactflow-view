import { ReactNode } from "react";
import { GridSize, Grid } from "@mui/material";

type CustomGridProps = {
  children: ReactNode[][];
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
  alignItems?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
  distributeColsEvenly?: boolean;
  noPaddingOrMargins?: boolean; // Default: False
  className?: any;
};

const CustomGrid = (props: CustomGridProps) => {
  const justifyContent = props.justifyContent == undefined ? "flex-start" : props.justifyContent;
  const alignItems = props.alignItems == undefined ? "center" : props.alignItems;
  const distributeColsEvenly = props.distributeColsEvenly == undefined ? false : props.distributeColsEvenly;
  const padOrMarginSize = props.noPaddingOrMargins ? '0rem' : '0.5rem';

  return (
    <>
      {props.children.map((row: ReactNode[], rowIndex: number) =>
        <Grid
          container
          key={rowIndex}
          direction="row"
          justifyContent={justifyContent}
          alignItems={alignItems}
          style={{ marginBottom: padOrMarginSize }}
          className={props.className}
        >
          {
            row.map((col: any, columnIndex: number) => {
              if (!col) return;
              if (distributeColsEvenly) {
                const l = 12 / row.length;
                return (
                  <Grid item key={columnIndex} style={{ padding: '0.1rem', paddingRight: '0.5rem' }} xs={l as GridSize}>
                    {col}
                  </Grid>
                )
              } else {
                return (
                  <Grid item key={columnIndex} style={{ padding: '0.1rem', paddingRight: '0.5rem' }}>
                    {col}
                  </Grid>
                )
              }
            })
          }
        </Grid>
      )}
    </>
  );
};

export default CustomGrid;