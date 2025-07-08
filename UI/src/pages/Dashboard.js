import React from 'react';
import { Box, Grid, Container, CssBaseline,Card,Typography } from '@mui/material';
import WhatsOnJanuaryCard from '../components/dashboard/WhatsOn';
import JuniorFrontendDeveloperCard from '../components/dashboard/DeveloperCard';
import EmployeeListCard from '../components/dashboard/EmployeeCard';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import MemberWorkHoursChart from '../components/dashboard/WorkHoursChart';
import BrooklynSimmonsCard from '../components/dashboard/BrookLynSimmons';
import RalphEdwardsLeaveCard from '../components/dashboard/LeaveCard';

const HRDashboard = () => {
  return (
    <React.Fragment>
      <CssBaseline /> {/* Resets CSS and provides a clean slate */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Top Row */}
          <Grid item xs={12} md={4}>
            <WhatsOnJanuaryCard />
          </Grid>
          <Grid item xs={12} md={5}>
            <TodaySchedule />
          </Grid>
          <Grid item xs={12} md={3}>
            <JuniorFrontendDeveloperCard />
          </Grid>

          {/* Middle Row */}
          <Grid item xs={12} md={5}>
            <EmployeeListCard />
          </Grid>
          <Grid item xs={12} md={7}>
            <MemberWorkHoursChart />
          </Grid>

          {/* Bottom Row */}
          <Grid item xs={12} md={4}>
            <BrooklynSimmonsCard />
          </Grid>
          <Grid item xs={12} md={4}>
            <RalphEdwardsLeaveCard />
          </Grid>
          <Grid item xs={12} md={4}>
            {/* You would place the Lisa Harvey and Leslie Alexander cards here, perhaps in another inner Grid or just stacked */}
            {/* <LisaHarveyCard /> */}
            {/* <LeslieAlexanderAnnualLeaveCard /> */}
             <Card sx={{ borderRadius: 2, boxShadow: 1, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <Typography variant="h6" color="text.secondary">
                    Lisa Harvey Card (Placeholder)
                </Typography>
            </Card>
            <Box mt={2}>
              <Card sx={{ borderRadius: 2, boxShadow: 1, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  <Typography variant="h6" color="text.secondary">
                      Leslie Alexander Card (Placeholder)
                  </Typography>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default HRDashboard;
