import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import Instance from "../../../util/axiosConfig";

export default function BoardView() {
  const [forum, setForum] = useState(null);
  const { postNo } = useParams();

  useEffect(()=>{
    fetchPost(postNo);
  },[postNo]);

  const fetchPost = (postNo) => {
    Instance.get(`/boards/${postNo}`)
        .then((response)=>{
          console.log(response)
          setForum(response.data);
          console.log(response.data);
        })
        .catch((err)=>console.log(err));
  };

  if(!forum){
    return<div> Loading....</div>
  }

  return (
    <>
      <div className='boardViewBox roundedRectangle darkModeElement'>
        <div className='boardInfo'>
          <div className='boardProfile'>
            <div className='boardprofileImg'></div>
            {forum.userNick}
          </div>
          <div>{new Date(forum.postDate).toLocaleDateString()}</div>
          <div>{forum.views} view</div>
        </div>
        <div className='boardViewTitle'>
          <h1>{forum.title}</h1>
        </div>
        <div className='quoteLink'>
          참고링크 : <a href={`http://${forum.link}`} target="_blank" rel="noopener noreferrer">{forum.link}</a>
        </div>
        <div className='boardViewContent'>
          {forum.content}
        </div>
        <div className='boardViewImg'>
          {forum.storedFileName && <img src={`/upload/${forum.storedFileName}`} height="200" />}
        </div>
        <div className='btnBox'>
          <button className='listBtn btnElement'>
            <Link to='/boards/forum'>LIST</Link>
          </button>
          <button className='updateBtn btnElement'>UPDATE</button>
          <button className='deleteBtn btnElement'>DELETE</button>
          <button className='bookMarkBtn btnElement'>📥</button>
          <button className='shareBtn btnElement'>🔗</button>
        </div>
      </div>
    </>
  );
}
