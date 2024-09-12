import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Post.css";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"), //Gets the accesstoken value from the session storage, but should be stored in the cookies in the future
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
            id: response.data.id,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      axios.put(
        "http://localhost:3001/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Title:");
      axios.put(
        "http://localhost:3001/posts/postText",
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      setPostObject({ ...postObject, text: newPostText });
    }
  };

  return (
    <div className="postPage">
      <div className="top">
        <div
          className="title"
          onClick={() => {
            if (authState.username === postObject.username) editPost("title");
          }}
        >
          {postObject.title}
        </div>
        <div
          className="postText"
          onClick={() => {
            if (authState.username === postObject.username)
              editPost("postText");
          }}
        >
          {postObject.postText}
        </div>
        <div className="footer">
          {postObject.username}
          {authState.username === postObject.username && (
            <button
              onClick={() => {
                deletePost(postObject.id);
              }}
            >
              Delete Post
            </button>
          )}
        </div>
      </div>
      <div className="bottom">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="commentUserName">{comment.username}</div>
              <div className="commentBody">{comment.commentBody}</div>
              {authState.username === comment.username && (
                <button
                  onClick={() => {
                    deleteComment(comment.id);
                  }}
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;
