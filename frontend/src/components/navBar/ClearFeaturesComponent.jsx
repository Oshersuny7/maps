import { Button, Grid } from '@mui/material'
import React from 'react'

const ClearFeaturesComponent = ({handleDelateAll}) => {
  return (
    <Grid item xs={12} sm={3} lg={3}>
        <Button variant="contained" color="error" onClick={handleDelateAll}>
          Clear all Draws
        </Button>
      </Grid>
  )
}

export default ClearFeaturesComponent