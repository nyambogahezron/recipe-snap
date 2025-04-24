"use client";

import { useState } from "react";
import { generateRecipeFromImage } from "@/ai/flows/generate-recipe-from-image";
import { identifyDishFromImage } from "@/ai/flows/identify-dish-from-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<{
    recipeName: string;
    ingredients: string[];
    instructions: string[];
  } | null>(null);
  const [dishName, setDishName] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateRecipe = async () => {
    if (photoDataUri) {
      try {
        const recipeData = await generateRecipeFromImage({ photoDataUri });
        setRecipe(recipeData);
      } catch (error: any) {
        console.error("Error generating recipe:", error);
        alert(`Failed to generate recipe: ${error.message}`);
      }
    } else {
      alert("Please upload an image first.");
    }
  };

  const handleIdentifyDish = async () => {
    if (photoDataUri) {
      try {
        const dishData = await identifyDishFromImage({ photoDataUri });
        setDishName(dishData.dishName);
      } catch (error: any) {
        console.error("Error identifying dish:", error);
        alert(`Failed to identify dish: ${error.message}`);
      }
    } else {
      alert("Please upload an image first.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-3xl font-semibold mb-4">Recipe Snap</h1>

      <Card className="w-full max-w-md bg-card shadow-md rounded-lg overflow-hidden">
        <CardHeader className="py-3 px-4">
          <CardTitle>Upload an Image</CardTitle>
          <CardDescription>Take a photo of ingredients or a dish to get started.</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="image-upload"
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 cursor-pointer"
            >
              <Camera className="mr-2 h-4 w-4" />
              <span>Upload Image</span>
            </label>

            {photoDataUri && (
              <img
                src={photoDataUri}
                alt="Uploaded"
                className="rounded-md object-cover aspect-square max-h-48 w-full"
              />
            )}

            <div className="flex justify-between">
              <Button onClick={handleGenerateRecipe} variant="accent">
                Generate Recipe
              </Button>
              <Button onClick={handleIdentifyDish} variant="secondary">
                Identify Dish
              </Button>
            </div>
            {dishName && (
              <div className="mt-2">
                <p className="text-sm font-medium">Identified Dish:</p>
                <p className="text-lg">{dishName}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {recipe && (
        <Card className="w-full max-w-md mt-6 bg-card shadow-md rounded-lg overflow-hidden">
          <CardHeader className="py-3 px-4">
            <CardTitle>{recipe.recipeName}</CardTitle>
            <CardDescription>Here's the generated recipe based on the image.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <ul className="list-disc list-inside">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="mb-1">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <h3 className="text-lg font-semibold mt-4 mb-2">Instructions:</h3>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <ol className="list-decimal list-inside">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="mb-2">
                    {instruction}
                  </li>
                ))}
              </ol>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
