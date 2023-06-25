import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import Instance from "../../../util/axiosConfig";
import {useDispatch} from "react-redux";

export default function BoardView() {
  const [forum, setForum] = useState({});
  const { postNo } = useParams();
  ////////////////////
  const dispatch = useDispatch();

  ////////////////////
  useEffect(()=>{
    fetchPost(postNo);
  },[postNo]);

  const fetchPost = (postNo) => {
    Instance.get(`/boards/${postNo}`)
        .then((response)=>{
          setForum(response.data);
        })
        .catch((error)=>{
            console.log(error);
        });
  };

    const handleUpdateClick = () => {
        Instance.get(`/boards/update/${postNo}`)
            .then((response) => {
                console.log(response.data);
                // 게시글 작성자와 로그인한 사용자가 같은 경우에만 수정 폼으로 이동
                if (response.status === 200) {
                    alert(response.data); // 성공 메시지 또는 다른 처리
                    window.location.href = `/boards/update/${postNo}`;
                }
            })
            .catch((error) => {
               if(error.response && error.response.status === 401) {
                   alert ("수정 권한이 없습니다.");
               }
            });
    };

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
          <button className='updateBtn btnElement' onClick={handleUpdateClick}>
            UPDATE
          </button>
          <button className='deleteBtn btnElement' onClick={()=>{
            Instance.post(`/boards/delete/${forum.postNo}`)
                .then(response => {
                  if (response.status === 200) {
                    console.log(response.status);
                    alert(response.data); // 수정된 부분
                    window.location.href = '/boards/forum';
                  } else if (response.status === 401 || !response) { // 여기에서 변경
                    console.log(response?.status || 401); // 여기에서 변경
                    alert(response?.data || "삭제 권한이 없습니다."); // 여기에서 변경
                  } else {
                    alert("게시글 삭제에 실패했습니다.");
                  }
                })
                .catch((error) => {
                  console.log(error);
                  alert(error);
                });
          }}>DELETE</button>
          <button className='bookMarkBtn btnElement'>📥</button>
          <button className='shareBtn btnElement'>🔗</button>
        </div>
      </div>
    </>
  );
}
