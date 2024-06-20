import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();


// Middleware to parse JSON request bodies
app.use(express.json());

app.use(cors());

// Create a new ingredient
app.post('/api/ingredients', async (req: Request, res: Response) => {
  try {
    const { name, quantity, unit } = req.body;

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        quantity,
        unit,
      },
    });

    res.json(ingredient);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Create a new recipe
app.post('/api/recipes', async (req: Request, res: Response) => {
  try {
    const { name, description, cookingInstructions, price, quantity, ingredients } = req.body;

    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        cookingInstructions,
        price,
        quantity,
        ingredients: {
          create: ingredients,
        },
      },
      include: {
        ingredients: true,
      },
    });

    res.json(recipe);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Create a new customer
app.post('/api/customers', async (req: Request, res: Response) => {
  try {
    const { name, email, address, mobileNumber} = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        address,
        mobileNumber,
      },
    });

    res.json(customer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
// Create a new order
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { customerId, recipeId, quantity } = req.body;

    const order = await prisma.order.create({
      data: {
        customer: { connect: { id: customerId } },
        recipe: { connect: { id: recipeId } },
        quantity,
      },
    });

    res.json(order);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
// Get all ingredients
app.get('/api/ingredients', async (req: Request, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany();

    res.json(ingredients);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Get all recipes
app.get('/api/recipes', async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany();

    res.json(recipes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Get a specific recipe by ID
app.get('/api/recipes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) },
      include: { ingredients: true },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Update a recipe by ID
app.put('/api/recipes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, cookingInstructions,price, quantity, ingredients } = req.body;

    const updatedRecipe = await prisma.recipe.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        cookingInstructions,
        price,
        quantity,
        ingredients: {
          deleteMany: {},
          create: ingredients,
        },
      },
      include: { ingredients: true },
    });

    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Delete a recipe by ID
app.delete('/api/recipes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedRecipe = await prisma.recipe.delete({
      where: { id: parseInt(id) },
    });

    res.json(deletedRecipe);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Delete an ingredient by ID
app.delete('/api/ingredients/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedIngredient = await prisma.ingredient.delete({
      where: { id: parseInt(id) },
    });

    res.json(deletedIngredient);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Update an ingredient by ID
app.put('/api/ingredients/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, quantity, unit } = req.body;

    const updatedIngredient = await prisma.ingredient.update({
      where: { id: parseInt(id) },
      data: {
        name,
        quantity,
        unit,
      },
    });

    res.json(updatedIngredient);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
            