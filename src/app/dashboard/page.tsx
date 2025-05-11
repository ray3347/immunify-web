import * as React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Grid } from '@mui/system';
// import { Grid } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';

export default function DashboardPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to your Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid > {/* No need for 'item' prop in Grid v2 */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Card Title 1
                </Typography>
                <Typography variant="body2">
                  This is some example content for the first card on your dashboard.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid > {/* No need for 'item' prop in Grid v2 */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Card Title 2
                </Typography>
                <Typography variant="body2">
                  This is some example content for the second card on your dashboard.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}