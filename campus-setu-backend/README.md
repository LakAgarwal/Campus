# Campus SETU – Spring Boot Backend

Backend for Campus SETU: Spring Boot 3, PostgreSQL, JWT auth.

## Requirements

- Java 17+
- Maven
- PostgreSQL

## Setup

1. **Create PostgreSQL database**
   ```bash
   createdb campus_setu
   ```

2. **Configure** `src/main/resources/application.yml` (or env):
   - `spring.datasource.url`: `jdbc:postgresql://localhost:5432/campus_setu`
   - `spring.datasource.username` / `spring.datasource.password`
   - `jwt.secret`: secret for JWT (min 256 bits for HS256)
   - `app.cors-origins`: frontend origin (e.g. `http://localhost:5173`)

3. **Run**
   ```bash
   ./mvnw spring-boot:run
   ```
   API base: **http://localhost:8080/api**

## API overview

- **Auth**: `POST /auth/register`, `POST /auth/login`, `GET /auth/session` (Bearer)
- **Club**: `POST /club-auth/login`
- **Admin**: `POST /admin-auth/login`
- **Profiles**: `GET/PATCH /profiles`, `GET /profiles/{id}/optional`, `GET/POST /profiles/{id}/preferences`
- **Events**: `GET/POST /events`, `GET /events/{id}`, `POST /events/{id}/register`
- **Openings**: `GET/POST /openings`, `GET /openings/{id}/members`, `POST /openings/{id}/join`
- **Resources**: `GET/POST /resources`
- **Lost/Found**: `GET/POST /lost-found/lost`, `GET/POST /lost-found/found`
- **Volunteering**: `GET/POST /volunteering-events`
- **Newsletters**: `GET/POST/DELETE /newsletters`

JWT is required for protected routes (except auth/club/admin login). Send header: `Authorization: Bearer <token>`.

## Database

Schema is created/updated by Hibernate (`ddl-auto: update`). For production use `validate` or Flyway/Liquibase.
