import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import http from "http";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger/doc/swagger.json";
import MyJson from "./swagger/swagger.json"
import ServerResponse from "./utils/ServerResponse";
import router from "./routes";
config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.disable("x-powered-by");
// Swagger docs
// app.use("/api/v1/docs", swaggerUi.serve as RequestHandler, swaggerUi.setup(swaggerFile));
//@ts-expect-error
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(MyJson))
// :white_check_mark: App routes (must come before catch-all)
app.use("/api/v1", router);
// :x: Catch-all goes last
app.use("*", (req, res) => {
    return ServerResponse.error(res, "Route not found");
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});











