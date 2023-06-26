import {Link, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import Instance from "../../../util/axiosConfig";
import {useDispatch} from "react-redux";

export default function BoardView() {
  const [forum, setForum] = useState({});
  const { postNo } = useParams();
  ////////////////////
  const navigate = useNavigate()
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
        Instance.get(`/boards/update/${forum.postNo}`)
            .then(response => {
                console.log(response);
                navigate(`/boards/update/${forum.postNo}`)
            })
            .catch(error => {
                // 응답이 실패한 경우
                if (error.response && error.response.status === 401) {
                    // 수정 권한이 없는 경우
                    alert(error.response.data);
                } else {
                    // 기타 오류 처리
                    console.log(error);
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
