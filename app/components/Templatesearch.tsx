'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates } from '../store/templatesSlice';
import { RootState, AppDispatch } from '../store';

const categories = ['All', 'Education', 'E-commerce', 'Health'];

export default function TemplateSearch() {
  const dispatch = useDispatch<AppDispatch>();
  const { templates, loading, error } = useSelector((state: RootState) => state.templates);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [alphabeticalOrder, setAlphabeticalOrder] = useState<'Default' | 'Ascending' | 'Descending'>('Default');
  const [dateOrder, setDateOrder] = useState<'Default' | 'Ascending' | 'Descending'>('Default');

  const [filteredTemplates, setFilteredTemplates] = useState(templates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    let result = templates;

    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter((template) => template.category.includes(activeCategory));
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      result = result.filter((template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by alphabetical order
    if (alphabeticalOrder === 'Ascending') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (alphabeticalOrder === 'Descending') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Sort by date
    if (dateOrder === 'Ascending') {
      result.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
    } else if (dateOrder === 'Descending') {
      result.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    }

    setFilteredTemplates(result);
  }, [templates, searchTerm, activeCategory, alphabeticalOrder, dateOrder]);

  const resetFilters = () => {
    setSearchTerm('');
    setAlphabeticalOrder('Default');
    setDateOrder('Default');
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    resetFilters();
  };

  return (
    <div className="p-6 font-sans">
      {/* Search and Filters Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
        {/* Search Bar */}
        <div className="flex items-center border border-gray-300 rounded px-4 py-2 w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search Templates"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow outline-none"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-500"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.85-8.15a8 8 0 11-16 0 8 8 0 0116 0z" />
          </svg>
        </div>

        {/* Dropdown Filters */}
        <div className="flex gap-4 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full md:w-auto"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Alphabetical Order Filter */}
          <select
            value={alphabeticalOrder}
            onChange={(e) => {
              setAlphabeticalOrder(e.target.value as 'Default' | 'Ascending' | 'Descending');
              setDateOrder('Default'); // Reset Date Order filter
            }}
            className="p-2 border border-gray-300 rounded w-full md:w-auto"
          >
            <option value="Default">Order: Default</option>
            <option value="Ascending">Order: A-Z</option>
            <option value="Descending">Order: Z-A</option>
          </select>

          {/* Date Order Filter */}
          <select
            value={dateOrder}
            onChange={(e) => {
              setDateOrder(e.target.value as 'Default' | 'Ascending' | 'Descending');
              setAlphabeticalOrder('Default'); // Reset Alphabetical Order filter
            }}
            className="p-2 border border-gray-300 rounded w-full md:w-auto"
          >
            <option value="Default">Date: Default</option>
            <option value="Ascending">Date: Oldest to Newest</option>
            <option value="Descending">Date: Newest to Oldest</option>
          </select>
        </div>
      </div>

      {/* Informational Banner */}
      <div className="bg-orange-100 text-orange-600 p-4 rounded mb-6">
        <p>
          <strong>Tip!</strong> Get started with a free template. Can&apos;t find what you are looking for? Search from the
          1000+ available templates.
        </p>
      </div>

      {/* Loading/Error Handling */}
      {loading && <p>Loading templates...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
            <p className="text-gray-500 text-sm mb-1">
              <strong>Created:</strong> {new Date(template.created).toLocaleDateString()}
            </p>
            <p className="text-gray-500 text-sm mb-1">
              <strong>Category:</strong> {template.category.join(', ')}
            </p>
            <p className="text-gray-700 mb-2">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
