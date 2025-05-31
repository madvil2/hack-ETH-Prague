# LockBlock

## Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint
```

## Editor Setup

### Required Editor Extensions

#### VSCode

1. **Biome** - Code formatter and linter

   - Extension ID: `biomejs.biome`
   - [Install Link](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

2. **React CSS Modules** - For CSS Modules class name validation
   - Extension ID: `clinyong.vscode-css-modules`
   - [Install Link](https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules)

#### WebStorm

1. **Biome** - Code formatter and linter

   - [Install Link](https://plugins.jetbrains.com/plugin/22761-biome)
   - Settings: Preferences > Languages & Frameworks > Biome
   - Enable these options in Settings > Languages & Frameworks > Biome:
     - ✅ Enable LSP-based code formatting
     - ✅ Run format on save
     - ✅ Run safe fixes on save
     - ✅ Sort import on save

2. **CSS Modules** - For CSS Modules support
   - WebStorm has built-in support for CSS/SCSS Modules
   - Enable in Settings > Editor > Inspections > CSS/SCSS > CSS/SCSS Modules

### VSCode Settings

Create a `.vscode/settings.json` file with these settings for the best development experience:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[css]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "prettier.enable": false,
  "typescript.tsdk": "node_modules/typescript/lib",
  "[html]": {
    "editor.defaultFormatter": "vscode.html-language-features"
  },
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit"
  }
}
```

## Project Structure

### Styles

This project uses SCSS modules for styling components. Global styles are available in:

- `src/styles/_variables.scss` - Color palette, spacing, typography, etc.
- `src/styles/_mixins.scss` - Reusable SCSS mixins
- `src/styles/main.scss` - Global reset and base styles

You can use these global styles in any component's SCSS module:

```scss
// Example component.module.scss
.myComponent {
  background-color: $primary-color;
  @include flex-center;
  padding: $spacing-4;
}
```

### Icons

This project uses SVG icons as React components:

1. Add your SVG file to `src/assets/icons/`
2. Export it in the index file at `src/assets/icons/index.ts`:

```typescript
import { ReactComponent as YourIcon } from "./YourIcon.svg";

export { YourIcon /* other icons */ };
```

3. Use it in your components:

```jsx
import { YourIcon } from "@/icons";
import styles from "./styles.module.scss";

const MyComponent = () => (
  <div>
    <YourIcon className={styles.iconClass} />
  </div>
);
```

## Project Configuration

- Routing is handled with React Router v7
- Internationalization with i18next
- Styling with SCSS modules
- TypeScript for type safety
- Automatic import sorting with Biome
