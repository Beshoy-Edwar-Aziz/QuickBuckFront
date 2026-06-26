💼 QuickBuck

A full-stack job-seeking web platform designed to bridge the gap between fresh graduates and job providers, giving early-career candidates a wider reach in the competitive Egyptian job market.

🔗 Frontend: github.com/Beshoy-Edwar-Aziz/QuickBuckFront
🔗 Backend: github.com/Beshoy-Edwar-Aziz/QuickBuckProject


🎓 This was my graduation project at Helwan University, Faculty of Commerce — Business Information Systems (2024).




📸 Screenshots


<img width="1910" height="2733" alt="screencapture-localhost-4200-Home-2024-06-22-03_32_28" src="https://github.com/user-attachments/assets/84548c51-a8ea-47c2-9a09-a220b6dd1afa" />
<img width="1910" height="2166" alt="screencapture-localhost-4200-UserProfile-20-2024-06-22-03_34_07" src="https://github.com/user-attachments/assets/e33f879c-8ea1-409a-b7f8-cd3e70744b99" />
<img width="1910" height="3081" alt="screencapture-localhost-4200-LandingPage-2024-06-22-03_29_13" src="https://github.com/user-attachments/assets/14743498-f7a6-4520-ad45-9411308cd135" />




✨ Features


👔 Job seekers can create profiles and apply to job listings
🏢 Job providers can post opportunities and manage applicants
💬 Real-time chat between job seekers and job providers via SignalR
💳 In-app payments powered by Stripe
📋 Sleek form design using Angular Material
📱 Fully responsive layout with Bootstrap 5



🛠️ Tech Stack

Frontend

CategoryTechnologyFrameworkAngular v17LanguageTypeScriptUI LibraryAngular MaterialStylingBootstrap 5Real-timeSignalR (Angular integration)PaymentsStripe

Backend

CategoryTechnologyFramework.NET Core 6ORMEntity Framework CoreQueryLINQReal-timeSignalRArchitectureRepository Pattern + Unit of WorkDatabaseSQL Server


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
