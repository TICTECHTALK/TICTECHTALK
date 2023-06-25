package com.demo.login.studylogin.controller;

import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.CommentDto;
import com.demo.login.studylogin.dto.ReCmDto;
import com.demo.login.studylogin.repository.UserRepository;
import com.demo.login.studylogin.service.CommentService;
import com.demo.login.studylogin.service.ReCmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {
    private final CommentService commentService;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;
    private final ReCmService recmService;

    //댓글 조회
    @GetMapping("/list")
    public  ResponseEntity<List<CommentDto>> findAllByPostNo(@RequestParam Long postNo){
        List<CommentDto> commentDtoList = commentService.findAll(postNo);

        return ResponseEntity.ok(commentDtoList);

    }

    //댓글 작성
    @PostMapping("/write")
    public ResponseEntity save(@RequestBody CommentDto commentDTO, HttpServletRequest request) {
        //토큰에서 userNo 추출
        Long userNo = jwtTokenUtil.getUserNoFromToken(request);

        Optional<User> optionalUser = userRepository.findById(userNo);

        User user = optionalUser.get();
        String userNick = user.getUserNick();

        commentDTO.setUserNo(userNo);
        commentDTO.setUserNick(userNick);

        commentService.save(commentDTO);

        return ResponseEntity.ok().body("댓글이 작성되었습니다.");
    }

    //댓글 삭제
    @PostMapping("/delete/{cmId}")
    public ResponseEntity delete(@PathVariable Long cmId, HttpServletRequest request) {
        Long userNo = jwtTokenUtil.getUserNoFromToken(request);

        CommentDto commentDTO = commentService.findById(cmId);

        if(userNo.equals(commentDTO.getUserNo())) {
            commentService.delete(cmId);
            List<CommentDto> commentDtoList = commentService.findAll(commentDTO.getPostNo());
            return new ResponseEntity<>(commentDtoList, HttpStatus.OK);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("삭제 권한이 없습니다.");
        }
    }

    //대댓글 작성
    @PostMapping("/reply/{cmId}")
    public ResponseEntity save(@RequestBody ReCmDto recmDTO, @PathVariable Long cmId, HttpServletRequest request) {
        Long userNo = jwtTokenUtil.getUserNoFromToken(request);

        Optional<User> optionalUser = userRepository.findById(userNo);

        User user = optionalUser.get();
        String userNick = user.getUserNick();

        recmDTO.setUserNo(userNo);
        recmDTO.setUserNick(userNick);

        recmService.save(recmDTO);
        List<ReCmDto> recmDtoList = recmService.findAll(cmId);
        return new ResponseEntity<>(recmDtoList, HttpStatus.OK);

    }

    //대댓글 삭제
    @PostMapping("/reply/delete/{recmId}")
    public ResponseEntity replydelete(@PathVariable Long recmId, HttpServletRequest request){
        Long userNo = jwtTokenUtil.getUserNoFromToken(request);

        ReCmDto recmDTO = recmService.findbyId(recmId);

        if(userNo.equals(recmDTO.getUserNo())){
            recmService.delete(recmId);
            List<ReCmDto> recmDtoList = recmService.findAll(recmDTO.getCmId());
            return new ResponseEntity<>(recmDtoList, HttpStatus.OK);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("삭제 권한이 없습니다.");
        }
    }

    ////////////////////////////////////////////
    @PostMapping(value = "/{cmId}/like")
    public ResponseEntity<?> saveLike(@PathVariable Long cmId) {
        return commentService.saveLike(cmId);
    }

    @PostMapping(value = "/{cmId}/disLike")
    public ResponseEntity<?> disLike(@PathVariable Long cmId) {
        return commentService.disLike(cmId);
    }

    @GetMapping(value = "/{cmId}")
    public ResponseEntity<CommentDto> getComment(@PathVariable Long cmId) {
        return commentService.getComment(cmId);
    }
    ////////////////////////////////////////////

}
