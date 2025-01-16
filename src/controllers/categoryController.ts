import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategory = async (req: Request, res: Response): Promise<void> => {
    try{
        const search = req.query.search?.toString();
        const category = await prisma.category.findMany({
            where: {
                categoryName:{
                    contains: search,
                    mode: 'insensitive'
                }
            }
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Error Receiving Category" })
    }
}

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try{
        const {categoryId, categoryName} = req.body;
        const category = await prisma.category.create({
            data:{
                categoryId,
                categoryName,
            }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error Creating Category" })
    }
}

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;

        const updatedCategory = await prisma.category.update({
            where: {
                categoryId: id,
            },
            data: {
                categoryName,
            },
        });

        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Error Updating Category" });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.category.delete({
            where: {
                categoryId: id,
            },
        });

        res.status(200).json({ message: "Category Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error Deleting Category" });
    }
};