package com.teamsync.common;

public final class CompanyContext {

    private static final ThreadLocal<String> CURRENT_COMPANY_ID = new ThreadLocal<>();

    private CompanyContext() {
    }

    public static void setCompanyId(String companyId) {
        CURRENT_COMPANY_ID.set(companyId);
    }

    public static String getCompanyId() {
        return CURRENT_COMPANY_ID.get();
    }

    public static void clear() {
        CURRENT_COMPANY_ID.remove();
    }
}

