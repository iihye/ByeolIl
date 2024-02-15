package com.stella.stella.common.email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@Component
public class Aes256 {
    @Value("${aes256.secret}")
    private String secretKey; // 32자리 비밀키
    @Value("${aes256.iv}")
    private String iv; // 16자리 iv

    // 암호화
    public String encrypt(String text) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE,
                    new SecretKeySpec(secretKey.getBytes(), "AES"),
                    new IvParameterSpec(iv.getBytes()));
            return new String(Base64.getEncoder().encode(cipher.doFinal(text.getBytes("UTF-8"))));
        } catch(Exception e) {
            return text;
        }
    }

    // 복호화
    public String decrypt(String encryptedText) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE,
                    new SecretKeySpec(secretKey.getBytes(), "AES"),
                    new IvParameterSpec(iv.getBytes()));

            return new String(cipher.doFinal(Base64.getDecoder().decode(encryptedText.getBytes("UTF-8"))));
        } catch(Exception e) {
            return encryptedText;
        }
    }
}