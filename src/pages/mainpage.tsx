import { useState, useEffect } from "react";
import { db } from "../firebase"; // Firestore
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext"; // for user and account status

const MainPage = () => {
  const { user } = useAuth(); // Get logged-in user
  const [motd, setMotd] = useState<string | null>(null); // Store MOTD
  const [author, setAuthor] = useState<string | null>(null); // Store MOTD author
  const [newMotd, setNewMotd] = useState<string>(""); // Input for new MOTD
  const [isAdmin, setIsAdmin] = useState(false); // Check if user is admin
  const [isOwner, setIsOwner] = useState(false); // Check if user is an owner

  // Fetch MOTD and user status (admin and owner)
  useEffect(() => {
    const fetchMotdAndStatus = async () => {
      // Fetch the MOTD from Firestore
      const motdDoc = await getDoc(doc(db, "settings", "motd"));
      if (motdDoc.exists()) {
        setMotd(motdDoc.data().message);
        setAuthor(motdDoc.data().author || "Unknown"); // Default to 'Unknown' if no author
      }

      // Fetch admin and owner status from Firestore
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setIsAdmin(data.isAdmin); // Set admin status
          setIsOwner(data.isOwner); // Set owner status
        }
      }
    };

    fetchMotdAndStatus();
  }, [user]);

  // Save the new MOTD to Firestore (supports HTML)
  const handleSaveMotd = async () => {
    // Only allow saving if the user is an owner
    if (newMotd && isOwner && user) {
      try {
        const authorName = user.displayName || user.email || "Anonymous";
        await setDoc(doc(db, "settings", "motd"), {
          message: newMotd, // Store raw HTML
          author: authorName,
          timestamp: serverTimestamp(),
        });

        setMotd(newMotd); // Update state
        setAuthor(authorName);
        setNewMotd(""); // Clear input field
      } catch (error) {
        console.error("Error saving Message of the Day:", error);
      }
    }
  };

  return (
    <div className="centered">
      <h1 className="centered">The Goobers Wiki</h1>
      <br />
      <p className="centered">Welcome to The Goobers Wiki! </p>
      <br />

      {/* Display MOTD with HTML Support */}
      {motd ? (
        <div className="motd-container">
          <h2 className="centered">Message of the Day</h2>
          <div
            className="motd-content"
            dangerouslySetInnerHTML={{ __html: motd }}
          />
          <p className="centered">
            <small>Last updated by: {author}</small>
          </p>
        </div>
      ) : (
        <p className="centered">No Message of the Day.</p>
      )}

      {/* Only Owner accounts can edit MOTD */}
      {isOwner && (
        <div className="motd-edit">
          <h3>Edit MOTD (Supports HTML)</h3>
          <textarea
            value={newMotd}
            onChange={(e) => setNewMotd(e.target.value)}
            placeholder="Enter new MOTD (HTML allowed)..."
            rows={5}
          />
          <br />
          <button onClick={handleSaveMotd}>Save MOTD</button>
        </div>
      )}
    </div>
  );
};

export default MainPage;
