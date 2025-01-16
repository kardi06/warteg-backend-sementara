import { Router } from 'express';
import { getBelanja, createBelanja, updateBelanja, deleteBelanja } from '../controllers/belanjaController';

const router = Router();

// GET: Retrieve Belanja with optional search filters
router.get('/', getBelanja);

// POST: Create a new Belanja
router.post('/', createBelanja);

// PUT: Update an existing Belanja by ID
router.put('/:id', updateBelanja);

// DELETE: Delete a Belanja by ID
router.delete('/:id', deleteBelanja);

export default router;
