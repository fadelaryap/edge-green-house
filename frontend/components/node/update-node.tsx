import { useEffect, useState } from 'react';
import { Button, Input, Modal, Text, Divider, Dropdown } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import {EditIcon} from '../icons/table/edit-icon';
import axios from 'axios';

interface Devicesss {
  id: number;
  name: string;
  apikey: string;
}

interface Device {
  id: number | null;
  name: string;
  apikey: string;
}

export const UpdateNode = ({ nodeId, loadNodes }: { nodeId: {id: number}, loadNodes: () => void }) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [devices, setDevices] = useState<Devicesss[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [nameError, setNameError] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      fetch(`http://localhost:8000/api/go/nodes/${nodeId.id}`)
        .then(res => res.json())
        .then(data => {
          setName(data.name);
          if (data.devices) {
            setSelectedDevices(data.devices);
          } else {
            setSelectedDevices([]);
          }
        })
        .catch(error => {
          console.error('Failed to fetch node data:', error);
          // Handle error if needed
        });
  
      fetch('http://localhost:8000/api/go/availabledevice')
        .then(res => res.json())
        .then(data => setDevices(data))
        .catch(error => {
          console.error('Failed to fetch available devices:', error);
          // Handle error if needed
        });
    }
  }, [visible, nodeId]);

  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
  };

  const handleAddDevice = () => {
    setSelectedDevices([...selectedDevices, { id: null, name: '', apikey: '' }]);
  };

  const handleRemoveDevice = (index: number) => {
    const newSelectedDevices = [...selectedDevices];
    newSelectedDevices.splice(index, 1);
    setSelectedDevices(newSelectedDevices);
  };

  const handleChangeDevice = (index: number, value: number) => {
    const device = devices.find(dev => dev.id === value);
    if (device) {
      const newSelectedDevices = [...selectedDevices];
      newSelectedDevices[index] = { id: device.id, name: device.name, apikey: device.apikey };
      setSelectedDevices(newSelectedDevices);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError(true);
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
      const timeout = setTimeout(() => {
        setNameError(false);
      }, 2000);
      setErrorTimeout(timeout);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/go/nodes/${nodeId.id}`, {
        name,
        devices: selectedDevices.map(device => ({
          id: device.id,
          name: device.name,
          apikey: device.apikey
        }))
      });

      console.log('Node updated successfully:', response.data);
      // Call the function to reload nodes here, if it exists
      loadNodes();
      closeHandler();
    } catch (error) {
      console.error('Failed to update node:', error);
    }
  };

  return (
    <div>
      {/* <Button auto onClick={handler}>
        Update Node
      </Button> */}

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
            Update Node
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
              label="Node Name"
              bordered
              clearable
              size="lg"
              placeholder="Enter node name"
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
            <Text>Devices:</Text>
            {selectedDevices.map((device, index) => (
              <Flex
                key={index}
                css={{
                  gap: '$10',
                  flexWrap: 'wrap',
                  marginBottom: '$0',
                  '@lg': { flexWrap: 'nowrap' },
                }}
                align="center"
              >
                <Dropdown>
                  <Dropdown.Button flat color="primary">
                    {device.name || 'Select Device'}
                  </Dropdown.Button>
                  <Dropdown.Menu onAction={key => handleChangeDevice(index, parseInt(String(key)))}>
                    {devices.map(dev => (
                      <Dropdown.Item key={dev.id}>
                        {dev.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Button auto flat color="error" onClick={() => handleRemoveDevice(index)}>
                  Remove
                </Button>
              </Flex>
            ))}
            <Button css= {{ width: '10px',}}auto flat onClick={handleAddDevice}>
              Add Device
            </Button>
          </Flex>
        </Modal.Body>
        <Divider css={{ my: '$5' }} />
        <Modal.Footer>
          <Button type="button" color="primary" auto onClick={handleSubmit}>
            Update Node
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
