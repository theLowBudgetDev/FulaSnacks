
# CHAPTER FOUR

## SYSTEM IMPLEMENTATION, TESTING, RESULTS AND DOCUMENTATION

### 4.1 System Implementation
This chapter describes the implementation of the FulaSnacks Online Food Ordering System. It presents the requirements for both hardware and software, the development environment, the programming languages and frameworks adopted, the testing procedures carried out, and the documentation of the system.

#### 4.1.1 New System Requirements
The development and deployment of the FulaSnacks system rely on modern web technologies and specific software resources to ensure smooth operation and compatibility.

**a) Hardware Requirements (for Development & Client Use)**

The minimum and recommended hardware components required to run the development environment or access the application as a user:

| Component       | Minimum Requirement      | Recommended Specification   |
|-----------------|--------------------------|-----------------------------|
| **Processor**   | Intel Dual Core 2.0 GHz  | Intel Core i5 or higher     |
| **RAM**         | 4 GB                     | 8 GB or more                |
| **Storage**     | 50 GB Free Space         | 100 GB SSD or more          |
| **Display**     | 1024 x 768 resolution    | 1920 x 1080 Full HD         |
| **Network**     | Wi-Fi / Ethernet         | Stable Broadband Connection |

*Note: Server hardware is managed by the cloud hosting provider (e.g., Firebase, Vercel) and scales automatically.*

**b) Software Requirements**

The software needed for development, deployment, and usage of the system includes:

| Software            | Version      | Purpose                           |
|---------------------|--------------|-----------------------------------|
| **Operating System**| Windows/Linux/macOS | Host operating system             |
| **Web Browser**     | Latest Chrome/Firefox/Edge | System testing and user interface |
| **Code Editor**     | VS Code      | Code development and editing    |
| **Node.js**         | >= 18.0      | JavaScript runtime environment    |
| **npm**             | >= 9.0       | Package management                |
| **Prisma**          | >= 5.0       | Database ORM and migrations       |
| **SQLite**          | (Bundled)    | Development database            |

#### 4.1.2 Program Development
This section describes how the FulaSnacks system was developed, including the tools, programming environment, and justifications for the choices made.

**a) Choice of Programming Environment**

The development environment included:
*   **Visual Studio Code (VS Code)** as the primary code editor, chosen for its powerful IntelliSense, integrated terminal, and extensive support for TypeScript and Next.js.
*   **Node.js** as the runtime for executing server-side JavaScript and managing the development server.
*   **Google Chrome** was used as the primary browser for testing due to its robust developer tools for debugging, performance analysis, and network inspection.

**b) Language and Framework Justification**

The system was built using the following technologies:
*   **Next.js (React Framework)**: Used as the full-stack framework for building the user interface with React components, handling routing, and creating server-side logic with API Routes. It was chosen for its performance optimizations, server-side rendering capabilities, and integrated development workflow.
*   **TypeScript**: Used to add static typing to JavaScript, enhancing code quality, maintainability, and developer productivity by catching errors during development.
*   **Tailwind CSS**: A utility-first CSS framework used for designing and styling the interface. It was chosen for its speed of development and ability to create modern, responsive designs directly in the markup.
*   **Prisma (ORM)**: Used as the Object-Relational Mapper to interact with the database. It simplifies database operations by allowing developers to work with TypeScript objects instead of writing raw SQL, and it manages database schema migrations.
*   **SQLite**: Used as the database for local development due to its simplicity and file-based nature, requiring no separate database server setup.
*   **NextAuth.js**: Used for handling user authentication, providing a secure and flexible way to manage user sessions, roles, and protected routes.

These technologies were chosen for their modern, component-based architecture, strong community support, scalability, and suitability for building fast, data-driven web applications.

### 4.2 System Testing
Testing was carried out to validate that all components of the system functioned as intended and met the specified requirements.

**a) Test Plan**

The testing approach combined unit testing of individual components and black-box testing of user-facing features. The testing was divided into modules based on user roles and functionality:

| Module                  | Test Description                                        | Expected Outcome                                      | Status |
|-------------------------|---------------------------------------------------------|-------------------------------------------------------|--------|
| **User Registration**   | A new user signs up as a Customer or Vendor.            | Account is created, role is assigned correctly.       | Passed |
| **User Login**          | A registered user logs in with correct credentials.     | User is authenticated and redirected to the correct page. | Passed |
| **Snack Browsing**      | A user views the list of snacks and applies filters.    | Snacks are displayed correctly and can be filtered.   | Passed |
| **Shopping Cart**       | A user adds snacks to the cart and updates quantities.  | Cart updates correctly with items and total price.    | Passed |
| **Order Placement**     | A user completes the checkout process.                  | Order is created in the database, cart is cleared.    | Passed |
| **Vendor Dashboard**    | A vendor logs in and manages their products and orders. | Vendor can view/update their specific data.           | Passed |
| **Admin Dashboard**     | An admin logs in and views platform-wide data.          | Admin can view all users, vendors, and orders.        | Passed |
| **Route Protection**    | A non-admin user tries to access the admin dashboard.   | Access is denied, user is redirected.                 | Passed |

**b) Test Data**

Test data was prepared using a seed script (`prisma/seed.ts`) to populate the database with realistic data for various test conditions:

| Test Case                  | Input Data                                        | Expected Output                                                 | Result |
|----------------------------|---------------------------------------------------|-----------------------------------------------------------------|--------|
| **Invalid login**          | Email: `fake@mail.com`, Password: `wrongpassword` | An error message "Invalid credentials" is displayed.            | Passed |
| **Valid registration**     | All required fields filled correctly.             | Account is created, and the user can log in.                    | Passed |
| **Add to cart**            | Click "Add to Cart" on a snack card.              | A toast notification appears, and the cart icon updates.        | Passed |
| **Vendor update product**  | Vendor changes the price of a snack.              | The product's price is updated in the database and on the UI.   | Passed |
| **Admin approves vendor**  | Admin toggles the approval switch for a vendor.   | The vendor's `isApproved` status is updated in the database.    | Passed |

### 4.3 Results and Documentation
The implemented system was successfully tested, and it met all the core functional requirements. The architecture is robust, and the user flows are logical.

**Key Outcomes:**
*   Users can register with distinct roles (Customer, Vendor, Admin), browse snacks from approved vendors, place orders, and track them.
*   Vendors have a dedicated dashboard to manage their product listings and process incoming orders.
*   Admins have a comprehensive dashboard to oversee platform activity, manage users, and approve vendors.
*   The responsive design, powered by Tailwind CSS, ensures the platform is usable across devices, including desktops, tablets, and smartphones.
*   All data transactions between the user interface and the database via API routes are accurate and secure.

**Documentation:**
*   **Test Reports**: Logs of passed/failed test cases were maintained during the development process.
*   **User Guide**: A comprehensive `README.md` file serves as the primary user and developer guide, covering setup, technology stack, and features.
*   **System Administrator Guide**: The `README.md` includes instructions for deployment, environment variable setup, and database seeding/migration commands.
*   **Source Code Documentation**: The code is structured logically with clear file and component names. TypeScript provides self-documentation through static types for functions and data structures.
