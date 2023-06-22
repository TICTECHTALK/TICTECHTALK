package com.demo.login.studylogin.service;

import com.demo.login.studylogin.domain.boards.Board;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.BoardDto;
import com.demo.login.studylogin.repository.BoardRepository;
import com.demo.login.studylogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;


    //게시글 조회
    @Transactional
    public List<BoardDto> findAll() {
        List<Board> boardList = boardRepository.findAll();

        List<BoardDto> boardDTOList = new ArrayList<>();

        // entity -> DTO
        for(Board board : boardList){
            boardDTOList.add(BoardDto.toBoardDTO(board));
        }
        return boardDTOList;
    }

    @Transactional
    public Page<BoardDto> paging(Pageable pageable) {
        int page = pageable.getPageNumber() - 1;
        int pageSize = pageable.getPageSize();

        Page<Board> boardEntities = boardRepository.findAll(PageRequest.of(page , pageSize, Sort.by(Sort.Direction.DESC, "PostNo")));

        Page<BoardDto> boardDTOS = boardEntities.map(board-> new BoardDto(
                board.getPostNo(),
                board.getUserEntity().getUserNick(),
                board.getTitle(),
                board.getViews(),
                board.getPostDate()
        ));

        return boardDTOS;
    }

    //게시글 상세 보기
    @Transactional
    public BoardDto findById(Long postNo) {
        Optional<Board> optionalBoardEntity = boardRepository.findById(postNo);
        Board board = optionalBoardEntity.get();
        BoardDto boardDTO = BoardDto.toBoardDTO(board);

        return boardDTO;
    }

    //게시글 쓰기
    public Long save(BoardDto boardDTO) throws IOException {
        Optional<User> optionalUserEntity = userRepository.findById(boardDTO.getUserNo());
        if(boardDTO.getBoardFile() == null){ //파일이 없을 때
            User userEntity = optionalUserEntity.get();
            Board board = Board.toSaveEntity(boardDTO, userEntity);
            Board savedEntity = boardRepository.save(board);

            return savedEntity.getPostNo();
        }else { //첨부 파일 있음
            /*
                1. DTO에 담긴 파일을 꺼냄
                2. 파일의 이름을 가져옴
                3. 서버 저장용 이름을 만듦
                4. 저장경로에 설정
                5. 해당 경로에 파일 저장
                6. board_table에 해당 데이터  save처리
             */
            MultipartFile boardFile = boardDTO.getBoardFile(); // 1.
            String originalFilename = boardFile.getOriginalFilename(); //2. 실제 사용자가 올린 파일 이름
            String storedFilename = System.currentTimeMillis() + "_" + originalFilename; // 3.
            String savePath = "C:/projectdemo2_img/"+storedFilename; // 4.
            boardFile.transferTo(new File(savePath)); // 5.

            User userEntity = optionalUserEntity.get();
            Board board = Board.toSaveFileEntity(boardDTO, storedFilename, userEntity); //6.
            Board savedEntity = boardRepository.save(board);

            return savedEntity.getPostNo();
        }
    }

    //게시글 수정
    public BoardDto update(BoardDto boardDTO) throws IOException {
        Optional<User> optionalUserEntity = userRepository.findById(boardDTO.getUserNo());

        if(boardDTO.getBoardFile() != null){ //파일 있을 때
            User userEntity = optionalUserEntity.get();
            Board board = Board.toUpdateFileEntity(boardDTO, userEntity); // 6
            boardRepository.save(board);

            return findById(boardDTO.getPostNo());
        }else { //파일 없을 때
            User userEntity = optionalUserEntity.get();
            Board board = Board.toUpdateEntity(boardDTO, userEntity);
            boardRepository.save(board); //update쿼리 수행

            return findById(boardDTO.getPostNo());
        }

    }

    public BoardDto findByIdAndUserEntity(Long postNo, User userEntity) {
        Optional<Board> optionalBoardEntity = boardRepository.findByPostNoAndUserEntity(postNo, userEntity);
        if(optionalBoardEntity.isPresent()){
            Board board = optionalBoardEntity.get();
            BoardDto boardDTO = BoardDto.toBoardDTO(board);
            return boardDTO;
        }else {
            return null;
        }
    }

    //게시글 삭제
    public void delete(Long postNo) {
        boardRepository.deleteById(postNo);
    }

    //게시글 조회수
    @Transactional
    public void updateViews(Long postNo) {
        boardRepository.updateViews(postNo);
    }


    //검색 기능 공사중...ing...
//    public Page<BoardDTO> forumSearch(String searchKeyword, Pageable pageable) {
//
//        int page = pageable.getPageNumber() -1 ;
//        int pageLimit = 5; // 한 페이지에 보여줄 글 갯수
//        Page<BoardEntity> boardEntities = boardRepository.findByTitleContaining(searchKeyword, PageRequest.of(page, pageLimit, Sort.by(Sort.Direction.DESC,"postNo")));
//
//        Page<BoardDTO> boardDTOS = boardEntities.map(board-> new BoardDTO(board.getPostNo(), board.getTitle(), board.getViews(), board.getPostDate()));
//
//        return boardDTOS;
//    }

}
