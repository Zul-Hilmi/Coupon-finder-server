"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const userModel_1 = require("./api/models/userModel");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const clientError_1 = __importDefault(require("./config/ClientError"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send("Hello express typescript");
});
const userRoute_1 = __importDefault(require("./api/routes/userRoute"));
app.use('/user', userRoute_1.default);
const couponRoute_1 = __importDefault(require("./api/routes/couponRoute"));
app.use('/coupon', couponRoute_1.default);
app.post("/test", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const user:IUser = req.body
    // await new User(user).save()
    // const {email,password}:{email:string,password:string} = req.body
    // const user = await User.login(email,password)
    const user = yield userModel_1.User.findById("dsds");
    res.send(user);
})));
app.all("*", (req, res) => { throw new clientError_1.default(404); });
app.use(errorHandler_1.default);
app.listen(process.env.PORT, () => {
    console.log("Server started");
});
