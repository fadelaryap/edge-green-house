// table.tsx

import { Table, Button, Input, Loading } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { Box } from '../styles/box';
import { columns, fetchDevices, searchDevices, deleteDevice as deleteDeviceService } from './data';
import { RenderCell } from './render-cell';
import { Flex } from '../styles/flex';
import axios from 'axios';
import { AddDevice } from '../configuration/add-device'; // Import AddUser
import { DotsIcon } from '../icons/user/dots-icon';
import { InfoIcon } from '../icons/user/info-icon';
import { TrashIcon } from '../icons/user/trash-icon';
import { SettingsIcon } from '../icons/sidebar/settings-icon';
import { ExportIcon } from '../icons/user/export-icon';
import { debounce } from 'lodash'; // Import lodash debounce

export const TableWrapper = () => {
    const [devices, setDevices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadDevices();
    }, [searchQuery]);

    const loadDevices = async () => {
        setLoading(true);
        const fetchedDevices = searchQuery ? await searchDevices(searchQuery) : await fetchDevices();
        setDevices(fetchedDevices);
        setLoading(false);
    };

    const handleSearch = debounce((e) => {
        setSearchQuery(e.target.value);
    }, 300); // Debounce to prevent too many API calls

    const deleteDevice = async (id: number) => {
        try {
            await axios.get(`http://localhost:8000/api/go/devices/${id}`);
            loadDevices();
        } catch (error) {
            console.error('Gagal menghapus device:', error);
        }
    };
    
    const exportDevice = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/go/exportdevices', {
                responseType: 'blob', // Important for handling binary data
            });
    
            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
            // Create a link element
            const link = document.createElement('a');
            
            // Set the download attribute with a filename
            link.href = window.URL.createObjectURL(blob);
            link.download = 'allDevices.xlsx';
            
            // Append the link to the body
            document.body.appendChild(link);
            
            // Programmatically click the link to trigger the download
            link.click();
            
            // Remove the link from the document
            document.body.removeChild(link);
        } catch (error) {
            console.error('Gagal mengekspor device:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = devices.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(devices.length / itemsPerPage);

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
                    <AddDevice loadDevices={loadDevices} />
                    <Button auto iconRight={<ExportIcon />} onClick={exportDevice}>
                        Export to XLSX
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
                                        device: item,
                                        columnKey: columnKey,
                                        onDelete: deleteDevice,
                                        loadDevices: loadDevices,
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
