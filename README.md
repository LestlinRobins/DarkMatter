# NASA Knowledge Graph Explorer

An interactive React + Vite application that visualizes NASA space biology research as a knowledge graph using Sigma.js.

## Features

- **Interactive Knowledge Graph**: Navigate hierarchical research categories using Sigma.js
- **Click-to-Expand**: Click category nodes to reveal sub-studies
- **Resource Access**: Click study nodes to open PDF resources
- **Visual Relationships**: See connections between research areas
- **Responsive Design**: Clean, mobile-friendly interface using TailwindCSS
- **Demo Mode**: Switch between interactive graph and demo visualization

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Sigma.js** - Graph visualization library
- **Graphology** - Graph data structure library
- **TailwindCSS** - Utility-first CSS framework

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
├── components/
│   ├── DatasetList.jsx    # Dataset list with search and pagination
│   └── DatasetDetails.jsx # Detailed dataset view
├── api-example.js         # Example API usage
├── index.css              # TailwindCSS imports and utilities
└── assets/                # Static assets
```

## API Integration

### Datasets Endpoint

```
GET https://osdr.nasa.gov/osdr/api/datasets
```

Fetches a list of all available datasets with basic information.

### Dataset Details Endpoint

```
GET https://osdr.nasa.gov/osdr/api/datasets/{id}
```

Fetches detailed information about a specific dataset.

## Key Components

### App.jsx

- Main application state management
- API error handling and retry logic
- Search functionality
- Navigation between list and detail views

### DatasetList.jsx

- Displays datasets in a responsive grid
- Search filtering
- Pagination for large datasets
- Loading and empty states

### DatasetDetails.jsx

- Shows comprehensive dataset information
- Handles additional API call for detailed data
- Graceful fallback to basic information if detailed fetch fails
- Development-mode raw JSON viewer

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (required for Vite)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to the displayed URL (usually http://localhost:3000)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Examples

### Basic Search

1. Use the search bar to filter datasets by title
2. Results update in real-time as you type

### Viewing Details

1. Click "View Details" on any dataset card
2. Navigate back using the "Back to Datasets" button

### API Testing

Open the browser console and run:

```javascript
// Test the API endpoints directly
fetch("https://osdr.nasa.gov/osdr/api/datasets")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Error Handling

- **Network Errors**: Retry button available
- **API Errors**: Graceful fallback with error messages
- **Loading States**: Spinner animations during data fetching
- **Empty States**: Helpful messages when no data is found

## Styling

The application uses TailwindCSS for styling with:

- Responsive design (mobile-first approach)
- Clean, modern interface
- Consistent color scheme (blue primary, gray neutrals)
- Hover effects and transitions
- Loading animations

## Browser Support

Works in all modern browsers that support:

- ES6+ features
- Fetch API
- CSS Grid and Flexbox

## License

This project is open source and available under the MIT License.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
