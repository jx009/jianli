FROM node:18-slim

# Install dependencies for Puppeteer (Chromium) and Chinese fonts
# fonts-noto-cjk: Google Noto CJK (Comprehensive Chinese/Japanese/Korean support)
# fonts-wqy-zenhei: WenQuanYi Zen Hei (Good fallback)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    chromium \
    fonts-noto-cjk \
    fonts-wqy-zenhei \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Skip local Chromium download since we installed it globally
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
# Generate Prisma Client before start
RUN npx prisma generate
CMD ["npm", "start"]

