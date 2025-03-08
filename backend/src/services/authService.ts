  import bcrypt from "bcrypt";
  import { Request, Response } from "express";
  import { checkSchema, validationResult } from "express-validator";
  import jwt from "jsonwebtoken";
  import User, { userInterface } from "../models/userModel.js";
  interface userLogin {
    email: string;
    password: string;
  }

  class authService {
    private static jwtKey = process.env.SECRET_JWT;
    private static instance: authService;
    public static getInstance(): authService {
      if (!authService.instance) {
        authService.instance = new authService();
      }
      return authService.instance;
    }

    public static getJWTKEY(): string | null {
      return authService.jwtKey || null;
    }

    async validateUser(user: userLogin): Promise<boolean> {
      const userValidationSchema = checkSchema({
        email: {
          isEmail: {
            errorMessage: "Invalid email",
          },
        },
        password: {
          isStrongPassword: {
            options: {
              minLength: 8,
            },
            errorMessage:
              "Invalid Password : Password must be at least 8 characters",
          },
        },
      });

      const mockRequest = { body: user };

      // Run validation
      await Promise.all(
        userValidationSchema.map((validation) => validation.run(mockRequest)),
      );

      // Collect validation results
      const errors = validationResult(mockRequest);

      // If there are errors, return false and log the errors
      if (!errors.isEmpty()) {
        console.error("Validation errors:", errors.array());
        return false;
      }

      // If validation passes
      return true;
    }

    async login(user: userLogin, req: Request, res: Response): Promise<Response> {
      const isValid = await this.validateUser(user);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const { email, password } = user;
      const userData: userInterface | null = await User.findOne({ email });
      if (!userData) {
        console.error("No user found with provided email");
        return res
          .status(401)
          .json({ errors: "Try Again!! Invalid user or password" });
      }

      // Compare passwords
      const pwdCompare = await bcrypt.compare(password, userData.password);
      if (!pwdCompare) {
        console.log("Wrong Password");
        return res
          .status(401)
          .json({ errors: "Try Again!! Invalid user or password" });
      }
      // Sign JWT token
      const payload = {
        name: userData.name,
        email: userData.email,
      };
      const options = { expiresIn: "24h" };
      const JWT_KEY = authService.getJWTKEY();
      if (!JWT_KEY) {
        console.error("JWTKEY is empty");
        return res.status(500).json({ message: "JWTKEY is empty" });
      }
      const authToken = jwt.sign(payload, JWT_KEY, options);
      req.user = userData;
      return res
        .status(200)
        .json({ message: "User Found", authToken: authToken });
    }
  }

  export default authService;
