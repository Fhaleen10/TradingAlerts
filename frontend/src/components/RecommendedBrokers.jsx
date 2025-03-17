import React from 'react';
import { Container, Typography, Card, CardContent, Button, Grid, Box } from '@mui/material';

const RecommendedBrokers = () => {
  const brokers = [
    {
      name: 'Binance',
      description: 'The world\'s largest crypto exchange by trading volume',
      affiliateLink: '#', // Replace with actual affiliate link
      features: ['Wide range of cryptocurrencies', 'High liquidity', 'Low fees']
    },
    {
      name: 'Bybit',
      description: 'Leading cryptocurrency derivatives exchange',
      affiliateLink: '#', // Replace with actual affiliate link
      features: ['Perpetual contracts', 'Spot trading', 'User-friendly interface']
    },
    {
      name: 'Forex Broker',
      description: 'Professional forex trading platform',
      affiliateLink: '#', // Replace with actual affiliate link
      features: ['Forex pairs', 'Low spreads', 'Professional tools']
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Recommended Brokers
      </Typography>
      
      <Typography variant="body1" paragraph align="center" sx={{ mb: 6 }}>
        We've partnered with the most reliable brokers in the industry to provide you with the best trading experience.
      </Typography>

      <Grid container spacing={4}>
        {brokers.map((broker) => (
          <Grid item xs={12} md={4} key={broker.name}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {broker.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {broker.description}
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {broker.features.map((feature, index) => (
                    <Typography component="li" key={index}>
                      {feature}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  href={broker.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start Trading
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecommendedBrokers;
