import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc, // Import getDoc here
} from 'firebase/firestore';
import { useAuth } from '../AuthContext';

type Message = {
  id: string;
  text: string;
  userId: string;
  username: string;
};

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userColor, setUserColor] = useState('#FFFFFF'); // Default color is white
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({}); // Object to hold each user's color

  if (!user) {
    return (
      <p className="text-center">You must be signed in to use the chat.</p>
    );
  }

  // Fetch user's stored color from Firestore
  useEffect(() => {
    const getUserColor = async () => {
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc); // Fetch user document

      if (userSnapshot.exists()) {
        setUserColor(userSnapshot.data()?.chatColor || '#FFFFFF'); // Set default color if no color is set
      }
    };

    getUserColor();
  }, [user]);

  // Update user's color in Firestore when it changes
  const updateUserColor = async (newColor: string) => {
    const userDoc = doc(db, 'users', user.uid);
    await updateDoc(userDoc, {
      chatColor: newColor,
    });
    setUserColor(newColor); // Update state immediately
  };

  // Fetch chat messages and colors from Firestore
  useEffect(() => {
    const q = query(collection(db, 'chat'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, 'id'>),
      }));

      // Fetch and update user colors for all messages
      const colors: { [key: string]: string } = {};
      for (const msg of msgs) {
        const userDoc = doc(db, 'users', msg.userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          colors[msg.userId] = userSnapshot.data()?.chatColor || '#FFFFFF'; // Assign default if no color
        }
      }

      setMessages(msgs);
      setUserColors(colors); // Set the user colors mapping
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, 'chat'), {
      text: newMessage,
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen p-4 centered">
      <h2>
        {' '}
        Ideas here please, <br /> Serious ideas only!{' '}
      </h2>
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded-lg">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-1 flex ${
              msg.userId === user.uid ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className="inline-flex items-center space-x-2">
              <span
                className="text-sm font-bold"
                style={{ color: userColors[msg.userId] || '#000000' }} // Apply the correct color for each user
              >
                {msg.username}:
              </span>
              <span
                className="p-1 rounded-lg"
                style={{ color: userColors[msg.userId] || '#000000' }} // Apply the correct color for each user
              >
                {msg.text}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
      <div className="flex items-center mt-2">
        <label className="mr-2 text-sm">Enter Hex Color:</label>
        <input
          type="text"
          value={userColor}
          onChange={(e) => updateUserColor(e.target.value)} // Update Firestore and state
          className="p-1 border rounded-lg text-black"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );
};

export default ChatPage;
