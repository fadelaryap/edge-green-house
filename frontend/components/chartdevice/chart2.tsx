import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import {Button, Input, Text} from '@nextui-org/react';
import {Flex} from '../styles/flex';

interface DataPoint {
  id: number;
  apikey: string;
  temperature: number;
  humidity: number;
  co2: number;
  vpd: number;
  created_at: string;
}

const VPDChartComponent: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/api/go/datatest/engrow1');
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const myChart = echarts.init(chartRef.current);

      // Process data for the chart
      const dates = data.map((d) => d.created_at.split('T')[0]);
      const temperature = data.map((d) => d.temperature);
      const humidity = data.map((d) => d.humidity);
      const co2 = data.map((d) => d.co2);
      const vpd = data.map((d) => d.vpd);

      const option: EChartsOption = {
        // title: {
        //   text: 'Environmental Data',
        //   left: 'center',
        // },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['Temperature', 'Humidity', 'CO2', 'VPD'],
          left: 50,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          },
        },
        dataZoom: [
            {
              show: true,
              realtime: true,
              start: 95,
              end: 100,
              xAxisIndex: [0, 1]
            }
          ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates,
        },
        yAxis: {
          type: 'value',
        },
        animation: false,
        series: [
        //   {
        //     name: 'Temperature',
        //     type: 'line',
        //     data: temperature,
        //     smooth: true,
        //   },
          {
            name: 'Humidity',
            type: 'line',
            data: humidity,
            smooth: true,
          },
        //   {
        //     name: 'CO2',
        //     type: 'line',
        //     data: co2,
        //     smooth: true,
        //   },
        //   {
        //     name: 'VPD',
        //     type: 'line',
        //     data: vpd,
        //     smooth: true,
        //   },
        ],
      };

      option && myChart.setOption(option);

      // Cleanup function to dispose of the chart instance
      return () => {
        myChart.dispose();
      };
    }
  }, [data]);

  return  (
    <Flex
         css={{
            'mt': '$5',
            'px': '$6',
            '@sm': {
               mt: '$10',
               px: '$16',
            },
         }}
         justify={'center'}
         direction={'column'}
      >
    <Text h3>Chart</Text>
    <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
    </Flex>
  );
};

export default VPDChartComponent;
