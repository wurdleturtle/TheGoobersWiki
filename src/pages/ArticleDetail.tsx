import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// Define Article Type
interface Article {
  title: string;
  content: string;
  author: string;
}

const ArticleDetail = () => {
  const { id } = useParams(); // Get article ID from URL
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      const docRef = doc(db, "articles", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setArticle(docSnap.data() as Article);
      }
    };

    fetchArticle();
  }, [id]);

  if (!article) return <p className="centered">Loading...</p>;

  return (
    <div className="centered">
      <h1>{article.title}</h1>
      {/* Render HTML content */}
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
      <p>
        <small>By: {article.author}</small>
      </p>
      <button
        onClick={() => window.history.back()}
        className="text-blue-600 hover:underline"
      >
        Back to Articles
      </button>
    </div>
  );
};

export default ArticleDetail;
