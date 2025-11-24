import { Hono } from 'hono'
import { ProductController } from '@/controllers/product/ProductController';

const productRouter = new Hono();
const productController = new ProductController();

// Get all products
productRouter.get('/', async (c) => {
    try {
        const result = await productController.getAllProducts();
        return c.json(result, 200);
    } catch (error) {
        return c.json({ error: 'Failed to fetch products' }, 500);
    }
});

export { productRouter };