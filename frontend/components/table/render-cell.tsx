import {Col, Grid, Button, Row, User, Text, Tooltip} from '@nextui-org/react';
import React from 'react';
import {DeleteIcon} from '../icons/table/delete-icon';
import {EditIcon} from '../icons/table/edit-icon';
import {EyeIcon} from '../icons/table/eye-icon';
import {IconButton, StyledBadge} from './table.styled';
import { deleteUser } from './data';

interface Props {
   user: {
      id: number;
      name: string;
      // lastname: string;
      role: string;
      team: string;
      status: string;
      avatar: string;
      email: string;
   };
   columnKey: string | React.Key;
   onDelete: (id: number) => void;
}

const DeleteUser: React.FC<Props>  = ({ user, onDelete }) => {
   return (
     <Grid.Container
       css={{
         borderRadius: "14px",
         padding: "0.75rem",
         maxWidth: "800px",
         width: "324px"
       }}
     >
       <Row justify="center" align="center">
         <Text b>Confirm</Text>
       </Row>
       <Row>
         <Text>
           Are you sure you want to delete {user.name}?, by doing this, you will
           not be able to recover the data.
         </Text>
       </Row>
       <Grid.Container justify="space-between" alignContent="center">
         <Grid>
           <Button size="sm" light>
             Cancel
           </Button>
         </Grid>
         <Grid>
           <Button size="sm" shadow color="error" onClick={() => onDelete(user.id)}>
             Delete
           </Button>
         </Grid>
       </Grid.Container>
     </Grid.Container>
   );
 };

export const RenderCell = ({user, columnKey, onDelete}: Props) => {
   const cellValue = user[columnKey as keyof typeof user];
   switch (columnKey) {
      case 'name':
         return (
            <User squared src={user.avatar} name={cellValue} css={{p: 0}}>
               {user.email}
               {/* {user.firstname} */}
            </User>
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
                     {user.team}
                  </Text>
               </Row>
            </Col>
         );
      case 'status':
         return (
            <StyledBadge type={user.status as "active" | "paused"}>{cellValue}</StyledBadge>
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
                        onClick={() => console.log('View user', user.id)}
                     >
                        <EyeIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip content="Edit user">
                     <IconButton
                        onClick={() => console.log('Edit user', user.id)}
                     >
                        <EditIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
               <Tooltip
                     trigger="click"
                     content={<DeleteUser user={user} onDelete={onDelete} columnKey={columnKey} />} // Pass columnKey here
                     placement="left"
                  >
                     <IconButton>
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
