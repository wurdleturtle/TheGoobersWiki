import { useEffect, useState } from 'react';

const ClickerPage = () => {
  const [clicks, setClicks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [clickStrength, setClickStrength] = useState(1);
  const [upgradeCost, setUpgradeCost] = useState(10);

  const incrementClicks = async (amount: number) => {
    try {
      const response = await fetch('https://backend.wurdle.eu:3000/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) throw new Error('Failed to increment clicks');

      const data = await response.json();
      setClicks(data.burgers);
      fetchTotalClicks();
    } catch (error) {
      console.error('Error incrementing clicks:', error);
    }
  };

  const fetchTotalClicks = async () => {
    try {
      const response = await fetch(
        'https://backend.wurdle.eu:3000/totalClicks'
      );
      if (response.ok) {
        const data = await response.json();
        setTotalClicks(data.totalClicks);
      }
    } catch (error) {
      console.error('Error fetching total clicks:', error);
    }
  };

  const fetchClickStrengthAndCost = async () => {
    try {
      const response = await fetch(
        'https://backend.wurdle.eu:3000/clickStrengthAndCost'
      );
      if (response.ok) {
        const data = await response.json();
        setClickStrength(data.clickStrength);
        setUpgradeCost(data.upgradeCost);
      }
    } catch (error) {
      console.error('Error fetching click strength and upgrade cost:', error);
    }
  };

  const handleUpgradeClick = async () => {
    if (totalClicks >= upgradeCost) {
      try {
        const response = await fetch(
          'https://backend.wurdle.eu:3000/upgradeClickStrength',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: upgradeCost }),
          }
        );

        if (!response.ok) throw new Error('Failed to upgrade click strength');

        const data = await response.json();
        setClickStrength(data.newClickStrength);
        setUpgradeCost(data.upgradeCost);
        fetchTotalClicks();
      } catch (error) {
        console.error('Error upgrading click strength:', error);
      }
    } else {
      alert('Not enough burgers to upgrade!');
    }
  };

  useEffect(() => {
    fetchClickStrengthAndCost();
    fetchTotalClicks();
  }, []);

  return (
    <div className="centered">
      <h1>Burger Game</h1>
      <h1 className="red big"> CURRENTLY BROKEN</h1>
      <button
        onClick={() => {
          incrementClicks(clickStrength);
        }}
        className="burgerbutton"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <img
          src="https://images.wurdle.eu/burger.png"
          draggable="false"
          style={{ width: 250 }}
        />
      </button>
      <p>Burgers: {totalClicks}</p>

      <div>
        <p>Upgrade Click Strength</p>
        <p>Cost: {upgradeCost} Burgers</p>
        <button
          onClick={handleUpgradeClick}
          disabled={totalClicks < upgradeCost}
        >
          Upgrade (Click Strength)
        </button>
      </div>
    </div>
  );
};

export default ClickerPage;
