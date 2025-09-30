import { INGREDIENT_CATEGORIES } from "../constants/ingredientCategories";
import { getPendingIngredients, deletePendingIngredientById, approvePendingIngredient } from "../services/recipes";

export default function AdminPendingIngredientsPage() {
}

AdminPendingIngredientsPage.route = {
    path: "/admin/pending/ingredients",
    index: 6
}