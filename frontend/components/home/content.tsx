import React, { useState, useEffect } from 'react';
import { Text, Loading } from '@nextui-org/react';
import { Box } from '../styles/box';
import dynamic from 'next/dynamic';
import { Flex } from '../styles/flex';
import { CardTemperatureEngrow } from './card-engrow/card-temperature-engrow';
import { CardHumidity } from './card-engrow/card-humidity';
import { CardCO2 } from './card-engrow/card-co2';
import { CardVPD } from './card-engrow/card-vpd';
import { CardTemperatureNutrigrow } from './card-nutrigrow/card-temperature-nutrigrow';
import { CardPH } from './card-nutrigrow/card-ph';
import { CardEC } from './card-nutrigrow/card-ec';
import { CardDO } from './card-nutrigrow/card-do';

import { SteamChart } from '../charts/steam';

import { CardTemperatureAWS } from './card-aws/card-temperature-aws';
import { CardHumidityAWS } from './card-aws/card-humidity-aws';
import { CardPressure } from './card-aws/card-pressure';
import { CardWindspeed } from './card-aws/card-windspeed';
import { CardWinddirection } from './card-aws/card-winddirection';

import { CardAgents } from './card-agents';
import { CardTransactions } from './card-transactions';
import { DropdownHome } from './dropdown-home';

const DynamicSteamChart = dynamic(() => import('../charts/steam').then((mod) => mod.SteamChart), {
  ssr: false,
});

