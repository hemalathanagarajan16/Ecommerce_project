# 🛍️ HEBA E-Commerce App

This is a modern **E-Commerce Web Application** built using **Angular**, designed to demonstrate scalable front-end architecture, responsive UI, and containerized deployment with **Docker**.

---

## 🚀 Features

- 🧩 **Modular Angular Architecture**
- 🛒 Product listing, cart, and checkout flow
- 🔍 Search and filtering functionality
- 📱 Fully responsive UI 
- ⚙️ Environment-based configuration (development/production)
- 🐳 Containerized using **Docker** for consistent builds
- ☁️ Deployed on **Vercel**
- 💻 Developed and tested using **GitHub Codespaces**

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend Framework | Angular |
| Styling | TailwindCSS / Angular Material |
| Package Manager | npm |
| Containerization | Docker |
| Cloud Deployment | Vercel |
| Development Environment | GitHub Codespaces |

---

## 🧰 Installation (Without Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/angular-ecommerce.git
   cd angular-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   ```
   http://localhost:4200
   ```

---

## 🐳 Running with Docker

This project includes a Docker setup to run the app inside a containerized environment.

### 1️⃣ Build the Docker image
```bash
docker build -t angular-ecommerce .
```

### 2️⃣ Run the container
```bash
docker run -p 8080:80 angular-ecommerce
```

### 3️⃣ Open in your browser
```
http://localhost:8080
```

---

## 📄 Dockerfile

Below is the Dockerfile used for this project (you can include this in your repo root):

```Dockerfile
# Stage 1: Build the Angular app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve the app with NGINX
FROM nginx:alpine
COPY --from=build /app/dist/angular-ecommerce /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 💻 Using GitHub Codespaces

You can develop directly in the cloud with **GitHub Codespaces**:
- No need to install Node.js or Angular CLI locally.
- Build, test, and run Docker containers in a pre-configured dev environment.

---

## ☁️ Deployment

The project is deployed on **Vercel** for fast and reliable hosting.

👉 [Live Demo](https://hebaecommerce-git-master-hemalathas-projects-4e5989bd.vercel.app/)

---

## 🧑‍💻 Author

**Hemalatha Nagarajan**  
💼 [LinkedIn](linkedin.com/in/hema-l-58059518a)  
🐙 [GitHub](https://github.com/hemalathanagarajan16)

---

## 🪪 License

This project is licensed under the **MIT License**.

---

### ⭐ If you like this project, give it a star on GitHub!
