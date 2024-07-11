import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from "axios";
import './Post.css';
function Post() {
    let {id} = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("")

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
          setPostObject(response.data);
          });

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
          setComments(response.data);
        });
    }, []);

    const addComment = () => {
      axios
      .post("http://localhost:3001/comments", {commentBody: newComment, PostId: id})
      .then((response) => {
        const commentToAdd ={commentBody: newComment}
        setComments([...comments, commentToAdd])
        setNewComment("")
      })
    }

  return (
    <div className="postPage">
      <div className="top">
        <div className="title">
          {postObject.title}
        </div>
        <div className="postText">
          {postObject.postText}
        </div>
        <div className="footer">
          {postObject.username}
        </div>
      </div>
      <div className="bottom">
        <div className="addCommentContainer">
          <input type="text" 
          placeholder="Comment..." 
          value={newComment}
          onChange={(event) => {setNewComment(event.target.value)} } /> {/* Holds value while typing*/}
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return <div key={key} className="comment"> {comment.commentBody} </div>
          })} 
        </div>
      </div>
    </div>
  )
}

export default Post