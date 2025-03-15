import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { AuthProvider, useAuth } from '../AuthContext';

const Clickerpage = () => {
  const [clicks, setClicks] = useState(0);
  const { user, username, logout } = useAuth();

  const incrementClicks = async (amount: number) => {
    // Marking the function as async
    try {
      if (user && user.uid) {
        // Make sure to provide the data to update
        await updateDoc(doc(db, 'settings', 'Clicks'), {
          Clicks: clicks + amount, // Add the incremented clicks value
        });
        setClicks((prevClicks) => prevClicks + amount); // Update the local state
      }
    } catch (error) {
      console.error('Error incrementing clicks:', error);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      if (user && user.uid) {
        // Ensure `user` and `user.uid` are valid
        const userDoc = await getDoc(doc(db, 'settings', 'Clicks'));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setClicks(data?.Clicks || 0); // Set default value if Clicks is undefined
        }
      } else {
        setClicks(0);
      }
    };

    fetchStatus();
  }, [user]); // Runs when `user` changes

  return (
    <div className="centered">
      <h1>Clicker game (no way)</h1>
      <button onClick={() => incrementClicks(10)}>Cookie (HD)</button>
      <p>{clicks}</p>
    </div>
  );
};

export default Clickerpage;
