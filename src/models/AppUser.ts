export interface AppUser {
    id: number;
    username: string;
    firstname: string;
    surname: string;
    email: string;
    phoneNum: string;
    encPassword: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    roles?: Role[];
}

export interface Role {
    id: number;
    name: string;
}

export interface UserRole {
    id: number;
    user_id: number;
    role_id: number;
}

export interface ExternalAuth {
    id: number;
    user_id: number;
    provider_id: number;
    external_id: string;
    created_at: string;
}

export interface AuthProvider {
    id: number;
    name: string;
}
