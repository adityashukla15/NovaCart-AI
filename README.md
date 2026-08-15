# 🛒 NovaCart AI

### AI-Powered MERN Stack E-Commerce Platform

**NovaCart AI** is a full-stack e-commerce platform built using the **MERN stack**, featuring a modern shopping experience, secure authentication, product management, cart & wishlist functionality, order management, returns & refunds, admin analytics, coupons, reviews, notifications, and **AI-powered product search**.

### 🔗 Live Demo

**[NovaCart AI](https://nova-cart-ai-weld.vercel.app/)**

### 🔗 Backend API

**[NovaCart AI API](https://novacart-ai-suiz.onrender.com/)**

---

## 🚀 Features

### 👤 Authentication & User Management

NovaCart AI provides a secure authentication system for customers and administrators.

* User registration
* User login & logout
* JWT-based authentication
* HTTP-only authentication cookies
* Password encryption using bcrypt
* Forgot password functionality
* OTP-based password reset
* OTP expiry handling
* OTP verification
* Resend OTP protection
* Account blocking/unblocking
* Role-based access control
* User/Admin roles
* Protected routes

---

## 🔐 Secure Authentication

Authentication is implemented using:

* JWT
* HTTP-only cookies
* bcrypt password hashing
* Express middleware
* Role-based authorization
* Protected API routes
* CORS configuration

Authentication cookies are configured for production environments with secure cross-origin support.

---

# 🛍️ Shopping Experience

NovaCart AI provides a complete e-commerce shopping flow.

### Product Browsing

Users can:

* Browse all products
* Search products
* Filter products
* Sort products
* Browse products by category
* View featured products
* Filter by price
* Filter by rating
* Filter by stock availability
* View product details
* View similar products
* View product ratings
* View latest reviews

---

# 🔎 Product Search & Filtering

The product listing system supports multiple filters.

### Search

Search products by:

* Product title
* Brand

### Filters

* Category
* Featured products
* Minimum price
* Maximum price
* Minimum rating
* In-stock products

### Sorting

Products can be sorted by:

* Price — Low to High
* Price — High to Low
* Rating
* Newest
* Oldest

### Pagination

Product APIs include server-side pagination to prevent loading the entire product collection at once.

Pagination supports:

* Current page
* Total pages
* Total products
* Next page
* Previous page
* Configurable page limit

---

# 🤖 AI-Powered Product Search

One of the core features of NovaCart AI is its AI-powered shopping search.

Users can search using natural language instead of manually selecting filters.

### Example

Instead of selecting:

```text
Category → Shoes
Color → Black
Price → Under ₹5000
```

Users can simply search:

```text
Black sneakers under 5000 for college
```

The AI processes the query and extracts relevant shopping filters such as:

* Category
* Brand
* Color
* Minimum price
* Maximum price
* Keywords

These filters are then converted into MongoDB product queries.

### AI Search Flow

```text
User Query
     ↓
AI Processing
     ↓
Extract Shopping Filters
     ↓
Generate MongoDB Filter
     ↓
Search Products
     ↓
Return Matching Products
```

The AI functionality is integrated into the backend using the AI service and product database.

---

# 📦 Product Management

Administrators can manage the complete product catalog.

### Create Products

Admin can add:

* Product title
* Description
* Category
* Brand
* Price
* Discount price
* Stock
* Sizes
* Colors
* Product images
* Featured status

### Product Validation

The backend validates:

* Required fields
* Product price
* Discount price
* Stock
* Category existence
* Duplicate product titles/slugs

### Product Images

Product images are uploaded and stored using **Cloudinary**.

### Update Products

Admins can update:

* Product information
* Category
* Price
* Discount
* Stock
* Sizes
* Colors
* Images
* Featured status

### Soft Delete

Products are not permanently removed immediately.

NovaCart AI uses soft deletion:

```text
isDeleted = true
deletedAt = Date
```

Deleted products can also be restored from the admin panel.

---

# 🗂️ Category Management

Categories are managed dynamically through the backend.

Admins can:

* Create categories
* Update categories
* Delete categories
* View categories
* Generate category slugs
* Upload category images

Products are connected to categories through MongoDB references.

---

# 🛒 Shopping Cart

Users can manage their shopping cart.

Features include:

* Add products to cart
* Remove products
* Update quantity
* View cart
* Product stock validation
* Cart persistence through backend
* Authenticated cart operations

The backend validates product availability before cart operations.

---

# ❤️ Wishlist

Users can maintain a personal wishlist.

Features include:

* Add product to wishlist
* Remove product from wishlist
* View wishlist
* Prevent duplicate wishlist products
* Authenticated wishlist operations

---

# 📍 Address Management

Users can manage their delivery addresses.

Features include:

* Add address
* Update address
* Delete address
* View saved addresses
* Use saved addresses during checkout

---

# 💳 Checkout & Orders

NovaCart AI provides a complete order workflow.

The order system manages:

* Cart items
* Product quantities
* Product prices
* Shipping address
* Order totals
* Payment status
* Order status
* Order history

### Order Status

Orders can move through statuses such as:

```text
Pending
   ↓
Confirmed
   ↓
Packed
   ↓
Shipped
   ↓
Delivered
```

Orders can also be cancelled where applicable.

---

# 💰 Payment Status

Payment status is maintained separately from order status.

Supported payment states include:

```text
Pending
Paid
Failed
Refunded
```

This separation allows NovaCart AI to independently track:

* Order progress
* Payment progress

---

# 🔄 Returns & Exchanges

NovaCart AI includes a complete return/exchange workflow.

Users can request:

* Product return
* Product exchange

Administrators can review and update return requests.

### Return Flow

```text
Requested
    ↓
Accepted
    ↓
Returned
    ↓
Refund Initiated
    ↓
Refund Completed
```

For exchange requests:

```text
Requested
    ↓
Accepted
    ↓
Returned
    ↓
Exchanged
```

Requests can also be rejected.

---

# 💸 Refund Management

Refunds are tracked separately from return status.

### Refund Status

```text
Pending
   ↓
Initiated
   ↓
Completed
```

Once the refund is completed:

* Return status becomes `Refund Completed`
* Refund status becomes `Completed`
* Payment status becomes `Refunded`
* Refund completion timestamp is stored

This creates a clear separation between return processing and payment processing.

---

# ⭐ Reviews & Ratings

Users can review purchased products.

Review functionality includes:

* Product reviews
* Rating system
* User information
* Review timestamps
* Latest reviews
* Average product rating
* Total review count

Product ratings are used by the product filtering and sorting system.

---

# 🎟️ Coupons

NovaCart AI includes an admin-managed coupon system.

Admins can:

* Create coupons
* View coupons
* Update coupons
* Delete coupons
* Enable/disable coupons

Coupons can be managed from the admin dashboard.

---

# 🔔 Notifications

NovaCart AI provides notifications for important user activities.

Notifications can be generated for events such as:

* Return accepted
* Return rejected
* Item returned
* Refund initiated
* Refund completed
* Exchange completed
* Order-related updates

Notifications are associated with users and relevant orders.

---

# 👨‍💼 Admin Dashboard

NovaCart AI includes a dedicated admin dashboard.

Admins can monitor important e-commerce statistics.

### Dashboard Statistics

* Total users
* Total products
* Total categories
* Total orders
* Total reviews
* Total revenue
* Recent orders
* Top products
* Low-stock products

---

# 📊 Sales Analytics

The admin dashboard provides sales analytics.

### Monthly Sales

The system calculates:

* Monthly revenue
* Number of orders
* Sales grouped by year
* Sales grouped by month

### Order Analytics

Orders can be grouped according to their status.

Example:

```text
Pending
Confirmed
Packed
Shipped
Delivered
Cancelled
```

### Category Sales

Category analytics track:

* Revenue generated by category
* Number of products sold

---

# 👥 User Management

Administrators can view and manage users.

Features include:

* View all users
* View user information
* Update user role
* Block users
* Unblock users

### Roles

NovaCart AI currently supports:

```text
user
admin
```

Role-based middleware protects administrative APIs.

---

# 🛡️ Admin Authorization

Admin-only functionality is protected using two middleware layers:

```text
Authentication
      ↓
Authorization
      ↓
Admin Controller
```

This prevents normal users from accessing administrative operations.

---

# ☁️ Cloudinary Integration

NovaCart AI uses Cloudinary for image management.

Cloudinary handles:

* Product images
* Category images
* Image uploads
* Cloud-hosted image URLs

This avoids storing large image files directly inside the application server.

---

# 🌐 REST API Architecture

The backend follows a modular REST API structure.

Main API modules include:

```text
/api/auth
/api/products
/api/categories
/api/wishlist
/api/cart
/api/addresses
/api/orders
/api/reviews
/api/ai
/api/admin
/api/notifications
/api/contact
```

---

# 🧩 Backend Architecture

The backend follows a controller-based architecture.

```text
server/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── services/
└── server.js
```

### Controllers

Business logic is handled inside controllers.

### Models

MongoDB schemas are managed using Mongoose models.

### Routes

Routes define API endpoints and middleware protection.

### Middleware

Middleware handles:

* Authentication
* Admin authorization
* Error handling
* Cookies
* CORS

### Utilities

Reusable utilities are used for:

* API errors
* API responses
* Async handlers

---

# 🎨 Frontend Architecture

The frontend is built using:

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Lucide React
* React Hot Toast

The frontend follows a component-based architecture.

```text
client/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── api/
│   ├── context/
│   ├── data/
│   └── utils/
```

---

# 🔌 Axios API Integration

The frontend communicates with the backend through a centralized Axios instance.

The API URL is configured using:

```text
VITE_API_URL
```

Production frontend requests are sent to the deployed Render backend.

Authentication requests use:

```text
withCredentials: true
```

to support secure HTTP-only authentication cookies.

---

# 🔒 Security Features

NovaCart AI includes multiple security measures:

* Password hashing using bcrypt
* JWT authentication
* HTTP-only cookies
* Secure production cookies
* CORS protection
* Role-based authorization
* Protected admin APIs
* User blocking
* Input validation
* OTP expiration
* OTP rate limiting
* Product pagination
* Soft deletion
* Server-side validation

---

# 📧 OTP-Based Security

OTP functionality is used for sensitive authentication flows.

OTP features include:

* 6-digit OTP
* OTP expiration
* Previous OTP deletion
* OTP verification
* Forgot-password OTP
* Booking-related OTP
* OTP request rate limiting

OTP records are stored separately and associated with their purpose.

---

# 📱 Responsive UI

The frontend is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

Tailwind CSS is used to create responsive layouts and reusable UI components.

---

# ⚡ Performance

NovaCart AI uses several performance-focused techniques:

* Server-side pagination
* MongoDB filtering
* MongoDB sorting
* `.lean()` for read-heavy product queries
* Limited similar products
* Limited latest reviews
* API-based data loading
* Lazy data fetching where applicable

---

# 🗄️ Database

NovaCart AI uses:

**MongoDB + Mongoose**

Major database models include:

```text
User
Product
Category
Order
Review
Wishlist
Cart
Address
OTP
Notification
Coupon
```

MongoDB provides the persistent data layer for the complete e-commerce platform.

---

# 🚀 Deployment

NovaCart AI is deployed using:

### Frontend

**Vercel**

### Backend

**Render**

### Database

**MongoDB Atlas**

### Image Storage

**Cloudinary**

### AI

**Groq / LLM API**

---

# 🔧 Environment Variables

### Backend

The backend requires environment variables for:

```env
PORT=
MONGO_URI=
JWT_SECRET=
NODE_ENV=
ALLOWED_ORIGINS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GROQ_API_KEY=

EMAIL_USER=
EMAIL_PASSWORD=
```

### Frontend

```env
VITE_API_URL=
```

Environment files should never be committed to GitHub.

---

# 🛠️ Installation

## Clone Repository

```bash
git clone https://github.com/adityashukla15/NovaCart-AI.git
```

## Backend Setup

```bash
cd NovaCart-AI/server
npm install --legacy-peer-deps
npm start
```

## Frontend Setup

Open another terminal:

```bash
cd NovaCart-AI/client
npm install
npm run dev
```

The frontend will run on the Vite development server.

---

# 🔄 Application Flow

The overall application architecture works like this:

```text
                    ┌─────────────────┐
                    │     React UI    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Axios API Layer │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Express Server  │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
          Middleware     Controllers    AI Service
                │            │            │
                └────────────┼────────────┘
                             ▼
                    ┌─────────────────┐
                    │    Mongoose     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     MongoDB     │
                    └─────────────────┘
```

---

# 🤖 AI Shopping Flow

```text
Natural Language Query
          ↓
       Groq AI
          ↓
Extract Shopping Intent
          ↓
Category / Brand / Color
Price / Keywords
          ↓
MongoDB Filter
          ↓
Product Search
          ↓
Relevant Products
```

---

# 🧑‍💻 Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* Lucide React
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Cookie Parser
* CORS

## AI

* Groq API
* LLM-powered natural language product search

## Cloud & Deployment

* MongoDB Atlas
* Cloudinary
* Vercel
* Render

## Development

* Git
* GitHub
* Postman
* VS Code

---

# 📌 API Modules

| Module         | Endpoint             |
| -------------- | -------------------- |
| Authentication | `/api/auth`          |
| Products       | `/api/products`      |
| Categories     | `/api/categories`    |
| Wishlist       | `/api/wishlist`      |
| Cart           | `/api/cart`          |
| Addresses      | `/api/addresses`     |
| Orders         | `/api/orders`        |
| Reviews        | `/api/reviews`       |
| AI Search      | `/api/ai`            |
| Admin          | `/api/admin`         |
| Notifications  | `/api/notifications` |
| Contact        | `/api/contact`       |

---

# 🧪 Development & Testing

The backend APIs can be tested using Postman.

Important flows to test include:

* Registration
* Login
* Logout
* OTP verification
* Forgot password
* Product creation
* Product search
* Product filtering
* Cart operations
* Wishlist operations
* Checkout
* Orders
* Reviews
* Returns
* Refunds
* Admin operations
* AI product search

---

# 📈 Future Improvements

Possible future improvements include:

* Online payment gateway integration
* Advanced AI recommendations
* Personalized product recommendations
* AI shopping assistant
* Product comparison
* Real-time order tracking
* Email notification templates
* Advanced sales analytics
* Redis caching
* Elasticsearch-based product search
* Automated refund processing
* Recommendation engine

---

# 👨‍💻 Author

### Aditya Shukla

Full-Stack Developer | MERN Stack | AI Integration

**Project:** NovaCart AI

---

# ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.

**NovaCart AI — Smart Shopping Powered by AI.**
