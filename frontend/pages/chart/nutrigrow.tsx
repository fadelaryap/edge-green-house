// pages/index.tsx

import React from 'react';
import ChartNutrigrow from '../../components/chartdevice/nutrigrow';
// import VPDChartComponent from '../components/chartdevice/chart2';

const Home: React.FC = () => {
  return (
    <div>
      <ChartNutrigrow />
      {/* <VPDChartComponent />
      <EChartComponent />
      <EChartComponent /> */}
    </div>
  );
};

export default Home;
