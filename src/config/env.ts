export interface EnvVarsInterface {
    JWT_SECRET: string;
}

export const env: EnvVarsInterface = {
    JWT_SECRET: process.env.JWT_SECRET || 'test',
}