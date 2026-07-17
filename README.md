<br/>
<p align="center">
  <h3 align="center">Foodd - Restaurant APP</h3>

  <p align="center">
    <a href="https://github.com/NakulPrasad/foodd-mern"><strong>Explore the docs »</strong></a>
    <br/>
    <a href="https://foodd-mern.vercel.app/">View Demo</a>
    .
    <a href="https://github.com/NakulPrasad/foodd-mern/issues">Report Bug</a>
    .
    <a href="https://github.com/NakulPrasad/foodd-mern/issues">Request Feature</a>
  </p>
</p>

![Downloads](https://img.shields.io/github/downloads/NakulPrasad/foodd-mern/total) ![Contributors](https://img.shields.io/github/contributors/NakulPrasad/foodd-mern?color=dark-green) ![Issues](https://img.shields.io/github/issues/NakulPrasad/foodd-mern) ![License](https://img.shields.io/github/license/NakulPrasad/foodd-mern) 

## About The Project

**FOODD** is a dynamic and interactive restaurant React web application that empowers users to seamlessly explore an assortment of delectable food items, personalize their orders, and effortlessly finalize the checkout process.<br/>
The application incorporates a robust user authentication system, ensuring data security and enhancing the overall user experience.<br/>
<br/>
<img width="1918" height="1079" alt="image" src="https://github.com/user-attachments/assets/7c93c911-9faa-4d5d-b4c9-a5d4709596f1" />


<br/>
<p  align="center">
<a href="https://foodd-mern.vercel.app" >View Live</a></p>

### _Key features:_

* **Unified Authentication** — Credential-based login (bcrypt-hashed passwords) and Google OAuth (via Passport.js) both resolve to the same JWT-based session, so downstream routes don't need to know which login method a user took.
* **Food Exploration** — Full catalog browsing with images and descriptions.
* **Customization Options** — Users tailor orders before checkout.
* **Effortless Checkout** — Order review and confirmation flow.


## Built With

* **Frontend:** React, TypeScript, Vite, Redux Toolkit, Mantine UI, React Router
* **Backend:** Node.js, Express.js, MongoDB, Passport.js
* **Testing:** Vitest, React Testing Library

## Technical Decisions

* **TypeScript + strict build (`tsc -b`)** — caught type mismatches between API responses and frontend state at compile time rather than runtime, especially useful across the Redux store's shared shape.
* **Redux Toolkit for order/cart state** — checkout involves multi-step state (item selection → customization → cart → order) that benefited from centralized, predictable state over prop drilling or scattered local state.
* **JWT over server-side sessions** — chosen for statelessness, since frontend (Vercel) and backend are deployed separately, and sticky sessions would've added deployment complexity.
* **Passport.js as the OAuth abstraction layer** — kept the Google OAuth callback logic isolated from the core auth service, so both login paths (credentials + OAuth) resolve to the same JWT session without duplicating logic.
* **Vitest + Testing Library** — component-level tests for cart/order flows rather than testing the whole app end-to-end, given time constraints as a solo project.

## Screen Shots
<img width="1916" height="1077" alt="image" src="https://github.com/user-attachments/assets/2418c6e8-2218-4ea5-b336-b26e26424cfd" />

<br/>
<img width="1919" height="1078" alt="image" src="https://github.com/user-attachments/assets/5bf9a997-030c-43c4-a3f3-384eb44bc0a9" />

<br/>
<img width="1919" height="937" alt="image" src="https://github.com/user-attachments/assets/576b8abb-9df7-4cef-b867-d2b7e657a3b7" />

<br/>
<img width="1918" height="1067" alt="image" src="https://github.com/user-attachments/assets/602c67e8-f54d-4a80-976d-00b7a8b2a748" />


## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

1. Clone the repo

```sh
https://github.com/NakulPrasad/foodd-mern.git
```
2. Install NPM packages

```sh
npm install --prefix client
npm install
```
3. Create .env file
File should be root of 'server' folder
```
#ADD FOLLOWING

REACT_APP_BASE_URL = "http://localhost:80/"
```
4. Create .env.local
Database File : /server/data/index.js
```
#ADD FOLLOWING

MONGO_URL = "mongodb+srv://{user}:{password}@{database}.5qdwl8g.mongodb.net/library?retryWrites=true&w=majority"
PORT = 8080
NODE_ENV = "production"

```
5. RUN

```
npm start
```
OR
```
npm run dev
```

## Contributing
### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

* **[Nakul Prasad Mahato](https://github.com/NakulPrasad)** - *IMSc. Mathematics & Computing Student* - *BIT Mesra*
