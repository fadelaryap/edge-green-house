import { useEffect, useState } from 'react';
import { Button, Input, Modal, Text, Divider, Dropdown } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { EditIcon } from '../icons/table/edit-icon';
import axios from 'axios';

export const UpdateDevice = ({ deviceId, loadDevices }: { deviceId: { id: number }, loadDevices: () => void }) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [apikey, setApikey] = useState('');
  const [nameError, setNameError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [apikeyError, setApikeyError] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      fetch(`http://localhost:8000/api/go/devices/${deviceId.id}`)
        .then(res => res.json())
        .then(data => {
          setName(data.name);
          setSelectedType(data.type.toString()); // Ensure this matches the expected format for keys
          setApikey(data.apikey);
        })
        .catch(error => {
          console.error('Failed to fetch device data:', error);
        });
    }
  }, [visible, deviceId]);

  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !apikey.trim() || !selectedType) {
      if (!name.trim()) setNameError(true);
      if (!apikey.trim()) setApikeyError(true);
      if (!selectedType) setTypeError(true);

      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }

      const timeout = setTimeout(() => {
        setNameError(false);
        setTypeError(false);
        setApikeyError(false);
      }, 2000);

      setErrorTimeout(timeout);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/go/devices/${deviceId.id}`, {
        name,
        type: parseInt(selectedType,10), // Menggunakan selectedType
        apikey,
      });

      console.log('Device updated successfully:', response.data);
      loadDevices();
      closeHandler();
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };

  return (
    <div>
      <EditIcon size={20} fill="#979797" onClick={handler}></EditIcon>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="600px"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header css={{ justifyContent: 'start' }}>
          <Text id="modal-title" h4>
            Update Device
          </Text>
        </Modal.Header>
        <Divider css={{ my: '$5' }} />
        <Modal.Body css={{ pb: '$12' }}>
          <Flex
            direction={'column'}
            css={{
              flexWrap: 'wrap',
              gap: '$8',
              '@lg': { flexWrap: 'nowrap', gap: '$8' },
            }}
          >
            <Input
              label="Device Name"
              bordered
              clearable
              size="lg"
              placeholder="Enter device name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(false);
                if (errorTimeout) {
                  clearTimeout(errorTimeout);
                }
              }}
              required
            />
            {nameError && (
              <Text>Please fill out the blank</Text>
            )}
            
            <Text h5 weight="normal" css={{paddingLeft: '4px', marginBottom: '0px'}}>Device Type</Text>
            <Dropdown>
              <Dropdown.Button flat>{selectedType === '0' ? 'Engrow' : selectedType === '1' ? 'Nutrigrow' : 'AWS'}</Dropdown.Button>
              <Dropdown.Menu 
                aria-label="Device Types"
                selectionMode="single"
                onAction={(key) => setSelectedType(String(key))} // Update selectedType on selection
              >
                <Dropdown.Item key="0">Engrow</Dropdown.Item>
                <Dropdown.Item key="1">Nutrigrow</Dropdown.Item>
                <Dropdown.Item key="2">AWS</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {typeError && (
              <Text>Please select a type</Text>
            )}

            <Input
              label="Device Api Key"
              bordered
              clearable
              size="lg"
              placeholder="Enter device apikey"
              value={apikey}
              onChange={(e) => {
                setApikey(e.target.value);
                setApikeyError(false);
                if (errorTimeout) {
                  clearTimeout(errorTimeout);
                }
              }}
              required
            />
            {apikeyError && (
              <Text>Please fill out the blank</Text>
            )}
            
          </Flex>
        </Modal.Body>
        <Divider css={{ my: '$5' }} />
        <Modal.Footer>
          <Button type="button" color="primary" auto onClick={handleSubmit}>
            Update Device
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
