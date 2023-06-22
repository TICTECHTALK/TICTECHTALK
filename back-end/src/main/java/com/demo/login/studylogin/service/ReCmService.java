package com.demo.login.studylogin.service;


import com.demo.login.studylogin.domain.boards.CommentEntity;
import com.demo.login.studylogin.domain.boards.ReCmEntity;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.ReCmDTO;
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
    public Long save(ReCmDTO recmDTO) {
        Optional<CommentEntity> optionalCommentEntity = commentRepository.findById(recmDTO.getCmId());
        log.info("recmDTO.getRecmContent()"+recmDTO.getRecmContent());
        if(optionalCommentEntity.isPresent()){
            Optional<User> optionalUserEntity = userRepository.findById(recmDTO.getUserNo());
            User userEntity = optionalUserEntity.get();
            CommentEntity commentEntity = optionalCommentEntity.get();
            ReCmEntity recmEntity = ReCmEntity.toSaveEntity(recmDTO, commentEntity, userEntity);
            return recmRepository.save(recmEntity).getRecmId();
        }else {
            return null;
        }
    }

    @Transactional
    public List<ReCmDTO> findAll(Long cmId) {
        CommentEntity commentEntity = commentRepository.findById(cmId).get();
        List<ReCmEntity> reCmEntityList = recmRepository.findByCommentEntityOrderByRecmIdDesc(commentEntity);

        List<ReCmDTO> reCmDTOList = new ArrayList<>();

        for(ReCmEntity reCmEntity : reCmEntityList){
            ReCmDTO reCmDTO = ReCmDTO.toReCmDTO(reCmEntity,cmId);
            reCmDTOList.add(reCmDTO);
        }
        return reCmDTOList;
    }

    @Transactional
    public ReCmDTO findbyId(Long recmId) {
        Optional<ReCmEntity> optionalRecmEntity = recmRepository.findById(recmId);
        if(optionalRecmEntity.isPresent()){
            ReCmEntity recmEntity = optionalRecmEntity.get();
            Long cmId = recmEntity.getCommentEntity().getCmId();
            return ReCmDTO.toReCmDTO(recmEntity, cmId);
        }else {
            return null;
        }
    }

    @Transactional
    public void delete(Long recmId) {
        recmRepository.deleteById(recmId);
    }
}
