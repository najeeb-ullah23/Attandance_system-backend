import { MongooseModuleOptions } from '@nestjs/mongoose';

export const DatabaseConfig = (): MongooseModuleOptions => ({
  uri:
    process.env.MONGO_URI 
});
