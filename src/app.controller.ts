import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('Root')
@Controller()
export class AppController {
  @Public()
  @Get()
  @Redirect('/health', 301)
  @ApiOperation({ summary: 'Redirect to health endpoint' })
  @ApiResponse({
    status: 301,
    description: 'Redirects to the /health endpoint',
  })
  redirectToHealth() {
    return;
  }
}
