import { getDatabase, ref, onValue, off } from 'firebase/database';
import { useEffect, useState } from 'react';
import { app } from './firebaseConfig'; // Import the initialized app instance

const useFetchDataFromFirebase = () => {
  const [data, setData] = useState(0);

  useEffect(() => {
    const database = getDatabase(app); // Get a reference to the database
    const databaseRef = ref(database, '/'); // Reference to the root of the database

    const onDataChange = (snapshot) => {
      const newData = snapshot.val();
      setData(newData);
    };

    // Set up a listener for realtime updates
    const unsubscribe = onValue(databaseRef, onDataChange);

    // Clean up the listener when no longer needed
    return () => {
      off(databaseRef, 'value', onDataChange);
      unsubscribe(); // Unsubscribe from realtime updates
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return data; // Return the fetched data
};

export default useFetchDataFromFirebase;