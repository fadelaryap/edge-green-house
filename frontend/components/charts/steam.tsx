import React from 'react';
import { Props as ApexChartProps } from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Box } from '../styles/box';
import dynamic from 'next/dynamic';

type ChartData = {
  temperature: number;
  humidity?: number;
  co2?: number;
  vpd?: number;
  ph?: number;
  ec?: number;
  do?: number;
  airpressure?: number;
  windspeed?: number;
  winddirection?: number;
  created_at: string;
}[];

type SteamProps = {
  chartData: ChartData;
  selectedType: number;
};

const Chart = dynamic<ApexChartProps>(() => import("react-apexcharts"), {
  ssr: false,
});

export const SteamChart: React.FC<SteamProps> = ({ chartData, selectedType }) => {
  const options: ApexOptions = {
    chart: {
      id: 'steam-chart',
      stacked: false,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'linear',
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350
        }
      },
    },
    xaxis: {
      categories: chartData.map((data) => {
        const datetime = new Date(data.created_at);
        const date = datetime.toLocaleDateString();
        const time = datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return [date, time];
      }),
      labels: {
        show: true,
        style: {
          colors: '#008FFB',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth' as 'smooth',
      width: 4,
    },
    markers: {
      size: 3,
      strokeColors: '#fff',
      strokeWidth: 2,
    },
    grid: {
      show: true,
      borderColor: '#90A4AE',
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: 11,
        bottom: 0,
        left: 13,
      },
    },
    legend: {
      labels: {
        colors: "#00E396",
        useSeriesColors: false,
      },
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '12px',
      },
      // theme: 'dark',
    },
    // theme: {
    //   mode: 'dark',
    // },
    yaxis: [
      {
        seriesName: 'Temperature',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB',
        },
        labels: {
          style: {
            colors: '#008FFB',
          },
        },
        title: {
          style: {
            color: '#008FFB',
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      selectedType === 0 ? {
        opposite: true,
        seriesName: 'Humidity',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396',
        },
        labels: {
          style: {
            colors: '#00E396',
          },
        },
        title: {
          style: {
            color: '#00E396',
          },
        },
      } : selectedType === 1 ? {
        opposite: true,
        seriesName: 'PH',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396',
        },
        labels: {
          style: {
            colors: '#00E396',
          },
        },
        title: {
          style: {
            color: '#00E396',
          },
        },
      } : {
         opposite: true,
         seriesName: 'Humidity',
         axisTicks: {
           show: true,
         },
         axisBorder: {
           show: true,
           color: '#00E396',
         },
         labels: {
           style: {
             colors: '#00E396',
           },
         },
         title: {
           style: {
             color: '#00E396',
           },
         },
      },
      selectedType === 0 ? {
        seriesName: 'CO2',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: false,
          color: '#FEB019',
        },
        labels: {
          style: {
            colors: '#FEB019',
          },
        },
        title: {
          style: {
            color: '#FEB019',
          },
        },
        tooltip: {
          enabled: true,
        },
      } : selectedType === 1 ? {
        seriesName: 'EC',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: false,
          color: '#FEB019',
        },
        labels: {
          style: {
            colors: '#FEB019',
          },
        },
        title: {
          style: {
            color: '#FEB019',
          },
        },
        tooltip: {
          enabled: true,
        },
      } : {
         seriesName: 'Air Pressure',
         axisTicks: {
           show: true,
         },
         axisBorder: {
           show: false,
           color: '#FEB019',
         },
         labels: {
           style: {
             colors: '#FEB019',
           },
         },
         title: {
           style: {
             color: '#FEB019',
           },
         },
         tooltip: {
           enabled: true,
         },
      },
      selectedType === 0 ? {
        opposite: true,
        seriesName: 'VPD',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: false,
          color: '#FF4560',
        },
        labels: {
          style: {
            colors: '#FF4560',
          },
        },
        title: {
          style: {
            color: '#FF4560',
          },
        },
      } : selectedType === 1 ? {
        opposite: true,
        seriesName: 'DO',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: false,
          color: '#FF4560',
        },
        labels: {
          style: {
            colors: '#FF4560',
          },
        },
        title: {
          style: {
            color: '#FF4560',
          },
        },
      } : {
         opposite: true,
         seriesName: 'Wind Speed',
         axisTicks: {
           show: true,
         },
         axisBorder: {
           show: false,
           color: '#FF4560',
         },
         labels: {
           style: {
             colors: '#FF4560',
           },
         },
         title: {
           style: {
             color: '#FF4560',
           },
         },
      },
      ...(selectedType === 2 ? [{
         opposite: true,
         seriesName: 'Wind Direction',
         axisTicks: {
           show: true,
         },
         axisBorder: {
           show: false,
           color: '#575DD0',
         },
         labels: {
           style: {
             colors: '#575DD0',
           },
         },
         title: {
           style: {
             color: '#575DD0',
           },
         },
       }] : []),
    ],
  };

  // Check for the presence of each data point
  const hasHumidity = chartData.some((data) => data.humidity !== undefined);
  const hasCO2 = chartData.some((data) => data.co2 !== undefined);
  const hasVPD = chartData.some((data) => data.vpd !== undefined);
  const hasPH = chartData.some((data) => data.ph !== undefined);
  const hasEC = chartData.some((data) => data.ec !== undefined);
  const hasDO = chartData.some((data) => data.do !== undefined);
  const hasAirPressure = chartData.some((data) => data.airpressure !== undefined);
  const hasWindSpeed = chartData.some((data) => data.windspeed !== undefined);
  const hasWindDirection = chartData.some((data) => data.winddirection !== undefined);

  // Debugging: log the data availability
  console.log("Data availability:", { hasHumidity, hasCO2, hasVPD, hasPH, hasEC, hasDO, hasAirPressure, hasWindSpeed, hasWindDirection});

  const series = selectedType === 0 ? [
    {
      name: 'Temperature',
      type: 'line',
      data: chartData.map((data) => data.temperature),
    },
    ...(hasHumidity ? [{
      name: 'Humidity',
      type: 'line',
      data: chartData.map((data) => data.humidity ?? null),
    }] : []),
    ...(hasCO2 ? [{
      name: 'CO2',
      type: 'line',
      data: chartData.map((data) => data.co2 ?? null),
    }] : []),
    ...(hasVPD ? [{
      name: 'VPD',
      type: 'line',
      data: chartData.map((data) => data.vpd ?? null),
    }] : []),
  ] : selectedType === 1 ? [
    {
      name: 'Temperature',
      type: 'line',
      data: chartData.map((data) => data.temperature),
    },
    ...(hasPH ? [{
      name: 'PH',
      type: 'line',
      data: chartData.map((data) => data.ph ?? null),
    }] : []),
    ...(hasEC ? [{
      name: 'EC',
      type: 'line',
      data: chartData.map((data) => data.ec ?? null),
    }] : []),
    ...(hasDO ? [{
      name: 'DO',
      type: 'line',
      data: chartData.map((data) => data.do ?? null),
    }] : []),
  ] : [
   {
     name: 'Temperature',
     type: 'line',
     data: chartData.map((data) => data.temperature),
   },
   ...(hasHumidity ? [{
     name: 'Humidity',
     type: 'line',
     data: chartData.map((data) => data.humidity ?? null),
   }] : []),
   ...(hasAirPressure ? [{
     name: 'Air Pressure',
     type: 'line',
     data: chartData.map((data) => data.airpressure ?? null),
   }] : []),
   ...(hasWindSpeed ? [{
     name: 'Wind Speed',
     type: 'line',
     data: chartData.map((data) => data.windspeed ?? null),
   }] : []),
   ...(hasWindDirection ? [{
      name: 'Wind Direction',
      type: 'line',
      data: chartData.map((data) => data.winddirection ?? null),
    }] : []),
 ];

  return (
    <Box css={{ width: '100%', zIndex: 5 }}>
      {typeof window !== 'undefined' && (
        <div id="chart">
          <Chart options={options} series={series} type="area" height={425} />
        </div>
      )}
    </Box>
  );
};

