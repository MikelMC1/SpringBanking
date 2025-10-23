package com.example.demo.dtos;
import com.example.demo.enums.AccountTypes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAccountDto {
    private Long accountId;
    private BigDecimal balance;
    private Date lastUpdate;
    private AccountTypes accountType;
}
