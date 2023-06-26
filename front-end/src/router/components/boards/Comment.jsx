import {useEffect, useState} from "react";
import Instance from "../../../util/axiosConfig";
import {useParams} from "react-router-dom";

export default function Comment() {
  const { postNo } = useParams();
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(()=>{ //댓글 목록 가져오기
      fetchComments(currentPage);
  },[currentPage,postNo]);


   const fetchComments = (page) => {
      Instance.get(`/comments/list?page=${page-1}&postNo=${postNo}`)
          .then((response)=>{
              setComments(response.data.content);
              setCommentInput('');
              setTotalPages(response.data.totalPages);
          })
          .catch((error)=>{
              console.log(error);
          })
   }

   const handlePageChange = (page) => {
      setCurrentPage(page);
   };

    const handleInputChange = (e) => {
        setCommentInput(e.target.value); // 입력된 댓글 내용을 상태에 업데이트합니다.
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Instance.post('/comments/write', {
                cmContent: commentInput,
                postNo: postNo
            }); // 댓글 작성 API 경로로 변경해야 합니다.

            const newComment = response.data; // 새로 작성된 댓글 데이터
            const updatedComments = [...comments, newComment]; // 기존 댓글 배열에 새로 작성된 댓글을 추가

            setComments(updatedComments); // 댓글 목록을 업데이트
            setCommentInput(''); // 입력 필드 초기화
            fetchComments(currentPage);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteComment = (cmId) => {
        Instance.post(`/comments/delete/${cmId}`)
            .then(response => {
                console.log(response.data);
                const updatedComments = comments.filter((comment)=> comment.cmId !== cmId);
                setComments(updatedComments);
                if(updatedComments.length === 1 && currentPage > 1) {
                    setCurrentPage((prePage)=>prePage-1);
                }

                fetchComments(currentPage);
            })
            .catch((error)=>{
                console.log(error);
                alert(error);
            })
    }
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
                    <button className="cmDelete" onClick={()=>handleDeleteComment(comment.cmId)}>🗑️</button>
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
        <div className="cmPage">
            {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter((page) => Math.abs(page - currentPage) <= 2)
                .map((page) => (
                    <button
                        key={page}
                        className={page === currentPage ? 'active' : ''}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
        </div>
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
