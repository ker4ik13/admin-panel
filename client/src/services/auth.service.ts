import $api from "@/http";
import { CreateUserDto } from "@/shared/types/user/CreateUser.dto";
import { LoginUserDto } from "@/shared/types/user/LoginUser.dto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class AuthService {
  static async login(dto: LoginUserDto) {
    return await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(dto),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }

  static async logout() {
    return await $api.get(`/auth/logout`);
  }

  static async registration(dto: CreateUserDto) {
    return await $api.post("/auth/register", dto);
  }

  static async refresh() {
    return await $api.get("/auth/refresh");
  }
}
