package com.stella.stella.common.S3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.stella.stella.member.dto.MemberLoginRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class S3Controller {

    @Autowired
    private final S3Service s3Service;

    private final AmazonS3Client amazonS3Client;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @PostMapping(value ="/upload",consumes
//            = "multipart/form-data")
            = {MediaType.APPLICATION_JSON_VALUE,MediaType.IMAGE_PNG_VALUE})
    public ResponseEntity<String> uploadFile
    (@RequestPart("requestDto") String memberLoginRequestDto
            , @RequestPart(value = "file",required = false) MultipartFile file)
    {
        try {
            log.info(memberLoginRequestDto.toString());
            return ResponseEntity.ok(s3Service.saveFile(file));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/download")
    public ResponseEntity<UrlResource> downloadImage(@RequestParam("name") String originalFilename) {
        UrlResource urlResource = new UrlResource(amazonS3.getUrl(bucket, originalFilename));

        String contentDisposition = "attachment; filename=\"" + originalFilename + "\"";

        // header에 CONTENT_DISPOSITION 설정을 통해 클릭 시 다운로드 진행
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(urlResource);
    }

//    @GetMapping("/download")
//    public ResponseEntity<byte[]> getObject(String storedFileName) throws IOException{
//        S3Object o = amazonS3.getObject(new GetObjectRequest(bucket, storedFileName));
//        S3ObjectInputStream objectInputStream = o.getObjectContent();
//        byte[] bytes = IOUtils.toByteArray(objectInputStream);
//
//        String fileName = URLEncoder.encode(storedFileName, "UTF-8").replaceAll("\\+", "%20");
//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//        httpHeaders.setContentLength(bytes.length);
//        httpHeaders.setContentDispositionFormData("attachment", fileName);
//
//        return new ResponseEntity<>(bytes, httpHeaders, HttpStatus.OK);
//    }
}