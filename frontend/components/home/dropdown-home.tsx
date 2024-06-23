import React, { useEffect, useState } from "react";
import { Dropdown } from "@nextui-org/react";

interface Device {
  apikey: string;
  type: string;
  name: string;
}

export const DropdownHome = ({ onSelectionChange }: { onSelectionChange: (apikey: string, type: string) => void }) => {
  const [selected, setSelected] = React.useState<Set<React.Key>>(new Set(["Select Device"]));
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/go/devices`);
        const data = await response.json();
        setDevices(data);

        if (data.length > 0) {
          const firstDevice = data[0];
          setSelected(new Set([firstDevice.apikey]));
          onSelectionChange(firstDevice.apikey, firstDevice.type);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  const handleSelectionChange = (keys: Set<React.Key>) => {
    setSelected(keys);
    const selectedApikey = Array.from(keys).join(", ");
    const selectedDevice = devices.find(device => device.apikey === selectedApikey);
    if (selectedDevice) {
      onSelectionChange(selectedApikey, selectedDevice.type);
    }
  };

  const selectedValue = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  return (
    <Dropdown>
      <Dropdown.Button flat color="secondary" css={{ tt: "capitalize" }}>
        {selectedValue}
      </Dropdown.Button>
      <Dropdown.Menu
        aria-label="Device selection"
        color="secondary"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={(keys) => handleSelectionChange(keys as Set<React.Key>)}
      >
        {devices.map(device => (
          <Dropdown.Item key={device.apikey}>{device.name}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
