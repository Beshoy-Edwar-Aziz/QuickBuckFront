💼 QuickBuck

A full-stack job-seeking web platform designed to bridge the gap between fresh graduates and job providers, giving early-career candidates a wider reach in the competitive Egyptian job market.

🔗 Frontend: github.com/Beshoy-Edwar-Aziz/QuickBuckFront
🔗 Backend: github.com/Beshoy-Edwar-Aziz/QuickBuckProject


🎓 This was my graduation project at Helwan University, Faculty of Commerce — Business Information Systems (2024).




📸 Screenshots


<img width="1910" height="3081" alt="screencapture-localhost-4200-LandingPage-2024-06-22-03_29_13" src="https://github.com/user-attachments/assets/0c53a14b-d92c-427e-ad02-fbf66497ade0" />
<img width="1910" height="2733" alt="screencapture-localhost-4200-Home-2024-06-22-03_32_28" src="https://github.com/user-attachments/assets/bf38f333-7e5e-4810-bef2-f1d9c5427208" />
<img width="1912" height="936" alt="Screenshot 2024-06-22 034755" src="https://github.com/user-attachments/assets/11a6b2ec-83f8-4ceb-b22a-54b7f490b661" />
<img width="1913" height="935" alt="Screenshot 2024-06-22 034045" src="https://github.com/user-attachments/assets/1ff89aa3-9d88-4e78-ba1d-50add6e3a9dd" />
<img width="1910" height="2166" alt="screencapture-localhost-4200-UserProfile-20-2024-06-22-03_34_07" src="https://github.com/user-attachments/assets/5b4e0860-a1a4-4aeb-bb7b-a87d1a60ddd9" />





✨ Features


👔 Job seekers can create profiles and apply to job listings
🏢 Job providers can post opportunities and manage applicants
💬 Real-time chat between job seekers and job providers via SignalR
💳 In-app payments powered by Stripe
📋 Sleek form design using Angular Material
📱 Fully responsive layout with Bootstrap 5



🛠️ Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | Angular v17 |
| Language | TypeScript |
| UI Library | Angular Material |
| Styling | Bootstrap 5 |
| Real-time | SignalR (Angular integration) |
| Payments | Stripe |

### Backend

| Category | Technology |
|---|---|
| Framework | .NET Core 6 |
| ORM | Entity Framework Core |
| Query | LINQ |
| Real-time | SignalR |
| Architecture | Repository Pattern + Unit of Work |
| Database | SQL Server |

🏗️ Architecture Highlights

Frontend


Control Flow Syntax — uses Angular v17's @if and @for for cleaner templates
Angular Material — used for form components, dialogs, and UI consistency
SignalR Integration — real-time bidirectional communication between users
Stripe Integration — secure in-app payment processing


Backend


Repository Pattern — abstracts data access logic for maintainability
Unit of Work — ensures transactional consistency across repositories
Entity Framework Core — code-first database management
LINQ — expressive, strongly-typed data querying
SignalR Hub — manages real-time connections and message broadcasting



💡 Problem Statement

Fresh graduates and undergraduates in Egypt face significant challenges standing out in a crowded job market. QuickBuck was built to solve this by creating a dedicated platform that focuses on early-career talent, providing them with tools to showcase their skills and connect directly with job providers — removing the noise of traditional job boards.


📦 Getting Started

Frontend

Prerequisites


Node.js v18+
Angular CLI v17


bash# Clone the frontend repository
git clone https://github.com/Beshoy-Edwar-Aziz/QuickBuckFront.git

# Navigate to project
cd QuickBuckFront

# Install dependencies
npm install

# Run development server
ng serve

Backend

Prerequisites


.NET 6 SDK
SQL Server


bash# Clone the backend repository
git clone https://github.com/Beshoy-Edwar-Aziz/QuickBuckProject.git

# Navigate to project
cd QuickBuckProject

# Restore packages
dotnet restore

# Apply migrations
dotnet ef database update

# Run the API
dotnet run


⚙️ Make sure to update the connection string in appsettings.json before running.




👤 Author

Beshoy Edwar Aziz


Portfolio: beshoy-edwar-aziz.github.io/Portfolio
GitHub: @Beshoy-Edwar-Aziz
LinkedIn: linkedin.com/in/beshoy-salama-ba734427b
