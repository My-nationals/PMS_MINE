import swaggerAutogen from "swagger-autogen";

const swaggerAutogenInstance = swaggerAutogen();

const doc = {
    info: {
        title: "My API",
        description: "Description",
    },
    host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["./path/userRoutes.ts", "./path/bookRoutes.ts"]; // Use `.ts` if your routes are in TypeScript

swaggerAutogenInstance(outputFile, routes, doc);
