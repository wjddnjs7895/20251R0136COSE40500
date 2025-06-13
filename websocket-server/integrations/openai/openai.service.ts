import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPEN_AI_API_KEY'),
    });
  }

  async getEphemeralKey(): Promise<string> {
    try {
      const response = await this.openai.beta.realtime.sessions.create({
        model: 'gpt-4o-mini-realtime-preview',
      });
      return response.client_secret.value;
    } catch (error) {
      console.error('Error in /session:', error);
      throw error;
    }
  }
}
