import React from 'react';
import { getDb } from '@/lib/actions';
import CategoryManager from '@/components/dashboard/CategoryManager';

export default async function CategoriesPage() {
  const db = await getDb();
  const { categories } = db;

  return <CategoryManager categories={categories} />;
}
