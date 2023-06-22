package com.demo.login.studylogin.dto;

import com.demo.login.studylogin.domain.boards.ReCmEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReCmDTO {

    private Long recmId; // 대댓글 번호(pk)
    private String recmContent; //대댓글 내용
    private LocalDateTime recmDate; // 대댓글 작성 시간

    private Long cmId; // 대댓글 달린 댓글 번호

    private Long userNo;
    private String userNick;

    public static ReCmDTO toReCmDTO(ReCmEntity reCmEntity, Long cmId) {
        ReCmDTO recmDTO = new ReCmDTO();

        recmDTO.setRecmId(reCmEntity.getRecmId());
        recmDTO.setRecmContent(reCmEntity.getRecmContent());
        recmDTO.setRecmDate(reCmEntity.getRecmDate());
        recmDTO.setCmId(cmId);
        recmDTO.setUserNo(reCmEntity.getUserEntity().getUserNo());
        recmDTO.setUserNick(reCmEntity.getUserEntity().getUserNick());

        return recmDTO;
    }
}
