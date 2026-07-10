import { CreateClientDto } from './create-client.dto';

// Fallback: use TypeScript's Partial to avoid dependency on @nestjs/mapped-types
export type UpdateClientDto = Partial<CreateClientDto>;