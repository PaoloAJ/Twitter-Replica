import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);

  const likePost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] }; // Add extra like (0) in order to utilize an optimistic approach
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: [...post.Likes] };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id != postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };
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
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="title">{value.title}</div>
            <div className="body" onClick={() => navigate(`/post/${value.id}`)}>
              {value.postText}
            </div>
            <div className="footer">
              {value.username}
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => {
                    likePost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikedBttn" : "likeBttn"
                  }
                />
              </div>
              <label> {value.Likes.length}</label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
