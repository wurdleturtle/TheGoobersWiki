import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

const ClickerPage = () => {
  const [clicks, setClicks] = useState(0); // User-specific clicks
  const [totalClicks, setTotalClicks] = useState(0); // Total clicks of all users
  const { user, username, logout } = useAuth();

  // Function to increment user clicks
  const incrementClicks = async (amount: number) => {
    try {
      if (user && user.uid) {
        const response = await fetch('https://88.85.157.209:3000/click', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: username, // Send the user's username
            amount: amount, // Number of clicks to increment
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to increment clicks');
        }

        const data = await response.json();
        setClicks(data.clicks); // Update the state with the new clicks value
      }
    } catch (error) {
      console.error('Error incrementing clicks:', error);
    }
  };

  // Fetch the user-specific clicks and the total clicks of all users
  useEffect(() => {
    const fetchStatus = async () => {
      if (user && user.uid) {
        const response = await fetch(
          `https://88.85.157.209:3000/status?user=${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setClicks(data.clicks || 0); // Set default if data is undefined
        } else {
          setClicks(0);
        }
      } else {
        setClicks(0);
      }
    };

    const fetchTotalClicks = async () => {
      const response = await fetch('https://88.85.157.209:3000/totalClicks');
      if (response.ok) {
        const data = await response.json();
        setTotalClicks(data.totalClicks || 0); // Set default value if undefined
      } else {
        setTotalClicks(0);
      }
    };

    fetchStatus(); // Fetch user-specific click count
    fetchTotalClicks(); // Fetch the total clicks for all users
  }, [user, username]);

  return (
    <div className="centered">
      <h1>Clicker Game</h1>
      <button onClick={() => incrementClicks(10)}>Increment Clicks</button>
      <p>Your Clicks: {clicks}</p>
      <p>Total Clicks (All Users): {totalClicks}</p>
    </div>
  );
};

export default ClickerPage;
