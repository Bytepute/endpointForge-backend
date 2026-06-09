# Business Requirement Document (BRD)

### **Refined Product Vision**

The **Endpoint Forge** is a desktop application (initially React web app, later Electron) that enables frontend  
developers to create and manage local mock APIs. The tool supports defining API endpoints, specifying HTTP methods, and  
providing custom JSON responses, including support for large JSON payloads. The application will allow projects to have  
specified controllers for different API endpoints. This allows developers to continue building and testing their  
applications even when external APIs are unavailable or unstable.

### **System Architecture**

The application will have a three-tier architecture:

1. **Frontend (React/Electron):** User interface for creating, managing, and running mock APIs. Communicates with the  
   backend API via HTTP requests.
2. **Backend (NestJS):** API server that receives requests from the frontend, manages API endpoint definitions, handles  
   response generation, and interacts with the database.
3. **Database (PostgreSQL):** Stores API definitions, project configurations, user accounts, and other application data.

**Components**

* **API Endpoint Manager:** Responsible for storing and retrieving API endpoint definitions from the database.
* **Response Generator:** Responsible for generating mock API responses based on endpoint definitions and user-defined  
  data.

### **API Endpoint Controller**

Each project can have its controller that manages all the routes. Example:

```  
/user/find-profile  (GET)  
/user/save-profile  (POST)  
/product/find-products (GET)  
...  
```  

### **MVP Features**

* Create Project
* Create Mock Endpoint (Route, Method, Response JSON)
* Support Large JSON Payloads (no size limit in the MVP, but we'll monitor and adjust later)
* Enable/Disable Endpoints
* Delete Endpoints
* Response Delay
* Create Controller inside Project
* Project persistence.

### **BRD – Business Requirements Document**

Here’s a detailed breakdown of the Business Requirements Document.

## **Business Requirements Document: Local API Mocker**

**1. Introduction**

**1.1. Purpose**

This document outlines the business requirements for the Local API Mocker, a tool designed to enable frontend developers  
to build and test applications without relying on external APIs. It details the problem statement, target users,  
functional and non-functional requirements, user stories, and success metrics.

**1.2. Scope**

This initial phase focuses on a desktop application (Electron) with a React web dashboard, backed by a NestJS API and a  
PostgreSQL database. The MVP features prioritize core functionality for creating, managing, and running mock APIs.

**2. Problem Statement**

Frontend developers often face challenges when developing applications:

* **API Unavailability:** External APIs may be temporarily or permanently unavailable, hindering development progress.
* **Development Cycles:** Waiting for backend APIs to be completed can significantly slow down the development  
  lifecycle.
* **Testing Scenarios:** Simulating various API responses, including error cases, latency, and specific data structures,  
  is often tedious.
* **Cost Concerns**: Third-party APIs might have costly usage tiers that hinder initial development.

**3. Target Users**

* Frontend Developers
* Fullstack Developers (for testing frontend components in isolation)
* QA Engineers

**4. Goals**

* Provide a fast and easy-to-use tool for creating mock APIs.
* Enable frontend developers to continue building and testing applications independently.
* Reduce development bottlenecks caused by API dependencies.

**5. Functional Requirements**

| Feature                      | Description                                                                                           | Priority |     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- | -------- | --- |
| **Project Management**       | Create, list, and manage projects.                                                                    | High     |     |
| **Endpoint Creation**        | Create API endpoints with a specified route, HTTP method (GET, POST, PUT, DELETE), and response JSON. | High     |     |
| **Response Definition**      | Define JSON responses with data types (string, number, boolean, array, object).                       | High     |     |
| **Data Simulation**          | Support generating random data using `faker.js` for various data types.                               | High     |     |
| **Large Payload Support**    | Support large JSON payloads without size restrictions.                                                | High     |     |
| **Response Delay**           | Add a delay to the response to simulate latency.                                                      | High     |     |
| **Endpoint Controller**      | Ability to define controllers for different API paths (e.g. `/user`, `/product`).                     | Medium   |     |
| **API Execution**            | Execute mock APIs locally and provide HTTP responses.                                                 | High     |     |
| **Enable/Disable Endpoints** | Enable and disable API endpoints individually.                                                        | Medium   |     |
| **Project Deletion**         | Delete projects and associated mock APIs.                                                             | Medium   |     |
| **Data Persistence**         | Store API definitions, project configurations, and user data in a PostgreSQL database.                | High     |     |
| **UI Preview**               | Provide a UI preview of mock responses.                                                               | High     |     |

**6. Non-Functional Requirements**

* **Performance:** Fast response times for API requests.
* **Security:** Secure storage of API definitions and user data.
* **Usability:** Intuitive and easy-to-use user interface.
* **Scalability:** The application should be scalable to support a growing number of projects and API endpoints.
* **Reliability:** The application should be reliable and prevent data loss.

**7. User Stories**

* As a frontend developer, I want to create a new project so that I can organize my mock APIs.
* As a frontend developer, I want to create an endpoint with a specific route and HTTP method so that I can simulate  
  different API calls.
* As a frontend developer, I want to define a JSON response for each endpoint so that I can control the data returned by  
  the mock API.
* As a frontend developer, I want to simulate data using `faker.js` so that I can test my application with realistic  
  data.
* As a frontend developer, I want to add a delay to the response so that I can test how my application handles latency.
* As a frontend developer, I want to delete projects or endpoints that are no longer needed.

**8. System Architecture Diagram**

```  
+-----------------+     +-----------------+     +-----------------+  
|   React/Electron | <--> |     NestJS API  | <--> |   PostgreSQL DB  |  
| (Frontend)      |     | (Backend)       |     | (Data Storage)  |  
+-----------------+     +-----------------+     +-----------------+  
```  


**9. Future Enhancements (Post-MVP)**

* Webhook Simulation
* API Documentation Generation
* Team Collaboration Features
* Advanced Data Manipulation Capabilities
* Support for other database types.  