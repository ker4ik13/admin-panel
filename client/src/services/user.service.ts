import $api from "@/http";
import { IUser } from "@/shared/types/IUser";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class UserService {
  static async getMe() {
    return await $api.get<IUser>("/me");
  }
}
