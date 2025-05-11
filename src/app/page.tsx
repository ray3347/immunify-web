'use client';
import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Grid } from '@mui/system'; 

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Material UI - Next.js App Router example in TypeScript
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid> 
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Welcome to your application
                </Typography>
                <Typography variant="body1" paragraph>
                  This is your new application with a responsive sidebar navigation.
                  Navigate through the different sections using the sidebar menu.
                </Typography>
                <Button 
                  component={NextLink} 
                  href="/dashboard" 
                  variant="contained" 
                  color="primary"
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid> 
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Features
                </Typography>
                <Typography variant="body1" component="div">
                  <ul>
                    <li>Responsive sidebar navigation</li>
                    <li>Material UI components</li>
                    <li>Next.js App Router</li>
                    <li>TypeScript support</li>
                  </ul>
                </Typography>
                <Link href="/about" color="secondary" component={NextLink}>
                  Go to the about page
                </Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}