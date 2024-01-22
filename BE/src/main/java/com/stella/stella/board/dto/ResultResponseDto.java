package com.stella.stella.board.dto;

import java.util.HashMap;
import java.util.Map;

public class ResultResponseDto {
    private Map<String, String> map = new HashMap<>();

    public ResultResponseDto(String str){
        map.put("response",str);
    }
}
