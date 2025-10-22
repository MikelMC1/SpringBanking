package com.example.demo.enums;

public enum LoanStatus {
    PENDING_APPROVAL,  // Loan has been created but not yet approved
    ACTIVE,            // Loan is approved and active
    PAID_OFF,          // Loan has been fully repaid
    DEFAULTED          // Loan is overdue or defaulted
}
