"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
/* Import routes */
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const bahaBakuRoutes_1 = __importDefault(require("./routes/bahaBakuRoutes"));
const belanjaRoutes_1 = __importDefault(require("./routes/belanjaRoutes"));
const produkRoutes_1 = __importDefault(require("./routes/produkRoutes"));
const penjualanRoutes_1 = __importDefault(require("./routes/penjualanRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
/* Configuration */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use((0, morgan_1.default)('common'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
// Menyajikan file statis dari folder 'public'
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
/* Routes */
app.use('/dashboard', dashboardRoutes_1.default);
app.use('/category', categoryRoutes_1.default);
app.use('/bahan-baku', bahaBakuRoutes_1.default);
app.use('/belanja', belanjaRoutes_1.default);
app.use('/produk', produkRoutes_1.default);
app.use('/penjualan', penjualanRoutes_1.default);
/* Server */
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server Running on port ${port}`));
