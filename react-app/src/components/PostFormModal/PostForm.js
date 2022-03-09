import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import * as postActions from "../../store/post";
import { useDispatch, useSelector } from "react-redux";
import "./PostForm.css";
import { createPost } from "../../store/post";

function PostForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImage] = useState(null);
  const [errors, setErrors] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("caption", caption);
  //   formData.append("imageUrl", 'testing');
  //   await dispatch(createPost(formData))
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    let s3Url;
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", imageUrl);
    // console.log(formData.entries())

        setImageLoading(true);
        // const payload = {...formData.entries(), caption};
        const res = await fetch('/api/posts/upload', {
            method: "POST",
            body: formData
        });
        if (res.ok) {
            s3Url = await res.json();
            console.log('This is the S3 url:', s3Url)
            setImageLoading(false);
            history.push("/posts");
        }
        else {
            setImageLoading(false);
            console.log("error");
        }
    // return dispatch(
    //   postActions.createPost({
    //     caption,
    //     imageUrl: s3Url,
    //     user_id: sessionUser.id,
    //   })
    // )
    //   .then((data) => {
    //     history.push(`/`);
    //   })
    //   .catch(async (res) => {
    //     const data = await res.json();
    //     if (data && data.errors) setErrors(data.errors);
    //   });
  };

  const updateImage = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    setImage(file);
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>Create Post</h2>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <div className="image-input">
        <label htmlFor="image">
          <h3>Image</h3>
        </label>
        <input
          className={imageUrl ? "green" : "red"}
          type="file"
          accept="image/*"
          name="image"
          onChange={updateImage}
        />
      </div>

      <div className="content-input">
        <label htmlFor="caption">
          <h3>Caption</h3>
        </label>
        <textarea
          className="add-post-caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>
      </div>

      <button className="post-form-btn" type="submit">
        Post
      </button>
    </form>
  );
}

export default PostForm;
