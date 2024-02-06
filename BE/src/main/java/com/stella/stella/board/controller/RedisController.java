package com.stella.stella.board.controller;

import com.stella.stella.board.dto.HeartRequestDto;
import com.stella.stella.board.service.HeartService;
import com.stella.stella.common.dto.BasicResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/redis")
@RequiredArgsConstructor
public class RedisController {
    private final HeartService heartService;

    @PostMapping("/heartadd")
    public ResponseEntity<Object> heartAdd(@RequestBody HeartRequestDto heartRequestDto){
//        heartService.addHeartToRedis(heartRequestDto);

        BasicResponseDto basicResponse = BasicResponseDto.builder()
                .message("success")
                .count(0)
                .build();

        return ResponseEntity.ok(basicResponse);
    }

    @GetMapping("/heart/mysql")
    public void heartUpdate(){
        heartService.transferRedisToMySQL();
    }

    @GetMapping("/heart/redis")
    public void heartUpdateMySQLToRedis() { heartService.transferMySQLToRedis();}

//    @PostMapping("/test")
//    public ResponseEntity<?> addRedisKey(){
//        ValueOperations<String, String> vop = redisTemplate.opsForValue();
//        vop.set("yellow", "banana");
//        vop.set("red", "apple");
//        return new ResponseEntity<>(HttpStatus.CREATED);
//    }
//
//    @GetMapping("/{key}")
//    public ResponseEntity<?> getRedisKey(@PathVariable String key){
//        ValueOperations<String, String> vop = redisTemplate.opsForValue();
//        String value = vop.get(key);
//        return new ResponseEntity<>(value, HttpStatus.OK);
//    }
}
