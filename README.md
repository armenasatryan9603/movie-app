## Project structure

src/
├── components/
│ ├── common/
│ │ ├── Header.tsx
│ │ ├── Footer.tsx
│ │ ├── MovieCard.tsx
│ │ ├── Loader.tsx
│ │ └── SearchBar.tsx
│ ├── home/
│ │ ├── MovieList.tsx
│ │ └── GenreFilter.tsx
│ └── details/
│ ├── MovieDetails.tsx
│ └── TrailerCarousel.tsx
├── hooks/
│ ├── useDebounce.ts
│ ├── useInfiniteScroll.ts
│ └── useFavorites.ts
├── services/
│ ├── api.ts
│ ├── tmdbApi.ts
│ └── indexedDB.ts
├── context/
│ ├── ThemeContext.tsx
│ └── FavoritesContext.tsx
├── pages/
│ ├── HomePage.tsx
│ ├── MovieDetailsPage.tsx
│ └── FavoritesPage.tsx
└── App.tsx
└── main.tsx

## Features

- Browse popular movies
- Search for movies
- View movie details
- Add movies to favorites
- Infinite scroll loading
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key (get it from [TMDB](https://www.themoviedb.org/settings/api))

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/movie-app.git
cd movie-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your TMDB API key:

```env
VITE_TMDB_API_KEY=your_api_key_here
VITE_BASE_URL=https://api.themoviedb.org/3
```

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

### Production Mode

```bash
npm run build
npm run preview
# or
yarn build
yarn preview
```

## Testing

### Running Tests

```bash
npm test
# or
yarn test
```

To run tests in watch mode:

```bash
npm test -- --watch
# or
yarn test --watch
```

### Test Coverage

```bash
npm test -- --coverage
# or
yarn test --coverage
```

## Building for Production

```bash
npm run build
# or
yarn build
```
