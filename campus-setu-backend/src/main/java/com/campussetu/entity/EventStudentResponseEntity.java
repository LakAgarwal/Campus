package com.campussetu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "event_student_responses")
public class EventStudentResponseEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "question_id", nullable = false)
    private Integer questionId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String response;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Integer getQuestionId() { return questionId; }
    public void setQuestionId(Integer questionId) { this.questionId = questionId; }
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
}
