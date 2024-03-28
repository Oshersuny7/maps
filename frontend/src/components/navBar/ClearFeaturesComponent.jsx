import { Button, Grid } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react'
const ClearFeaturesComponent = ({handleDelateAll}) => {
  return (
    <Grid item xs={12} sm={3} lg={3}>
        <Button variant="contained" color="error" onClick={handleDelateAll}>
          <ClearIcon/>
        </Button>
      </Grid>
  )
}
export default ClearFeaturesComponent