# Geo Sport APP with NestJS & PostGIS
This application serves as the backend for a sports app that tracks users' workouts and helps them locate sports facilities across Finland through spatial location search.

Android UI:
https://github.com/Johamatt/RR-Android

## Prerequisites
- [Docker]
- [Node]
---

## Download data

1. Download data from https://www.lipas.fi/liikuntapaikat
2. Click left bottom corner icon (Luo excel raportti hakutuloksista)
3. Add all quick selections (Pikavalinnat)
4. Select GeoJSON from dropdown
5. Save it as places.geojson file and add it in project root folder

---

## Installation

```bash
$ git clone https://github.com/Johamatt/RR-API.git
$ cd sport-geo-api
```

## Running the app

- Rename **env.example** to **.env** and change the variable values to your liking (The default values will work, but some features may be limited without further configuration.)
- Start Nestjs application and database server:

```cmd
$ docker compose up --build
```
- Wait till application starts and run script:
```cmd
$ docker exec sport-geo-api-api-1 ts-node import-places.ts
```
- Access application on localhost:3000
- You are done 🔥

## Optional
 **Set Up Google OAuth**:
   - Create a Google OAuth Client ID (Web application) from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   - Add the Client ID to the `.env` file as `GOOGLE_CLIENT_ID=`.
  - in Front-end, add this value to res/values/developer-config.xml
  
   [Node]: <https://nodejs.org/en/download>
   [Docker]: <https://www.docker.com/products/docker-desktop/>
