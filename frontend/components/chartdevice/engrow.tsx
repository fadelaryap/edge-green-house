import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { Dropdown, Text, Container, Spacer, Collapse } from '@nextui-org/react';
import { Flex } from '../styles/flex';

interface DataPoint {
  id: number;
  apikey: string;
  temperature: number;
  humidity: number;
  co2: number;
  vpd: number;
  created_at: string;
  month?: number;
}

interface Device {
  id: number;
  apikey: string;
  name: string;
  type: number;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Define a type for valid time filters
 type TimeFilter = '24H' | '1W' | '1M' | '1Y';

 const zoomConfigs: Record<TimeFilter, { start: number; end: number }> = {
   '24H': { start: 0, end: 100 },
   '1W': { start: 20, end: 100 },
   '1M': { start: 50, end: 100 },
   '1Y': { start: 90, end: 100 },
 };

const ChartEngrow: React.FC = () => {
  const chartRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [data, setData] = useState<{ [key: number]: DataPoint[] }>({});
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedApiKey, setSelectedApiKey] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24H');
  const [firstMonthExpanded, setFirstMonthExpanded] = useState<boolean>(true); // State untuk mengatur collapse bulan pertama


  const [zoomConfig, setZoomConfig] = useState(zoomConfigs['24H']);

