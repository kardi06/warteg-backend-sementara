import { Router } from 'express';
import { getProduk, createProduk, updateProduk, deleteProduk } from '../controllers/produkController';

const router = Router();

// GET: Retrieve Belanja with optional search filters
router.get('/', getProduk);

// POST: Create a new Belanja
router.post('/', createProduk);

// PUT: Update an existing Belanja by ID
router.put('/:id', updateProduk);

// DELETE: Delete a Belanja by ID
router.delete('/:id', deleteProduk);

export default router;