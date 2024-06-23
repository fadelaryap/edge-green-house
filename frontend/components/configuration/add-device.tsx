// add-user.tsx

import { Button, Divider, Input, Modal, Text } from '@nextui-org/react';
import React, { useState } from 'react';
import { Flex } from '../styles/flex';
import axios from 'axios';

export const AddDevice = ({ loadDevices }: { loadDevices: () => void }) => {
   const [visible, setVisible] = useState(false);
   const [name, setName] = useState('');
   const [type, setType] = useState('');
   const [apikey, setApikey] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [department, setDepartment] = useState('');
   const [company, setCompany] = useState('');

   const handler = () => setVisible(true);
   const closeHandler = () => setVisible(false);

   const addDeviceHandler = async () => {
      try {
         const response = await axios.post('http://localhost:8000/api/go/devices', {
            name,
            type,
            apikey,
         });
         console.log('Device added successfully:', response.data);
         loadDevices();
         // Optionally, you can reload the list of users or perform other actions after successful addition
         closeHandler(); // Close the modal after successful addition
      } catch (error) {
         console.error('Failed to add device:', error);
      }
   };

   return (
      <div>
         <Button auto onClick={handler}>
            Add Device
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
                  Add new device
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                     />
                     <Input
                        label="Type"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
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
                        label="apikey"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Apikey"
                        value={apikey}
                        onChange={(e) => setApikey(e.target.value)}
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
               <Button auto onClick={addDeviceHandler}>
                  Add Device
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};