  useEffect(() => {
    const fetchDevices = async () => {
      const response = await fetch('http://localhost:8000/api/go/devices');
      const devicesData = await response.json();
      const filteredDevices = devicesData.filter((device: Device) => device.type === 0);
      setDevices(filteredDevices);
      if (filteredDevices.length > 0) {
        setSelectedApiKey(filteredDevices[0].apikey);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedApiKey) {
      const fetchData = async () => {
        const response = await fetch(`http://localhost:8000/api/go/chartengrow?apikey=${selectedApiKey}&timeFilter=${timeFilter}`);
        const result = await response.json();
  
        let formattedData: { [key: number]: DataPoint[] } = {};
  
        if (timeFilter === '1Y') {
          formattedData = result;
        } else {
          // Assuming all data is for month 0 (current month) for other filters
          formattedData = { 0: result };
        }
  
        setData(formattedData);
        setZoomConfig(zoomConfigs[timeFilter]);
      };
  
      fetchData();
    }
  }, [selectedApiKey, timeFilter]);
  
  useEffect(() => {
    Object.keys(data).forEach((monthStr) => {
      const month = parseInt(monthStr, 10);
      if (chartRefs.current[month]) {
        const myChart = echarts.init(chartRefs.current[month]);
  
        const dates = data[month]?.map((d) => {
          if (timeFilter === '24H') {
            // Format for 24H filter (hours)
            return d.created_at.split('T')[1].split('Z')[0]; // Extract hours from timestamp
          } else {
            // Format for 1W, 1M, 1Y filter (dates)
            return d.created_at.split('T')[0]; // Extract date from timestamp
          }
        }) ?? [];

        const datesTooltip = data[month]?.map((d) => d.created_at.replace('T', ' ').replace('Z', '')) ?? [];
  
        const temperature = data[month]?.map((d) => d.temperature) ?? [];
        const humidity = data[month]?.map((d) => d.humidity) ?? [];
        const co2 = data[month]?.map((d) => d.co2) ?? [];
        const vpd = data[month]?.map((d) => d.vpd) ?? [];
  
        const option: EChartsOption = {
          tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const dataIndex = params[0]?.dataIndex;
                const tooltipDate = datesTooltip[dataIndex]; // Ambil tanggal sesuai dengan indeks data
                
                let tooltipContent = `${tooltipDate}<br/>`;
                
                params.forEach((param: any) => {
                    const seriesName = param.seriesName;
                    const value = param.value;
                    const color = param.color;
                    tooltipContent += `<div style="display: flex; align-items: center; justify-content: space-between; padding:1px;">
                             <span style="display: flex; align-items:center; margin-right:15px;"><div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></div>
                             ${seriesName}</span>
                             <span>${value}</span>
                           </div>`;
                });
          
                return tooltipContent;
            },
          },
          legend: {
            data: ['Temperature', 'Humidity', 'CO2', 'VPD'],
            left: 50,
            top:30,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '16%',
            top: '18%',
            containLabel: true,
          },
          toolbox: {
            top: '5%',
            right: '2%',
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
              },
              restore: {},
              saveAsImage: {},
            },
          },
          dataZoom: [
            {
                bottom:'6%',
              show: true,
              realtime: true,
              start: zoomConfig.start,
              end: zoomConfig.end,
              xAxisIndex: [0, 1],
            },
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
            {
              name: 'Temperature',
              type: 'line',
              data: temperature,
              smooth: true,
            },
            {
              name: 'Humidity',
              type: 'line',
              data: humidity,
              smooth: true,
            },
            {
              name: 'CO2',
              type: 'line',
              data: co2,
              smooth: true,
            },
            {
              name: 'VPD',
              type: 'line',
              data: vpd,
              smooth: true,
            },
          ],
        };
  
        myChart.setOption(option);
        
        chartRefs.current[month]!.style.backgroundColor = '#fff';
        chartRefs.current[month]!.style.borderRadius = '8px'; // Misalnya, atur sudut corner chart
        chartRefs.current[month]!.style.overflow = 'hidden';
        return () => {
          myChart.dispose();
        };
      }
    });
  }, [data, timeFilter]);

  // Efek untuk mengatur collapse bulan pertama saat filter waktu berubah
  useEffect(() => {
    if (timeFilter === '1Y') {
      setFirstMonthExpanded(true); // Buka collapse bulan pertama saat filter '1Y'
    } else {
      setFirstMonthExpanded(false); // Tutup collapse bulan pertama untuk filter lainnya
    }
  }, [timeFilter]);

  return (
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
      <Text h3>Engrow Chart</Text>
      <Flex justify="between" align="center" css={{ mb: '$5' }}>
        <Dropdown>
          <Dropdown.Button flat>
            {selectedApiKey ? devices.find(device => device.apikey === selectedApiKey)?.name : "Select Device"}
          </Dropdown.Button>
          <Dropdown.Menu
            onAction={(key) => setSelectedApiKey(key as string)}
            selectedKeys={new Set([selectedApiKey])}
          >
            {devices.map((device) => (
              <Dropdown.Item key={device.apikey}>
                {device.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Spacer x={1} />
        <Dropdown>
          <Dropdown.Button flat>
            {timeFilter === '24H' ? '24 Hours' :
              timeFilter === '1W' ? '1 Week' :
                timeFilter === '1M' ? '1 Month' : '1 Year'}
          </Dropdown.Button>
          <Dropdown.Menu
            onAction={(key) => setTimeFilter(key as TimeFilter)}
            selectedKeys={new Set([timeFilter])}
          >
            <Dropdown.Item key="24H">24 Hours</Dropdown.Item>
            <Dropdown.Item key="1W">1 Week</Dropdown.Item>
            <Dropdown.Item key="1M">1 Month</Dropdown.Item>
            <Dropdown.Item key="1Y">1 Year</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Flex>
      {timeFilter !== '1Y' ? (
        <div ref={ref => chartRefs.current[0] = ref} style={{ width: '100%', height: '500px' }} />
      ) : (
        <Collapse.Group>
          {Object.keys(data).map((month) => (
            <Collapse key={month} title={months[parseInt(month) - 1]} expanded={parseInt(month) === 1 && firstMonthExpanded}>
            <div ref={ref => chartRefs.current[parseInt(month)] = ref} style={{ width: '100%', height: '500px' }} />
            </Collapse>
        ))}
        </Collapse.Group>
    )}
    </Flex>
);
};

export default ChartEngrow;
          
