import {Col, Row, Grid, Button, User, Text, Tooltip} from '@nextui-org/react';
import React from 'react';
import {DeleteIcon} from '../icons/table/delete-icon';
import {EditIcon} from '../icons/table/edit-icon';
import {EyeIcon} from '../icons/table/eye-icon';
import {IconButton, StyledBadge} from './table.styled';
import { UpdateNode } from '../node/update-node'
import { deleteNode } from './data';


export type Node = {
   id: number;
   name: string;
   status: string;
   actions?: string;
};

type ColumnKey = keyof Node;

interface Props {
   node: Node;
   columnKey: ColumnKey;
   onDelete: (id: number) => void;
   loadNodes: () => void;
}


interface DeleteNodeProps {
   node: {
     id: number;
     name: string;
     status: string;
   };
   onDelete: (id: number) => void;
 }

const DeleteNode: React.FC<DeleteNodeProps> = ({ node, onDelete }) => {
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
           Are you sure you want to delete {node.name}?, by doing this, you will
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
           <Button size="sm" shadow color="error" onClick={() => onDelete(node.id)}>
             Delete
           </Button>
         </Grid>
       </Grid.Container>
     </Grid.Container>
   );
 };

export const RenderCell = ({node, columnKey, onDelete, loadNodes}: Props) => {
   // console.log(node.id);
   if (!node || !columnKey) {
      console.error('node atau columnKey tidak ada:', { node, columnKey });
      return null;
   }

   const cellValue = node[columnKey];
   switch (columnKey) {
      case 'name':
         return (
            // <User name={cellValue} css={{p: 0}}>
               <>
               {cellValue}
               </>

            // </User>
         );
      case 'status':
         return (
            <StyledBadge type={node.status as "active" | "paused"}>{cellValue}</StyledBadge>
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
                        onClick={() => console.log('View node', node.id)}
                     >
                        <EyeIcon size={20} fill="#979797" />
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
                  <Tooltip content="Edit Node">
                     <IconButton
                        onClick={() => console.log('Edit Node', node.id)}
                     >
                        <UpdateNode nodeId={node} loadNodes={loadNodes}/>
                     </IconButton>
                  </Tooltip>
               </Col>
               <Col css={{d: 'flex'}}>
               <Tooltip
                     trigger="click" 
                     content={<DeleteNode node={node} onDelete={onDelete} />}
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
