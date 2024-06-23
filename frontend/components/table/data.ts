import axios from 'axios';

// Kolom tetap
export const columns = [
   {name: 'NAME', uid: 'name'},
   {name: 'ROLE', uid: 'role'},
   {name: 'STATUS', uid: 'status'},
   {name: 'ACTIONS', uid: 'actions'},
];

// Fungsi untuk mengambil data dari API
export const fetchUsers = async () => {
   try {
      const response = await axios.get('http://localhost:8000/api/go/users');
      const usersData = response.data;

      // Map data pengguna sesuai format yang diperlukan
      return usersData.map((user: { id: number, firstname: string, lastname: string, email: string, role: string }) => ({
         id: user.id,
         name: `${user.firstname} ${user.lastname}`,
         role: user.role, // Role bisa diupdate sesuai kebutuhan
         team: 'Unknown Team', // Team bisa diupdate sesuai kebutuhan
         status: 'active', // Status bisa diupdate sesuai kebutuhan
         age: 'Unknown Age', // Age bisa diupdate sesuai kebutuhan
         avatar: `https://i.pravatar.cc/150?u=${user.email}`,
         email: user.email,
      }));
   } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
   }
};

export const searchUsers = async (query: string) => {
   try {
       const response = await axios.get(`http://localhost:8000/api/go/search/users?q=${query}`);
       const usersData = response.data;

      // Map data pengguna sesuai format yang diperlukan
      return usersData.map((user: { id: number, firstname: string, lastname: string, email: string }) => ({
         id: user.id,
         name: `${user.firstname} ${user.lastname}`,
         role: 'Unknown Role', // Role bisa diupdate sesuai kebutuhan
         team: 'Unknown Team', // Team bisa diupdate sesuai kebutuhan
         status: 'active', // Status bisa diupdate sesuai kebutuhan
         age: 'Unknown Age', // Age bisa diupdate sesuai kebutuhan
         avatar: `https://i.pravatar.cc/150?u=${user.email}`,
         email: user.email,
      }));
   } catch (error) {
       console.error('Gagal mencari pengguna:', error);
       return [];
   }
};

export const deleteUser = async (id: number) => {
   try {
      await axios.delete(`http://localhost:8000/api/go/users/${id}`);
      console.log(`User with ID ${id} deleted successfully.`);
   } catch (error) {
      console.error('Failed to delete user:', error);
   }
};

// Data pengguna diambil dari API
export let users: any[] = [];

// Memanggil fetchUsers dan mengupdate users
fetchUsers().then((fetchedUsers) => {
   users = fetchedUsers;
});
