import axios from 'axios';

// Kolom tetap
export const columns = [
   {name: 'NAME', uid: 'name'},
   {name: 'STATUS', uid: 'status'},
   {name: 'ACTIONS', uid: 'actions'},
];

// Fungsi untuk mengambil data dari API
export const fetchNodes = async () => {
   try {
      const response = await axios.get('http://localhost:8000/api/go/nodes');
      const nodesData = response.data;
      
      // Map data pengguna sesuai format yang diperlukan
      return nodesData.map((node: { id: number, name: string }) => ({
         id: node.id,
         name: node.name,
         // lastname: user.lastname,
         // role: device.type === 0 ? 'Engrow' : 'Nutrigrow', // Role bisa diupdate sesuai kebutuhan
         // team: 'Unknown Team', // Team bisa diupdate sesuai kebutuhan
         status: 'active', // Status bisa diupdate sesuai kebutuhan
         
         // email: user.email,
      }));
   } catch (error) {
      console.error('Failed to fetch nodes:', error);
      return [];
   }
};

export const searchNodes = async (query: string) => {
   try {
       const response = await axios.get(`http://localhost:8000/api/go/search/nodes?q=${query}`);
       const nodesData = response.data;
      
      // Map data pengguna sesuai format yang diperlukan
      return nodesData.map((node: { id: number, name: string, type: number }) => ({
         id: node.id,
         name: node.name,
         // lastname: user.lastname,
         // role: node.type === 0 ? 'Engrow' : 'Nutrigrow', // Role bisa diupdate sesuai kebutuhan
         // team: 'Unknown Team', // Team bisa diupdate sesuai kebutuhan
         status: 'active', // Status bisa diupdate sesuai kebutuhan

         // email: user.email,
      }));
   } catch (error) {
       console.error('Gagal mencari node:', error);
       return [];
   }
};

export const deleteNode = async (id: number) => {
   try {
      console.log(id);
      await axios.delete(`http://localhost:8000/api/go/nodes/${id}`);
      console.log(`User with ID ${id} deleted successfully.`);
      // Optionally, you can remove the user from the local 'nodes' array to update the UI
      // nodes = nodes.filter(node => node.id !== id);
   } catch (error) {
      console.error('Failed to delete node:', error);
   }
};

// Data pengguna diambil dari API
export let nodes: any[] = [];

// Memanggil fetchDevices dan mengupdate devices
fetchNodes().then((fetchedNodes) => {
   nodes = fetchedNodes;
});
