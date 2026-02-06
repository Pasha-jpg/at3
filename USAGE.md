#### **1. Set Up Your Project Directory**

First, create a new directory for your project and navigate into it:

```bash
mkdir my-nextjs-app
cd my-nextjs-app
```

#### **2. Initialise a New NPM Project**

Initialise a new NPM project. This will create a `package.json` file:

```bash
npm init -y
```

The `-y` flag automatically accepts the default settings, but you can omit it if you prefer to go through each prompt manually.

#### **3. Install Next.js, React, and React DOM**

Next.js requires `react` and `react-dom` as peer dependencies, so you need to install them along with `next`:

```bash
npm install next@15 react@18 react-dom@18
```

#### **4. Configure Your `package.json` for Next.js**

Open your `package.json` file and add scripts to run and build your Next.js application. Update your `package.json` to include the following:

```json
{
    "name": "my-nextjs-app",
    "version": "1.0.0",
    "private": true,
    "scripts": {
        "dev": "next dev", // Script to start the development server
        "build": "next build", // Script to build the application
        "start": "next start" // Script to start the production server
    },
    "dependencies": {
        "next": "^15.5.6",
        "react": "^18.3.1",
        "react-dom": "^18.3.1"
    },
    "devDependencies": {
        "eslint": "^8.57.1",
        "eslint-config-next": "^15.5.6"
    }
}
```

#### **5. Create the Required Directory Structure for App Router**

Now, manually create the folder structure for a Next.js app using the App Router:

```bash
mkdir -p app/api/hello
mkdir -p styles
touch app/layout.js app/page.js app/api/hello/route.js styles/globals.css
```

This will create the following structure:

```
my-nextjs-app/
├── app/
│   ├── api/
│   │   └── hello/
│   │       └── route.js
│   ├── layout.js
│   └── page.js
├── styles/
│   └── globals.css
├── package.json
└── node_modules/
```

#### **6. Add Basic Content to Your Files**

Now, you need to add some basic content to each file to get your Next.js project up and running.

**`app/page.js`**:

```jsx
// app/page.js
export default function HomePage() {
    return (
        <main>
            <h1>Welcome to the App Router in Next.js 13!</h1>
        </main>
    );
}
```

**`app/layout.js`**:

```jsx
// app/layout.js
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
```

**`styles/globals.css`**:

```css
/* styles/globals.css */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}
```

#### **7. Start the Development Server**

Now, start the Next.js development server to see your project in action:

```bash
npm run dev
```

This command will start the development server at `http://localhost:3000`.
