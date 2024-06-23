import { useEffect, useState } from 'react';
import { Button, Input, Modal, Text, Divider, Dropdown } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import axios from 'axios';

interface Device {
  id: number;
  name: string;
}

interface SelectedDevice {
  id: number | null;
}

export const AddNode = ({ loadNodes }: { loadNodes: () => void }) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>([]);
  const [nameError, setNameError] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/go/availabledevice')
      .then(res => res.json())
      .then((data: Device[]) => setDevices(data));
  }, []);

  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    clearTimeout(errorTimeout as NodeJS.Timeout);
  };

  const handleAddDevice = () => {
    setSelectedDevices([...selectedDevices, { id: null }]);
  };

  const handleRemoveDevice = (index: number) => {
    const newSelectedDevices = [...selectedDevices];
    newSelectedDevices.splice(index, 1);
    setSelectedDevices(newSelectedDevices);
  };

  const handleChangeDevice = (index: number, value: number) => {
    const newSelectedDevices = [...selectedDevices];
    newSelectedDevices[index].id = value;
    setSelectedDevices(newSelectedDevices);
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
      const response = await axios.post('http://localhost:8000/api/go/nodes', {
        name,
        devices: selectedDevices.map(device => device.id)
      });

      console.log('Node added successfully:', response.data);
      loadNodes();
      closeHandler();
    } catch (error) {
      console.error('Failed to add node:', error);
    }
  };

  return (
    <div>
      <Button auto onClick={handler}>
        Add Node
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
            Create Node
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
                    {device.id ? devices.find(dev => dev.id === device.id)?.name : "Select a device"}
                  </Dropdown.Button>
                  <Dropdown.Menu onAction={key => handleChangeDevice(index, parseInt(String(key)))}>
                    {devices.map(dev => (
                      <Dropdown.Item key={dev.id}>{dev.name}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Button auto flat color="error" onClick={() => handleRemoveDevice(index)}>
                  Remove
                </Button>
              </Flex>
            ))}
            <Button css={{
              width: '10px',
            }} auto flat onClick={handleAddDevice}>
              Add Device
            </Button>
          </Flex>
        </Modal.Body>
        <Divider css={{ my: '$5' }} />
        <Modal.Footer>
          <Button type="button" color="primary" auto onClick={handleSubmit}>
            Create Node
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
