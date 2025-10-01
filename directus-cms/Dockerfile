# Use the official Directus image as base
FROM directus/directus:latest

# Set working directory
WORKDIR /directus

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create directories for database and uploads
RUN mkdir -p /directus/database /directus/uploads

# Expose port
EXPOSE 8055

# Start the application
CMD ["npm", "start"]