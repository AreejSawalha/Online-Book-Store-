# Base Image for all services
FROM node:14 AS base

# Set working directory for base
WORKDIR /app

# Update packages and install SQLite3 (if you need SQLite)
RUN apt-get update -y && \
    apt-get install -y sqlite3

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install global dependencies
RUN npm install

# Catalog Service
FROM base AS catalog
WORKDIR /app/catalog
COPY ./catalog .  
RUN npm install    
EXPOSE 5001       
CMD ["npm", "run", "start-catalog"]  

# Order Service
FROM base AS order
WORKDIR /app/order
COPY ./order .    
RUN npm install   
EXPOSE 5002       
CMD ["npm", "run", "start-order"]   

# Frontend Service
FROM base AS client
WORKDIR /app/frontend
COPY ./frontend .  
RUN npm install    
EXPOSE 3000       
CMD ["npm", "run", "start-client"]  
