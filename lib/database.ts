import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import { Construct } from 'constructs';

import * as config from '../config';

export class DatabaseConstruct extends cdk.Construct {
  public readonly database: Table;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    // Create RDS database (Free Tier eligible)
    const db = new rds.DatabaseInstance(this, `${config.PREFIX}-lms-db`, {
      engine: rds.DatabaseInstanceEngine.mysql(rds.MysqlEngineVersion.VER_8_0_28),
      databaseName: 'my_crud_app',
      instanceType: rds.InstanceType.of(rds.InstanceClass.BURSTABLE2, 't3.micro'), // Free Tier eligible
      allocatedStorage: 15, // Free Tier limit
      multiAz: false, // Not eligible for Free Tier
    });

    // Define tables using CDK constructs
    this.database = new rds.Table(this, 'UserTable', {
      tableName: `${config.PREFIX}-user`,
      database: db,
      schema: 'my_schema', // Adjust schema name if needed
      columns: [
        { name: 'id', type: rds.AttributeType.INTEGER, primaryKey: true },
        { name: 'first_name', type: rds.AttributeType.STRING },
        { name: 'last_name', type: rds.AttributeType.STRING },
        { name: 'email', type: rds.AttributeType.STRING, unique: true },
        { name: 'is_teacher', type: rds.AttributeType.BOOLEAN },
      ],
    });

    new rds.Table(this, 'TestTable', {
      tableName: `${config.PREFIX}-test`,
      database: db,
      schema: 'my_schema',
      columns: [
        { name: 'id', type: rds.AttributeType.INTEGER, primaryKey: true },
        { name: 'header', type: rds.AttributeType.STRING },
        { name: 'description', type: rds.AttributeType.TEXT },
      ],
    });

    new rds.Table(this, 'TestResultTable', {
      tableName: `${config.PREFIX}-test-result`,
      database: db,
      schema: 'my_schema',
      columns: [
        { name: 'id', type: rds.AttributeType.INTEGER, primaryKey: true },
        {
          name: 'user_id',
          type: rds.AttributeType.INTEGER,
          notNull: true,
          foreignKey: { references: { table: 'UserTable', column: 'id' } },
          index: true,
        }, // Index added
        {
          name: 'test_id',
          type: rds.AttributeType.INTEGER,
          notNull: true,
          foreignKey: { references: { table: 'TestTable', column: 'id' } },
          index: true,
        }, // Index added
        { name: 'score', type: rds.AttributeType.INTEGER },
        { name: 'date_taken', type: rds.AttributeType.DATETIME },
      ],
    });
  }
}
