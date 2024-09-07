# Geo API with NestJS & PostGIS
This application enables users to find the location information of sport places in Finland by utilizing spatial location search.

Android UI:
https://github.com/Johamatt/RR-Android

## Prerequisites
- [PostgreSQL] running locally initialized with [PostGIS] -extension
- [Node] installed on your machine

---

## Download data

1. Download data from https://www.lipas.fi/liikuntapaikat
2. Click left bottom corner icon (Luo excel raportti hakutuloksista)
3. Add all quick selections (Pikavalinnat)
4. Select GeoJSON from dropdown
5. Save it as places.geojson file and add it in project root folder
6. Run script in helpers -folder.

---

## Installation

```bash
$ git clone https://github.com/Johamatt/RR-API.git
$ cd sport-geo-api
$ npm install
```

## Setting Up the Application

1. **Create the .env File**:
   - Add the necessary `DATABASE_****` values as specified in `/src/app.module.ts`.

2. **Configure JWT token**:
   - Define to`JWT_SECRET=` with any string value.

3. **Set Up Google OAuth (optional..)**:
   - Create a Google OAuth Client ID (Web application) from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   - Add the Client ID to the `.env` file as `GOOGLE_CLIENT_ID=`.
  - in Front-end, add this value to res/values/developer-config.xml
  

    
   [PostgreSQL]: <https://www.postgresql.org/download/>
   [Node]: <https://nodejs.org/en/download>
   [PostGIS]: <https://postgis.net/documentation/getting_started/#:~:text=CREATE%20EXTENSION%20postgis%3B>
