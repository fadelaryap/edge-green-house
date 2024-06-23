// table.tsx

import { Table, Button, Input, Loading } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { Box } from '../styles/box';
import { columns, fetchNodes, searchNodes, deleteNode as deleteNodeService } from './data';
import { RenderCell } from './render-cell';
import { Flex } from '../styles/flex';
import axios from 'axios';
import { AddNode } from '../node/add-node'; // Import AddNode
import { DotsIcon } from '../icons/user/dots-icon';
import { InfoIcon } from '../icons/user/info-icon';
import { TrashIcon } from '../icons/user/trash-icon';
import { SettingsIcon } from '../icons/sidebar/settings-icon';
import { ExportIcon } from '../icons/user/export-icon';
import { debounce } from 'lodash'; // Import lodash debounce
import { Node } from './render-cell';

export const TableWrapper = () => {
    const [nodes, setNodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadNodes();
    }, [searchQuery]);

    const loadNodes = async () => {
        setLoading(true);
        const fetchedNodes = searchQuery ? await searchNodes(searchQuery) : await fetchNodes();
        setNodes(fetchedNodes);
        setLoading(false);
    };

    const handleSearch = debounce((e) => {
        setSearchQuery(e.target.value);
    }, 300); // Debounce to prevent too many API calls

    const deleteNode = async (id: number) => {
        try {
            // console.log(id);
            await deleteNodeService(id);
            loadNodes();
        } catch (error) {
            console.error('Gagal menghapus node:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = nodes.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(nodes.length / itemsPerPage);

    const changePage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const Pagination = () => (
        <Box css={{ display: 'flex', justifyContent: 'center', marginTop: '$4'}}>
            {Array.from({ length: totalPages }, (_, index) => (
                <Box
                    key={index}
                    as="button"
                    onClick={() => changePage(index + 1)}
                    css={{
                        padding: '$2 $4',
                        margin: '0 $2',
                        cursor: 'pointer',
                        fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
                        bg: currentPage === index + 1 ? '$blue500' : '$gray300',
                        color: currentPage === index + 1 ? '$white' : '$text',
                        borderRadius: '5px',
                        border: '0',
                        '&:hover': {
                            bg: '$primaryLight',
                        },
                    }}
                >
                    {index + 1}
                </Box>
            ))}
        </Box>
    );

    return (
        <Box css={{ '& .nextui-table-container': { boxShadow: 'none' } }}>
            <Flex css={{gap: '$8'}} align={'center'} justify={'between'} wrap={'wrap'}>
                <Flex css={{'gap': '$6', 'flexWrap': 'wrap', '@sm': {flexWrap: 'nowrap'},}} align={'center'}>
                    <Input
                        css={{width: '100%', maxW: '410px'}}
                        placeholder="Search users"
                        onChange={handleSearch} // Attach the handler here
                    />
                    <SettingsIcon />
                    <TrashIcon />
                    <InfoIcon />
                    <DotsIcon />
                </Flex>
                <Flex direction={'row'} css={{gap: '$6'}} wrap={'wrap'}>
                    <AddNode loadNodes={loadNodes} />
                    <Button auto iconRight={<ExportIcon />}>
                        Export to CSV
                    </Button>
                </Flex>
            </Flex>

            {loading ? (
                <Loading></Loading> // Replace this with your loading spinner or component
            ) : (
            <Table
                aria-label="Tabel contoh dengan sel kustom"
                css={{
                    height: 'auto',
                    minWidth: '100%',
                    boxShadow: 'none',
                    width: '100%',
                    px: 0,
                }}
                selectionMode="multiple"
            >
                <Table.Header columns={columns}>
                    {(column) => (
                        <Table.Column
                            key={column.uid}
                            hideHeader={column.uid === 'actions'}
                            align={column.uid === 'actions' ? 'center' : 'start'}
                        >
                            {column.name}
                        </Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={currentItems}>
                    {(item) => (
                        <Table.Row key={item.id}>
                            {(columnKey) => (
                                <Table.Cell>
                                    {RenderCell({
                                        node: item,
                                        columnKey: columnKey as keyof Node,
                                        onDelete: deleteNode,
                                        loadNodes: loadNodes,
                                    })}
                                </Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
            )}
            <Pagination />
        </Box>
    );
};
