package com.stella.stella.common.dto;

import java.util.Map;

import lombok.Builder;

@Builder
public class ResultResponseDto {
	private Map<String,Object> resultMap;
}
