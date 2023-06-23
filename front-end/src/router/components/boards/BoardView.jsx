import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import Instance from "../../../util/axiosConfig";

export default function BoardView() {
  console.log('jemejfalkdsj')
  const postNo = useLocation().pathname.split('/')[3];
  //
  const [forum, setForum] = useState(null);
  // const { postNo } = useParams();

  useEffect(()=>{
    fetchPost(postNo);
  },[postNo]);

  const fetchPost = (postNo) => {
    console.log(postNo)
    Instance.get(`/boards/detail/${postNo}`)
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
      <div class='boardViewBox roundedRectangle darkModeElement'>
        <div class='boardInfo'>
          <div class='boardProfile'>
            <div class='boardprofileImg'></div>
            {forum.userNick}
          </div>
          <div>{new Date(forum.postDate).toLocaleDateString()}</div>
          <div>{forum.views} view</div>
        </div>
        <div class='boardViewTitle'>
          <h1>{forum.title}</h1>
        </div>
        <div class='quoteLink'>
          참고링크 : <a href={`http://${forum.link}`} target="_blank" rel="noopener noreferrer">{forum.link}</a>
        </div>
        <div class='boardViewContent'>
          {forum.content}
        </div>
        <div className='boardViewImg'>
          {forum.storedFileName && <img src={`/upload/${forum.storedFileName}`} height="200" />}
        </div>
        <div class='btnBox'>
          <button class='listBtn btnElement'>
            <Link to='/boards/forum'>LIST</Link>
          </button>
          <button class='updateBtn btnElement'>UPDATE</button>
          <button class='deleteBtn btnElement'>DELETE</button>
          <button class='bookMarkBtn btnElement'>📥</button>
          <button class='shareBtn btnElement'>🔗</button>
        </div>
      </div>
    </>
  );
}
