# TradeX Asia

TradeX Asia is a full-stack marketplace prototype for buyers and suppliers. The backend is a Django REST API with JWT authentication, and the frontend is a React + Vite application that consumes the API.

## Project Structure

- `backend/`: Django project with apps for `users`, `products`, `orders`, and `logistics`
- `frontend/`: React client with role-based pages for buyers and suppliers

## Current Feature Flow

- Users can register as a `buyer` or `supplier`
- Users can log in through JWT token endpoints
- Suppliers can create products
- Buyers can browse products and place orders
- Orders automatically create a logistics record with a default `pending` status
- Suppliers can view incoming orders for their products

## Backend Stack

- Django
- Django REST Framework
- `django-cors-headers`
- `djangorestframework-simplejwt`
- SQLite

## Frontend Stack

- React
- React Router
- Axios
- Vite

## Local Setup

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend runs at `http://127.0.0.1:8000/`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend expects the API at `http://127.0.0.1:8000/api/`.

## API Routes

- `POST /api/token/`
- `POST /api/token/refresh/`
- `GET|POST /api/users/`
- `GET|POST /api/products/`
- `GET|POST /api/orders/`
- `GET|POST /api/logistics/`

## Verification Performed

- `python manage.py check`
- `npm run build`

Both commands completed successfully in the current workspace.

## Important Implementation Note

The project currently uses two different user representations:

- Django's built-in authenticated user for JWT login and `request.user`
- A separate `users.User` profile model for marketplace data

This is important because some backend code expects `request.user.role`, while the role field exists on `users.User`, not on Django's default auth model. The repo builds and passes Django system checks, but this mismatch can still cause runtime issues in authenticated product and order flows. I did not change that behavior because it is a deeper model-design decision and changing it carelessly could hamper the project.

## Recommended Next Safe Improvement

If you want, the next careful step would be to unify authentication and marketplace user data by either:

1. Switching to a custom Django user model, or
2. Keeping the profile model and updating all permission/query logic to resolve the related profile explicitly

I left the code untouched in that area for safety.
