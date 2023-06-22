package com.demo.login.studylogin.dto;

import com.demo.login.studylogin.domain.boards.ReCm;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReCmDto {

    private Long recmId; // 대댓글 번호(pk)
    private String recmContent; //대댓글 내용
    private LocalDateTime recmDate; // 대댓글 작성 시간

    private Long cmId; // 대댓글 달린 댓글 번호

    private Long userNo;
    private String userNick;

    public static ReCmDto toReCmDTO(ReCm reCm, Long cmId) {
        ReCmDto recmDTO = new ReCmDto();

        recmDTO.setRecmId(reCm.getRecmId());
        recmDTO.setRecmContent(reCm.getRecmContent());
        recmDTO.setRecmDate(reCm.getRecmDate());
        recmDTO.setCmId(cmId);
        recmDTO.setUserNo(reCm.getUserEntity().getUserNo());
        recmDTO.setUserNick(reCm.getUserEntity().getUserNick());

        return recmDTO;
    }
}
