import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for case-insensitive search and filtering across object arrays.
 * 
 * @param {Array} [items=[]] - Array of items to search.
 * @param {Array<string>} [searchKeys=['title', 'name', 'description', 'role', 'email', 'category', 'priority']] - Object properties to match against.
 */
export default function useSearch(
  items = [],
  searchKeys = ['title', 'name', 'description', 'role', 'email', 'category', 'priority', 'columnId', 'assignee']
) {
  const [searchQuery, setSearchQuery] = useState('');

  const filterItems = useCallback((itemList, customKeys = searchKeys) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query || !itemList || itemList.length === 0) return itemList;

    return itemList.filter((item) => {
      if (!item) return false;
      return customKeys.some((key) => {
        let val = item[key];
        // Handle object assignee
        if (key === 'assignee' && typeof val === 'object' && val !== null) {
          val = val.name;
        }
        if (typeof val === 'string') {
          return val.toLowerCase().includes(query);
        }
        return false;
      });
    });
  }, [searchQuery, searchKeys]);

  const filteredItems = useMemo(() => {
    return filterItems(items, searchKeys);
  }, [items, filterItems, searchKeys]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    filterItems,
  };
}
