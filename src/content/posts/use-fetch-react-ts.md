---
title: "Hook for fetching data using only React"
description: "Using React hooks for fetching and controlling the state of data. Data, loading and error handling."
pubDate: 2024-12-25
heroImage: "/path/to/optional/hero-image.jpg"
tags: ["webdev", "react", "frontend"]
---

# Simplifying data fetching in React with a custom hook

Fetching data in React can sometimes feel repetitive, especially if you're juggling multiple states for data, loading, and error handling. To streamline this, let me introduce a custom hook that makes data fetching clean, reusable, and easy to manage. 

Here’s how it works, step-by-step:

---

### The idea behind the hook

React’s functional components shine when you can break out reusable logic into hooks. Instead of writing the same `useState` and `useEffect` boilerplate in multiple components, this hook bundles it all up nicely.

With `useFetch`, you get:

1. **data state**: Where your fetched data lives.
2. **loading state**: To indicate the request’s progress.
3. **error state**: For handling errors when things don’t go smoothly.
4. **refetch functionality**: Fetch fresh data whenever you need it.

---

### The code: `useFetch`

```javascript
import { useState, useEffect } from "react";

type FetchOptions = RequestInit;

type UseFetchResult<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
};

export function useFetch<T>(url: string, options: FetchOptions = {}): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0); // Used to trigger refetch

  const refetch = () => setReload((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, options, reload]);

  return { data, error, loading, refetch };
}
```

---
### How it works

1. **states**:  
   - `data` stores the fetched data.  
   - `loading` indicates whether a request is in progress.  
   - `error` captures error messages if the fetch fails.  
   - `reload` triggers re-fetching when `refetch` is called.

2. **`refetch` function**:  
   Calling `refetch` bumps the `reload` counter, which forces the `useEffect` to run again.

3. **cleanup with `isMounted`**:  
   To avoid updating state after the component unmounts (and prevent those annoying React warnings), we track whether the component is still mounted.

---

### How to use it

This hook is flexible and can be used in any functional component:

```javascript
import { useFetch } from "./useFetch";

function App() {
  const { data, error, loading, refetch } = useFetch("https://api.example.com/data");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Fetched Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={refetch}>Refetch</button>
    </div>
  );
}
```
