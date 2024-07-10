# Geo API with NestJS & PostGIS
This application enables users to find the location information of places by utilizing spatial location search. The data can be retrieved for example, from [Overpass].

Android UI in progress here:
https://github.com/Johamatt/RR-Android

## Prerequisites
- [PostgreSQL] running locally initialized with [PostGIS] -extension
- [Node] installed on your machine

---

## Download data

 1. While [Overpass] API does not support exporting large datasets, this tool simplifies the process of exporting smaller GeoJSON data. To use this tool, you'll need to construct queries that specify nodes, as the app exclusively supports only Point data. Here is an example of a valid query for ~5000 nodes:

```
[out:json][timeout:60];
area["ISO3166-1"="FI"]->.finland;
(
  node["natural"~"peak|water|wood|beach|cliff|waterfall"](area.finland);
);
out body;
>;
out skel qt;
```


2. Export results as places.geojson file and add it in project root folder

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