export const Content = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [deviceData, setDeviceData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedId && selectedType !== null) {
      // setIsLoading(true);
      const fetchData = async () => {
        try {
          const endpoint = selectedType === 0 
           ? `http://localhost:8000/api/go/dataengrow/${selectedId}`
           : selectedType === 1
           ? `http://localhost:8000/api/go/datanutrigrow/${selectedId}`
           : `http://localhost:8000/api/go/dataaws/${selectedId}`;
         const response = await fetch(endpoint);
         const data = await response.json();
         console.log(data);
         setDeviceData(data);

         // Fetch last 10 data points for the selected device
         const last10DataEndpoint = selectedType === 0
            ? `http://localhost:8000/api/go/dataengrows/last10/${selectedId}`
            : selectedType === 1
            ? `http://localhost:8000/api/go/nutrigrows/last10/${selectedId}`
            : `http://localhost:8000/api/go/dataaws/last10/${selectedId}`;
         const last10Response = await fetch(last10DataEndpoint);
         const last10Data = await last10Response.json();
         // console.log(last10Data);
        //  setTimeout(() => {
        //   setIsLoading(false);
          setChartData(last10Data);
        // }, 500);
       } catch (error) {
         console.error("Error fetching device data:", error);
        //  setIsLoading(false);
       }
     };

     fetchData();
   }
 }, [selectedId, selectedType]);

 useEffect(() => {
   if (selectedId && selectedType !== null) {
     const socket = new WebSocket('ws://localhost:8000/ws');

     socket.onmessage = (event) => {
       if (event.data === selectedId) {
         const fetchData = async () => {
           try {
            const endpoint = selectedType === 0 
               ? `http://localhost:8000/api/go/dataengrow/${selectedId}`
               : selectedType === 1
               ? `http://localhost:8000/api/go/datanutrigrow/${selectedId}`
               : `http://localhost:8000/api/go/dataaws/${selectedId}`;
             const response = await fetch(endpoint);
             const data = await response.json();
             setDeviceData(data);

            const last10DataEndpoint = selectedType === 0
               ? `http://localhost:8000/api/go/dataengrows/last10/${selectedId}`
               : selectedType === 1
               ? `http://localhost:8000/api/go/nutrigrows/last10/${selectedId}`
               : `http://localhost:8000/api/go/dataaws/last10/${selectedId}`;
            const last10Response = await fetch(last10DataEndpoint);
            const last10Data = await last10Response.json();
            // console.log(last10Data);

            setChartData(last10Data);
           } catch (error) {
             console.error("Error fetching device data:", error);
           }
         };
         fetchData();
       }
     };

     return () => {
       socket.close();
     };
   }
 }, [selectedId, selectedType]);

  const handleSelectionChange = (id: string, type: string) => {
    setSelectedId(id);
    setSelectedType(Number(type));
  };

   const renderCards = () => {
      if (selectedType === 0) {
         return (
         <>
            <CardTemperatureEngrow data={deviceData} />
            <CardHumidity data={deviceData} />
            <CardCO2 data={deviceData} />
            <CardVPD data={deviceData} />
         </>
         );
      } else if (selectedType === 1) {
         return (
         <>
            <CardTemperatureNutrigrow data={deviceData} />
            <CardPH data={deviceData} />
            <CardEC data={deviceData} />
            <CardDO data={deviceData} />
         </>
         );
      } else if (selectedType === 2) {
         return (
         <>
            <CardTemperatureAWS data={deviceData} />
            <CardHumidityAWS data={deviceData} />
            <CardPressure data={deviceData} />
            <CardWindspeed data={deviceData} />
            <CardWinddirection data={deviceData} />
         </>
         );
      
      } else {
         return null; // or some default set of cards
      }
   };

   const renderContent = () => {
    if (isLoading) {
      return (
      // console.log("Loading");
      <Flex css={{ height: '45.9vh', width: '100%' }} justify="center" align="center">
        <Loading />
      </Flex>
      );
    } else {
      return (
        <>
          <DynamicSteamChart chartData={chartData} selectedType={selectedType || 0} />
        </>
      );
    }
  };

  return (
    <Box css={{ overflow: 'hidden', height: '100%' }}>
      <Flex
        css={{
          'gap': '$8',
          'pt': '$5',
          'height': 'fit-content',
          'flexWrap': 'wrap',
          'marginLeft': '$20',
          '@lg': {
            flexWrap: 'nowrap',
          },
          '@sm': {
            pt: '$10',
          },
        }}
        justify={'start'}
      >
        <Flex
          css={{
            'px': '$12',
            'mt': '$8',
            '@xsMax': { px: '$10' },
            'gap': '$12',
          }}
          direction={'column'}
        >
          {/* Card Section Top */}
          <Box css={{ margin: '$0 $4' }}>
            <Flex css={{ gap: '$8', marginBottom: '$4' }} align={'center'} justify={'between'} wrap={'wrap'}>
              <Text
                h3
                css={{
                  'textAlign': 'center',
                  '@sm': {
                    textAlign: 'inherit',
                  },
                }}
              >
                Latest Data
              </Text>
              <DropdownHome onSelectionChange={handleSelectionChange} />
            </Flex>
            <Flex
              css={{
                'gap': '$8',
                'flexWrap': 'wrap',
                'justifyContent': 'center',
                '@sm': {
                  flexWrap: 'nowrap',
                },
              }}
              direction={'row'}
            >
              {renderCards()}
            </Flex>
          </Box>

          {/* Chart */}
          <Box>
            <Text
              h3
              css={{
                'textAlign': 'center',
                '@lg': {
                  textAlign: 'inherit',
                },
              }}
            >
              Chart
            </Text>
            <Box
              css={{
                width: '100%',
                backgroundColor: '$accents0',
                boxShadow: '$lg',
                borderRadius: '$2xl',
                px: '$10',
                py: '$10',
              }}
            >
              {renderContent()}
            </Box>
          </Box>
        </Flex>

        {/* Left Section */}
        <Box
          css={{
            'px': '$12',
            'mt': '$8',
            'height': 'fit-content',
            '@xsMax': { px: '$10' },
            'gap': '$6',
            'overflow': 'hidden',
          }}
        >
          <Text
            h3
            css={{
              'textAlign': 'center',
              '@lg': {
                textAlign: 'inherit',
              },
            }}
          >
            Section
          </Text>
          <Flex
            direction={'column'}
            justify={'center'}
            css={{
              'gap': '$8',
              'flexDirection': 'row',
              'flexWrap': 'wrap',
              '@sm': {
                flexWrap: 'nowrap',
              },
              '@lg': {
                flexWrap: 'nowrap',
                flexDirection: 'column',
              },
            }}
          >
            <CardAgents />
            <CardTransactions />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
