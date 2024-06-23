import {Card, Text} from '@nextui-org/react';
import React from 'react';
import {Community} from '../../icons/community';
import {Box} from '../../styles/box';
import {Flex} from '../../styles/flex';

interface DOData {
   latest: { do: number };
   min: { do: number };
   max: { do: number };
   avg: { do: number };
   status: string;
 }
 

export const CardDO = ({ data }: { data?: DOData | null }) => {
   if (data && data.status === "error") {
      return (
         <Card
            css={{
               mw: '291.25px',
               bg: '$blue600',
               borderRadius: '$xl',
               px: '$6',
            }}
         >
            <Card.Body css={{py: '$10'}}>
               <Flex css={{gap: '$5'}}>
                  <Community />
                  <Flex direction={'column'}>
                     <Text span css={{color: 'white'}}>
                        DO
                     </Text>
                     <Text span css={{color: 'white'}} size={'$xs'}>
                        Dissolve Oxygen
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
               <Flex css={{gap: '$10'}} align={'center'}>
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
               mw: '291.25px',
               width: '118%',
               bg: '$blue600',
               borderRadius: '$xl',
               px: '$6',
            }}
         >
            <Card.Body css={{py: '$10'}}>
               <Flex css={{gap: '$5'}}>
                  <Community />
                  <Flex direction={'column'}>
                     <Text span css={{color: 'white'}}>
                        DO
                     </Text>
                     <Text span css={{color: 'white'}} size={'$xs'}>
                        Dissolve Oxygen
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
                     {data.latest.do} mg/L
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     {/* + 4.5% */}
                  </Text>
               </Flex>
               <Flex css={{gap: '$10'}} align={'center'}>
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
               mw: '291.25px',
               bg: '$blue600',
               borderRadius: '$xl',
               px: '$6',
            }}
         >
         <Card.Body css={{py: '$10'}}>
            <Flex css={{gap: '$5'}}>
               <Community />
               <Flex direction={'column'}>
                  <Text span css={{color: 'white'}}>
                     DO
                  </Text>
                  <Text span css={{color: 'white'}} size={'$xs'}>
                     Dissolve Oxygen
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
                  {data.latest.do} mg/L
               </Text>
               <Text span css={{color: '$green600'}} size={'$xs'}>
                  {/* + 4.5% */}
               </Text>
            </Flex>
            <Flex css={{gap: '$10'}} align={'center'}>
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
                     {data.min.do}
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
                     {data.max.do}
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
                     {data.avg.do}
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
