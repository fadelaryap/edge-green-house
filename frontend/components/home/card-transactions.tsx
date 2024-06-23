import {Avatar, Grid, Collapse, Card, Text} from '@nextui-org/react';
import React from 'react';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

export const CardTransactions = () => {
   return (
      <Card
         css={{
            mw: '375px',
            height: 'auto',
            bg: '$accents0',
            borderRadius: '$xl',
            // alignContent: 'start',
            justifyContent: 'start',
            px: '$6',
         }}
      >
         <Card.Body css={{py: '$10'}}>
            <Flex css={{gap: '$5'}} justify={'center'}>
               <Text h3 css={{textAlign: 'center'}}>
                  Latest Update
               </Text>
            </Flex>
            <Flex
               css={{gap: '$6', py: '$4'}}
               // align={'center'}

               direction={'column'}
            >
               <Grid.Container gap={2}>
                  <Grid>
                  <Collapse.Group splitted>
                     <Collapse title="Option A">
                        <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                        enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat.
                        </Text>
                     </Collapse>
                     <Collapse title="Option B">
                        <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                        enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat.
                        </Text>
                     </Collapse>
                     <Collapse title="Option C">
                        <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                        enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat.
                        </Text>
                     </Collapse>
                  </Collapse.Group>
                  </Grid>
               </Grid.Container>
               {/* <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'}>
                     Jose Perez
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     4500 USD
                  </Text>
                  <Text span css={{color: '$accents8'}} size={'$xs'}>
                     9/20/2021
                  </Text>
               </Flex>

               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'}>
                     Andrew Steven
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     4500 USD
                  </Text>
                  <Text span css={{color: '$accents8'}} size={'$xs'}>
                     9/20/2021
                  </Text>
               </Flex>
               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'}>
                     Ruben Garcia
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     1500 USD
                  </Text>
                  <Text span css={{color: '$accents8'}} size={'$xs'}>
                     2/20/2022
                  </Text>
               </Flex>
               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'}>
                     Perla Garcia
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     200 USD
                  </Text>
                  <Text span css={{color: '$accents8'}} size={'$xs'}>
                     3/20/2022
                  </Text>
               </Flex>
               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'}>
                     Mathew Funez
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     2444 USD
                  </Text>
                  <Text span css={{color: '$accents8'}} size={'$xs'}>
                     5/20/2022
                  </Text>
               </Flex>
               <Flex css={{gap: '$6'}} align={'center'} justify="between">
                  <Avatar
                     size="lg"
                     pointer
                     src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                     bordered
                     color="gradient"
                     stacked
                  />
                  <Text span size={'$base'} weight={'semibold'}>
                     Carlos Diaz
                  </Text>
                  <Text span css={{color: '$green600'}} size={'$xs'}>
                     3000 USD
                  </Text>
                  <Text span css={{color: '$accents8'}} size={'$xs'}>
                     12/20/2022
                  </Text>
               </Flex> */}
            </Flex>
         </Card.Body>
      </Card>
   );
};
