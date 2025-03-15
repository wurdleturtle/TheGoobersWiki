import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

interface LeaderboardEntry {
  user: string;
  userclicks: number;
}

const ClickerPage = () => {
  const [clicks, setClicks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const { user, username } = useAuth();

  const incrementClicks = async (amount: number) => {
    try {
      if (user && user.uid) {
        const response = await fetch('https://backend.wurdle.eu:3000/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: username, amount }),
        });

        if (!response.ok) throw new Error('Failed to increment clicks');

        const data = await response.json();
        setClicks(data.clicks);
      }
    } catch (error) {
      console.error('Error incrementing clicks:', error);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      if (user && user.uid) {
        const response = await fetch(
          `https://backend.wurdle.eu:3000/status?user=${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setClicks(data.clicks || 0);
        } else {
          setClicks(0);
        }
      } else {
        setClicks(0);
      }
    };

    fetchStatus();
  }, [user, username]);

  useEffect(() => {
    const fetchTotalClicks = async () => {
      try {
        const response = await fetch(
          'https://backend.wurdle.eu:3000/totalClicks'
        );
        if (response.ok) {
          const data = await response.json();
          setTotalClicks(data.totalClicks || 0);
        }
      } catch (error) {
        console.error('Error fetching total clicks:', error);
      }
    };

    fetchTotalClicks();
    const interval = setInterval(fetchTotalClicks, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          'https://backend.wurdle.eu:3000/leaderboard'
        );
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data.leaderboard || []);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="centered">
      <h1>Clicker Game</h1>
      <button onClick={() => incrementClicks(1)}>Increment Clicks</button>
      <p>Your Clicks: {clicks}</p>
      <p>Total Clicks (All Users): {totalClicks}</p>

      <h2>Leaderboard</h2>
      <ol>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.user}: {entry.userclicks} clicks
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ClickerPage;
