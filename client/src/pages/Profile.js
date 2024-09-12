import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import "./Profile.css";

function Profile() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/users/basicinfo/${id}`)
      .then((response) => {
        setUsername(response.data.username);
      });

    axios.get(`http://localhost:3001/posts/byuserid/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  // alllows the enlargment of the post through hovering the body
  useEffect(() => {
    const posts = document.querySelectorAll(".post");

    posts.forEach((post) => {
      const body = post.querySelector(".body");

      body.addEventListener("mouseover", () => {
        post.classList.add("hovered");
      });

      body.addEventListener("mouseout", () => {
        post.classList.remove("hovered");
      });
    });

    // Cleanup event listeners on component unmount
    return () => {
      posts.forEach((post) => {
        const body = post.querySelector(".body");

        body.removeEventListener("mouseover", () => {
          post.classList.add("hovered");
        });

        body.removeEventListener("mouseout", () => {
          post.classList.remove("hovered");
        });
      });
    };
  }, [listOfPosts]);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>{username}'s Profile</h1>
        {authState.username === username && (
          <button
            onClick={() => {
              navigate("/changepassword");
            }}
          >
            Change password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title">{value.title}</div>
              <div
                className="body"
                onClick={() => navigate(`/post/${value.id}`)}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  <label>Likes: {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
