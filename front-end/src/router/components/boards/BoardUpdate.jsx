import {useLocation, useNavigate, useParams} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Instance from '../../../util/axiosConfig';
import {useEffect, useState} from 'react';


export default function BoardUpdate() {
    const { postNo } = useParams();
    const navigate = useNavigate();
    const [boardData, setBoardData] = useState({
        category: '',
        title: '',
        content: '',
        link: '',
        storedFileName: ''
    });

    useEffect(() => {
        Instance.get(`/boards/update/${postNo}`)
            .then((response)=>{
                const data  = response.data;
                setBoardData(data);
            })
            .catch((error)=>{
                console.error(error);
            })
    }, []);


    const onSubmit = () => {
        Instance.post(`/boards/update`, boardData)
            .then(response => {
                const data = response.data;
                // setBoardData(data);
                alert("글 수정이 완료되었습니다.");
                navigate(`/boards/${data}`);
            })
            .catch(error => {
                console.error(error);
            });
    };

    /* 수정 시 파일 첨부 공사중 ing...
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // 선택된 파일을 서버로 업로드
        uploadFile(file)
            .then((response) => {
                // 파일 업로드가 성공한 경우, 업로드된 파일의 정보를 업데이트
                const updatedBoardData = {
                    ...boardData,
                    storedFileName: response.data.fileName
                };

                setBoardData(updatedBoardData);
            })
            .catch((error) => {
                // 파일 업로드가 실패한 경우, 에러 처리
                console.error('파일 업로드 에러:', error);
            });
    };

    // 파일을 서버로 업로드하는 함수
    const uploadFile = (file) => {
        // FormData를 사용하여 파일 데이터 전송
        const formData = new FormData();
        formData.append('file', file);

        // 파일 업로드를 위한 API 요청
        return Instance.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };
    */

    return (
        <div className="boardWriteBox roundedRectangle darkModeElement">
            <form className="boardWriteForm" encType="multipart/form-data" >
                <input
                    type='text'
                    name='category'
                    className='hideElement'
                    defaultValue={boardData.category}
                    readOnly
                />
                <input
                    className="darkModeElement"
                    type="text"
                    name="title"
                    value={boardData.title}
                    onChange={event=> setBoardData({...boardData, title: event.target.value})}
                />
                <textarea
                    className="darkModeElement"
                    name="content"
                    cols="30"
                    rows="30"
                    value={boardData.content}
                    onChange={event=> setBoardData({...boardData, content: event.target.value})}
                ></textarea>
                <input
                    className="darkModeElement"
                    type="text"
                    name="link"
                    value={boardData.link}
                    onChange={event=> setBoardData({...boardData, link: event.target.value})}
                />
                {/*<div className='boardViewImg'>*/}
                {/*    {boardData.storedFileName && (*/}
                {/*        <div>*/}
                {/*            <img src={`/upload/${boardData.storedFileName}`} height="200" />*/}
                {/*            <input type="file" onChange={handleFileChange} />*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*</div>*/}
                <button type="button" className="btnElement" onClick={onSubmit}>
                    UPDATE
                </button>
            </form>
        </div>
    );
}