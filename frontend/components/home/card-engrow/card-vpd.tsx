import {Card, Text} from '@nextui-org/react';
import React from 'react';
import {Community} from '../../icons/community';
import {Box} from '../../styles/box';
import {Flex} from '../../styles/flex';

interface VPDData {
   latest: { vpd: number };
   min: { vpd: number };
   max: { vpd: number };
   avg: { vpd: number };
   status: string;
 }
 

export const CardVPD = ({ data }: { data?: VPDData | null }) => {
   if (data && data.status === "error") {
      return (
         <Card
            css={{
               mw: '321.25px',
               width: '118%',
               bg: '$blue600',
               borderRadius: '$xl',
               px: '$6',
            }}
         >
            <Card.Body css={{py: '$10'}}>
               <Flex css={{gap: '$3'}}>
                  <Community />
                  <Flex direction={'column'}>
                     <Text span css={{color: 'white'}}>
                        VPD
                     </Text>
                     <Text span css={{color: 'white'}} size={'$xs'}>
                        Vapor Pressure Deficit
                     </Text>
                  </Flex>
               </Flex>
               <Flex css={{gap: '$6', py: '$4'}} align={'center'}>
                  <Text
                     span
                     size={'$xl'}
                     css={{color: 'white'}}
                     weight={'semibold'}
                  >
                     NO DATA
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     {/* + 4.5% */}
                  </Text>
               </Flex>
               <Flex css={{gap: '$12'}} align={'center'}>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$green600', display: 'block'}}
                        weight={'semibold'}
                     >
                        Min
                        {/* {'↓'} */}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white', display: 'block'}}>
                        -
                     </Text>
                  </Box>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$red600', display: 'block'}}
                        weight={'semibold'}
                     >
                        Max
                        {/* {'↑'} */}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white', display: 'block'}}>
                        -
                     </Text>
                  </Box>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$green600', display: 'block'}}
                        weight={'semibold'}
                     >
                        Average
                        {/* {'⭐'} */}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white', display: 'block'}}>
                        -
                     </Text>
                  </Box>
               </Flex>
            </Card.Body>
         </Card>
      );
   } else if (data && !data.min) {
      return (
         <Card
            css={{
               mw: '321.25px',
               width: '118%',
               bg: '$blue600',
               borderRadius: '$xl',
               px: '$6',
            }}
         >
            <Card.Body css={{py: '$10'}}>
               <Flex css={{gap: '$3'}}>
                  <Community />
                  <Flex direction={'column'}>
                     <Text span css={{color: 'white'}}>
                        VPD
                     </Text>
                     <Text span css={{color: 'white'}} size={'$xs'}>
                        Vapor Pressure Deficit
                     </Text>
                  </Flex>
               </Flex>
               <Flex css={{gap: '$6', py: '$4'}} align={'center'}>
                  <Text
                     span
                     size={'$xl'}
                     css={{color: 'white'}}
                     weight={'semibold'}
                  >
                     {data.latest.vpd} kPa
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     {/* + 4.5% */}
                  </Text>
               </Flex>
               <Flex css={{gap: '$12'}} align={'center'}>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$green600', display: 'block'}}
                        weight={'semibold'}
                     >
                        Min
                        {/* {'↓'} */}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white', display: 'block'}}>
                        -
                     </Text>
                  </Box>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$red600', display: 'block'}}
                        weight={'semibold'}
                     >
                        Max
                        {/* {'↑'} */}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white', display: 'block'}}>
                        -
                     </Text>
                  </Box>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$green600', display: 'block'}}
                        weight={'semibold'}
                     >
                        Average
                        {/* {'⭐'} */}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white', display: 'block'}}>
                        -
                     </Text>
                  </Box>
               </Flex>
            </Card.Body>
         </Card>
      );
   } else if(data && data.min) {
      return (
         <Card
            css={{
               mw: '321.25px',
               bg: '$blue600',
               borderRadius: '$xl',
               px: '$6',
            }}
         >
            <Card.Body css={{py: '$10'}}>
               <Flex css={{gap: '$3'}}>
                  <Community />
                  <Flex direction={'column'}>
                     <Text span css={{color: 'white'}}>
                        VPD
                     </Text>
                     <Text span css={{color: 'white'}} size={'$xs'}>
                        Vapor Pressure Deficit
                     </Text>
                  </Flex>
               </Flex>
               <Flex css={{gap: '$6', py: '$4'}} align={'center'}>
                  <Text
                     span
                     size={'$xl'}
                     css={{color: 'white'}}
                     weight={'semibold'}
                  >
                     {data.latest.vpd} kPa
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     {/* + 4.5% */}
                  </Text>
               </Flex>
               <Flex css={{gap: '$12'}} align={'center'}>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$green600', display: 'block'}}
                        weight={'semibold'}
                     >
                        Min
                        {/* {'↓'} */}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white', display: 'block'}}>
                        {data.min.vpd}
                     </Text>
                  </Box>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$red600', display: 'block'}}
                        weight={'semibold'}
                     >
                        Max
                        {/* {'↑'} */}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white', display: 'block'}}>
                        {data.max.vpd}
                     </Text>
                  </Box>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$green600', display: 'block'}}
                        weight={'semibold'}
                     >
                        Average
                        {/* {'⭐'} */}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white', display: 'block'}}>
                        {data.avg.vpd}
                     </Text>
                  </Box>
                  </Flex>

            </Card.Body>
         </Card>
      
   )
   };

   return (
      <Card
      css={{
        mw: '291.25px',
        bg: '$blue600',
        borderRadius: '$xl',
        px: '$6',
      }}
    >
      {/* Render the rest of the component using data */}
    </Card>
   );
};
