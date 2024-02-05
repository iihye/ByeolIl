package com.stella.stella.common.S3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class S3Controller {

    @Autowired
    private final S3Service s3Service;

    private final AmazonS3Client amazonS3Client;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @PostMapping(value ="/upload", consumes = "multipart/form-data")
    public ResponseEntity<String> uploadFile
            (@RequestPart(value="requestDto") TestDto testDto,
             @RequestPart(value = "files",required = false) MultipartFile[] files)
    {
        try {
            log.info(testDto.toString());
            if(files!=null)
                for(MultipartFile file: files){
                    log.info(s3Service.saveFile(file));
                }
            return ResponseEntity.ok("success");
        } catch (IOException e) {
            log.debug(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/download")
    public ResponseEntity<UrlResource> downloadFile(@RequestParam("fileName") String fileName) {
        UrlResource urlResource = new UrlResource(amazonS3.getUrl(bucket, fileName));
        String contentDisposition = "attachment; filename=\"" + fileName + "\"";
        // header에 CONTENT_DISPOSITION 설정을 통해 클릭 시 다운로드 진행
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(urlResource);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteFile(@RequestParam("fileName")String fileName){
        HttpStatus status = HttpStatus.OK;
        String message="success";
        try{
            s3Service.deleteFile(fileName);
        }catch(Exception e){
            status = HttpStatus.BAD_REQUEST;
            message=e.getMessage();
        }
        return ResponseEntity.status(status).body(message);
    }
}