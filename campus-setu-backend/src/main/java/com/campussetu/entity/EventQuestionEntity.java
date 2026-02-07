package com.campussetu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "event_questions")
public class EventQuestionEntity {

    @Id
    @Column(name = "question_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer questionId;

    @Column(name = "event_id", nullable = false)
    private Integer eventId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    public Integer getQuestionId() { return questionId; }
    public void setQuestionId(Integer questionId) { this.questionId = questionId; }
    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
