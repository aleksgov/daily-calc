// database.js
import * as SQLite from 'expo-sqlite';

let db = null;

async function getDbConnection() {
    if (db) {
        return db;
    }
    db = await SQLite.openDatabaseAsync('foods.db');
    return db;
}


export async function initDatabase() {
    const database = await getDbConnection();

    await database.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS product_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS diet_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS meal_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      calories REAL NOT NULL CHECK (calories >= 0),
      fats REAL NOT NULL CHECK (fats >= 0),
      proteins REAL NOT NULL CHECK (proteins >= 0),
      carbohydrates REAL NOT NULL CHECK (carbohydrates >= 0),
      product_type_id INTEGER NOT NULL,
      FOREIGN KEY (product_type_id) REFERENCES product_types(id)
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      calories REAL NOT NULL CHECK (calories >= 0),
      fats REAL NOT NULL CHECK (fats >= 0),
      proteins REAL NOT NULL CHECK (proteins >= 0),
      carbohydrates REAL NOT NULL CHECK (carbohydrates >= 0),
      diet_type_id INTEGER NOT NULL,
      FOREIGN KEY (diet_type_id) REFERENCES diet_types(id)
    );

    CREATE TABLE IF NOT EXISTS recipe_products (
      recipe_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity REAL NOT NULL CHECK (quantity > 0),
      PRIMARY KEY (recipe_id, product_id),
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      meal_type_id INTEGER NOT NULL,
      total_calories REAL CHECK (total_calories >= 0),
      total_fats REAL CHECK (total_fats >= 0),
      total_proteins REAL CHECK (total_proteins >= 0),
      total_carbohydrates REAL CHECK (total_carbohydrates >= 0),
      FOREIGN KEY (meal_type_id) REFERENCES meal_types(id)
    );

    CREATE TABLE IF NOT EXISTS meal_products (
      meal_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity REAL NOT NULL CHECK (quantity > 0),
      PRIMARY KEY (meal_id, product_id),
      FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS meal_recipes (
      meal_id INTEGER NOT NULL,
      recipe_id INTEGER NOT NULL,
      quantity REAL NOT NULL CHECK (quantity > 0),
      PRIMARY KEY (meal_id, recipe_id),
      FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    );

    INSERT OR IGNORE INTO product_types (name) VALUES
      ('Овощи'), ('Фрукты'), ('Молочные продукты'),
      ('Мясо'), ('Рыба'), ('Зерновые'), ('Напитки'), ('Орехи');

    INSERT OR IGNORE INTO diet_types (name) VALUES
      ('Веганский'), ('Вегетарианский'), ('Низкоуглеводный'),
      ('Мало жира'), ('Низкокалорийный'), ('Высокобелковый');

    INSERT OR IGNORE INTO meal_types (name) VALUES
      ('Завтрак'), ('Обед'), ('Ужин'), ('Перекус');
      
  `)
        .then(() => {
            console.log('База данных успешно инициализирована');
        })
        .catch(error => {
            console.error('Ошибка инициализации БД:', error);
        });
}

export async function resetDatabase() {
    const database = await getDbConnection();

    await database.execAsync(`
    PRAGMA foreign_keys = OFF;

    DROP TABLE IF EXISTS meal_recipes;
    DROP TABLE IF EXISTS meal_products;
    DROP TABLE IF EXISTS meals;
    DROP TABLE IF EXISTS recipe_products;
    DROP TABLE IF EXISTS recipes;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS meal_types;
    DROP TABLE IF EXISTS diet_types;
    DROP TABLE IF EXISTS product_types;

    PRAGMA foreign_keys = ON;
  `);

    await initDatabase();
}

export async function runQuery(sql, params = []) {
    const database = await getDbConnection();
    const result = await database.runAsync(sql, params)

    return result;
}

export async function getAll(sql, params = []) {
    const database = await getDbConnection();
    const rows = await database.getAllAsync(sql, params);

    return rows;
}

export async function getFirst(sql, params = []) {
    const database = await getDbConnection();
    const row = await database.getFirstAsync(sql, params);
    return row;
}

export async function getMealTypes() {
    return getAll('SELECT id, name FROM meal_types;', []);
}

// ==================== ОПЕРАЦИИ С ПРОДУКТАМИ ====================


export async function addProduct(product) {
    const sql = `
    INSERT INTO products
      (name, calories, fats, proteins, carbohydrates, product_type_id)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
    return runQuery(sql, [
        product.name,
        product.calories,
        product.fats,
        product.proteins,
        product.carbohydrates,
        product.product_type_id
    ]);
}

export async function getProducts() {
    const sql = 'SELECT * FROM products;';
    return getAll(sql, []);
}

// ==================== ОПЕРАЦИИ С РЕЦЕПТАМИ ====================

export async function addRecipe(recipe) {
    const sql = `
    INSERT INTO recipes
      (name, calories, fats, proteins, carbohydrates, diet_type_id)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
    return runQuery(sql, [
        recipe.name,
        recipe.calories,
        recipe.fats,
        recipe.proteins,
        recipe.carbohydrates,
        recipe.diet_type_id
    ]);
}

export async function getRecipes() {
    const sql = 'SELECT * FROM recipes;';
    return getAll(sql, []);
}

// ==================== ОПЕРАЦИИ С ПРИЁМАМИ ПИЩИ ====================

export async function addMeal(meal) {
    const sql = `
    INSERT INTO meals
      (name, meal_type_id, total_calories, total_fats, total_proteins, total_carbohydrates)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
    return runQuery(sql, [
        meal.name,
        meal.meal_type_id,
        meal.total_calories,
        meal.total_fats,
        meal.total_proteins,
        meal.total_carbohydrates
    ]);
}

export { db };
