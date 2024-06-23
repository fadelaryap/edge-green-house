import { useEffect, useState } from 'react';

export default function RealTimeComponent() {
  const [data, setData] = useState('');

  // Contoh implementasi pong di klien Next.js
  useEffect(() => {
    const socket = new WebSocket('ws://103.196.152.44:8000/ws');


    return () => {
        socket.close();
    };
  }, []);


  return (
    <div>
      <h1>Real-time Data</h1>
      <p>{data}</p>
    </div>
  );
}