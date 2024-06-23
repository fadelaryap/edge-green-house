// pages/index.tsx

import React from 'react';
import ChartEngrow from '../../components/chartdevice/engrow';
// import VPDChartComponent from '../components/chartdevice/chart2';

const Home: React.FC = () => {
  return (
    <div>
      <ChartEngrow />
      {/* <VPDChartComponent />
      <EChartComponent />
      <EChartComponent /> */}
    </div>
  );
};

export default Home;
