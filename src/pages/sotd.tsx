import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext"; // to check if user is admin
import { db } from "../firebase"; // Firestore
import { doc, getDoc, setDoc } from "firebase/firestore";

const SotdPage = () => {
  const { user, username } = useAuth();
  const [songOfTheDay, setSongOfTheDay] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newSong, setNewSong] = useState("");
  const currentDate: Date = new Date();
  const formattedDate: string = currentDate
    .toLocaleDateString("nl-BE")
    .replace(/\//g, ".");

  // Fetch current SotD and admin status
  useEffect(() => {
    if (user) {
      // Fetch admin status from Firestore
      const fetchAdminStatus = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().isAdmin); // Set admin status
        }
      };

      // Fetch Song of the Day from Firestore
      const fetchSongOfTheDay = async () => {
        const sotdDoc = await getDoc(doc(db, "settings", "sotd"));
        if (sotdDoc.exists()) {
          setSongOfTheDay(sotdDoc.data().song);
        }
      };

      fetchAdminStatus();
      fetchSongOfTheDay();
    }
  }, [user]);

  // Update Song of the Day if user is an admin
  const handleSaveSong = async () => {
    if (newSong && isAdmin) {
      try {
        await setDoc(doc(db, "settings", "sotd"), {
          song: newSong,
        });
        setSongOfTheDay(newSong); // Update the state to reflect changes immediately
        setNewSong(""); // Clear input after saving
      } catch (error) {
        console.error("Error saving song of the day:", error);
      }
    }
  };

  return (
    <>
      <h1 className="centered">Song of the Day</h1>
      <br />
      {songOfTheDay ? (
        // Render HTML using dangerouslySetInnerHTML
        <p
          className="centered"
          dangerouslySetInnerHTML={{ __html: songOfTheDay }}
        />
      ) : (
        <p className="centered">No Song of the Day today.</p>
      )}
      <br />
      <p className="centered">Date: {formattedDate}</p>

      {/* If user is an admin, allow them to edit SotD */}
      {isAdmin && (
        <div className="centered">
          <input
            type="text"
            value={newSong}
            onChange={(e) => setNewSong(e.target.value)}
            placeholder="Enter new Song of the Day"
          />
          <button onClick={handleSaveSong}>Save Song</button>
          <br />
        </div>
      )}
    </>
  );
};

export default SotdPage;
