import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  increment,
} from "firebase/firestore";

const SpinWheel = () => {
  const { user } = useAuth();
  const [pipariCount, setPipariCount] = useState(0);
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(null);
  const [canSpin, setCanSpin] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [tradeAmount, setTradeAmount] = useState("");

  useEffect(() => {
    if (!user) return; // Early return if user is null

    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setPipariCount(data.pipariCount || 0);
        setLastSpinDate(data.lastSpinDate || null);

        // Check if user has already spun today
        const today = new Date().toISOString().split("T")[0];
        setCanSpin(data.lastSpinDate !== today); // Validate whether user can spin today
      }
    };

    fetchUserData();
  }, [user]); // Trigger the effect when user changes (user logged in)

  const spinWheel = async () => {
    if (!user || !canSpin || spinning) return; // Early return if user is null or spinning

    setSpinning(true);
    const reward = Math.floor(Math.random() * 100) + 1; // Random 1-100 Piparis

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      pipariCount: increment(reward),
      lastSpinDate: new Date().toISOString().split("T")[0], // Set today's date to prevent multiple spins
    });

    setPipariCount((prev) => prev + reward);
    setLastSpinDate(new Date().toISOString().split("T")[0]);
    setCanSpin(false);
    setSpinning(false);
    alert(`You won ${reward} Piparis! 🎉`);
  };

  const tradePiparis = async () => {
    if (!user || !recipient || !tradeAmount) return; // Early return if user is null or invalid trade data
    const amount = parseInt(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid Pipari amount.");
      return;
    }
    if (amount > pipariCount) {
      alert("You don't have enough Piparis!");
      return;
    }

    const usersRef = collection(db, "users");
    const recipientQuery = query(usersRef, where("username", "==", recipient));
    const recipientSnapshot = await getDocs(recipientQuery);

    if (recipientSnapshot.empty) {
      alert("Recipient not found!");
      return;
    }

    const recipientDocRef = recipientSnapshot.docs[0].ref;

    await updateDoc(doc(db, "users", user.uid), {
      pipariCount: increment(-amount),
    });
    await updateDoc(recipientDocRef, {
      pipariCount: increment(amount),
    });

    setPipariCount(pipariCount - amount);
    alert(`You sent ${amount} Piparis to ${recipient}! 🎉`);
    setRecipient("");
    setTradeAmount("");
  };

  // Define handleEarnPiparis function
  const handleEarnPiparis = (earnedPiparis: number) => {
    setPipariCount((prev) => prev + earnedPiparis); // Add earned Piparis to the user's count
  };

  const removePipari = async () => {
    if (!user) return; // Early return if user is null
    if (pipariCount <= 0) {
      alert("You don't have any Piparis to remove!");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      pipariCount: increment(-1),
    });

    setPipariCount(pipariCount - 1);
    alert("You removed 1 Pipari! 😔");
  };

  return (
    <div className="spin-container centered">
      <h2>Daily Spin Wheel 🎡</h2>
      <p>Your Piparis: {pipariCount}</p>
      <button onClick={spinWheel} disabled={!canSpin} className="spin-button">
        {spinning ? "Spinning..." : "Spin the Wheel!"}
      </button>
      {!canSpin && <p>Come back tomorrow for another spin!</p>}
      <h2>Trade Piparis 🤝</h2>
      <input
        type="text"
        placeholder="Recipient username"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount to send"
        value={tradeAmount}
        onChange={(e) => setTradeAmount(e.target.value)}
      />
      <button onClick={tradePiparis}>Send Piparis</button>
      <h2> Throw a Pipari into the well</h2>
      <button onClick={removePipari} disabled={pipariCount <= 0}>
        Throw a Pipari into the well
      </button>
      <br />
    </div>
  );
};

export default SpinWheel;
