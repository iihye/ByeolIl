package com.stella.stella.radio.controller;

import com.stella.stella.board.dto.ResultResponseDto;
import com.stella.stella.radio.dto.RadioCreateRequestDto;
import com.stella.stella.radio.dto.RadioResponseDto;
import com.stella.stella.radio.service.RadioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/radio")
@RequiredArgsConstructor
public class RadioController {

    private final RadioService radioService;

    @PostMapping
    public ResponseEntity<ResultResponseDto> radioAdd(@RequestBody  RadioCreateRequestDto radioCreateRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            radioService.addRadio(radioCreateRequestDto);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = e.getMessage();
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = e.getMessage();
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }

    @GetMapping("/{memberIndex}")
    public ResponseEntity<RadioResponseDto> radioDetails(@PathVariable Long memberIndex){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        RadioResponseDto radioResponseDto =null;
        try {
            radioResponseDto =  radioService.findRadio(memberIndex);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = e.getMessage();
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = e.getMessage();
        }
        System.out.println(message);
        return ResponseEntity.status(status).body(radioResponseDto);
    }
    @PostMapping("/toss")
    public ResponseEntity<ResultResponseDto> radioToss(@RequestBody RadioCreateRequestDto radioCreateRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            radioService.tossRadio(radioCreateRequestDto);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = e.getMessage();
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = e.getMessage();
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }
}

