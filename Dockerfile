# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage using Nginx
FROM nginx:alpine

# Copy to root and subdirectory to support both local root access (http://localhost:8080)
# and subpath access (http://localhost:8080/IDBI-Hackathon-Project/) matching Vite base config.
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html/IDBI-Hackathon-Project

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
