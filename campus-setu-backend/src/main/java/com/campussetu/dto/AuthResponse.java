package com.campussetu.dto;

public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private String userId;
    private String email;
    private UserData user;

    public static class UserData {
        private String id;
        private String email;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public UserData getUser() { return user; }
    public void setUser(UserData user) { this.user = user; }
}
