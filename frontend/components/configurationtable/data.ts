import axios from 'axios';

// Kolom tetap
export const columns = [
   {name: 'NAME', uid: 'name'},
   {name: 'TYPE', uid: 'role'},
   {name: 'STATUS', uid: 'status'},
   {name: 'ACTIONS', uid: 'actions'},
];

// Fungsi untuk mengambil data dari API
export const fetchDevices = async () => {
   try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/go/devices`);
      const devicesData = response.data;
      
      // Map data pengguna sesuai format yang diperlukan
      return devicesData.map((device: { id: number, name: string, type: number, pausestate: boolean }) => ({
         id: device.id,
         name: device.name,
         // lastname: user.lastname,
         role: device.type === 0 ? 'Engrow' : 'Nutrigrow', // Role bisa diupdate sesuai kebutuhan
         // team: 'Unknown Team', // Team bisa diupdate sesuai kebutuhan
         status: device.pausestate === false ? 'active' : 'paused', // Status bisa diupdate sesuai kebutuhan
         
         // email: user.email,
      }));
   } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
   }
};

export const searchDevices = async (query: string) => {
   try {
       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/go/search/devices?q=${query}`);
       const devicesData = response.data;
      
      // Map data pengguna sesuai format yang diperlukan
      return devicesData.map((device: { id: number, name: string, type: number }) => ({
         id: device.id,
         name: device.name,
         // lastname: user.lastname,
         role: device.type === 0 ? 'Engrow' : 'Nutrigrow', // Role bisa diupdate sesuai kebutuhan
         // team: 'Unknown Team', // Team bisa diupdate sesuai kebutuhan
         status: 'active', // Status bisa diupdate sesuai kebutuhan

         // email: user.email,
      }));
   } catch (error) {
       console.error('Gagal mencari pengguna:', error);
       return [];
   }
};

export const deleteDevice = async (id: number) => {
   try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/go/devices/${id}`);
      console.log(`User with ID ${id} deleted successfully.`);
      // Optionally, you can remove the user from the local 'devices' array to update the UI
      devices = devices.filter(device => device.id !== id);
   } catch (error) {
      console.error('Failed to delete device:', error);
   }
};

// Data pengguna diambil dari API
export let devices: any[] = [];

// Memanggil fetchDevices dan mengupdate devices
fetchDevices().then((fetchedDevices) => {
   devices = fetchedDevices;
});
