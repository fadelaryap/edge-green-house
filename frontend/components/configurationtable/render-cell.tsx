import {Col, Row, User, Text, Tooltip} from '@nextui-org/react';
import React from 'react';
import {DeleteIcon} from '../icons/table/delete-icon';
import {EditIcon} from '../icons/table/edit-icon';
import {EyeIcon} from '../icons/table/eye-icon';
import {IconButton, StyledBadge} from './table.styled';
import { UpdateDevice } from '../configuration/update-device'
import { deleteDevice } from './data';

interface Props {
   device: {
      id: number;
      name: string;
      // lastname: string;
      type: string;
      role: string;
      team: string;
      status: string;
      // avatar: string;
      email: string;
   };
   columnKey: string | React.Key;
   onDelete: (id: number) => void;
   loadDevices: () => void;
}

export const RenderCell = ({device, columnKey, onDelete, loadDevices}: Props) => {
   if (!device || !columnKey) {
      console.error('device atau columnKey tidak ada:', { device, columnKey });
      return null;
   }

   const cellValue = device[columnKey as keyof typeof device];
   switch (columnKey) {
      case 'name':
         return (
            // <User name={cellValue} css={{p: 0}}>
               <>
               {cellValue}
               </>

            // </User>
         );
      case 'role':
         return (
            <Col>
               <Row>
                  <Text b size={14} css={{tt: 'capitalize'}}>
                     {cellValue}
                  </Text>
               </Row>
               <Row>
                  <Text
                     b
                     size={13}
                     css={{tt: 'capitalize', color: '$accents7'}}
                  >
                     {device.team}
                  </Text>
               </Row>
            </Col>
         );
      case 'status':
         return (
            <StyledBadge type={device.status as "active" | "paused"}>{cellValue}</StyledBadge>
         );

      case 'actions':
         return (
            <Row
               justify="center"
               align="center"
               css={{'gap': '$8', '@md': {gap: 0}}}
            >
               <Col css={{d: 'flex'}}>
                  <Tooltip content="Details">
                     <IconButton
                        onClick={() => console.log('View Device', device.id)}
                     >
                        <EyeIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip content="Edit Device">
                     <IconButton
                        onClick={() => console.log('Edit Device', device.id)}
                     >
                        <UpdateDevice deviceId={device} loadDevices={loadDevices}/>
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip
                     content="Delete Device"
                     color="error"
                     onClick={() => onDelete(device.id)}
                  >
                     <IconButton onClick={() => deleteDevice(device.id)}>
                        <DeleteIcon size={20} fill="#FF0080" />
                     </IconButton>
                  </Tooltip>
               </Col>
            </Row>
         );
      default:
         return cellValue;
   }
};
