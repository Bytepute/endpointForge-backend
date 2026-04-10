# Product Requirement Document (PRD)
Endpoint Forge – MVP

## 1. Product Overview

Endpoint Forge is a desktop developer tool that allows frontend developers to simulate API endpoints locally. Developers can define endpoints, HTTP methods, and JSON responses, allowing applications to be tested without relying on real backend services.

The system runs a **local mock server** that exposes endpoints defined by the user.

Example:

Developer creates endpoint:

GET `/user/find-profile`

The tool automatically serves:

```  
http://localhost:4010/user/find-profile  
```  

Returning the configured JSON response.
  
---  

# 2. System Architecture

Stack:

Frontend
- React (Dashboard UI)

Backend
- NestJS

Database
- PostgreSQL

Future
- Electron wrapper

Architecture:

```  
React Dashboard  
       |       | HTTP       |NestJS API (Management API)  
       |       | DB       |PostgreSQL  
  
NestJS Mock Server  
       |       | serves       |localhost:4010/*  
```  

Important idea:

The backend has **two roles**

1. **Management API** (CRUD endpoints)
2. **Mock Server** (serves fake endpoints)

---  

# 3. Main Entities

We already defined a hierarchy:

```  
Project  
 ├─ Controllers │    ├─ Endpoints │    ├─ Endpoints │ ├─ Controllers      ├─ Endpoints```  
  
Example:  
  
```  
Weather App  
├─ /weather  │     ├─ GET /weather/current  │     └─ GET /weather/forecast  │  └─ /user        ├─ GET /user/profile        └─ POST /user/login```
  
---  

# 4. Database Design (PostgreSQL)

### Project

```  
id (uuid)  
name  
description  
created_at  
updated_at  
```  
  
---  

### Controller

```  
id (uuid)  
project_id (fk)  
name  
base_path  
created_at  
```  

Example:

```  
name: user  
base_path: /user  
```  
  
---  

### Endpoint

```  
id (uuid)  
controller_id (fk)  
  
method  
path  
  
status_code  
  
response_json (jsonb)  
  
delay_ms  
  
enabled (boolean)  
  
created_at  
```  

Example record:

```  
method: GET  
path: /profile  
status_code: 200  
delay_ms: 1000  
```  

Final route becomes:

```  
/user/profile  
```  
  
---  

# 5. Pages (Frontend)

Now the **dashboard UI structure**.
  
---  

# Page 1 — Projects List

Route

```  
/  
```  

Shows:

- list of projects
- create project button

Example UI

```  
+ Create Project  
  
Projects  
-------------------  
Weather App  
Ecommerce API  
Mobile Backend  
```  

Actions:

- Open project
- Delete project

API used:

```  
GET /projects  
POST /projects  
DELETE /projects/:id  
```  
  
---  

# Page 2 — Project Dashboard

Route

```  
/projects/:id  
```  

Shows:

- controllers
- endpoints summary
- mock server status

Example:

```  
Project: Weather App  
  
Controllers  
-----------------  
/user  
/weather  
/product  
  
Mock Server:  
RUNNING on localhost:4010  
```  

Actions:

- create controller
- start/stop mock server

APIs:

```  
GET /projects/:id  
POST /controllers  
DELETE /controllers/:id  
```  
  
---  

# Page 3 — Controller Page

Route

```  
/projects/:id/controllers/:controllerId  
```  

Shows endpoints inside controller.

Example:

```  
Controller: /user  
  
Endpoints  
------------------------  
GET  /user/profile  
POST /user/login  
PUT  /user/update  
```  

Actions:

- create endpoint
- edit endpoint
- delete endpoint

APIs:

```  
GET /controllers/:id/endpoints  
POST /endpoints  
PATCH /endpoints/:id  
DELETE /endpoints/:id  
```  
  
---  

# Page 4 — Endpoint Editor

Route

```  
/endpoints/:id  
```  

Main configuration page.

Fields:

Method

```  
GET  
POST  
PUT  
DELETE  
```  

Path

```  
/profile  
```  

Status code

```  
200  
404  
500  
```  

Response delay

```  
0 ms  
500 ms  
2000 ms  
```  

JSON Response editor

```  
{  
 "id": "{{uuid}}", "name": "{{name}}", "email": "{{email}}"}  
```  

Toggle

```  
Enabled / Disabled  
```  

API:

```  
GET /endpoints/:id  
PATCH /endpoints/:id  
```  
  
---  

# Page 5 — Mock Server Control

Could be inside project page.

Controls:

```  
Start Server  
Stop Server  
Port: 4010  
```  

API:

```  
POST /server/start  
POST /server/stop  
GET /server/status  
```  
  
---  

# 6. Backend APIs (Management API)

Projects

```  
GET    /projects  
POST   /projects  
GET    /projects/:id  
DELETE /projects/:id  
```  

Controllers

```  
POST   /controllers  
GET    /projects/:id/controllers  
DELETE /controllers/:id  
```  

Endpoints

```  
POST   /endpoints  
GET    /controllers/:id/endpoints  
GET    /endpoints/:id  
PATCH  /endpoints/:id  
DELETE /endpoints/:id  
```  

Server

```  
POST /server/start  
POST /server/stop  
GET  /server/status  
```  
  
---  

# 7. Mock Server Behavior

When server starts:

NestJS loads endpoints from DB.

Example endpoint record:

```  
method: GET  
path: /profile  
controller: /user  
```  

It registers:

```  
GET /user/profile  
```  

When request arrives:

```  
GET localhost:4010/user/profile  
```  

Flow:

1 Request received    
2 find endpoint in DB    
3 apply delay    
4 generate faker data    
5 return JSON
  
---  

# 8. Faker Data Processing

Example user JSON:

```  
{  
 "id": "{{uuid}}", "name": "{{name}}", "email": "{{email}}"}  
```  

Server replaces tokens using faker.

Result:

```  
{  
 "id": "b12d3f...", "name": "John Doe", "email": "john@email.com"}  
```  
  
---  

# 9. Error Simulation (Optional but Easy)

Endpoint config:

```  
status_code: 500  
```  

Response:

```  
{  
 "error": "Internal Server Error"}  
```  
  
---  

# 10. Port Configuration

Default

```  
localhost:4010  
```  

Later allow custom port.
  
---  

# 11. Folder Structure (Backend)

NestJS modules:

```  
src  
  
projects  
controllers  
endpoints  
mock-server  
  
database  
faker  
  
main.ts  
```  
  
---  

# 12. MVP Scope (Final)

Included:

✅ Projects    
✅ Controllers    
✅ Endpoints    
✅ JSON response    
✅ Faker tokens    
✅ Delay simulation    
✅ Enable/disable endpoints    
✅ Local server

Excluded:

❌ Webhooks    
❌ Teams    
❌ Auth    
❌ Cloud sync  