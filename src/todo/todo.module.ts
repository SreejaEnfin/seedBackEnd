// import { Module } from '@nestjs/common';
// import { TodosService } from './todo.service';
// import { TodosController } from './todo.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Todo } from './entities/todo.entity';

// @Module({
//   imports: [PostgresModule, TypeOrmModule.forFeature([Todo])], // importing typeOrm
//   controllers: [TodosController],
//   providers: [TodosService],
// })
// export class TodoModule {}
// import { Module } from '@nestjs/common';
// import { TodosController } from './todo.controller';
// import { TodosService } from './todo.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Todo } from './entities/todo.entity';
// import { MongoModule } from 'src/databases/mongo.module';
// import { PostgresModule } from 'src/databases/postgres.module';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// console.log(ConfigService.get('DB_TYPE'));
// @Module({
//   imports: [
//     process.env.DB_TYPE == 'postgres' ? PostgresModule : MongoModule,
//     TypeOrmModule.forFeature([Todo]),
//   ], // import MongoModule instead of PostgresModule
//   controllers: [TodosController],
//   providers: [TodosService],
// })
// export class TodoModule {}
import { Module } from '@nestjs/common';
import { TodosController } from './todo.controller';
import { TodosService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo]),
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodoModule {}
