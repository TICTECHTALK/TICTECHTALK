import {useEffect, useState} from "react";
import Instance from "../../../util/axiosConfig";
import {useParams} from "react-router-dom";

export default function Comment() {
  const { postNo } = useParams();
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  console.log("Comment.jsx: ", postNo);

  useEffect(()=>{ //댓글 목록 가져오기
      fetchComments();
  },[postNo]);


  const fetchComments = () => {
      Instance.get(`/comments/list?postNo=${postNo}`)
          .then((response)=>{
              setComments(response.data);
              setCommentInput('');
          })
          .catch((error)=>{
              console.log(error);
          })
  }
    const handleInputChange = (e) => {
        setCommentInput(e.target.value); // 입력된 댓글 내용을 상태에 업데이트합니다.
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 댓글 작성 API를 호출하여 서버에 댓글을 전송합니다.
            const response = await Instance.post('/comments/write', {
                cmContent: commentInput,
                postNo: postNo
            }); // 댓글 작성 API 경로로 변경해야 합니다.
            console.log(response.data);
            const newComment = response.data; // 새로 작성된 댓글 데이터
            const updatedComments = [...comments, newComment]; // 기존 댓글 배열에 새로 작성된 댓글을 추가

            setComments(updatedComments); // 댓글 목록을 업데이트
            setCommentInput(''); // 입력 필드 초기화
            fetchComments();
        } catch (error) {
            console.error(error);
        }
    };

  return (
      <>
        {comments.length > 0 && comments.map((comment) => (
            <div className="commentBox roundedRectangle darkModeElement" key={comment.cmId}>
              <div className="comment">
                <div className="cmUpper">
                  <div className="cmInfo">
                    <div className="boardprofileImg"></div>
                    <div className="cmName">{comment.userNick}</div>
                    <div className="cmDate">{comment.cmDate}</div>
                  </div>
                  <div className="cmBtn">
                    <button className="cmDelete" onClick={()=>{
                        Instance.post(`/comments/delete/${comment.cmId}`)
                            .then(response => {
                               const commentDtoList = response.data;
                               console.log(commentDtoList);
                               fetchComments();
                            })
                            .catch((error)=>{
                                console.log(error);
                                alert(error);
                            })
                    }}>🗑️</button>
                    <button className="cmReply">↪️</button>
                    <button className="cmLikey">❤️</button>
                  </div>
                </div>
                <div className="cmContent">{comment.cmContent}</div>
              </div>
              {/*/!* 대댓글 데이터를 동적으로 표시하는 부분 *!/*/}
              {/*{comment.replies.map((reply) => (*/}
              {/*    <div className="comment replyCm" key={reply.id}>*/}
              {/*      <div className="cmUpper">*/}
              {/*        <div className="cmInfo">↪️</div>*/}
              {/*        <div className="boardprofileImg"></div>*/}
              {/*        <div className="cmName">{reply.username}</div>*/}
              {/*        <div className="cmDate">{reply.createdAt}</div>*/}
              {/*      </div>*/}
              {/*      <div className="cmBtn">*/}
              {/*        <button className="cmDelete">🗑️</button>*/}
              {/*        <button className="cmReply">↪️</button>*/}
              {/*        <button className="cmLikey">❤️</button>*/}
              {/*      </div>*/}
              {/*      <div className="cmContent">{reply.content}</div>*/}
              {/*    </div>*/}
              {/*))}*/}
            </div>
        ))}
        <div className="cmPage">{'< 1 2 3 4 5 >'}</div>
        <div className="cmWriteBox">
          <form className="cmWriteForm" onSubmit={handleSubmit}>
            <textarea
                className="darkModeElement"
                name='cmContent'
                value={commentInput}
                onChange={handleInputChange}
            ></textarea>
            <button type="submit" className="btnElement">
              WRITE
            </button>
          </form>
        </div>
      </>
  );
}
