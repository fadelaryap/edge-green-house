import {Button, Input, Text} from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import {Breadcrumbs, Crumb, CrumbLink} from '../breadcrumb/breadcrumb.styled';
import {HouseIcon} from '../icons/breadcrumb/house-icon';
import {UsersIcon} from '../icons/breadcrumb/users-icon';

import {Flex} from '../styles/flex';
// import { UserProvider } from './UserContext';
import { TableWrapper } from '../nodetable/table';
// import { AddUser } from './AddUser';
// import {AddUser} from './add-user';

export const Node = () => {
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
         <Breadcrumbs>
            <Crumb>
               <HouseIcon />
               <Link href={'/'}>
                  <CrumbLink href="#">Home</CrumbLink>
               </Link>
               <Text>/</Text>
            </Crumb>

            <Crumb>
               <UsersIcon />
               <CrumbLink href="/node">Nodes</CrumbLink>
               {/* <Text>/</Text> */}
            </Crumb>
            {/* <Crumb>
               <CrumbLink href="#">List</CrumbLink>
            </Crumb> */}
         </Breadcrumbs>

         <Text h3>All Nodes</Text>
         
         {/* <AddUser /> */}
         <TableWrapper />
      </Flex>
   );
};
