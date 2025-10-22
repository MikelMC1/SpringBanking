package com.example.demo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetUserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String password;
    private Date createDate;
    private Date updateDate;
    private List<GetAccountDto> accounts;
}
