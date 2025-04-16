import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async check() {
    let databaseStatus = 'up';
    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      databaseStatus = 'down';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      databaseStatus,
    };
  }
}
