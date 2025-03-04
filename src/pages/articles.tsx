import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../AuthContext"; // Get user auth

// Define Article Type
interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
}

const ArticlesPage = () => {
  const { user } = useAuth(); // Get logged-in user
  const [articles, setArticles] = useState<Article[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch articles & check admin status
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "articles"));
      const fetchedArticles: Article[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Article, "id">),
      }));
      setArticles(fetchedArticles);

      // Check if user is admin
      if (user) {
        const userDoc = await getDocs(collection(db, "users"));
        const userData = userDoc.docs
          .find((doc) => doc.id === user.uid)
          ?.data();
        setIsAdmin(userData?.isAdmin || false);
      }
    };

    fetchData();
  }, [user]);

  // Create new article
  const handleCreateArticle = async () => {
    if (!newTitle || !newContent || !isAdmin || !user) return;
    const authorName = user.displayName || user.email || "Anonymous";

    const docRef = await addDoc(collection(db, "articles"), {
      title: newTitle,
      content: newContent,
      author: authorName,
    });

    setArticles([
      ...articles,
      {
        id: docRef.id,
        title: newTitle,
        content: newContent,
        author: authorName,
      },
    ]);
    setNewTitle("");
    setNewContent("");
  };

  // Delete an article
  const handleDeleteArticle = async (id: string) => {
    if (!isAdmin) return;
    await deleteDoc(doc(db, "articles", id));
    setArticles(articles.filter((article) => article.id !== id));
  };

  // Update an article
  const handleUpdateArticle = async (
    id: string,
    updatedTitle: string,
    updatedContent: string
  ) => {
    if (!isAdmin) return;
    await updateDoc(doc(db, "articles", id), {
      title: updatedTitle,
      content: updatedContent,
    });

    setArticles(
      articles.map((article) =>
        article.id === id
          ? { ...article, title: updatedTitle, content: updatedContent }
          : article
      )
    );

    setEditingArticleId(null);
  };

  return (
    <div className="centered">
      <h1>Articles</h1>

      {/* List articles */}
      {articles.length > 0 ? (
        <ul className="centered">
          {articles.map((article) => (
            <li key={article.id} className="centered">
              <Link
                to={`/articles/${article.id}`}
                className="text-blue-600 hover:underline centered"
                style={{ display: "block", textAlign: "center" }}
              >
                {article.title}
              </Link>
              {/* Admin Controls */}
              {isAdmin && (
                <>
                  <button onClick={() => setEditingArticleId(article.id)}>
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles available.</p>
      )}

      {/* Admin: Create New Article */}
      {isAdmin && (
        <div className="article-form">
          <h2>Create New Article</h2>
          <h5> Articles have full (ish) HTML support</h5>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <br></br>
          <textarea
            placeholder="Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={10}
            cols={50}
            style={{ width: "100%", height: "200px" }}
          />
          <br></br>
          <button onClick={handleCreateArticle}>Create</button>
        </div>
      )}

      {/* Edit Mode */}
      {editingArticleId && (
        <div className="article-form">
          <h2>Edit Article</h2>
          <h5> Articles have full (ish) HTML support</h5>
          {articles.map(
            (article) =>
              article.id === editingArticleId && (
                <div key={article.id}>
                  <input
                    type="text"
                    value={article.title}
                    onChange={(e) =>
                      setArticles(
                        articles.map((a) =>
                          a.id === article.id
                            ? { ...a, title: e.target.value }
                            : a
                        )
                      )
                    }
                  />
                  <br></br>
                  <textarea
                    value={article.content}
                    onChange={(e) =>
                      setArticles(
                        articles.map((a) =>
                          a.id === article.id
                            ? { ...a, content: e.target.value }
                            : a
                        )
                      )
                    }
                    rows={10}
                    cols={50}
                    style={{ width: "100%", height: "200px" }}
                  />
                  <br></br>
                  <button
                    onClick={() =>
                      handleUpdateArticle(
                        article.id,
                        article.title,
                        article.content
                      )
                    }
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingArticleId(null)}>
                    Cancel
                  </button>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
