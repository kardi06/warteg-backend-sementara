import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

/* Import routes */
import categoryRoutes from './routes/categoryRoutes';
import bahanBakuRoutes from './routes/bahaBakuRoutes';
import belanjaRoutes from './routes/belanjaRoutes';
import produkRoutes from './routes/produkRoutes';
import penjualanRoutes from './routes/penjualanRoutes';
import dashboardRoutes from './routes/dashboardRoutes';


/* Configuration */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Menyajikan file statis dari folder 'public'
app.use('/public', express.static(path.join(__dirname, '../public')));

/* Routes */
app.use('/dashboard', dashboardRoutes);
app.use('/category', categoryRoutes);
app.use('/bahan-baku', bahanBakuRoutes);
app.use('/belanja', belanjaRoutes);
app.use('/produk', produkRoutes);
app.use('/penjualan', penjualanRoutes);

/* Server */
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server Running on port ${port}`));