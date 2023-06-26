package com.demo.login.studylogin.service;


import com.demo.login.studylogin.domain.boards.Comment;
import com.demo.login.studylogin.domain.boards.ReCm;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.ReCmDto;
import com.demo.login.studylogin.repository.CommentRepository;
import com.demo.login.studylogin.repository.ReCmRepository;
import com.demo.login.studylogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReCmService {
    private final ReCmRepository recmRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Transactional
    public Long save(ReCmDto recmDTO) {
        Optional<Comment> optionalCommentEntity = commentRepository.findById(recmDTO.getCmId());

        if(optionalCommentEntity.isPresent()){
            Optional<User> optionalUserEntity = userRepository.findById(recmDTO.getUserNo());
            User userEntity = optionalUserEntity.get();
            Comment comment = optionalCommentEntity.get();
            ReCm recm = ReCm.toSaveEntity(recmDTO, comment, userEntity);
            return recmRepository.save(recm).getRecmId();
        }else {
            return null;
        }
    }

    @Transactional
    public List<ReCmDto> findAll(Long cmId) {
        Comment comment = commentRepository.findById(cmId).get();
        List<ReCm> reCmList = recmRepository.findByCommentOrderByRecmIdDesc(comment);

        List<ReCmDto> reCmDtoList = new ArrayList<>();

        for(ReCm reCm : reCmList){
            ReCmDto reCmDTO = ReCmDto.toReCmDTO(reCm,cmId);
            reCmDtoList.add(reCmDTO);
        }
        return reCmDtoList;
    }

    @Transactional
    public ReCmDto findbyId(Long recmId) {
        Optional<ReCm> optionalRecmEntity = recmRepository.findById(recmId);
        if(optionalRecmEntity.isPresent()){
            ReCm recm = optionalRecmEntity.get();
            Long cmId = recm.getComment().getCmId();
            return ReCmDto.toReCmDTO(recm, cmId);
        }else {
            return null;
        }
    }

    @Transactional
    public void delete(Long recmId) {
        recmRepository.deleteById(recmId);
    }

}
