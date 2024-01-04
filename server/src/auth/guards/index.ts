export * from './jwt-auth.guard';
export * from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

export const GUARDS = [JwtAuthGuard];
