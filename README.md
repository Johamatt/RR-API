# Geo API with NestJS & PostGIS
This application enables users to find the location information of places by utilizing spatial location search. The data can be retrieved for example, from [Overpass].

Android UI in progress here:
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

2. **Set Up Google OAuth**:
   - Create a Google OAuth Client ID (Web application) from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   - Add the Client ID to the `.env` file as `GOOGLE_CLIENT_ID=`.
  - in Front-end, add this value to res/values/developer-config.xml
  
3. **Configure JWT token**:
   - Define to`JWT_SECRET=` with any string value (random gen for prod).

4. **Configure SSL**:
    1. make self-signed certificate using openssl
    2. make cert folder in root and paste cert.pem and key.pem
    3. define .env values for paths:
    ```
    SSL_KEY_PATH=cert/key.pem
    SSL_CERT_PATH=cert/cert.pem
    ```
    In front-end, add this cert.pem to res/raw -folder
    
   [PostgreSQL]: <https://www.postgresql.org/download/>
   [Node]: <https://nodejs.org/en/download>
   [Overpass]: <https://overpass-turbo.eu/>
   [PostGIS]: <https://postgis.net/documentation/getting_started/#:~:text=CREATE%20EXTENSION%20postgis%3B>