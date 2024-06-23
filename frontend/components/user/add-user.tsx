// add-user.tsx

import { Button, Divider, Input, Modal, Text } from '@nextui-org/react';
import React, { useState } from 'react';
import { Flex } from '../styles/flex';
import axios from 'axios';

export const AddUser = ({ loadUsers }: { loadUsers: () => void }) => {
   const [visible, setVisible] = useState(false);
   const [firstname, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [department, setDepartment] = useState('');
   const [company, setCompany] = useState('');

   const handler = () => setVisible(true);
   const closeHandler = () => setVisible(false);

   const addUserHandler = async () => {
      try {
         const response = await axios.post('http://localhost:8000/api/go/users', {
            firstname,
            lastName,
            email,
         });
         console.log('User added successfully:', response.data);
         loadUsers();
         // Optionally, you can reload the list of users or perform other actions after successful addition
         closeHandler(); // Close the modal after successful addition
      } catch (error) {
         console.error('Failed to add user:', error);
      }
   };

   return (
      <div>
         <Button auto onClick={handler}>
            Add User
         </Button>
         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="600px"
            open={visible}
            onClose={closeHandler}
         >
            <Modal.Header css={{ justifyContent: 'start' }}>
               <Text id="modal-title" h4>
                  Add new user
               </Text>
            </Modal.Header>
            <Divider css={{ my: '$5' }} />
            <Modal.Body css={{ py: '$10' }}>
               <Flex
                  direction={'column'}
                  css={{
                     flexWrap: 'wrap',
                     gap: '$8',
                     '@lg': { flexWrap: 'nowrap', gap: '$12' },
                  }}
               >
                  <Flex
                     css={{
                        gap: '$10',
                        flexWrap: 'wrap',
                        '@lg': { flexWrap: 'nowrap' },
                     }}
                  >
                     <Input
                        label="Name"
                        bordered
                        clearable
                        fullWidth
                        size="lg"
                        placeholder="Name"
                        value={firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                     />
                     <Input
                        label="Last Name"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                     />
                  </Flex>

                  <Flex
                     css={{
                        gap: '$10',
                        flexWrap: 'wrap',
                        '@lg': { flexWrap: 'nowrap' },
                     }}
                  >
                     <Input
                        label="Email"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                     <Input
                        label="Phone Number"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                     />
                  </Flex>
                  <Flex
                     css={{
                        gap: '$10',
                        flexWrap: 'wrap',
                        '@lg': { flexWrap: 'nowrap' },
                     }}
                  >
                     <Input
                        label="Department"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                     />
                     <Input
                        label="Company"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                     />
                  </Flex>
               </Flex>
            </Modal.Body>
            <Divider css={{ my: '$5' }} />
            <Modal.Footer>
               <Button auto onClick={addUserHandler}>
                  Add User
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};
