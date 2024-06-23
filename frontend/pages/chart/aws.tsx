// pages/index.tsx

import React from 'react';
import ChartAWS from '../../components/chartdevice/aws';
// import VPDChartComponent from '../components/chartdevice/chart2';

const Home: React.FC = () => {
  return (
    <div>
      <ChartAWS />
      {/* <VPDChartComponent />
      <EChartComponent />
      <EChartComponent /> */}
    </div>
  );
};

export default Home;
