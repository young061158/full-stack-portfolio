package com.winti.backend.show.showdetails.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class QrController {

    @GetMapping("/generateQRCode")
    public ResponseEntity<byte[]> generateQRCode(
            @RequestParam("date") String date,
            @RequestParam("title") String title,
            @RequestParam("count") int count,
            @RequestParam("price") String price,
            @RequestParam("seat") String seat,
            @RequestParam("purchaser") String purchaser) throws WriterException, IOException {

        // 티켓 정보를 쿼리 파라미터로 포함한 URL 생성
        String url = String.format("http://localhost:8080/ticket-info?date=%s&title=%s&count=%d&price=%s&seat=%s&purchaser=%s",
                URLEncoder.encode(date, StandardCharsets.UTF_8.toString()),
                URLEncoder.encode(title, StandardCharsets.UTF_8.toString()),
                count,
                URLEncoder.encode(price, StandardCharsets.UTF_8.toString()),
                URLEncoder.encode(seat, StandardCharsets.UTF_8.toString()),
                URLEncoder.encode(purchaser, StandardCharsets.UTF_8.toString()));

        int width = 200;
        int height = 200;

        BitMatrix bitMatrix = new MultiFormatWriter().encode(url, BarcodeFormat.QR_CODE, width, height);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        byte[] qrCodeBytes = outputStream.toByteArray();

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCodeBytes);
    }

    // 티켓 정보 반환 메소드
    @GetMapping("/ticket-info")
    public ResponseEntity<TicketInfo> getTicketInfo(
            @RequestParam String date,
            @RequestParam String title,
            @RequestParam int count,
            @RequestParam String price,
            @RequestParam String seat,
            @RequestParam String purchaser) {

        TicketInfo ticketInfo = new TicketInfo(date, title, count, price, seat, purchaser);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(ticketInfo);
    }

    // 티켓 정보 클래스
    static class TicketInfo {
        private String date;
        private String title;
        private int count;
        private String price;
        private String seat;
        private String purchaser;

        public TicketInfo(String date, String title, int count, String price, String seat, String purchaser) {
            this.date = date;
            this.title = title;
            this.count = count;
            this.price = price;
            this.seat = seat;
            this.purchaser = purchaser;
        }

        // Getters and Setters
        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public String getPrice() {
            return price;
        }

        public void setPrice(String price) {
            this.price = price;
        }

        public String getSeat() {
            return seat;
        }

        public void setSeat(String seat) {
            this.seat = seat;
        }

        public String getPurchaser() {
            return purchaser;
        }

        public void setPurchaser(String purchaser) {
            this.purchaser = purchaser;
        }
    }
}
