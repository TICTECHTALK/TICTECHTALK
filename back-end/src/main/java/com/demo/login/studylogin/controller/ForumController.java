package com.demo.login.studylogin.controller;



import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.BoardDTO;
import com.demo.login.studylogin.dto.CommentDTO;
import com.demo.login.studylogin.dto.UserDto;
import com.demo.login.studylogin.repository.UserRepository;
import com.demo.login.studylogin.service.BoardService;
import com.demo.login.studylogin.service.CommentService;
import com.demo.login.studylogin.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Optional;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/boards")
public class ForumController {
    private final JwtTokenUtil jwtTokenUtil;
    private final BoardService boardService;
    private final CommentService commentService;
    private final UserRepository userRepository;

    //게시판 페이징 목록
    @GetMapping("/forum")
    public ResponseEntity<?> findAllForum(
            @PageableDefault(page = 0, size = 10, sort = "postNo", direction = Sort.Direction.DESC) Pageable pageable,
            HttpServletRequest request
    ) {
        //토큰에서 userNo 추출
        Long userNo = jwtTokenUtil.getUserNoFromToken(request);

        //사용자 인증 여부 확인
        if(userNo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Page<BoardDTO> boardDTOList = boardService.paging(pageable);
        return ResponseEntity.ok(boardDTOList);
    }

    //상세 보기
    @GetMapping("/{postNo}")
    public ResponseEntity<?> findById(@PathVariable Long postNo, HttpServletRequest request){
        //토큰에서 userNo를 추출
        Long userNo = jwtTokenUtil.getUserNoFromToken(request);

        //사용자 인증 여부 확인
        if(userNo == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        // 조회수 처리
        boardService.updateViews(postNo);

        BoardDTO boardDTO = boardService.findById(postNo);

        //댓글 목록 가져오기
        List<CommentDTO> commentDTOList = commentService.findAll(postNo);

        return ResponseEntity.ok(boardDTO);
    }

    //글쓰기
    @PostMapping(value = "/write")
    public ResponseEntity<?> write(@RequestBody BoardDTO boardDTO, HttpServletRequest request) throws IOException {
        //토큰에서 userNo를 추출
        Long userNo = jwtTokenUtil.getUserNoFromToken(request);

        //사용자 인증 여부 확인
        if(userNo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        Optional<User> optionalUser = userRepository.findById(userNo);
        if(optionalUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 정보를 찾을 수 없습니다.");
        }

        User user = optionalUser.get();
        String userNick = user.getUserNick();

        boardDTO.setUserNo(userNo);
        boardDTO.setUserNick(userNick);

        Long postNo = boardService.save(boardDTO);
        return ResponseEntity.ok(postNo);
    }

    //수정 Form
    @GetMapping("/update/{postNo}")
    public ResponseEntity<?> updateForm(@PathVariable Long postNo, HttpServletRequest request){
        Long userNo = jwtTokenUtil.getUserNoFromToken(request);

        User userEntity = userRepository.findById(userNo).orElse(null);

        BoardDTO boardDTO = boardService.findByIdAndUserEntity(postNo, userEntity);

        if(boardDTO != null) {
            return ResponseEntity.ok().body(boardDTO);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("수정 권한이 없습니다.");
        }
    }

    //수정 Proc
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody BoardDTO boardDTO) throws IOException {
        //폼에서 userNo 히든으로 처리할 것 !
        BoardDTO board = boardService.update(boardDTO);

        List<CommentDTO> commentDTOList = commentService.findAll(board.getPostNo());

        return ResponseEntity.ok(board.getPostNo());
    }

    //게시글 삭제
    @PostMapping("/delete/{postNo}")
    public ResponseEntity<?> delete(@PathVariable Long postNo, HttpServletRequest request){
        Long userNo = jwtTokenUtil.getUserNoFromToken(request);

        BoardDTO boardDTO = boardService.findById(postNo);

        if(boardDTO != null && boardDTO.getUserNo().equals(userNo)) { //권한 있을 때
            boardService.delete(postNo);
            return ResponseEntity.ok("게시물이 삭제되었습니다.");
        }else { //권한이 없을땐
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("삭제 권한이 없습니다.");
        }
    }
}
