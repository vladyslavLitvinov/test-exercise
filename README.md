# test-exercise
A Json API for adverticements.

# Before start
Run: npm i

# How to start
Start server without docker: npm start

Start unit tests: npm test test.js

# Routs
Available routs:
 - Find many adverticements with pagination:
    Method: GET,
    URL: /adverticements,
    Body: { 
        page: number, 
        sort?: { 
            price?: "asc" | "desc", 
            date?: "asc" | "desc" 
        } 
    };
 - Fing one adverticement:
    Method: GET,
    URL: /adverticements/:id,
    Params: {
        id: string
    },
    Body: {
        fields?: string[]
    };
 - Create an adverticement:
    Method: POST,
    URL: /adverticements,
    Body: {
        name: string (length < 200),
        description: string (length < 1000),
        photos: string[] (0 < length <= 3),
        price: number,
    };

# Docker
Building: 
 docker-compose build

Running:
 docker-compose up -d

Get logs:
 docker-compose logs -f
