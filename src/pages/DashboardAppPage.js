import { useState,useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';



import {TotalUsersInMonth,GetFeedBack5News,GetPurchaseMonth,GetReport} from '../api/ReportService'

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const[usersInMonth,setUsersInMonth] = useState([]);

  const[fbFiveNews,setFbFiveNews] = useState([]);
  const[poByMonth,setPoByMonth] = useState([]);

  const[dataAdmin,setDataAdmin] = useState({});

  useEffect(() => {
    GetUsersInMonth();
    GetFB5News();
    GetPurchaseByMonth();
    GetReportForAdmin();
  }, []);


  const GetUsersInMonth = async () => {
    const response = await TotalUsersInMonth();

    console.log(response);

    setUsersInMonth(response.data.result);
    console.log(usersInMonth);
  };

  const GetFB5News = async () => {
    const response = await GetFeedBack5News();

    console.log(response);

    setFbFiveNews(response.data.result);
  };

  const GetPurchaseByMonth = async () => {
    const response = await GetPurchaseMonth();

    console.log(response);

    setPoByMonth(response.data.result);
  };

  const GetReportForAdmin = async () => {
    const response = await GetReport();

    console.log(response);

    setDataAdmin(response.data.result);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard</title>
      </Helmet>

      <Container maxWidth="xl" style={{letterSpacing:"0.05em"}}>
        <Typography color={'Highlight'} variant="h4" sx={{ mb: 5,letterSpacing:"0.1em" }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Purchase Created" total={(dataAdmin.po > 0 ) ? dataAdmin.po : '0' } icon={"carbon:purchase"} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="All Users Created" total={dataAdmin.countUsers} color="info" icon={"tabler:user"}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Quantity Sales" total={(dataAdmin.pd > 0) ? dataAdmin.pd : '0'} color="warning" icon={"material-symbols:production-quantity-limits"}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="All Image Upload" total={dataAdmin.myImage} color="error"  icon={"ph:upload"}/>
          </Grid>

         

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Created Users In Month"
              chartData={usersInMonth}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Product Sales In Month"
              subheader=""
              chartData={poByMonth}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <AppNewsUpdate
              title="Feed Back TimeLine"
              list={fbFiveNews.map((fb, index) => ({
                name: fb.name,
                createDate: fb.createDate,
                image: fb.image,
                content: fb.content,
              }))}
            />
          </Grid>


          <Grid item xs={12} md={12} lg={12}>
            <AppTrafficBySite
              title=""
              list={[
                {
                  name: 'Normal Register',
                  value: dataAdmin.normal,
                  icon: <Iconify icon={'mdi:register'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: dataAdmin.google,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
              ]}
            />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
