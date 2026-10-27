import React from 'react';
import { getDb } from '@/lib/actions';
import HomepageManager from '@/components/dashboard/HomepageManager';

export default async function HomepagePage() {
  const db = await getDb();
  const { homepage, categories } = db;

  return <HomepageManager homepage={homepage} categories={categories} />;
}
