package com.example.backend.Payload;

import lombok.Data;

import java.util.List;

@Data
public class TemplateResponse {
    private List<String> images;
    private String caption;
}
